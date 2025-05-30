import React from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {toDp} from '../../../hepers/PercentageToDp';
import GlobalText from '../../../component/globalText';
import {CircleDot, MapPin, Search} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {getRute} from '../../../hepers/Api';
type LokasiTugasScreenProps = {
  navigation?: any;
};

const dataDummy = [
  {
    id_rute: 1,
    rute_name: '[JAK2] KP MELAYU >> DUREN SAWIT >> KP MELAYU',
    latitude: -6.252294400250764,
    longitude: 106.87353524871757,
  },
  {
    id_rute: 2,
    rute_name: '[JAK6] PONDOK GEDE >> KP RAMBUTAN',
    latitude: -6.252294400250764,
    longitude: 106.87353524871757,
  },
  {
    id_rute: 3,
    rute_name: '[JAK22] HALIM >> DWIKORA >> HALIM',
    latitude: -6.252294400250764,
    longitude: 106.87353524871757,
  },
  {
    id_rute: 4,
    rute_name: '[0] HALIM > POOL',
    latitude: -6.252294400250764,
    longitude: 106.87353524871757,
  },
  {
    id_rute: 5,
    rute_name: '[JAK20] LUBANG BUAYA >> CAWANG CENTRAL >> LUBANG BUAYA',
    latitude: -6.252294400250764,
    longitude: 106.87353524871757,
  },
];

interface DataSelected {
  id_rute: number;
  rute_name: string;
  latitude: number;
  longitude: number;
}

interface DataRoute {
  id: number;
  nama_perjalanan: string;
  rute: string;
}

const LokasiTugasScreen: React.FC<LokasiTugasScreenProps> = ({navigation}) => {
  React.useLayoutEffect(() => {
    navigation.getParent()?.setOptions({tabBarStyle: {display: 'none'}});

    return () => {
      navigation.getParent()?.setOptions({tabBarStyle: {display: 'flex'}});
    };
  }, [navigation]);
  const [searchText, setSearchText] = React.useState('');

  const [state, setState] = React.useState({
    isSelected: 0,
    dataSelected: {} as DataSelected,
    dataRoute: [] as DataRoute[],
  });
  const [filteredData, setFilteredData] = React.useState(state.dataRoute);
  const scaleAnims = React.useRef<Record<number, Animated.Value>>({}).current;

  const saveRuteToStorage = async () => {
    try {
      await AsyncStorage.setItem(
        'lokasi_penugasan',
        JSON.stringify(state.dataSelected),
      );
      console.log('berhasil simpan lokal');
      Toast.show({
        type: 'success',
        text1: 'Lokasi Berhasil Dipilih',
        text2: state.dataSelected.rute_name,
      });
      setTimeout(() => {
        navigation.navigate('Home');
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    if (state.dataRoute.length > 0) {
      const filtered = state.dataRoute.filter(item =>
        item.nama_perjalanan.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  }, [searchText, state.dataRoute]);

  // const handleSelectedRoute = (id: number, item: any) => {
  //   setState({
  //     ...state,
  //     isSelected: id,
  //     dataSelected: item,
  //   });
  // };

  const handleSelectedRoute = (id: number, item: any) => {
    if (!scaleAnims[id]) {
      scaleAnims[id] = new Animated.Value(1); // Inisialisasi animasi jika belum ada
    }
    setState({...state, isSelected: id, dataSelected: item});
    Animated.sequence([
      Animated.timing(scaleAnims[id], {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[id], {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlegetRute = async () => {
    try {
      const result = await getRute('/v1/app/rute/mikro');
      console.log('Result from API:', result);
      setState({...state, dataRoute: result.data});
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: error.response.data.messages,
      });
      console.log('Login error:', error.response.data);
    }
  };

  React.useEffect(() => {
    handlegetRute();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.separator} /> */}
      <View style={styles.containerTextInput}>
        <Search size={toDp(14)} style={styles.icSearch} color={'#6D6D6D'} />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          style={styles.textInput}
          placeholder="Cari lokasi Tugas"
        />
      </View>

      <FlatList
        ListEmptyComponent={() => (
          <ActivityIndicator size="large" color="#16509B" />
        )}
        // contentContainerStyle={{paddingBottom: toDp(50)}}
        data={filteredData}
        renderItem={({item, index}) => (
          <Animated.View
            style={[
              styles.listRuteContainer,
              {
                transform: [
                  {scale: scaleAnims[item.id] || new Animated.Value(1)},
                ],
              },
            ]}>
            <TouchableOpacity
              style={[
                styles.contentList,
                {
                  elevation: state.isSelected === item.id ? 1 : 0,
                  marginBottom: state.isSelected === item.id ? toDp(1) : 0,
                },
              ]}
              onPress={() => handleSelectedRoute(item.id, item)}>
              <MapPin
                size={state.isSelected === item.id ? toDp(16) : toDp(12)}
                color={state.isSelected === item.id ? '#16509B' : '#6D6D6D'}
              />
              <GlobalText
                typeText={state.isSelected === item.id ? 'bold' : 'regular'}
                size={state.isSelected === item.id ? toDp(13) : toDp(12)}
                style={StyleSheet.flatten([
                  styles.textRutename,
                  {
                    color: state.isSelected === item.id ? '#16509B' : '#6D6D6D',
                  },
                ])}>
                {item.nama_perjalanan}
              </GlobalText>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
      <View style={styles.rowbtnSimpan}>
        <TouchableOpacity
          onPress={() => {
            if (state.isSelected != 0) {
              saveRuteToStorage();
            }
          }}
          style={[
            styles.btnSimpan,
            {backgroundColor: state.isSelected != 0 ? '#16509B' : '#EEEEEE'},
          ]}>
          <GlobalText
            typeText="bold"
            size={toDp(14)}
            style={{color: state.isSelected != 0 ? 'white' : '#6D6D6D'}}>
            Pilih lokasi
          </GlobalText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    backgroundColor: '#EEEEEE',
    width: toDp(340),
    borderRadius: toDp(20),
    paddingLeft: toDp(30),
  },
  containerTextInput: {
    alignItems: 'center',
    padding: toDp(12),
    flexDirection: 'row',
  },
  separator: {
    borderColor: '#EEEEEE',
    borderWidth: toDp(3),
    width: '100%',
  },
  listRuteContainer: {
    // padding: toDp(12),
  },
  textRutename: {
    marginLeft: toDp(10),
    width: toDp(300),
  },
  contentList: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: toDp(1),
    paddingHorizontal: toDp(12),
    paddingVertical: toDp(16),
    borderBottomColor: '#BDBDBD',
    backgroundColor: 'white',
    // width: toDp(340),
  },
  icSearch: {
    position: 'absolute',
    left: toDp(22),
    bottom: toDp(30),
    zIndex: 1,
  },
  rowbtnSimpan: {
    borderTopWidth: toDp(1),
    borderTopColor: '#EEEEEE',
    position: 'absolute',
    bottom: toDp(0),
    width: '100%',
    padding: toDp(12),
    backgroundColor: 'white',
    shadowColor: '#000',
  },
  btnSimpan: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toDp(20),
    paddingVertical: toDp(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    // height: toDp(40),
  },
});

export default LokasiTugasScreen;
