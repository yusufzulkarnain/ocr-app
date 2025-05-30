import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  Alert,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import {requestCameraPermission} from '../../../hepers/PermissionHelper';
import ml from '@react-native-firebase/ml';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import {useRoute, RouteProp} from '@react-navigation/native';
import GlobalText from '../../../component/globalText';
import {toDp} from '../../../hepers/PercentageToDp';
import CustomModal from '../../../component/customBottomModal';
import {requestLocationPermission} from '../../../hepers/PermissionHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {postData, getData} from '../../../hepers/Api';
import {
  ChevronDown,
  CheckCheck,
  Route,
  Camera,
  SwitchCamera,
  Printer,
  GaugeCircle,
  Send,
  Gauge,
  User,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

type BuatDoScreenProps = {
  navigation: any;
};

interface RouteParams {
  dataPramudi?: {
    jabatan: string;
    id: number;
    nik: string;
    nama: string;
  };
}
type RootStackParamList = {
  BuatDo: RouteParams;
};

interface DataPramudi {
  id: number;
  nama: string;
  nik: string;
  jabatan: string;
}

interface DataRute {
  rute: number;
  nama_perjalanan: string;
  latitude: number;
  longitude: number;
}

interface DataVehicle {
  id: number;
  nomer_body: string;
  km_baku: number;
  nomer_plat: string;
}

interface UserInterface {
  id: number;
  jabatan: string;
  nama: string;
  nik: string;
}

const BuatDoScreen: React.FC<BuatDoScreenProps> = ({navigation}) => {
  const route = useRoute<RouteProp<RootStackParamList, 'BuatDo'>>();
  const dataPramudi = route.params.dataPramudi || {};
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rute, setRute] = useState<DataRute>();
  const [state, setState] = useState({
    dataPramudi: dataPramudi as DataPramudi,
    visibleModal: false,
    dataRute: {} as DataRute,
    modalBusList: false,
    idBusSelected: 0,
    nomerBus: '',
    modalCatDo: false,
    idCatDoSelected: 0,
    nameCatDo: '',
    idShiftSelected: 0,
    nameShift: '',
    modalShift: false,
    base64Image: '',
    showBtnPrint: true,
    dataVehicle: [] as DataVehicle[],
    km_real: 0,
    user: {} as UserInterface,
    loadingSubmitDo: false,
    noPlat: '',
  });

  React.useLayoutEffect(() => {
    navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}});

    return () => {
      navigation.getParent()?.setOptions({tabBarStyle: {display: 'flex'}});
    };
  }, [navigation]);

  React.useEffect(() => {
    fetchData();
    handlegetVehicleMikro();
  }, []);

  const fetchData = async () => {
    try {
      await requestLocationPermission();
      const lokasiPenugasan = await AsyncStorage.getItem('lokasi_penugasan');
      const users = await AsyncStorage.getItem('user');

      if (lokasiPenugasan && users) {
        const parsedLokasiPenugasan = JSON.parse(lokasiPenugasan);
        const parsedUser = JSON.parse(users);
        setRute(parsedLokasiPenugasan);
        setState(prevState => ({
          ...prevState,
          dataRute: parsedLokasiPenugasan,
          user: parsedUser,
        }));
      }
    } catch (error) {
      console.error('Error fetching lokasi penugasan:', error);
    }
  };

  // React.useEffect(() => {
  //   console.log('RUTE:', rute);
  // }, [rute]);

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();

    if (hasPermission) {
      ImagePicker.openCamera({
        width: toDp(500),
        height: toDp(200),
        cropping: true,
        // cropperCircleOverlay: true,
      })
        .then(image => {
          setImage(image.path);
          processOCR(image.path); // Memproses OCR setelah gambar diambil
        })
        .catch(error => {
          console.log('Error taking photo:', error);
        });
    } else {
      Alert.alert('Permission denied to access camera.');
    }
  };

  const processOCR = async (uri: string) => {
    try {
      setLoading(true);
      // const result = await ml().cloudTextRecognizerProcessImage(uri);
      // const result = await ml().textRecognizerProcessImage(uri);
      const result = await TextRecognition.recognize(uri);

      setExtractedText(removeAllSpaces(result.text));
      console.log(JSON.stringify(result));
    } catch (error) {
      console.error('Error OCR:', error);
      setExtractedText('Gagal membaca teks');
    } finally {
      setLoading(false);
    }
  };

  const dataDummyCatDo = [
    {
      id: 1,
      name: 'BA 01',
    },
    {
      id: 2,
      name: 'BA 02',
    },
    {
      id: 3,
      name: 'BA 04',
    },
    {
      id: 4,
      name: 'OKB',
    },
    {
      id: 5,
      name: 'Pelengkap',
    },
  ];

  const dataShiftDummy = [
    {
      id: 1,
      name: 'Shift 1',
    },
    {
      id: 2,
      name: 'Shift 2',
    },
    {
      id: 3,
      name: 'Driver BKO',
    },
  ];

  const isNumberOnly = (str: any) => /^\d+$/.test(str);
  const removeAllSpaces = (str: any) => str.replace(/\s/g, '');

  const handleSelectBus = (
    id: number,
    nomer: string,
    kmBaku: number,
    noPlat: string,
  ) => {
    setState(prev => ({
      ...prev,
      idBusSelected: id === state.idBusSelected ? 0 : id,
      nomerBus: id === state.idBusSelected ? '' : nomer,
      km_real: id === state.idBusSelected ? 0 : kmBaku,
      noPlat: id === state.idBusSelected ? '' : noPlat,
    }));
  };

  const handleCatDo = (id: number, name: string) => {
    setState(prev => ({
      ...prev,
      idCatDoSelected: id === state.idCatDoSelected ? 0 : id,
      nameCatDo: id === state.idCatDoSelected ? '' : name,
    }));
  };

  const handleSelectedShift = (id: number, name: string) => {
    setState(prev => ({
      ...prev,
      idShiftSelected: id === state.idShiftSelected ? 0 : id,
      nameShift: id === state.idShiftSelected ? '' : name,
    }));
  };

  const generateUniqueCode = (prefix: string) => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const timestamp = new Date().getTime();
    const microseconds = Math.floor(performance.now() * 1000);
    return `${prefix}-${randomNumber}-${timestamp}${microseconds}`;
  };

  const gotoPrint = async () => {
    // let data = {
    //   id_bus: state.idBusSelected,
    //   bus_number: state.nomerBus,
    //   kategori_do_id: state.idCatDoSelected,
    //   shift: state.idShiftSelected,
    //   km: parseInt(extractedText),
    //   pramudi: state.dataPramudi?.nama,
    //   nik_pramudi: state.dataPramudi?.nik,
    //   rute: state.dataRute?.nama_perjalanan,
    //   rute_code: state.dataRute?.rute,
    //   kode_do: generateUniqueCode(state.nomerBus),
    //   no_plat: state.noPlat,
    //   km_baku: Math.abs(parseInt(extractedText) + state.km_real),
    //   petugas: state.user.nik.toString(),
    // };
    // // console.log(JSON.stringify(data));
    // if (isNumberOnly(extractedText)) {
    //   if (state.km_real != 0) {
    //     const jarakTempuh = Math.abs(parseInt(extractedText) - state.km_real);
    //     console.log(jarakTempuh);
    //   }
    // }
    // console.log(JSON.stringify(data));
    // // navigation.navigate('Print', {data});
    setState({...state, loadingSubmitDo: true});
    try {
      const result = await postData('/v1/app/mikro/create/dispatch', {
        id_bus: state.idBusSelected,
        bus_number: state.nomerBus,
        kategori_do_id: state.idCatDoSelected,
        shift: state.idShiftSelected,
        km: parseInt(extractedText),
        pramudi: state.dataPramudi?.nama,
        nik_pramudi: state.dataPramudi?.nik,
        rute: state.dataRute?.nama_perjalanan,
        rute_code: state.dataRute?.rute,
        kode_do: generateUniqueCode(state.nomerBus),
        no_plat: state.noPlat,
        km_baku: Math.abs(parseInt(extractedText) + state.km_real).toString(),
        petugas: state.user.nik.toString(),
      });
      console.log('Result from API:', result);
      if (result.code === 200) {
        setState({...state, loadingSubmitDo: false});
        Toast.show({
          type: 'success',
          text1: result.messages,
        });
        setTimeout(() => {
          navigation.navigate('Home');
        }, 1000);
      } else {
        setState({...state, loadingSubmitDo: false});
        Toast.show({
          type: 'info',
          text1: result.messages,
        });
      }
    } catch (error: any) {
      setState({...state, loadingSubmitDo: false});
      Toast.show({
        type: 'error',
        text1: error.response.data.messages,
      });
      console.log('Login error:', error.response.data);
    }
  };

  const handlegetVehicleMikro = async () => {
    try {
      const result = await getData('/mikro/app/vehicle/mikro');
      console.log('Result vehicle from API:', result.data);
      setState({...state, dataVehicle: result.data});
    } catch (error: any) {
      // Toast.show({
      //   type: 'error',
      //   text1: error.response.data.messages,
      // });
      console.log('Login error:', error.response.data);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomModal
        visibleBtn
        isVisible={state.modalBusList}
        onPressbtn={() => setState(prev => ({...prev, modalBusList: false}))}
        typeIcon="bus"
        title="Pilih Nomer Bus"
        titleBtn="Simpan">
        <View style={styles.ContainerModal}>
          <TextInput
            style={styles.inputSearch}
            placeholder="Cari Nomer Bus.."
          />
          <FlatList
            data={state.dataVehicle}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            contentContainerStyle={{paddingBottom: toDp(20)}}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() =>
                  handleSelectBus(
                    item.id,
                    item.nomer_body,
                    item.km_baku,
                    item.nomer_plat,
                  )
                }>
                {state.idBusSelected === item.id && (
                  <CheckCheck color={'#16509B'} size={toDp(16)} />
                )}
                <View>
                  <GlobalText
                    typeText="regular"
                    size={16}
                    style={{
                      marginLeft: toDp(8),
                      color:
                        state.idBusSelected === item.id ? '#16509B' : '#000000',
                    }}>
                    {item.nomer_body}
                  </GlobalText>
                  <GlobalText
                    typeText="italic"
                    size={10}
                    style={{
                      marginLeft: toDp(6),
                      color:
                        state.idBusSelected === item.id ? '#16509B' : 'gray',
                    }}>
                    {item.nomer_plat}
                  </GlobalText>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </CustomModal>
      <CustomModal
        visibleBtn
        isVisible={state.modalCatDo}
        onPressbtn={() => setState(prev => ({...prev, modalCatDo: false}))}
        title="Pilih status driver order"
        titleBtn="Simpan">
        <View style={styles.ContainerModal}>
          <FlatList
            data={dataDummyCatDo}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            contentContainerStyle={{paddingBottom: toDp(20)}}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => handleCatDo(item.id, item.name)}>
                {state.idCatDoSelected === item.id && (
                  <CheckCheck color={'#16509B'} size={toDp(16)} />
                )}
                <GlobalText
                  typeText="regular"
                  size={16}
                  style={{
                    marginLeft: toDp(8),
                    color:
                      state.idCatDoSelected === item.id ? '#16509B' : '#000000',
                  }}>
                  {item.name}
                </GlobalText>
              </TouchableOpacity>
            )}
          />
        </View>
      </CustomModal>
      <CustomModal
        visibleBtn
        isVisible={state.modalShift}
        onPressbtn={() => setState(prev => ({...prev, modalShift: false}))}
        title="Pilih shift"
        typeIcon="shift"
        titleBtn="Simpan">
        <View style={styles.ContainerModal}>
          <FlatList
            data={dataShiftDummy}
            keyExtractor={(item, index) =>
              item.id?.toString() || index.toString()
            }
            contentContainerStyle={{paddingBottom: toDp(20)}}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => handleSelectedShift(item.id, item.name)}>
                {state.idShiftSelected === item.id && (
                  <CheckCheck color={'#16509B'} size={toDp(16)} />
                )}
                <GlobalText
                  typeText="regular"
                  size={16}
                  style={{
                    marginLeft: toDp(8),
                    color:
                      state.idShiftSelected === item.id ? '#16509B' : '#000000',
                  }}>
                  {item.name}
                </GlobalText>
              </TouchableOpacity>
            )}
          />
        </View>
      </CustomModal>
      <CustomModal
        titleBtn="-"
        visibleBtn={false}
        isVisible={state.loadingSubmitDo}
        onPressbtn={() => console.log('Close modal')}
        typeIcon="-">
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../../../assets/img/waiting.gif')}
            style={{width: toDp(100), height: toDp(100), marginLeft: toDp(24)}}
            resizeMode="stretch"
          />
          <GlobalText typeText="bold" size={20}>
            Mengirim Data..
          </GlobalText>
        </View>
      </CustomModal>
      <ScrollView>
        <View style={styles.rowPramudiDetail}>
          <GlobalText typeText="bold" size={16} style={styles.textTitle}>
            Pramudi / {state.dataPramudi?.nama}
          </GlobalText>
          <GlobalText typeText="bold" size={16} style={styles.textTitle}>
            {state.dataPramudi?.nik}
          </GlobalText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: toDp(10),
            }}>
            <Route color={'#FFFFFF'} size={12} />
            <GlobalText
              typeText="regular"
              size={12}
              style={{color: '#FFFFFF', marginLeft: toDp(8)}}>
              {rute?.nama_perjalanan}
            </GlobalText>
          </View>
        </View>

        <View style={{paddingHorizontal: toDp(16), marginTop: toDp(12)}}>
          <View>
            <GlobalText typeText="bold" size={14}>
              Shift
            </GlobalText>
            <TouchableOpacity
              style={styles.containerListBus}
              onPress={() => setState(prev => ({...prev, modalShift: true}))}>
              <GlobalText
                typeText="regular"
                size={14}
                style={styles.textPilihNomorBus}>
                {state.nameShift !== '' ? state.nameShift : 'Pilih Shift'}
              </GlobalText>
              <ChevronDown
                color={'#6D6D6D'}
                size={18}
                style={{position: 'absolute', right: toDp(10)}}
              />
            </TouchableOpacity>
          </View>
          <View>
            <View style={{marginTop: toDp(12)}}>
              <GlobalText typeText="bold" size={14}>
                Nomer Bus
              </GlobalText>
              <TouchableOpacity
                style={styles.containerListBus}
                onPress={() =>
                  setState(prev => ({...prev, modalBusList: true}))
                }>
                <GlobalText
                  typeText="regular"
                  size={14}
                  style={styles.textPilihNomorBus}>
                  {state.nomerBus !== '' ? state.nomerBus : 'Pilih Nomer Bus'}
                </GlobalText>
                <ChevronDown
                  color={'#6D6D6D'}
                  size={18}
                  style={{position: 'absolute', right: toDp(10)}}
                />
              </TouchableOpacity>
            </View>
            <GlobalText typeText="italic" size={10}>
              Current Km: {state.km_real}
            </GlobalText>
          </View>
          <View style={{marginTop: toDp(12)}}>
            <GlobalText typeText="bold" size={14}>
              Status DO
            </GlobalText>
            <TouchableOpacity
              style={styles.containerListBus}
              onPress={() => setState(prev => ({...prev, modalCatDo: true}))}>
              <GlobalText
                typeText="regular"
                size={14}
                style={styles.textPilihNomorBus}>
                {state.idCatDoSelected !== 0
                  ? state.nameCatDo
                  : 'Pilih Status DO'}
              </GlobalText>
              <ChevronDown
                color={'#6D6D6D'}
                size={18}
                style={{position: 'absolute', right: toDp(10)}}
              />
            </TouchableOpacity>
          </View>
          <View style={{marginTop: toDp(12)}}>
            {extractedText && image !== null ? (
              <View>
                <View>
                  <Image
                    source={{uri: image}}
                    style={{
                      width: toDp(322),
                      height: toDp(100),
                      borderRadius: toDp(8),
                      backgroundColor: 'white',
                      alignSelf: 'center',
                    }}
                  />
                  <TouchableOpacity
                    onPress={takePhoto}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: toDp(8),
                    }}>
                    <SwitchCamera
                      color={'#16509B'}
                      size={14}
                      style={{marginTop: toDp(2), marginRight: toDp(4)}}
                    />
                    <GlobalText
                      typeText="bold"
                      size={14}
                      style={{color: '#16509B'}}>
                      Ambil foto ulang
                    </GlobalText>
                  </TouchableOpacity>
                </View>

                <View>
                  <GlobalText typeText="bold" size={14}>
                    Km
                  </GlobalText>
                  <TextInput
                    value={extractedText}
                    onChangeText={setExtractedText}
                    style={styles.inputkm}
                    keyboardType="numeric"
                    onFocus={() =>
                      setState(prev => ({
                        ...prev,
                        showBtnPrint: !state.showBtnPrint,
                      }))
                    }
                    onBlur={() =>
                      setState(prev => ({
                        ...prev,
                        showBtnPrint: !state.showBtnPrint,
                      }))
                    }
                  />
                </View>
              </View>
            ) : (
              <Pressable
                style={styles.containerSelectPhoto}
                onPress={takePhoto}>
                <View style={{alignItems: 'center'}}>
                  <Gauge color={'#FFFFFF'} size={20} />
                  <GlobalText
                    typeText="bold"
                    size={14}
                    style={{color: '#FFFFFF'}}>
                    Ambil Foto Odometer
                  </GlobalText>
                </View>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
      {state.showBtnPrint && (
        <View style={styles.containerButton}>
          <TouchableOpacity style={styles.btnSimpan} onPress={gotoPrint}>
            <Send color={'#FFFFFF'} size={18} />
            <GlobalText typeText="bold" size={14} style={styles.textbtn}>
              Kirim
            </GlobalText>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  rowPramudiDetail: {
    // borderWidth: toDp(1),
    paddingHorizontal: toDp(16),
    paddingVertical: toDp(16),
    backgroundColor: '#16509B',
    borderBottomLeftRadius: toDp(20),
    borderBottomRightRadius: toDp(20),
  },
  textTitle: {
    width: toDp(300),
    color: '#FFFFFF',
  },
  ContainerModal: {
    height: Dimensions.get('window').height / toDp(2),
  },
  textModalContent: {
    color: '#000',
  },
  containerListBus: {
    borderWidth: toDp(1),
    borderRadius: toDp(8),
    height: toDp(40),
    paddingHorizontal: toDp(12),
    // paddingVertical: toDp(10),
    justifyContent: 'center',
    marginTop: toDp(8),
    borderColor: '#6D6D6D',
  },
  textPilihNomorBus: {
    color: '#6D6D6D',
  },
  inputSearch: {
    height: toDp(40),
    width: '100%',
    borderWidth: toDp(1),
    borderRadius: toDp(8),
    paddingLeft: toDp(12),
    borderColor: '#8A9DB9',
  },
  itemContainer: {
    paddingVertical: toDp(12),
    borderBottomWidth: toDp(1),
    borderBottomColor: '#D9D9D9',
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerSelectPhoto: {
    borderRadius: toDp(8),
    paddingHorizontal: toDp(12),
    paddingVertical: toDp(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: toDp(12),
    backgroundColor: '#308CF6',
  },
  inputkm: {
    height: toDp(40),
    borderWidth: toDp(1),
    borderRadius: toDp(8),
    paddingLeft: toDp(12),
    borderColor: '#6D6D6D',
    color: '#000',
    marginTop: toDp(8),
  },
  containerButton: {
    borderTopWidth: toDp(1),
    borderTopColor: '#D9D9D9',
    padding: toDp(12),
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  btnSimpan: {
    width: toDp(322),
    height: toDp(40),
    borderRadius: toDp(8),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#16509B',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  textbtn: {
    color: '#FFFFFF',
    marginLeft: toDp(8),
  },
});

export default BuatDoScreen;
