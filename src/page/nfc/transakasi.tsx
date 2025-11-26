import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
  Image,
  TextInput,
  ActivityIndicator
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {requestLocationPermission} from '../../hepers/PermissionHelper';
import {Headers} from '../../component/headers';
import {toDp} from '../../hepers/PercentageToDp';
import GlobalText from '../../component/globalText';
import {MapPin, MapPinCheck, MapPinned} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import axios from 'axios';
import { images } from '../../assets';
import { useStatusBar } from '../../hooks/useStatusBar';
import { formatCurrency } from '../../hepers/CurrencyFormat';
import { postKurangiSaldo } from '../../hepers/Api';
import CustomModal from '../../component/customBottomModal';
// import TextTicker from 'react-native-text-ticker';

moment.locale('id');
// Tipe untuk properti navigation
type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: any;
};


const TransaksiNfc: React.FC<HomeScreenProps> = ({navigation, route}) => {
    const [form, setForm] = React.useState({
        jumlah: '',
    });
    const [loadingData, setLoadingData] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalVisibleSuccess, setModalVisibleSuccess] = React.useState(false);
    const handleChange = ( value: string) => {
       setForm(prev => ({
            ...prev,
            jumlah: value,
          }));
      };

   const postTransaction = async () => {
    if(!form.jumlah || form.jumlah === '0'){
        Toast.show({
            type: 'error',
            text1: 'Jumlah tidak boleh kosong',
          });
          return;
    }
       setLoadingData(true);
       const obj = {
         id: route.params?.cardNumber || '',
         jumlah: form.jumlah || '0',
       };
       console.log(obj);
       try {
         const result = await postKurangiSaldo('/kurangi_saldo.php', obj);
         console.log('Result from API', result);
         if (result?.status) {
           setLoadingData(false);
        setErrorMessage(result?.message + " " + "Sisa Saldo: " +"Rp. " + formatCurrency(String(result?.sisa_saldo)) || 'Transaksi berhasil');
        setModalVisibleSuccess(true);
         } else {
           setLoadingData(false);
            setErrorMessage(result?.message || 'Transaksi gagal');
            setModalVisible(true);
           Toast.show({
             type: 'error',
             text1: result?.message || 'Terjadi kesalahan',
           });
         }
       } catch (error: any) {
            setLoadingData(false);
            setErrorMessage(error.message || 'Transaksi gagal');
            setModalVisible(true);
         console.log(' error:', error);
         Toast.show({
           type: 'error',
           text1: error.message || 'Terjadi kesalahan',
         });
       }
     };   
  return (
    <View style={styles.container}>
        <View style={{alignItems: 'center', justifyContent: 'center', marginBottom: toDp(20)}}>
            <GlobalText typeText='bold' style={{color: '#fff'}} size={toDp(26)}>Saldo</GlobalText>
            <GlobalText typeText='bold' style={{color: '#fff'}} size={toDp(24)}>Rp. {formatCurrency(route.params?.saldo)}</GlobalText>
        </View>
        <View style={styles.rowConten}>
            <View style={styles.inputContainer}>
                <GlobalText
                  size={toDp(14)}
                  typeText="regular"
                  style={styles.prefix}>
                  Rp
                </GlobalText>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={formatCurrency(form.jumlah) ||'0'}
                  placeholderTextColor={'#999'}
                  onChangeText={value => handleChange(value)}
                />
              </View>
        </View>
        <View style={{marginTop: toDp(40), alignItems: 'center'}}>
            <TouchableOpacity style={{
            alignItems: 'center', 
            width: toDp(325), 
            backgroundColor: '#16509B',
            borderRadius: toDp(8),
            // height: toDp(40),
            justifyContent: 'center',
            paddingVertical: toDp(12)
            }}
            onPress={() => {
                postTransaction();
            }} 
            >
            {loadingData ? (<ActivityIndicator size="small" color={'#fff'}/>) : (<GlobalText typeText='bold' style={{color: '#fff'}} size={toDp(18)}>
              Checkout
            </GlobalText>)}    
            
          </TouchableOpacity>
        </View>
        <CustomModal
            titleBtn="Kembali"
            visibleBtn={true}
            isVisible={modalVisible}
            onPressbtn={() => {setModalVisible(false), navigation.goBack()}}
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
      <CustomModal
            titleBtn="Kembali"
            visibleBtn={true}
            isVisible={modalVisibleSuccess}
            onPressbtn={() => { setModalVisibleSuccess(false), navigation.goBack()}}
            typeIcon="-">
            <View style={{alignItems: 'center'}}>
            <Image
                source={images.successcard}
                style={{width: toDp(60), height: toDp(60)}}
                resizeMode="stretch"
            />
            <GlobalText typeText="bold" size={16} style={{textAlign: 'center',width: toDp(220)}}>
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
    justifyContent: 'center',
  },
    rowConten: {
     padding: toDp(16),
    },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: toDp(8),
    overflow: 'hidden',
  },
  prefix: {
    paddingHorizontal: toDp(16),
    color: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: toDp(58),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: toDp(8),
    fontSize: toDp(16),
    color: '#FFFFFF',
    paddingLeft: toDp(8),
  },  
});

export default TransaksiNfc;
