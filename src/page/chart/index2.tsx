import React, {useEffect, useRef} from 'react';
import {View, TextInput, StyleSheet, Animated} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg';
import {toDp} from '../../hepers/PercentageToDp';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const ChartScreen: React.FC = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const circleRef = useRef<Circle | null>(null);
  const inputRef = useRef<TextInput | null>(null);

  const percentage = 75;
  const radius = toDp(100);
  const strokeWidth = toDp(20);
  const duration = 2000;
  const color = 'tomato';
  const max = 2400;
  const delay = 500;
  const halfCircle = radius + strokeWidth;
  const circumference = 2 * Math.PI * radius;

  // const gapDegree = 129; // derajat spasi putih
  // const gapLength = (circumference * gapDegree) / 360;

  const animation = React.useCallback(
    (toValue: number) => {
      return Animated.timing(animatedValue, {
        toValue,
        duration,
        delay: delay || 0,
        useNativeDriver: false,
      }).start(() => {
        animation(toValue === 0 ? percentage : 0);
      });
    },
    [animatedValue, duration, delay, percentage],
  );
  useEffect(() => {
    animation(percentage);
    animatedValue.addListener(({value}) => {
      if (circleRef?.current) {
        const maxPercentage = (100 * value) / max;
        const strokeDashoffset =
          circumference - (circumference * maxPercentage) / 100;
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
      if (inputRef?.current) {
        inputRef.current.setNativeProps({
          text: `${Math.round(value)}`,
        });
      }
    });
    return () => {
      animatedValue.removeAllListeners();
    };
  }, [max, percentage, animatedValue, animation, circumference]);
  return (
    <View style={styles.screenContainer}>
      <View>
        <Svg
          width={radius * 2}
          height={radius * 2}
          viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
          <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
            <Circle
              cy={'50%'}
              cx={'50%'}
              stroke={color}
              strokeWidth={strokeWidth}
              r={radius}
              fill={'transparent'}
              strokeOpacity={0.2}
            />
            <AnimatedCircle
              ref={circleRef}
              cy={'50%'}
              cx={'50%'}
              stroke={color}
              strokeWidth={strokeWidth}
              r={radius}
              fill={'transparent'}
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <AnimatedTextInput
          ref={inputRef}
          underlineColorAndroid="transparent"
          editable={false}
          defaultValue={'0'}
          style={[
            StyleSheet.absoluteFillObject,
            {
              fontSize: radius / 2,
              color: '#000',
              fontWeight: 'bold',
              textAlign: 'center',
            },
            ,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChartScreen;
