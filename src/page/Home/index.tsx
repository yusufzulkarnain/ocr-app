import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Text,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {requestLocationPermission} from '../../hepers/PermissionHelper';
import Geolocation from '@react-native-community/geolocation';
import Headers from '../../component/headers';
import {toDp} from '../../hepers/PercentageToDp';
import GlobalText from '../../component/globalText';
import {MapPin, MapPinCheck, MapPinned} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import MapView, {Marker} from 'react-native-maps';
import mapStyle from '../../mapStyle.json';
import moment from 'moment';
import 'moment/locale/id';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import TextTicker from 'react-native-text-ticker';

moment.locale('id');
// Tipe untuk properti navigation
type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

interface LokasiTugas {
  latitude: number;
  longitude: number;
  rute: number;
  nama_perjalanan: string;
}

interface UserInterface {
  id: number;
  jabatan: string;
  nama: string;
  nik: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [state, setState] = React.useState({
    isStayIn: false,
    stayInDate: '',
    hasMylocation: false,
    currentLocation: {
      lat: 0,
      lon: 0,
    },
    currenLocationPenugasan: {
      lat: 0,
      lon: 0,
    },
    dataStorageTugas: {} as LokasiTugas,
    hasLocationPenugasan: false,
    user: {} as UserInterface,
  });
  const mapRef = React.useRef<MapView | null>(null);

  const formatDate = (date: Date) => {
    return moment(date).format('D MMMM YYYY | HH:mm [WIB]');
  };
  const formattedDate = formatDate(new Date());

  React.useEffect(() => {
    requetPermisionLocation();
  }, []);

