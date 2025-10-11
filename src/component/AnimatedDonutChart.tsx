import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, ViewStyle, StyleProp} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg';
import {toDp} from '../hepers/PercentageToDp';

export interface AnimatedDonutChartProps {
  value: number;
  maxValue: number;
  radius?: number;
  strokeWidth?: number;
  colorBlue?: string;
  colorRed?: string;
  gapDegree?: number;
  label?: string;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  percentTextStyle?: object;
  labelTextStyle?: object;
  onAnimationEnd?: () => void;
}

const AnimatedDonutChart: React.FC<AnimatedDonutChartProps> = ({
  value,
  maxValue,
  radius = 100,
  strokeWidth = 22,
  colorBlue = '#08448F',
  colorRed = '#CFCFCF',
  gapDegree = 15,
  label = '',
  duration = 800,
  style,
  percentTextStyle,
  labelTextStyle,
  onAnimationEnd,
}) => {
  const currentValueRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const [, setRenderKey] = useState(0);
  const [displayPercent, setDisplayPercent] = useState('');

  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  useEffect(() => {
    const startValue = currentValueRef.current;
    const endValue = value;
    const startTime = Date.now();

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const newValue = startValue + (endValue - startValue) * easeOutCubic;
      currentValueRef.current = newValue;
      setRenderKey(prev => prev + 1);
      setDisplayPercent(((newValue / maxValue) * 100).toFixed(1) + '%');
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        if (onAnimationEnd) {
          onAnimationEnd();
        }
      }
    };

    if (startValue !== endValue) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setDisplayPercent(((endValue / maxValue) * 100).toFixed(1) + '%');
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, maxValue, duration, onAnimationEnd]);

  const currentValue = currentValueRef.current;
  const totalGapDegree = gapDegree * 2;
  const availableDegree = 360 - totalGapDegree;
  const blueDegree = (currentValue / maxValue) * availableDegree;
  const redDegree = availableDegree - blueDegree;
  const blueLength = (circumference * blueDegree) / 360;
  const redLength = (circumference * redDegree) / 360;
  const gapLength = (circumference * gapDegree) / 360;

  return (
    <View style={[styles.container, style]}>
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
          <Text style={[styles.percentText, percentTextStyle]}>
            {displayPercent}
          </Text>
          {!!label && (
            <Text style={[{fontSize: toDp(12)}, labelTextStyle]}>{label}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default AnimatedDonutChart;
