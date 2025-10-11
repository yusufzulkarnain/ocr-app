import React from 'react';
import {View, StyleSheet, Platform, Dimensions, Image} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {toDp} from '../../../hepers/PercentageToDp';
import {useStatusBar} from '../../../hooks/useStatusBar';
import {images} from '../../../assets';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  SharedValue,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  runOnJS,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

type CarouselScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};
const {width} = Dimensions.get('screen');
const _itemSize = width * 0.24;
const _spacing = 12;
const _itemTotalSize = _itemSize + _spacing;
interface CarouselItemProps {
  imageUri: any;
  _index: number;
  _scrollX: SharedValue<number>;
}

// function CarouselItem({imageUri, _index, _scrollX}: CarouselItemProps) {
//   const stylez = useAnimatedStyle(() => {
//     return {
//       borderWidth: 4,
//       borderColor: interpolateColor(
//         _scrollX.value,
//         [_index - 2, _index, _index + 1],
//         ['transparent', 'white', 'transparent'],
//       ),
//       transform: [
//         {
//           translateY: interpolate(
//             _scrollX.value,
//             [_index - 1, _index, _index + 1],
//             [_itemSize / 3, 0, _itemSize / 3],
//           ),
//         },
//       ],
//     };
//   });
//   return (
//     <Animated.View style={[{borderRadius: _itemSize}, stylez]}>
//       <Image
//         source={imageUri}
//         style={{
//           width: _itemSize,
//           height: _itemSize,
//           borderRadius: _itemSize / 2,
//         }}
//       />
//     </Animated.View>
//   );
// }

const CarouselScreen: React.FC<CarouselScreenProps> = ({navigation}) => {
  useStatusBar({
    barStyle: 'dark-content',
    backgroundColor: 'transparent',
    translucent: true,
  });
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });

    return () => {
      const tabBarStyle = {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? toDp(20) : toDp(20),
        left: toDp(20),
        right: toDp(20),
        elevation: 4,
        borderRadius: toDp(15),
        height: Platform.OS === 'ios' ? toDp(60) : toDp(60),
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: Platform.OS === 'ios' ? 2 : 4,
        },
        shadowOpacity: Platform.OS === 'ios' ? 0.15 : 0.1,
        shadowRadius: Platform.OS === 'ios' ? 6 : 8,
        borderTopWidth: 0,
        paddingBottom: Platform.OS === 'ios' ? toDp(5) : 0,
      };

      navigation.getParent()?.setOptions({
        tabBarStyle,
      });
    };
  }, [navigation]);

  // const imagesList = [
  //   images.img_carousel1,
  //   images.img_carousel2,
  //   images.img_carousel3,
  //   images.img_carousel4,
  //   images.img_carousel5,
  // ];
  // const scrollX = useSharedValue(0);
  // const onScroll = useAnimatedScrollHandler(e => {
  //   scrollX.value = e.contentOffset.x / _itemTotalSize;
  //   const newIndex = Math.round(e.contentOffset.x / _itemTotalSize);
  //   if (newIndex !== currentIndex) {
  //     runOnJS(setCurrentIndex)(newIndex);
  //   }
  // });
  return (
    <View style={styles.container}>
      {/* <View style={[StyleSheet.absoluteFill, styles.backgroundImage]}>
        <Animated.Image
          key={`image-${currentIndex}`}
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          source={imagesList[currentIndex]}
          style={styles.backgroundImageStyle}
          resizeMode="cover"
        />
      </View>
      <Animated.FlatList
        style={styles.flatListStyle}
        contentContainerStyle={styles.containStyle}
        keyExtractor={(_, index) => index.toString()}
        data={imagesList}
        renderItem={({item, index}) => (
          <CarouselItem imageUri={item} _index={index} _scrollX={scrollX} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={1000 / 60}
        snapToInterval={_itemTotalSize}
        decelerationRate={'fast'}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: _spacing,
    backgroundColor: '#000',
  },
  backgroundImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: {
    width: '100%',
    height: '100%',
  },
  flatListStyle: {
    flexGrow: 0,
  },
  containStyle: {
    paddingHorizontal: (width - _itemSize) / 2,
    gap: _spacing,
    paddingBottom: _itemSize - _spacing,
  },
});

export default CarouselScreen;
