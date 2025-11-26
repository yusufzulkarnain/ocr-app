// RaceScreen.tsx
import React, {useState} from 'react';
import {View, Text, TextInput, Button, SafeAreaView} from 'react-native';
import {useRaceTimer} from './useRaceTimer';

const RaceScreen = () => {
  const [trackLength, setTrackLength] = useState(402);
  const [segmentSize, setSegmentSize] = useState(100);
  const [start, setStart] = useState(false);

  const race = start ? useRaceTimer(trackLength, segmentSize) : null;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#000', padding: 20}}>
      {!start ? (
        <View>
          <Text style={{color: '#fff', fontSize: 18}}>Track Length (m)</Text>
          <TextInput
            value={String(trackLength)}
            onChangeText={v => setTrackLength(Number(v))}
            keyboardType="numeric"
            style={{
              backgroundColor: '#222',
              color: '#fff',
              padding: 10,
              borderRadius: 8,
              marginVertical: 10,
            }}
          />

          <Text style={{color: '#fff', fontSize: 18}}>Segment Size (m)</Text>
          <TextInput
            value={String(segmentSize)}
            onChangeText={v => setSegmentSize(Number(v))}
            keyboardType="numeric"
            style={{
              backgroundColor: '#222',
              color: '#fff',
              padding: 10,
              borderRadius: 8,
              marginVertical: 10,
            }}
          />

          <Button title="Start Race" onPress={() => setStart(true)} />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <Text style={{color: '#0f0', fontSize: 24}}>
            {race?.speed.toFixed(1)} km/h
          </Text>
          <Text style={{color: '#fff'}}>
            Distance: {race?.distance.toFixed(1)} m
          </Text>

          {race?.segments.map((seg, i) => (
            <Text key={i} style={{color: '#fff'}}>
              {seg.from}–{seg.to} m :{' '}
              {seg.time ? `${seg.time.toFixed(2)} s` : '-'}
            </Text>
          ))}

          {race?.finished && (
            <Text style={{color: '#FFD700', fontSize: 18}}>
              Total Time: {race.totalTime.toFixed(2)} s
            </Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default RaceScreen;
