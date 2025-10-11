import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg';
import {useFocusEffect} from '@react-navigation/native';
import {toDp} from '../../hepers/PercentageToDp';

const ChartScreen = () => {
  const [percentage, setPercentage] = useState(94);
  const [maxValue, setMaxValue] = useState(512); // Dynamic max value
  const currentValueRef = useRef(75);
  const animationRef = useRef<number | null>(null);
  const [, setRenderKey] = useState(0);
  const [isFirstFocus, setIsFirstFocus] = useState(true);
  const [pesentase, setPesentase] = useState('');

  const radius = 100;
  const strokeWidth = 22;
  const colorBlue = '#08448F';
  const colorRed = '#CFCFCF';
  const gapDegree = 15;

  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  useEffect(() => {
    const startValue = currentValueRef.current;
    const endValue = percentage;
    const duration = 800;
    const startTime = Date.now();

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      const newValue = startValue + (endValue - startValue) * easeOutCubic;
      currentValueRef.current = newValue;

      // Force re-render with minimal state update
      setRenderKey(prev => prev + 1);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (startValue !== endValue) {
      animationRef.current = requestAnimationFrame(animate);
    }

    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [percentage]);

  const changePercentage = (newPercentage: number) => {
    setPercentage(Math.max(0, Math.min(maxValue, newPercentage)));
  };

  // Animate on page focus
  useFocusEffect(
    React.useCallback(() => {
      const percentageState = (percentage / maxValue) * 100;
      const persentaseString = percentageState.toFixed(1) + '%';
      setPesentase(persentaseString);
      if (isFirstFocus) {
        currentValueRef.current = 0;
        setIsFirstFocus(false);

        const duration = 800;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          const easeOutCubic = 1 - Math.pow(1 - progress, 3);
          const newValue = 0 + (percentage - 0) * easeOutCubic;
          currentValueRef.current = newValue;

          setRenderKey(prev => prev + 1);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      } else {
        const startValue = currentValueRef.current;
        const endValue = percentage;

        if (startValue !== endValue) {
          const duration = 600;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const newValue =
              startValue + (endValue - startValue) * easeOutCubic;
            currentValueRef.current = newValue;

            setRenderKey(prev => prev + 1);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      }
    }, [percentage, isFirstFocus]),
  );

  // Calculate current values based on animated value
  const currentValue = currentValueRef.current;

  // Calculate total available space (excluding gaps)
  const totalGapDegree = gapDegree * 2; // 2 gaps
  const availableDegree = 360 - totalGapDegree; // Space available for blue + red

  const blueDegree = (currentValue / maxValue) * availableDegree;
  const redDegree = availableDegree - blueDegree;

  const blueLength = (circumference * blueDegree) / 360;
  const redLength = (circumference * redDegree) / 360;
  const gapLength = (circumference * gapDegree) / 360;

  console.log('=== Chart Debug ===');
  console.log('Current Value:', currentValue);
  console.log('Max Value:', maxValue);
  console.log('Available Degree:', availableDegree.toFixed(1), '°');
  console.log('Blue Degree:', blueDegree.toFixed(1), '°');
  console.log('Red Degree:', redDegree.toFixed(1), '°');
  console.log('Blue Length:', blueLength.toFixed(1), 'px');
  console.log('Red Length:', redLength.toFixed(1), 'px');
  console.log('Gap Length:', gapLength.toFixed(1), 'px');
  console.log('Percentage:', ((currentValue / maxValue) * 100).toFixed(1), '%');
  console.log('==================');

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
          <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
            <Circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke={colorBlue}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={
                currentValue === maxValue
                  ? `${circumference}`
                  : currentValue === 0
                  ? `0, ${circumference}`
                  : `${blueLength}, ${gapLength}, ${redLength}, ${gapLength}`
              }
              strokeDashoffset={0}
              strokeLinecap="round"
            />

            {currentValue !== maxValue && (
              <Circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke={colorRed}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={
                  currentValue === 0
                    ? `${circumference}`
                    : `${redLength}, ${circumference}`
                }
                strokeDashoffset={
                  currentValue === 0 ? 0 : -(blueLength + gapLength)
                }
                strokeLinecap="round"
              />
            )}
          </G>
        </Svg>
        <View style={styles.centerText}>
          <Text style={styles.percentText}>{pesentase}</Text>
          <Text style={{fontSize: toDp(12)}}>dari Total Pramudi</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Text style={styles.percentageText}>
          Total: {percentage}/{maxValue}
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changePercentage(percentage - 10)}>
            <Text style={styles.buttonText}>-10</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changePercentage(percentage - 5)}>
            <Text style={styles.buttonText}>-5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changePercentage(percentage + 5)}>
            <Text style={styles.buttonText}>+5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => changePercentage(percentage + 10)}>
            <Text style={styles.buttonText}>+10</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setMaxValue(prev => Math.max(10, prev - 10))}>
            <Text style={styles.buttonText}>Max-10</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setMaxValue(prev => prev + 10)}>
            <Text style={styles.buttonText}>Max+10</Text>
          </TouchableOpacity>
        </View> */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => setPercentage(75)}>
          <Text style={styles.buttonText}>Reset to 75</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    position: 'absolute',
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ChartScreen;
