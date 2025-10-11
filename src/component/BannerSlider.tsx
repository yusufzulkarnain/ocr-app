import React, {useRef, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
} from 'react-native';
import {toDp} from '../hepers/PercentageToDp';

interface BannerItem {
  id: number;
  banner: any; // or ImageSourcePropType from react-native
}

interface BannerSliderProps {
  data: BannerItem[];
}

const {width: screenWidth} = Dimensions.get('window');
const SLIDE_WIDTH = screenWidth - toDp(32); // Full width minus padding
const ITEM_SPACING = toDp(16);

export const BannerSlider: React.FC<BannerSliderProps> = ({data}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offset / (SLIDE_WIDTH + ITEM_SPACING));
    setActiveIndex(newIndex);
  };

  // Calculate initial padding to center items
  const initialPadding = (screenWidth - SLIDE_WIDTH) / 2;

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={SLIDE_WIDTH + ITEM_SPACING}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: initialPadding,
            },
          ]}>
          {data.map(item => (
            <View key={item.id} style={styles.slide}>
              {item.banner && (
                <Image source={item.banner} style={styles.bannerImage} />
              )}
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.paginationContainer}>
        <View style={styles.pagination}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: toDp(16),
  },
  sliderContainer: {
    width: '100%',
  },
  scrollContent: {
    gap: ITEM_SPACING,
  },
  slide: {
    width: SLIDE_WIDTH,
    height: toDp(160),
    borderRadius: toDp(12),
    backgroundColor: '#E0E0E0',
  },
  paginationContainer: {
    width: '100%',
    paddingHorizontal: toDp(32),
    marginTop: toDp(12),
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationDot: {
    width: toDp(4),
    height: toDp(4),
    borderRadius: toDp(2),
    backgroundColor: '#BDBDBD',
    marginRight: toDp(4),
  },
  paginationDotActive: {
    backgroundColor: '#06367C',
    width: toDp(12),
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: toDp(12),
  },
});
