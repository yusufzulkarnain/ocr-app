import {Dimensions, PixelRatio} from 'react-native';

const {width, height} = Dimensions.get('window');

const widthPercentageToDP = (widthPercent: number): number => {
  const screenWidth = Dimensions.get('window').width;
  return PixelRatio.roundToNearestPixel((screenWidth * widthPercent) / 100);
};

const heightPercentageToDP = (heightPercent: number): number => {
  const screenHeight = Dimensions.get('window').height;
  return PixelRatio.roundToNearestPixel((screenHeight * heightPercent) / 100);
};

const toDp = (size: number): number => {
  const screenHeight = Dimensions.get('window').width;
  return PixelRatio.roundToNearestPixel((screenHeight * size) / 100) / 3.6;
};

const toDpLandspace = (size: number): number => {
  const screenWidth = Math.min(width, height);
  return PixelRatio.roundToNearestPixel((screenWidth * size) / 100) / 7.3;
  //return PixelRatio.roundToNearestPixel((screenWidth * size) / 100) / 6;
};

export {widthPercentageToDP, heightPercentageToDP, toDp, toDpLandspace};
