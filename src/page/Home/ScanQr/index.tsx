import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Animated,
  Platform,
  Easing,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {toDp} from '../../../hepers/PercentageToDp';
import CustomModal from '../../../component/customBottomModal';
import GlobalText from '../../../component/globalText';
import {useStatusBar} from '../../../hooks/useStatusBar';

const {width} = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;
const CORNER_SIZE = 20;

const originalTabBarStyle = {
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

type RootStackParamList = {
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DataPramudi {
  id: number;
  nama: string;
  nik: string;
  jabatan: string;
}

const ScanQrKops: React.FC = () => {
  useStatusBar({
    barStyle: 'dark-content',
    backgroundColor: '#fff',
  });
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const [cameraActive, setCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [state, setState] = useState({
    dataPramudi: {} as DataPramudi,
    visibleModal: false,
  });
  const translateY = useRef(new Animated.Value(0)).current;
  const frameScale = useRef(new Animated.Value(0)).current;
  const frameOpacity = useRef(new Animated.Value(0)).current;

  React.useLayoutEffect(() => {
    const parent = navigation.getParent();

    parent?.setOptions({
      tabBarStyle: {
        display: 'none',
      },
    });

    return () => {
      parent?.setOptions({
        tabBarVisible: true,
        tabBarStyle: originalTabBarStyle,
      });
    };
  }, [navigation]);

  useEffect(() => {
    setCameraActive(isFocused);
    if (isFocused && isScanning) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(frameScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 20,
            friction: 5,
            restDisplacementThreshold: 0.001,
            restSpeedThreshold: 0.001,
            velocity: 0.3,
          }),
          Animated.timing(frameOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          }),
        ]),
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: toDp(200),
              duration: 3000,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
          ]),
        ),
      ]).start();
    }
  }, [isFocused, translateY, isScanning, frameScale, frameOpacity]);

  const onSuccess = (e: any) => {
    if (e.data && isScanning) {
      setIsScanning(false);
      console.log(e.data);
      setState({
        ...state,
        visibleModal: true,
      });
    }
  };

  const toggleModal = () => {
    setState({
      ...state,
      visibleModal: false,
    });
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  const renderCorner = (position: string) => {
    const cornerStyle = {
      position: 'absolute' as const,
      width: CORNER_SIZE,
      height: CORNER_SIZE,
      borderColor: 'white',
      borderWidth: toDp(5),
    };

    switch (position) {
      case 'topLeft':
        return (
          <View
            style={[
              cornerStyle,
              {
                top: 0,
                left: 0,
                borderBottomWidth: 0,
                borderRightWidth: 0,
              },
            ]}
          />
        );
      case 'topRight':
        return (
          <View
            style={[
              cornerStyle,
              {
                top: 0,
                right: 0,
                borderBottomWidth: 0,
                borderLeftWidth: 0,
              },
            ]}
          />
        );
      case 'bottomLeft':
        return (
          <View
            style={[
              cornerStyle,
              {
                bottom: 0,
                left: 0,
                borderTopWidth: 0,
                borderRightWidth: 0,
              },
            ]}
          />
        );
      case 'bottomRight':
        return (
          <View
            style={[
              cornerStyle,
              {
                bottom: 0,
                right: 0,
                borderTopWidth: 0,
                borderLeftWidth: 0,
              },
            ]}
          />
        );
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <CustomModal
        visibleBtn
        isVisible={state.visibleModal}
        onPressbtn={toggleModal}
        title="Berhasil"
        typeIcon="qr"
        titleBtn="Oke">
        <View style={styles.ContainerModal}>
          <GlobalText typeText="regular" size={16}>
            Berhasil Scan QR
          </GlobalText>
        </View>
      </CustomModal>
      {cameraActive && (
        <RNCamera
          captureAudio={false}
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          flashMode={RNCamera.Constants.FlashMode.off}
          onBarCodeRead={onSuccess}>
          <View style={styles.overlay}>
            <View style={styles.maskTop} />
            <View style={styles.maskCenter}>
              <View style={styles.maskSide} />
              <Animated.View
                style={[
                  styles.focusedArea,
                  {
                    opacity: frameOpacity,
                    transform: [{scale: frameScale}],
                  },
                ]}>
                {renderCorner('topLeft')}
                {renderCorner('topRight')}
                {renderCorner('bottomLeft')}
                {renderCorner('bottomRight')}
                <Animated.View
                  style={[
                    styles.scanner,
                    {
                      transform: [{translateY}],
                    },
                  ]}
                />
              </Animated.View>
              <View style={styles.maskSide} />
            </View>
            <View style={styles.maskBottom}>
              <Text style={styles.instructionText}>
                Align the QR code within the frame to scan
              </Text>
            </View>
          </View>
        </RNCamera>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  maskTop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height: toDp(160),
  },
  maskCenter: {
    flexDirection: 'row',
    height: SCAN_AREA_SIZE,
  },
  maskSide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  focusedArea: {
    width: toDp(250),
    height: toDp(250),
    backgroundColor: 'transparent',
    position: 'relative',
  },
  maskBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    color: '#FFF',
    fontSize: toDp(14),
    textAlign: 'center',
    paddingHorizontal: toDp(20),
    fontFamily: 'Poppins-Regular',
  },
  ContainerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: toDp(12),
  },
  textModalContent: {
    color: '#000',
  },
  camera: {
    flex: 1,
  },
  scanner: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#2196F3',
    shadowColor: '#2196F3',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
});

export default ScanQrKops;
