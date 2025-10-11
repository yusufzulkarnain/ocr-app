import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Circle, G} from 'react-native-svg';

interface DonutChartProps {
  value: number;
  maxValue: number;
  size?: number;
  strokeWidth?: number;
  gap?: number;
  showPercentage?: boolean;
  showValue?: boolean;
}

const DonutChart: React.FC<DonutChartProps> = ({
  value = 78,
  maxValue = 100,
  size = 200,
  strokeWidth = 20,
  gap = 10,
  showPercentage = true,
  showValue = true,
}) => {
  // Calculate radius and center
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate the blue portion (half of total value)
  const blueValue = maxValue / 2;
  const redValue = maxValue - blueValue;

  // Calculate gap in pixels
  const gapPixels = (gap / 360) * circumference;

  // Calculate stroke dasharray for each segment with gaps
  const blueStrokeDasharray = (blueValue / maxValue) * circumference;
  const redStrokeDasharray = (redValue / maxValue) * circumference;

  // Calculate current value percentage
  const currentPercentage = (value / maxValue) * 100;

  // Determine which color to show based on current value
  let currentColor = '#FF6B6B'; // red
  let currentStrokeDasharray = 0;

  if (value <= blueValue) {
    // Value is within blue range
    currentColor = '#4ECDC4'; // blue
    currentStrokeDasharray = (value / maxValue) * circumference;
  } else {
    // Value exceeds blue range, show blue + partial red
    currentStrokeDasharray =
      blueStrokeDasharray +
      gapPixels +
      ((value - blueValue) / maxValue) * circumference;
  }

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#E0E0E0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Blue segment (first half) */}
          {/* <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#4ECDC4"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${blueStrokeDasharray} ${gapPixels} ${
              circumference - blueStrokeDasharray - gapPixels
            }`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          /> */}

          {/* Red segment (second half) */}
          {/* <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#FF6B6B"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${redStrokeDasharray} ${gapPixels} ${
              circumference - redStrokeDasharray - gapPixels
            }`}
            strokeDashoffset={-blueStrokeDasharray - gapPixels}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          /> */}

          {/* Current value indicator */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={currentColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${currentStrokeDasharray} ${
              circumference - currentStrokeDasharray
            }`}
            strokeDashoffset={0}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
            opacity={0.8}
          />
        </G>
      </Svg>

      {/* Center text */}
      <View style={[styles.centerText, {width: size, height: size}]}>
        {showValue && <Text style={styles.valueText}>{value}</Text>}
        {showPercentage && (
          <Text style={styles.percentageText}>
            {currentPercentage.toFixed(1)}%
          </Text>
        )}
        <Text style={styles.maxValueText}>/ {maxValue}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  percentageText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  maxValueText: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
});

export default DonutChart;