  const requetPermisionLocation = async () => {
    console.log('LOkasi');
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      Geolocation.getCurrentPosition(position => {
        console.log(position);
        setState({
          ...state,
          hasMylocation: true,
          currentLocation: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
        });
        // focusOnMarker(position.coords.latitude, position.coords.longitude);
      });
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          await requestLocationPermission();
          const lokasiPenugasan = await AsyncStorage.getItem(
            'lokasi_penugasan',
          );
          const users = await AsyncStorage.getItem('user');
          if (lokasiPenugasan) {
            const parsedLokasiPenugasan = JSON.parse(lokasiPenugasan);
            setState(prevState => ({
              ...prevState,
              dataStorageTugas: parsedLokasiPenugasan,
              hasLocationPenugasan: true,
            }));
            console.log('Lokasi penugasan:', parsedLokasiPenugasan);
          }
          if (users) {
            const parsedUser = JSON.parse(users);
            setState(prevState => ({
              ...prevState,
              user: parsedUser,
            }));
            console.log('USERS:', parsedUser);
          }
        } catch (error) {
          console.error('Error fetching lokasi penugasan:', error);
        }
      };

      fetchData();
    }, []),
  );

  const getInitialsName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };

  const focusOnMarker = (lat: number, lon: number) => {
    mapRef.current?.animateToRegion(
      {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000,
    );
  };

  const onPressStayIn = () => {
    if (state.isStayIn != true) {
      setState({
        ...state,
        isStayIn: true,
        stayInDate: formattedDate,
      });
      Toast.show({
        type: 'success',
        text1: 'Stay In Berhasil',
      });
    }
  };

  const onPressCreateDo = () => {
    navigation.navigate('ScanQR');
    // Toast.show({
    //   type: 'info',
    //   text1: 'Under maintenance',
    // });
  };

  const handleLogOut = () => {
    clearAsyncStorage();
    Toast.show({
      type: 'success',
      text1: 'Berhasil keluar',
    });
    setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);
    // navigation.navigate('Print');
  };

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared!');
    } catch (error) {
      console.error('Failed to clear AsyncStorage:', error);
    }
  };

  const handleErrorLokasiTugas = () => {
    Toast.show({
      type: 'error',
      text1: 'Pilih lokasi penugasan',
    });
  };

  return (
    <View style={styles.container}>
      <Headers title="PT Transportasi Jakarta" logOut={handleLogOut} />
      <View
        style={{
          paddingHorizontal: toDp(16),
        }}>
        <View style={styles.cardUser}>
          <View style={styles.rowImageUser}>
            <View style={styles.imageUser}>
              <GlobalText
                typeText="bold"
                size={toDp(18)}
                style={styles.initialName}>
                {state.user.nama
                  ? getInitialsName(state.user.nama)
                  : getInitialsName('UserName')}
              </GlobalText>
            </View>
            <View style={styles.colUserName}>
              <GlobalText
                typeText="bold"
                size={toDp(18)}
                style={styles.textName}>
                {state.user ? state.user.nama : '-'}
              </GlobalText>
              <GlobalText
                typeText="regular"
                size={toDp(12)}
                style={styles.textNik}>
                {state.user ? state.user.nik : '-'} -{' '}
                {state.user ? state.user.jabatan : '-'}
              </GlobalText>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={state.isStayIn ? 1 : 0}
            style={[
              styles.btnStayIn,
              {backgroundColor: state.isStayIn ? '#16509B' : '#EAEAEA'},
            ]}
            onPress={
              state.dataStorageTugas.rute
                ? onPressStayIn
                : handleErrorLokasiTugas
            }>
            {state.isStayIn ? (
              <GlobalText
                typeText="regular"
                size={toDp(12)}
                style={styles.textStayIndate}>
                Stay in, {state.stayInDate}
              </GlobalText>
            ) : (
              <GlobalText
                typeText="bold"
                size={toDp(16)}
                style={styles.textStayIn}>
                Stay in
              </GlobalText>
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.btnCariLokasi}
          onPress={() => navigation.navigate('LokasiTugas')}>
          <MapPin size={toDp(20)} color={'#6D6D6D'} />
          <GlobalText
            typeText="regular"
            size={toDp(14)}
            style={styles.textCariLokasi}>
            Pilih Lokasi Penugasan
          </GlobalText>
        </TouchableOpacity>
      </View>

      {/* {state.hasMylocation && ( */}
      {/* <> */}
      <View style={styles.rowLinePenugasan}>
        <View style={styles.line} />
        <GlobalText
          typeText="bold"
          size={toDp(12)}
          style={styles.textLokasiPenugasan}>
          Lokasi Penugasan
        </GlobalText>
        <View style={styles.line} />
      </View>
      <View style={styles.mapsContent}>
        <View style={styles.containerLokasiPenugasan}>
          <MapPinned size={toDp(30)} color={'#FFFFFF'} />
          {state.dataStorageTugas.rute ? (
            <TextTicker
              duration={3000}
              loop={true}
              bounce
              repeatSpacer={10}
              marqueeDelay={800}
              style={{
                color: '#FFFF',
                marginTop: toDp(12),
                fontSize: toDp(16),
                fontFamily: 'PlusJakartaSans-Bold',
                width: toDp(300),
                textAlign: 'center',
              }}>
              {state.dataStorageTugas.nama_perjalanan}
            </TextTicker>
          ) : (
            <Text
              style={{
                color: '#FFFF',
                marginTop: toDp(12),
                fontSize: toDp(16),
                fontFamily: 'PlusJakartaSans-Bold',
                width: toDp(300),
                textAlign: 'center',
              }}>
              Lokasi tugas belum dipilih
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={
            state.dataStorageTugas.rute
              ? onPressCreateDo
              : handleErrorLokasiTugas
          }
          activeOpacity={1}
          style={styles.btnBuatDo}>
          <GlobalText
            typeText="regular"
            size={toDp(13)}
            style={styles.textBuatDO}>
            Buat Driving Order (DO)
          </GlobalText>
        </TouchableOpacity>
      </View>
      {/* </> */}
      {/* )} */}

      {/* <View>
        <Button
          title="Go to Home Detail"
          onPress={() => navigation.navigate('HomeDetail')} // Navigasi ke HomeDetailScreen
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  cardUser: {
    width: toDp(338),
    borderRadius: toDp(15),
    backgroundColor: '#F6F6F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  rowCardHeader: {
    borderWidth: toDp(2),
    flexDirection: 'row',
  },
  imageUser: {
    width: toDp(52),
    height: toDp(52),
    borderRadius: toDp(52),
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  rowImageUser: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: toDp(12),
  },
  initialName: {
    color: '#BDBDBD',
  },
  textNik: {
    width: toDp(208),
    color: '#000000',
  },
  colUserName: {
    marginLeft: toDp(15),
  },
  textName: {
    color: '#000000',
  },
  btnStayIn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: toDp(14),
    padding: toDp(12),
  },
  textStayIn: {
    color: '#6D6D6D',
  },
  textStayIndate: {
    color: '#FFFFFF',
  },
  btnCariLokasi: {
    backgroundColor: '#EEEEEE',
    flexDirection: 'row',
    width: toDp(338),
    marginTop: toDp(20),
    borderRadius: toDp(25),
    alignSelf: 'center',
    paddingVertical: toDp(12),
    paddingLeft: toDp(13),
    alignItems: 'center',
  },
  textCariLokasi: {
    color: '#BDBDBD',
    marginLeft: toDp(10),
  },
  map: {
    width: toDp(338),
    height: toDp(160),
  },
  mapsContent: {
    borderRadius: toDp(15),
    overflow: 'hidden',
    marginTop: toDp(10),
    backgroundColor: '#FFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  rowLinePenugasan: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: toDp(12),
  },
  line: {
    borderColor: '#BDBDBD',
    borderWidth: toDp(1),
    width: toDp(98),
    margin: toDp(10),
  },
  textLokasiPenugasan: {
    color: '#BDBDBD',
  },
  rowInfoLokasiPenugasan: {
    backgroundColor: '#00B0EC',
    flexDirection: 'row',
    height: toDp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBuatDo: {
    backgroundColor: '#EEEEEE',
    height: toDp(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBuatDO: {
    color: '#6D6D6D',
  },
  abslutePin1: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: toDp(90),
    left: toDp(4),
    zIndex: 1,
    padding: toDp(4),
    borderRadius: toDp(6),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  containerLokasiPenugasan: {
    width: toDp(338),
    // height: toDp(150),
    backgroundColor: '#00B0EC',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: toDp(12),
    paddingVertical: toDp(16),
  },
});

export default HomeScreen;
