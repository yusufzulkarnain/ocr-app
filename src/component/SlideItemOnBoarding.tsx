// SlideItem.tsx
import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  SharedValue,
} from 'react-native-reanimated';
import GlobalText from '../component/globalText';

const {width} = Dimensions.get('window');

interface SlideItemProps {
  item: any;
  index: number;
  scrollX: SharedValue<number>;
}

const SlideItem = ({item, index, scrollX}: SlideItemProps) => {
  const SvgComponent = item.SvgComponent.default;

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [width * 0.3, 0, -width * 0.3],
      Extrapolate.CLAMP,
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{translateX}],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.slide, animatedStyle]}>
      <SvgComponent width={width * 0.8} height={width * 0.8} />
      <GlobalText typeText="bold" size={24} style={styles.title}>
        {item.title}
      </GlobalText>
      <GlobalText size={16} style={styles.description}>
        {item.description}
      </GlobalText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  slide: {
    width,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#06367C',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default SlideItem;
