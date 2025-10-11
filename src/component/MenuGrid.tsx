import React, {useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {MenuIcon} from './MenuIcon';
import {toDp} from '../hepers/PercentageToDp';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import BottomSheet from './BottomSheet';
import {images} from '../assets';
import GlobalText from './globalText';
import Animated, {StretchInX} from 'react-native-reanimated';

const menuItems = [
  {type: 'loan', label: 'Pinjaman'},
  {type: 'keuangan', label: 'Keuangan'},
  {type: 'product', label: 'Produk'},
  {type: 'qr', label: 'Scan QR'},
  {type: 'transfer', label: 'Transfer'},
  {type: 'topup', label: 'Top Up'},
  {type: 'withdraw', label: 'Tarik'},
  {type: 'more', label: 'Lainnya'},
] as const;

export const MenuGrid: React.FC = () => {
  const isFocused = useIsFocused();
  const show = isFocused;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [modal, setModal] = useState(false);

  const handleMenuPress = (type: string) => {
    switch (type) {
      case 'loan':
        navigation.navigate('LoanScreen');
        break;
      case 'qr':
        // navigation.navigate('ScanQrKops');
        setModal(true);
        break;
      case 'product':
        navigation.navigate('ProdukScreen');
        break;
      case 'more':
        setModal(true);
        // navigation.navigate('CarouselScreen');
        break;
      case 'keuangan':
        navigation.navigate('Keuangan');
        break;
      case 'topup':
        setModal(true);
        break;
      case 'withdraw':
        setModal(true);
        break;
      case 'transfer':
        setModal(true);
        break;
      default:
        console.log(type);
    }
  };

  const renderModal = () => {
    return (
      <View style={styles.modalContainer}>
        <GlobalText size={toDp(18)} typeText="bold" style={styles.textHeader}>
          Development
        </GlobalText>
        <Image
          source={images.ondev}
          style={styles.ondevImage}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BottomSheet visible={modal} onClose={() => setModal(false)}>
        {renderModal()}
      </BottomSheet>
      {show && (
        <Animated.View
          key={'menu'}
          style={styles.gridContainer}
          entering={StretchInX.delay(100)}>
          <View style={styles.row}>
            {menuItems.slice(0, 4).map((item, index) => (
              <View key={index}>
                <MenuIcon
                  type={item.type}
                  label={item.label}
                  onPress={() => handleMenuPress(item.type)}
                />
              </View>
            ))}
          </View>
          <View style={styles.row}>
            {menuItems.slice(4, 8).map((item, index) => (
              <View key={index}>
                <MenuIcon
                  type={item.type}
                  label={item.label}
                  onPress={() => handleMenuPress(item.type)}
                />
              </View>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  gridContainer: {
    width: '100%',
    maxWidth: toDp(306),
    paddingVertical: toDp(16),
    gap: toDp(16),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  ondevImage: {
    width: toDp(250),
    height: toDp(160),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHeader: {
    color: '#000',
  },
});
