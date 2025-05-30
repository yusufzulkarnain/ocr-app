import React, {useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Vibration,
  Linking,
  Animated,
  Pressable,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {toDp} from '../../hepers/PercentageToDp';
import GlobalText from '../../component/globalText';
import moment from 'moment';
import 'moment/locale/id';
import {RNCamera} from 'react-native-camera';
import Toast from 'react-native-toast-message';
import {Zap, ZapOff} from 'lucide-react-native';

const {width, height} = Dimensions.get('window');

moment.locale('id');

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const QrAsset: React.FC<HomeScreenProps> = ({navigation}) => {
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const [flashOn, setFlashOn] = React.useState(false);
  const [isScanned, setIsScanned] = React.useState(false);

  // Mulai animasi naik turun
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const onSuccess = (e: {data: any}) => {
    if (isScanned) return;

    setIsScanned(true);
    Vibration.vibrate(20);
    Toast.show({
      type: 'success',
      text1: 'Berhasil',
      text2: e.data,
    });

    setTimeout(() => {
      Linking.openURL('https://beta.transjakarta.co.id/sma/data/' + e.data);
      setIsScanned(false);
    }, 3000);
  };

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, toDp(320) - toDp(2)], // 2dp tinggi garis
  });

  const handleFlash = () => {
    setFlashOn(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        captureAudio={false}
        style={{width, height}}
        type={RNCamera.Constants.Type.back}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        flashMode={
          flashOn
            ? RNCamera.Constants.FlashMode.torch
            : RNCamera.Constants.FlashMode.off
        }
        onBarCodeRead={onSuccess}>
        <View style={styles.maskTopText}>
          <GlobalText size={toDp(14)} style={styles.instructionText}>
            Selamat Datang Di TJ-ASSET
          </GlobalText>
          <GlobalText size={toDp(14)} style={styles.textDeskrip}>
            Sejajarkan kode QR di dalam bingkai untuk dipindai
          </GlobalText>
        </View>
        <View style={styles.overlay}>
          <View style={styles.maskTop} />
          <View style={styles.maskCenter}>
            <View style={styles.maskSide} />
            <View style={styles.focusedArea}>
              {/* Garis animasi naik-turun */}
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{translateY}],
                  },
                ]}
              />
            </View>
            <View style={styles.maskSide} />
          </View>
          <View style={styles.maskBottom}>
            <Pressable onPress={handleFlash}>
              {flashOn ? (
                <Zap size={40} color={'#FFFFFF'} />
              ) : (
                <ZapOff size={40} color={'#FFFFFF'} />
              )}
            </Pressable>
          </View>
        </View>
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  maskTop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height: toDp(180),
  },
  maskCenter: {
    flexDirection: 'row',
    height: toDp(320),
  },
  maskSide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  focusedArea: {
    width: toDp(320),
    height: toDp(320),
    borderWidth: toDp(3),
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  scanLine: {
    width: '100%',
    height: toDp(2),
    backgroundColor: '#00FF00',
    position: 'absolute',
    top: 0,
  },
  maskBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  maskTopText: {
    position: 'absolute',
    top: toDp(24),
    zIndex: 1,
    alignSelf: 'center',
  },
  instructionText: {
    color: '#FFF',
    fontSize: toDp(16),
    textAlign: 'center',
    paddingHorizontal: toDp(20),
    fontFamily: 'PlusJakartaSans-Bold',
  },
  textDeskrip: {
    color: '#FFF',
    fontSize: toDp(14),
    textAlign: 'center',
    paddingHorizontal: toDp(20),
    fontFamily: 'PlusJakartaSans-Regular',
    marginTop: toDp(12),
  },
});

export default QrAsset;
