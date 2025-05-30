import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Vibration,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {useIsFocused} from '@react-navigation/native';
import {toDp} from '../../../../hepers/PercentageToDp';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';
import CustomModal from '../../../../component/customBottomModal';
import GlobalText from '../../../../component/globalText';

const {width, height} = Dimensions.get('window');
type BuatDoScreenProps = {
  navigation: any;
};
interface DataPramudi {
  id: number;
  nama: string;
  nik: string;
  jabatan: string;
}

const ScanQR: React.FC<BuatDoScreenProps> = ({navigation}) => {
  const isFocused = useIsFocused();
  const [cameraActive, setCameraActive] = useState(false);
  const [state, setState] = useState({
    dataPramudi: {} as DataPramudi,
    visibleModal: false,
  });

  React.useLayoutEffect(() => {
    navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}});

    return () => {
      navigation.getParent()?.setOptions({tabBarStyle: {display: 'flex'}});
    };
  }, [navigation]);

  useEffect(() => {
    setCameraActive(isFocused);
    // setTimeout(() => {
    //   const data = {
    //     id: 12,
    //     nama: 'Yusufz',
    //     nik: '123456',
    //     jabatan: 'Pramudi',
    //   };
    //   setState({
    //     ...state,
    //     dataPramudi: JSON.parse(JSON.stringify(data)),
    //     visibleModal: true,
    //   });
    // }, 3000);
  }, [isFocused]);

  const onSuccess = (e: {data: any}) => {
    console.log(e.data);
    Vibration.vibrate(10);
    Toast.show({
      type: 'success',
      text1: 'Berhasil',
    });
    setState({
      ...state,
      dataPramudi: JSON.parse(e.data),
      visibleModal: true,
    });
  };
  const toggleModal = () => {
    console.log(state.dataPramudi);
    setState({
      ...state,
      visibleModal: false,
    });
    navigation.navigate('BuatDo', {
      dataPramudi: state.dataPramudi,
    });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <CustomModal
        visibleBtn
        isVisible={state.visibleModal}
        onPressbtn={toggleModal}
        title="Berhasil"
        titleBtn="Lanjutkan">
        <View style={styles.ContainerModal}>
          <GlobalText typeText="regular" size={16}>
            {state.dataPramudi.nama}
          </GlobalText>
          <GlobalText
            typeText="regular"
            size={16}
            style={{marginTop: toDp(10)}}>
            {state.dataPramudi.nik}
          </GlobalText>
          <GlobalText
            typeText="regular"
            size={16}
            style={{marginTop: toDp(10)}}>
            {state.dataPramudi.jabatan}
          </GlobalText>
        </View>
      </CustomModal>
      {cameraActive && (
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
          flashMode={RNCamera.Constants.FlashMode.off}
          onBarCodeRead={onSuccess}>
          <View style={styles.overlay}>
            <View style={styles.maskTop} />
            <View style={styles.maskCenter}>
              <View style={styles.maskSide} />
              <View style={styles.focusedArea} />
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
    // flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    height: toDp(160),
  },
  maskCenter: {
    flexDirection: 'row',
    height: toDp(250),
  },
  maskSide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  focusedArea: {
    width: toDp(250),
    height: toDp(250),
    borderWidth: toDp(3),
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
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
    // borderWidth: toDp(1),
    justifyContent: 'center',
    alignItems: 'center',
    padding: toDp(12),
  },
  textModalContent: {
    color: '#000',
  },
});

export default ScanQR;
