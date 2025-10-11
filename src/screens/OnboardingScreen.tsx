import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {setHasSeenOnboarding} from '../utils/storage';
import {toDp} from '../hepers/PercentageToDp';
import GlobalText from '../component/globalText';
import {images} from '../assets';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import {ArrowRight} from 'lucide-react-native';
import {PaginationDot} from '../component/PaginationDot';
import SlideItem from '../component/SlideItemOnBoarding';

const {width} = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Selamat Datang',
    description: 'Aplikasi untuk memudahkan transaksi keuangan Anda',
    SvgComponent: images.onboarding1,
  },
  {
    id: '2',
    title: 'Transaksi Mudah',
    description: 'Lakukan berbagai transaksi dengan cepat dan aman',
    SvgComponent: images.onboarding2,
  },
  {
    id: '3',
    title: 'Mulai Sekarang',
    description: 'Bergabung dan nikmati kemudahan bertransaksi',
    SvgComponent: images.onboarding3,
  },
];

export const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const buttonWidth = useSharedValue(toDp(40)); // default icon mode
  const iconOpacity = useSharedValue(1);
  const textOpacity = useSharedValue(0);

  const renderItem = ({item, index}: any) => (
    <SlideItem item={item} index={index} scrollX={scrollX} />
  );

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    try {
      await setHasSeenOnboarding();
      navigation.replace('LoginKops');
    } catch (error) {
      console.error('Error setting onboarding status:', error);
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const getItemLayout = (_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  React.useEffect(() => {
    const isLast = currentIndex === slides.length - 1;
    buttonWidth.value = withTiming(isLast ? toDp(120) : toDp(40), {
      duration: 300,
    });
    iconOpacity.value = withTiming(isLast ? 0 : 1, {duration: 200});
    textOpacity.value = withTiming(isLast ? 1 : 0, {duration: 200});
  }, [currentIndex, buttonWidth, iconOpacity, textOpacity]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    width: buttonWidth.value,
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{scale: iconOpacity.value}],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{scale: textOpacity.value}],
  }));

  return (
    <View style={styles.container}>
      <Animated.FlatList
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        getItemLayout={getItemLayout}
        keyExtractor={item => item.id}
      />
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <PaginationDot key={index} index={index} scrollX={scrollX} />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}>
          <GlobalText
            size={toDp(16)}
            style={styles.skipButtonText}
            typeText="bold">
            Lewati
          </GlobalText>
        </TouchableOpacity>
        <Animated.View style={[styles.nextButton, animatedButtonStyle]}>
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.7}
            style={styles.touchableOpacityIcon}>
            <Animated.View style={[{position: 'absolute'}, animatedIconStyle]}>
              <ArrowRight color="#fff" size={20} />
            </Animated.View>
            <Animated.View style={[animatedTextStyle]}>
              <GlobalText
                typeText="bold"
                size={toDp(14)}
                style={styles.nextButtonText}>
                Mulai
              </GlobalText>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  image: {
    marginVertical: toDp(20),
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: toDp(20),
  },
  paginationDot: {
    height: toDp(8),
    borderRadius: toDp(4),
    backgroundColor: '#06367C',
    marginHorizontal: toDp(4),
  },
  paginationDotActive: {
    backgroundColor: '#06367C',
    width: toDp(20),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: toDp(20),
    paddingBottom: Platform.OS === 'ios' ? toDp(40) : toDp(16),
  },
  skipButton: {
    padding: toDp(15),
  },
  skipButtonText: {
    color: '#06367C',
  },
  nextButtonText: {
    color: '#FFFFFF',
  },
  nextButton: {
    backgroundColor: '#06367C',
    paddingVertical: toDp(10),
    borderRadius: toDp(25),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flexDirection: 'row',
  },
  touchableOpacityIcon: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
