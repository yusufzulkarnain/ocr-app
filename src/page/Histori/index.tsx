import React from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  SectionList,
} from 'react-native';
// import ReceiptSVG from '../../component/TiketCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from 'lucide-react-native';
import {getData} from '../../hepers/Api';
import {toDp} from '../../hepers/PercentageToDp';
import GlobalText from '../../component/globalText';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import {useFocusEffect} from '@react-navigation/native';
import {CalendarDays, History} from 'lucide-react-native';

type HistoryScreenProps = {
  navigation?: any;
};

interface UserInterface {
  id: number;
  jabatan: string;
  nama: string;
  nik: string;
}

interface HistoryInterface {
  title: string;
  created_at: string;
  kategori_do_mikro: string;
  km_baku: number;
  kode_do: string;
  nik: string;
  no_bus: string;
  no_plat: string;
  rute: string;
  rute_code: string;
  shift: string;
  petugas: string;
  data: any;
}

const HistoriScreen: React.FC<HistoryScreenProps> = () => {
  const [users, setUsers] = React.useState<UserInterface>();
  const [dataHistori, setDataHistori] = React.useState<HistoryInterface[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  // React.useEffect(() => {
  //   fetchData();
  // }, []);

  // React.useEffect(() => {
  //   if (users) {
  //     getDataHistori();
  //   }
  //   // getDataHistori();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  const fetchData = async () => {
    try {
      const users = await AsyncStorage.getItem('user');
      if (users) {
        const parsedUser = JSON.parse(users);
        setUsers(parsedUser);
        getDataHistori();
      }
    } catch (error) {
      console.error('Error AsyncStorage:', error);
    }
  };

  const getDataHistori = async () => {
    console.log('Fetching data...', users?.nik);
    try {
      const result = await getData(
        '/v1/app/mikro/histori/dispatch?petugas=' + users?.nik,
      );
      console.log('Result data from API:', JSON.stringify(result.result));
      setDataHistori(result.result);
      setRefreshing(false);
    } catch (error: any) {
      // Toast.show({
      //   type: 'error',
      //   text1: error.response.data.messages,
      // });
      console.log('Login error:', error.response.data);
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        // alignItems: 'center',
        backgroundColor: 'white',
        // paddingVertical: toDp(10),
      }}>
      <SectionList
        sections={dataHistori.map(item => ({
          title: item.title,
          data: item.data,
        }))}
        keyExtractor={(item, index) => item?.kode_do + index}
        renderItem={({item}) => (
          <View
            style={{
              paddingHorizontal: 16,
              paddingBottom: toDp(8),
              borderBottomWidth: toDp(0.5),
              borderBottomColor: '#00000080',
              marginBottom: toDp(10),
            }}>
            <GlobalText typeText="regular" style={styles.cardText}>
              {item?.kode_do}
            </GlobalText>
            <GlobalText typeText="regular">{item?.rute}</GlobalText>
            <GlobalText typeText="regular" style={styles.cardText}>
              {item?.no_plat} - {item?.no_bus}
            </GlobalText>
            <GlobalText typeText="regular" style={styles.cardText}>
              {item?.shift} | {item?.nik}
            </GlobalText>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <GlobalText typeText="regular">
                {item?.kategori_do_mikro}
              </GlobalText>
              <GlobalText typeText="regular">
                {item?.created_at.split(' ').pop()} WIB
              </GlobalText>
            </View>
          </View>
        )}
        renderSectionHeader={({section: {title}}) => (
          <View
            style={{
              paddingHorizontal: toDp(16),
              backgroundColor: '#eee',
              marginBottom: toDp(4),
              paddingVertical: toDp(4),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CalendarDays
              size={toDp(16)}
              color="#06367C"
              style={{marginRight: toDp(6)}}
            />
            <GlobalText
              typeText="bold"
              size={toDp(14)}
              style={{color: '#06367C'}}>
              {title}
            </GlobalText>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: toDp(8),
    borderWidth: toDp(0.5),
    borderColor: '#00000080',
    width: toDp(330),
    marginBottom: toDp(10),
    padding: toDp(8),
    elevation: toDp(2),
  },
  cardText: {
    fontSize: toDp(12),
  },
  textKodeDo: {
    fontSize: toDp(8),
    marginBottom: toDp(4),
    color: 'gray',
  },
  titleRiwayat: {
    fontSize: toDp(15),
    // marginBottom: toDp(12),
  },
  textStatus: {
    fontSize: toDp(12),
    marginBottom: toDp(4),
  },
  spacer: {
    marginBottom: toDp(6),
  },
});

export default HistoriScreen;
