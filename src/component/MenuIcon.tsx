import React from 'react';
import Svg, {Path, Circle, Rect} from 'react-native-svg';
import {View, StyleSheet, Pressable, Image} from 'react-native';
import GlobalText from './globalText';
import {toDp} from '../hepers/PercentageToDp';
import {images} from '../assets';

type IconType =
  | 'loan'
  | 'transfer'
  | 'keuangan'
  | 'topup'
  | 'withdraw'
  | 'product'
  | 'qr'
  | 'more';

interface MenuIconProps {
  type: IconType;
  label: string;
  onPress?: () => void;
}

const renderIcon = (type: IconType) => {
  switch (type) {
    case 'loan':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          {/* <Circle cx="12" cy="12" r="10" fill="#4CAF50" />
          <Path
            d="M8 12h8M12 8v8"
            stroke="#FFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <Path
            d="M15 7c1.5 1 2.5 2.5 2.5 4.25s-1 3.25-2.5 4.25"
            stroke="#FFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          /> */}
          <Image
            source={images.icLoan}
            style={{width: toDp(25), height: toDp(25)}}
          />
        </Svg>
      );
    case 'transfer':
      return (
        // <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        //   <Circle cx="12" cy="12" r="10" fill="#2196F3" />
        //   <Path d="M8 12l3-3v6L8 12zm8 0l-3 3v-6l3 3z" fill="#FFFFFF" />
        // </Svg>
        <Image
          source={images.icTransfer}
          style={{width: toDp(25), height: toDp(25)}}
        />
      );
    case 'keuangan':
      return (
        // <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        //   <Rect x="4" y="2" width="16" height="20" rx="2" fill="#FF9800" />
        //   <Path d="M7 7h10M7 11h10M7 15h6" stroke="#FFF" strokeWidth="2" />
        // </Svg>
        <Image
          source={images.icKeuangan}
          style={{width: toDp(25), height: toDp(25)}}
        />
      );
    case 'topup':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" fill="#9C27B0" />
          <Path d="M12 7v10M7 12h10" stroke="#FFF" strokeWidth="2" />
        </Svg>
      );
    case 'withdraw':
      return (
        // <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        //   <Circle cx="12" cy="12" r="10" fill="#F44336" />
        //   <Path d="M7 12h10M12 9l3 3-3 3" stroke="#FFF" strokeWidth="2" />
        // </Svg>
        <Image
          source={images.icWithdraw}
          style={{width: toDp(25), height: toDp(25)}}
        />
      );
    case 'product':
      return (
        // <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        //   <Rect
        //     x="3"
        //     y="3"
        //     width="18"
        //     height="18"
        //     rx="2"
        //     stroke="#06367C"
        //     strokeWidth="2"
        //   />
        //   <Path
        //     d="M8 12h8M12 8v8"
        //     stroke="#06367C"
        //     strokeWidth="2"
        //     strokeLinecap="round"
        //   />
        // </Svg>
        <Image
          source={images.icProduct}
          style={{width: toDp(25), height: toDp(25)}}
        />
      );
    case 'qr':
      return (
        // <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        //   <Rect x="4" y="4" width="7" height="7" rx="1" fill="#00BCD4" />
        //   <Rect x="13" y="4" width="7" height="7" rx="1" fill="#00BCD4" />
        //   <Rect x="4" y="13" width="7" height="7" rx="1" fill="#00BCD4" />
        //   <Path d="M13 13h7v2h-2v5h-5v-7z" fill="#00BCD4" />
        // </Svg>
        <Image
          source={images.icScanQr}
          style={{width: toDp(25), height: toDp(25)}}
        />
      );
    case 'more':
      return (
        // <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        //   <Circle cx="12" cy="12" r="10" fill="#795548" />
        //   <Circle cx="8" cy="12" r="1.5" fill="#FFF" />
        //   <Circle cx="12" cy="12" r="1.5" fill="#FFF" />
        //   <Circle cx="16" cy="12" r="1.5" fill="#FFF" />
        // </Svg>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="4" width="7" height="7" rx="1" fill="#00BCD4" />
          <Rect x="13" y="4" width="7" height="7" rx="1" fill="#00BCD4" />
          <Rect x="4" y="13" width="7" height="7" rx="1" fill="#00BCD4" />
          <Path d="M13 13h7v2h-2v5h-5v-7z" fill="#00BCD4" />
        </Svg>
      );
  }
};

export const MenuIcon: React.FC<MenuIconProps> = ({type, label, onPress}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View
        style={[
          styles.iconContainer,
          {
            opacity:
              type === 'topup' ||
              type === 'transfer' ||
              type === 'withdraw' ||
              type === 'qr' ||
              type === 'product' ||
              type === 'more'
                ? 0.6
                : 1,
          },
        ]}>
        {renderIcon(type)}
      </View>
      <GlobalText size={toDp(12)} typeText="regular" style={styles.label}>
        {label}
      </GlobalText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: toDp(65),
  },
  iconContainer: {
    width: toDp(48),
    height: toDp(48),
    borderRadius: toDp(50),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: toDp(8),
  },
  label: {
    textAlign: 'center',
    color: '#000000',
  },
});
