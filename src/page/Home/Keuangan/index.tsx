import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {toDp} from '../../../hepers/PercentageToDp';
import GlobalText from '../../../component/globalText';
import {useStatusBar} from '../../../hooks/useStatusBar';
import {getUserData} from '../../../utils/storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Collapsible from 'react-native-collapsible';
import {ChevronDown, ChevronUp, Filter} from 'lucide-react-native';
import {formatCurrency} from '../../../hepers/CurrencyFormat';
import {images} from '../../../assets';
import Animated, {FadeInDown} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import {userInterface} from '../../../hepers/Interface';
import moment from 'moment';
import {postDataKoperasi} from '../../../hepers/Api';
import {set} from 'date-fns';

type TransaksiScreenKopsProps = {
  navigation?: any;
};

const transaksi = [
  {
    transaction_id: 'TRX001',
    type: 'saldo pokok',
    date: '2025-06-14',
    member_name: 'John Doe',
    payment_details: {
      simpanan_pokok: 100000,
      simpanan_wajib: 50000,
      simpanan_sukarela: 20000,
    },
    total_payment: 170000,
    payment_method: 'Tunai',
    keterangan: 'Simpanan Pokok',
    total: 100000,
  },
  {
    transaction_id: 'TRX002',
    type: 'iuran',
    date: '2025-06-14',
    member_name: 'John Doe',
    items: [{item_name: 'Beras 5kg', quantity: 1, price: 60000}],
    total_purchase: 88000,
    payment_method: 'QRIS',
    total: 100000,
  },
  {
    transaction_id: 'TRX004',
    type: 'sukarela',
    date: '2025-06-14',
    member_name: 'John Doe',
    items: [
      {item_name: 'Beras 5kg', quantity: 1, price: 60000},
      {item_name: 'Minyak Goreng 2L', quantity: 1, price: 28000},
    ],
    total_purchase: 88000,
    payment_method: 'QRIS',
    total: 100000,
  },
];

