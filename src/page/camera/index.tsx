import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Platform,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  Camera,
  CameraPosition,
  PhotoFile,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import {useFocusEffect} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import axios from 'axios';
import {toDp} from '../../hepers/PercentageToDp';
import {userInterface} from '../../hepers/Interface';
import {getUserData, updateUserPhoto} from '../../utils/storage';
import GlobalText from '../../component/globalText';
import {putDataKoperasi} from '../../hepers/Api';
import * as Icon from 'lucide-react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CameraComponents = forwardRef(function CameraComponents2(
  {
    navigation,
  }: {
    navigation: any;
  },
  ref,
) {
  const [hasPermission, setHasPermission] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [hasFlash, setHasFlash] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('front');
  const [userData, setUserData] = useState<userInterface | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const deviceCamera = useCameraDevice(cameraPosition);

  const format = useCameraFormat(deviceCamera, [
    {photoResolution: {width: 1280, height: 720}},
  ]);

  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
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

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('#FFFFFF');
      StatusBar.setTranslucent(true);
      getLocalUserData();
      return () => {};
    }, []),
  );

  useEffect(() => {
    if (deviceCamera) {
      setHasFlash(deviceCamera.hasFlash || deviceCamera.hasTorch);
    }
  }, [deviceCamera]);

  useEffect(() => {
    const requestCameraPermission = async () => {
      const permission = await Camera.requestCameraPermission();
      if (permission === 'denied') {
        navigation.goBack();
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Please allow permission Camera',
        });
      }
      setHasPermission(permission === 'granted');
    };

    requestCameraPermission();
  }, [navigation]);

  const getLocalUserData = async () => {
    try {
      const userDataLocal = await getUserData();
      setUserData(userDataLocal);
      return userDataLocal;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const HandleTakePhoto = async (): Promise<{
    photo: PhotoFile;
    rawBase64: string;
    base64Preview: string;
  } | null> => {
    if (!cameraRef.current) return null;

    try {
      const photo = await cameraRef.current.takePhoto({flash: 'off'});

      // **Resize & kompres foto**
      const resized = await ImageResizer.createResizedImage(
        photo.path, // path asli foto
        800, // width target
        600, // height target
        'JPEG', // format
        70, // kualitas (0–100)
      );

      // Baca hasil resize ke Base64
      const rawBase64 = await RNFS.readFile(resized.uri, 'base64');
      const base64Preview = `data:image/jpeg;base64,${rawBase64}`;

      return {photo, rawBase64, base64Preview};
    } catch (e) {
      console.error('TakePhoto error:', e);
      return null;
    }
  };

  if (deviceCamera == null || !hasPermission) {
    return (
      <View style={styles.page2}>
        <ActivityIndicator size="large" color={'#06367C'} />
      </View>
    );
  }

  const renderModalLoading = () => {
    return (
      <View>
        <Modal isVisible={loading}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                backgroundColor: '#fff',
                padding: toDp(16),
                borderRadius: toDp(10),
              }}>
              <ActivityIndicator size="small" color={'#06367C'} />
              <GlobalText
                typeText="regular"
                size={12}
                style={{marginTop: toDp(10)}}>
                Sedang mengupload foto ...
              </GlobalText>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <View style={styles.page2}>
      {renderModalLoading()}
      <View style={[styles.header, {top: insets.top}]}>
        <Icon.ArrowLeft
          size={toDp(24)}
          color="#FFFFFF"
          onPress={() => navigation.goBack()}
          strokeWidth={toDp(2)}
        />
        {/* Tombol flash */}
        {hasFlash && (
          <TouchableOpacity
            style={styles.flashButton}
            onPress={() => setTorchOn(prev => !prev)}>
            <GlobalText size={toDp(14)} style={styles.captureText}>
              {torchOn ? 'Flash ON' : 'Flash OFF'}
            </GlobalText>
          </TouchableOpacity>
        )}
      </View>
      <Camera
        ref={cameraRef}
        style={{width: '100%', height: '100%', backgroundColor: 'black'}}
        device={deviceCamera}
        isActive={true}
        photo={true}
        format={format}
        torch={torchOn ? 'on' : 'off'}
      />

      {/* Preview foto */}
      {preview && (
        <Image
          source={{uri: preview}}
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            width: 100,
            height: 100,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#fff',
          }}
        />
      )}

      {/* Tombol ambil foto */}
      <View style={styles.rowtakeBtn}>
        <View style={styles.outlineBtnTake}>
          <TouchableOpacity
            disabled={loading}
            style={styles.captureButton}
            onPress={async () => {
              const result = await HandleTakePhoto();
              if (result) {
                setPreview(result.base64Preview);
                // console.log('result', result.rawBase64);

                const obj = {
                  id: userData?.id,
                  photo: result.base64Preview,
                };
                setLoading(true);
                try {
                  const result = await putDataKoperasi('/update-photo', obj);
                  if (result) {
                    setLoading(false);
                    Toast.show({
                      type: 'success',
                      text1: 'Foto berhasil diambil',
                      text2: result.message,
                    });
                    console.log(
                      JSON.stringify({
                        message: result.message,
                        foto: result?.foto?.substring(0, 100) + '...',
                      }),
                    );
                    updateUserPhoto(result?.foto);
                    //  navigation.goBack();
                  } else {
                    setLoading(false);
                    Toast.show({
                      type: 'error',
                      text1: result?.error || 'Terjadi kesalahan',
                    });
                  }
                } catch (error: any) {
                  setLoading(false);
                  console.log(' error:', error);
                  Toast.show({
                    type: 'error',
                    text1: error.message || 'Terjadi kesalahan',
                  });
                }
              }
            }}>
            <Icon.Camera
              size={toDp(32)}
              color={'#06367C'}
              strokeWidth={toDp(2)}
            />
          </TouchableOpacity>
        </View>
        {/* Tombol ganti kamera */}
        <TouchableOpacity
          style={styles.switchButton}
          onPress={() =>
            setCameraPosition(prev => (prev === 'back' ? 'front' : 'back'))
          }>
          <Icon.SwitchCamera size={toDp(30)} color={'#FFFFFF'} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default CameraComponents;

const styles = StyleSheet.create({
  page2: {
    flex: 1,
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    backgroundColor: 'white',
    width: toDp(60),
    height: toDp(60),
    borderRadius: toDp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineBtnTake: {
    borderColor: 'white',
    width: toDp(74),
    height: toDp(74),
    borderRadius: toDp(40),
    borderWidth: toDp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },

  rowtakeBtn: {
    position: 'absolute',
    bottom: toDp(0),
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: toDp(12),
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  captureText: {
    color: 'black',
    fontWeight: 'bold',
  },
  flashButton: {
    // position: 'absolute',
    // top: toDp(40),
    // left: toDp(20),
    backgroundColor: 'white',
    paddingHorizontal: toDp(10),
    paddingVertical: toDp(8),
    borderRadius: toDp(4),
  },
  switchButton: {
    position: 'absolute',
    top: toDp(24),
    right: toDp(16),
    bottom: toDp(12),
    // backgroundColor: 'white',
    // paddingHorizontal: toDp(10),
    // paddingVertical: toDp(8),
    // borderRadius: toDp(8),
    width: toDp(50),
    height: toDp(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    // top: 20,
    zIndex: 10,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: toDp(10),
    paddingHorizontal: toDp(16),
  },
});
