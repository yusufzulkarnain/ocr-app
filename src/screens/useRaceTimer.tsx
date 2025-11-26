// useRaceTimer.ts
import {useEffect, useRef, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';

const getDistance = (prev: any, curr: any) => {
  const R = 6371e3;
  const φ1 = (prev.latitude * Math.PI) / 180;
  const φ2 = (curr.latitude * Math.PI) / 180;
  const Δφ = ((curr.latitude - prev.latitude) * Math.PI) / 180;
  const Δλ = ((curr.longitude - prev.longitude) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export function useRaceTimer(trackLength: number, segmentSize: number) {
  const [segments, setSegments] = useState(() => {
    const segs = [];
    let start = 0;
    while (start < trackLength) {
      const end = Math.min(start + segmentSize, trackLength);
      segs.push({from: start, to: end, time: null as number | null});
      start = end;
    }
    return segs;
  });

  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const startTimeRef = useRef(0);
  const lastPosRef = useRef<any>(null);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      pos => {
        const {coords} = pos;
        const spd = (coords.speed || 0) * 3.6;
        setSpeed(spd);

        if (!lastPosRef.current) {
          lastPosRef.current = coords;
          return;
        }

        const d = getDistance(lastPosRef.current, coords);
        lastPosRef.current = coords;

        if (!running && spd > 1) {
          setRunning(true);
          startTimeRef.current = performance.now();
        }

        if (running && !finished) {
          setDistance(prev => {
            const total = prev + d;
            const elapsed = performance.now() - startTimeRef.current;

            setSegments(prevSegs =>
              prevSegs.map(seg => {
                if (seg.time === null && total >= seg.to) {
                  return {...seg, time: elapsed / 1000};
                }
                return seg;
              }),
            );

            if (total >= trackLength) {
              setFinished(true);
              setTotalTime(elapsed / 1000);
            }

            return total;
          });
        }
      },
      err => console.log('GPS error:', err),
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 200,
        fastestInterval: 200,
      },
    );

    return () => Geolocation.clearWatch(watchId);
  }, [running, finished, trackLength]);

  return {speed, distance, segments, totalTime, finished};
}
