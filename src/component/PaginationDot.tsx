import React from 'react';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {Dimensions, StyleSheet} from 'react-native';
import {toDp} from '../hepers/PercentageToDp';

const {width} = Dimensions.get('window');

export const PaginationDot = ({
  index,
  scrollX,
}: {
  index: number;
  scrollX: any;
}) => {
  const smallDot = toDp(8);
  const largeDot = toDp(20);
  const animatedDotStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const dotWidth = interpolate(
      scrollX.value,
      inputRange,
      [smallDot, largeDot, smallDot],
      Extrapolate.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP,
    );

    return {
      width: dotWidth,
      opacity,
    };
  });

  return <Animated.View style={[styles.dot, animatedDotStyle]} />;
};

const styles = StyleSheet.create({
  dot: {
    height: toDp(8),
    borderRadius: toDp(4),
    backgroundColor: '#06367C',
    marginHorizontal: toDp(4),
  },
});
