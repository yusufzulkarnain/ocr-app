import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
  Image,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {requestLocationPermission} from '../../hepers/PermissionHelper';
import {Headers, HeadersNfc} from '../../component/headers';
import {toDp} from '../../hepers/PercentageToDp';
import GlobalText from '../../component/globalText';
import {MapPin, MapPinCheck, MapPinned} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import axios from 'axios';
import { images } from '../../assets';
import { useStatusBar } from '../../hooks/useStatusBar';
import { getSaldo } from '../../hepers/Api';
import CustomModal from '../../component/customBottomModal';
// import TextTicker from 'react-native-text-ticker';

moment.locale('id');
// Tipe untuk properti navigation
type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};


const HomeNfcScreen: React.FC<HomeScreenProps> = ({navigation}) => {
useStatusBar({
    barStyle: 'light-content',
    backgroundColor: 'transparent',
    translucent: true,
  });
  const [cardNumber, setCardNumber] = React.useState('');
  const [isScanning, setIsScanning] = React.useState(false);
  const [text, setText] = React.useState('Menunggu');
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  React.useEffect(() => {
    // checkNfc();
    NfcManager.start();
  }, []);

 

  const scanCard = async () => {
  if (isScanning) return;  
  setIsScanning(true);
  setLoading(true);
  startEllipsis();
  try {
    // Cek apakah device support NFC
    const supported = await NfcManager.isSupported();
    if (!supported) {
      Toast.show({
        type: 'error',
        text1: 'Tidak Support',
        text2: 'Device tidak mendukung NFC',
      });
      setLoading(false);
      return;
    }

    // Cek apakah NFC aktif
    const enabled = await NfcManager.isEnabled();
    if (!enabled) {
      Toast.show({
        type: 'error',
        text1: 'NFC Mati',
        text2: 'Silakan aktifkan NFC',
      });
      setLoading(false);
      return;
    }
    // Mulai scan NFC
    await NfcManager.requestTechnology(NfcTech.NfcA);
        const tag = await NfcManager.getTag();
        if (tag?.id) {
        const uid = tag.id.toUpperCase();
          try {
              const result = await getSaldo(
                'cek_saldo.php?id=' + 'uid',
              );
              setCardNumber(uid);
              console.log('result uid:', result);
              Toast.show({
                type: result?.status === false ? 'error' : 'success',
                text1: result?.status === false ? 'Gagal' : 'Berhasil',
                text2: result?.status === false ? result?.message : 'Nomor kartu:' + uid,
              });
              navigation.navigate('TransaksiNfcScreen', {cardNumber: uid, saldo: result?.saldo || '0'});
              if (result?.status === false) {
                setErrorMessage(result?.message || 'Terjadi kesalahan');
                setModalVisible(true);
              }
              setLoading(false);
            } catch (error: any) {
              setLoading(false);
              console.log('saldo error:', error.response.data);
            }
        } else {
        setLoading(false);
        Toast.show({
            type: 'error',
            text1: 'Gagal',
            text2: 'Nomor kartu tidak terbaca',
        });
        }
    } catch (e: any) {
        console.log('NFC Error:', e);

        // Jika error karena double request
        if (e?.message?.includes('one request at a time')) {
        setLoading(false);  
        Toast.show({
            type: 'info',
            text1: 'Sedang Scan',
            text2: 'Tunggu proses selesai...',
        });
        }
    } finally {
        // WAJIB untuk menghindari error
        try {
        await NfcManager.cancelTechnologyRequest();
        } catch (_) {}
        setLoading(false);
        setIsScanning(false);
    }
  };


  const checkNfc = async () => {
  const supported = await NfcManager.isSupported();
  if (!supported) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'HP kamu tidak mendukung NFC',
    })
    return;
  }
  const enabled = await NfcManager.isEnabled();
  if (!enabled) {
    Toast.show({
      type: 'info',
      text1: 'Info',
      text2: 'NFC belum diaktifkan',
    })
    return;
  }
};

  const startEllipsis = () => {
    if (intervalRef.current) return;

    let dots = 0;

    intervalRef.current = setInterval(() => {
      dots = (dots + 1) % 4;
      const ellipsis = '.'.repeat(dots);
      setText(`Menunggu${ellipsis}`);
    }, 500);
  };




  return (
    <View style={{flex: 1, backgroundColor: '#132440'}}>
    <HeadersNfc title="Kartu Huma Betang Sejahtera" logOut={() => console.log('logout')} />
    <View style={styles.container}>
       {loading ? (
          <GlobalText typeText='bold' style={{color: '#fff'}} size={toDp(18)}>{text}</GlobalText>
          ) : (
            <View style={{alignItems: 'center'}}>
              <GlobalText typeText='bold' style={{color: '#fff'}} size={toDp(18)}>Tempelkan Kartu</GlobalText>
                <View >
                    <Image source={images.gifScan} style={styles.gifImage}/>       
                </View>
              <GlobalText typeText='regular' style={{color: '#fff'}} size={toDp(12)}>v1.0</GlobalText>
            </View>
          )}
        <View style={{position: 'absolute', bottom: toDp(16)}}>
          <TouchableOpacity style={{
            alignItems: 'center', 
            width: toDp(325), 
            backgroundColor: '#16509B',
            borderRadius: toDp(8),
            height: toDp(40),
            justifyContent: 'center'
            }} 
            onPress={scanCard}
            // onPress={() => navigation.navigate('TransaksiNfcScreen', {cardNumber: cardNumber, saldo: '100000'})}
            >
            <GlobalText typeText='bold' style={{color: '#fff'}} size={toDp(16)}>
              Scan Kartu
            </GlobalText>
          </TouchableOpacity>
        </View>
    </View>
    <CustomModal
        titleBtn="-"
        visibleBtn={false}
        isVisible={modalVisible}
        onPressbtn={() => setModalVisible}
        typeIcon="-">
        <View style={{alignItems: 'center'}}>
          <Image
            source={images.failedcard}
            style={{width: toDp(60), height: toDp(60)}}
            resizeMode="stretch"
          />
          <GlobalText typeText="bold" size={16} style={{textAlign: 'center'}}>
            {errorMessage}
          </GlobalText>
        </View>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#132440',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gifImage: {
    width: toDp(100),
    height: toDp(100),
    // alignSelf: 'center',
  },
});

export default HomeNfcScreen;