moment.locale('id');
const KeuanganScreen: React.FC<TransaksiScreenKopsProps> = ({navigation}) => {
  const [value, setValue] = useState('');
  const [user, setUser] = useState<userInterface>();
  const [dataIuran, setDataIuran] = useState<any>({});
  const [totabayarIuran, setTotabayarIuran] = useState(0);
  const [loading, setLoading] = useState(false);
  const [nominalPengajuan, setNominalPengajuan] = useState(0);

  React.useEffect(() => {
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
  const insets = useSafeAreaInsets();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('semua');
  const [selectedMethod, setSelectedMethod] = useState<string>('semua');
  const [filteredTransactions, setFilteredTransactions] = useState(transaksi);

  const toggleItem = (id: string) => {
    setActiveId(prev => (prev === id ? null : id));
  };

  useStatusBar({
    barStyle: 'dark-content',
    backgroundColor: 'transparent',
    translucent: true,
  });

  const fetchDataKeuangan = async (no_rek_dki?: string) => {
    const obj = {
      periode_iuran: moment().format('YYYY-MM') + '-01',
      no_rek_dki: no_rek_dki,
    };
    try {
      const result = await postDataKoperasi('/sumsukarela', obj);
      console.log('Result from API SUM:', result.data);
      if (result) {
        console.log('result');
        setDataIuran(result.data);
        setTotabayarIuran(
          parseFloat(result.data.iuran_sukarela.total_jumlah) + 100000,
        );
      } else {
        Toast.show({
          type: 'error',
          text1: result?.error || 'Terjadi kesalahan',
        });
      }
    } catch (error: any) {
      console.log('Register error:', error);
      Toast.show({
        type: 'error',
        text1: error.message || 'Terjadi kesalahan',
      });
    }
  };

  const fetchPengajuanSukarela = async () => {
    setLoading(true);
    const obj = {
      no_anggota: user?.no_anggota,
      no_rek_dki: user?.no_rek_dki,
      jumlah: nominalPengajuan,
    };
    console.log(obj);
    try {
      const result = await postDataKoperasi('/pengajuansukarela', obj);
      console.log('Result from API', result);
      if (result) {
        setNominalPengajuan(0);
        setValue('');
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: result.message,
        });
        fetchDataKeuangan((user as any).no_rek_dki);
      } else {
        setLoading(false);
        setNominalPengajuan(0);
        setValue('');
        Toast.show({
          type: 'error',
          text1: result?.error || 'Terjadi kesalahan',
        });
      }
    } catch (error: any) {
      console.log('Register error:', error);
      Toast.show({
        type: 'error',
        text1: error.message || 'Terjadi kesalahan',
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const localUserData = await getUserData();
        if (localUserData) {
          setUser(localUserData);
          fetchDataKeuangan((localUserData as any).no_rek_dki);
        }
        console.log('userDataTR', localUserData);
      };
      fetchUserData();
      return () => {
        // Cleanup if needed
      };
    }, []),
  );

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const isCollapsed = activeId !== item.transaction_id;

    return (
      <Animated.View
        style={styles.card}
        entering={FadeInDown.delay(index * 200)}>
        <TouchableOpacity
          onPress={() => toggleItem(item.transaction_id)}
          style={styles.header}>
          <View style={{width: toDp(260)}}>
            <GlobalText size={toDp(12)} typeText="bold" style={styles.title1}>
              {item.type.toUpperCase()}
            </GlobalText>
          </View>
          {isCollapsed ? (
            <ChevronDown size={toDp(22)} color="#06367C" />
          ) : (
            <ChevronUp size={toDp(22)} color="#06367C" />
          )}
        </TouchableOpacity>

        <Collapsible collapsed={isCollapsed}>
          {item.type === 'saldo pokok' && (
            <View style={styles.detail}>
              <GlobalText
                size={toDp(12)}
                typeText="regular"
                style={styles.title}>
                {item.keterangan}
              </GlobalText>
            </View>
          )}
          {item.type === 'iuran' && (
            <View style={styles.detail}>
              <View style={{flexDirection: 'row'}}>
                <View style={{width: toDp(90)}}>
                  <GlobalText
                    size={toDp(12)}
                    typeText="regular"
                    style={styles.title}>
                    Periode
                  </GlobalText>
                </View>
                <View
                  style={{
                    width: toDp(10),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <GlobalText
                    size={toDp(12)}
                    typeText="regular"
                    style={styles.title}>
                    :
                  </GlobalText>
                </View>
                <View style={{width: toDp(140), marginLeft: toDp(4)}}>
                  <GlobalText
                    size={toDp(12)}
                    typeText="regular"
                    style={styles.title}>
                    {moment().format('MMMM YYYY')}
                  </GlobalText>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{width: toDp(90)}}>
                  <GlobalText
                    size={toDp(12)}
                    typeText="regular"
                    style={styles.title}>
                    No. Rek
                  </GlobalText>
                </View>
                <View
                  style={{
                    width: toDp(10),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <GlobalText
                    size={toDp(12)}
                    typeText="regular"
                    style={styles.title}>
                    :
                  </GlobalText>
                </View>
                <View style={{width: toDp(140), marginLeft: toDp(4)}}>
                  <GlobalText
                    size={toDp(12)}
                    typeText="regular"
                    style={styles.title}>
                    {user?.no_rek_dki}
                  </GlobalText>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={{width: toDp(90)}}>
                  <GlobalText
                    size={toDp(12)}
                    typeText="regular"
                    style={styles.title}>
                    Sukarela
                  </GlobalText>
                </View>
                <View
                  style={{
                    width: toDp(10),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <GlobalText
                    size={toDp(12)}
                    typeText="regular"
                    style={styles.title}>
                    :
                  </GlobalText>
                </View>
                <View style={{width: toDp(140), marginLeft: toDp(4)}}>
                  <GlobalText
                    size={toDp(12)}
                    typeText="regular"
                    style={styles.title}>
                    Rp.
                    {dataIuran?.iuran_sukarela?.total_jumlah &&
                      formatCurrency(
                        dataIuran?.iuran_sukarela?.total_jumlah.toString(),
                      )}
                  </GlobalText>
                </View>
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={{width: toDp(90)}}>
                  <GlobalText
                    size={toDp(12)}
                    typeText="regular"
                    style={styles.title}>
                    Total Bayar
                  </GlobalText>
                </View>
                <View
                  style={{
                    width: toDp(10),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <GlobalText
                    size={toDp(12)}
                    typeText="regular"
                    style={styles.title}>
                    :
                  </GlobalText>
                </View>
                <View style={{width: toDp(140), marginLeft: toDp(4)}}>
                  <GlobalText
                    size={toDp(12)}
                    typeText="regular"
                    style={styles.title}>
                    Rp
                    {totabayarIuran &&
                      formatCurrency(totabayarIuran.toString())}
                  </GlobalText>
                </View>
              </View>
              <GlobalText
                size={toDp(12)}
                typeText="bold"
                style={[
                  styles.title,
                  {
                    color:
                      dataIuran?.iuran_wajib?.total === '0'
                        ? 'orange'
                        : 'green',
                    marginTop: toDp(8),
                  },
                ]}>
                {dataIuran?.iuran_wajib?.total === '0'
                  ? 'Belum Terpotong'
                  : 'Sudah Terpotong'}
              </GlobalText>
            </View>
          )}
          {item.type === 'sukarela' && (
            <View style={styles.detail}>
              <View
                style={{
                  borderRadius: toDp(5),
                  width: toDp(280),
                  padding: toDp(8),
                  alignSelf: 'center',
                  margin: toDp(8),
                  backgroundColor: '#f06d0640',
                }}>
                <GlobalText
                  size={toDp(11)}
                  typeText="regular"
                  style={styles.title}>
                  Pengajuan sukarela akan masuk pada Periode{' '}
                  {moment().add(1, 'M').format('MMMM YYYY')}
                </GlobalText>
              </View>

              <GlobalText size={toDp(12)} typeText="bold" style={styles.title}>
                Nominal Sukarela
              </GlobalText>
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
                  value={value}
                  onChangeText={value => {
                    const formatted = formatCurrency(value);

                    const numericValue =
                      parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;

                    setValue(formatted);
                    setNominalPengajuan(numericValue);
                  }}
                />
              </View>
              <TouchableOpacity
                disabled={loading}
                onPress={fetchPengajuanSukarela}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: toDp(250),
                  height: toDp(38),
                  backgroundColor: '#06367C',
                  borderRadius: toDp(6),
                  alignSelf: 'center',
                  marginTop: toDp(10),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: toDp(8),
                  }}>
                  {loading ? (
                    <ActivityIndicator size={'small'} color={'white'} />
                  ) : (
                    <GlobalText
                      size={toDp(12)}
                      typeText="bold"
                      style={[styles.title, {color: 'white'}]}>
                      Ajukan Sukarela
                    </GlobalText>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}
        </Collapsible>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <FlatList
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image source={images.empty} style={styles.emptyImage} />
            <GlobalText
              size={toDp(16)}
              typeText="regular"
              style={styles.emptyText}>
              Tidak ada data transaksi
            </GlobalText>
          </View>
        }
        data={filteredTransactions}
        keyExtractor={item => item.transaction_id}
        contentContainerStyle={styles.scrollContent}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: toDp(16),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: toDp(100),
    paddingTop: toDp(12),
    paddingHorizontal: toDp(16),
  },
  card: {
    marginBottom: toDp(10),
    padding: toDp(12),
    // backgroundColor: '#E8F0FF', // Opacity 50%
    borderRadius: toDp(4),
    elevation: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#E6EEF8',
    borderWidth: toDp(1),
  },
  title1: {
    color: '#06367C',
  },
  title: {
    color: '#000000',
    lineHeight: toDp(18),
  },
  detail: {
    marginTop: toDp(8),
    // paddingLeft: toDp(10),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    padding: toDp(8),
    backgroundColor: '#E6EEF8',
    borderRadius: toDp(8),
    width: toDp(40),
    height: toDp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHeader: {
    color: '#06367C',
    marginLeft: toDp(8),
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: toDp(16),
  },
  filterSection: {
    marginBottom: toDp(12),
  },
  filterTitle: {
    color: '#06367C',
    marginBottom: toDp(12),
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: toDp(8),
  },
  filterOption: {
    paddingHorizontal: toDp(16),
    paddingVertical: toDp(8),
    borderRadius: toDp(20),
    backgroundColor: '#E6EEF8',
    borderWidth: 1,
    borderColor: '#06367C',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: toDp(16),
    paddingHorizontal: toDp(16),
  },
  filterActionButton: {
    paddingVertical: toDp(12),
    paddingHorizontal: toDp(24),
    borderRadius: toDp(8),
    minWidth: toDp(120),
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#F5F5F5',
  },
  applyButton: {
    backgroundColor: '#06367C',
  },
  selectedFilterOption: {
    backgroundColor: '#06367C',
  },
  selectedFilterText: {
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#06367C',
  },
  emptyImage: {
    width: toDp(200),
    height: toDp(200),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: toDp(8),
    overflow: 'hidden',
    marginTop: toDp(10),
  },
  prefix: {
    paddingHorizontal: toDp(16),
    color: '#666666',
  },
  input: {
    flex: 1,
    height: toDp(48),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: toDp(8),
    fontSize: toDp(14),
    color: '#000000',
  },
});

export default KeuanganScreen;
