import React, {useEffect, useState, useMemo, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Animated as RNAnimated,
  Modal,
  Platform,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import {getUserData, getUserTransactions} from '../../utils/storage';
import GlobalText from '../../component/globalText';
import {toDp} from '../../hepers/PercentageToDp';
import {CalendarDays, CreditCard, CalendarClock} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CalendarPicker from 'react-native-calendar-picker';
import {useStatusBar} from '../../hooks/useStatusBar';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import Animated, {FadeInUp} from 'react-native-reanimated';
import {formatCurrency} from '../../hepers/CurrencyFormat';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import 'moment/locale/id';
import {postDataKoperasi} from '../../hepers/Api';
import {set} from 'date-fns';
import {da} from 'date-fns/locale';
import {images} from '../../assets';

moment.locale('id');

interface TransactionItem {
  id: number;
  userId: string;
  date: string;
  amount: number;
  description: string;
  status: 'success' | 'pending';
  type: 'iuran' | 'kredit';
}

interface DataUser {
  id?: string;
  nama?: string;
  nik?: string;
  no_anggota?: string;
  status_anggota?: string;
  no_rek_dki?: string;
  tlp?: string;
}

interface IuranWajib {
  id: number;
  periode: string;
  jumlah_tagihan: number;
  jumlah_bayar: number;
  status_verifikasi: string;
}

interface IuranSukarela {
  id: number;
  periode_iuran: string;
  no_anggota: string;
  jumlah: number;
  status: string;
}

interface DataKredit {
  id: number;
  no_rek: string;
  nama: string;
  jumlah: string;
  jangka_waktu: string;
  tujuan_pinjaman: string;
  penghasilan: string;
  created_at: string;
  status: string;
}

const HistoriScreenKops = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [iuranData, setIuranData] = useState<TransactionItem[]>([]);
  const [kreditData, setKreditData] = useState<TransactionItem[]>([]);
  const [sukarelaData, setSukarelaData] = useState<TransactionItem[]>([]);
  const [totalIuran, setTotalIuran] = useState(0);
  const [totalKredit, setTotalKredit] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dataUser, setDataUser] = useState<DataUser>({});
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    undefined,
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
    undefined,
  );
  const slideAnim = useRef(new RNAnimated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const show = isFocused;
  const [dataIuranWajib, setDataIuranWajib] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingData, setLoadingData] = useState(false);
  const [dataIuranSukarela, setDataIuranSukarela] = useState<IuranSukarela[]>(
    [],
  );
  const [typeTab, setTypeTab] = useState('iuran');
  const [dataKredit, setDataKredit] = useState<DataKredit[]>([]);

  useStatusBar({
    barStyle: 'dark-content',
    backgroundColor: 'transparent',
    translucent: true,
  });

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    RNAnimated.spring(slideAnim, {
      toValue: index,
      useNativeDriver: true,
      tension: 68,
      friction: 10,
    }).start();
    if (index === 1) {
      setTypeTab('sukarela');
      requestDataTransactionSukarelaOrKredit(
        (dataUser as any).no_anggota,
        'sukarela',
      );
    } else if (index === 2) {
      setTypeTab('kredit');
      requestDataTransactionSukarelaOrKredit(
        (dataUser as any).no_rek_dki,
        'kredit',
      );
    } else {
      setTypeTab('iuran');
      requestDataTransaction((dataUser as any).no_rek_dki);
    }
  };

  const loadTransactions = React.useCallback(async () => {
    try {
      const userData = await getUserData();
      if (!userData) {
        console.error(userData);
        return;
      }
      if (userData) {
        setDataUser(userData);
        requestDataTransaction((userData as any).no_rek_dki);
      }

      const iuranTransactions = await getUserTransactions(userData.id, 'iuran');
      const kreditTransactions = await getUserTransactions(
        userData.id,
        'kredit',
      );

      setIuranData(iuranTransactions);
      setKreditData(kreditTransactions);

      // Hitung total
      const totalIuranAmount = iuranTransactions.reduce(
        (sum: number, item: TransactionItem) => sum + item.amount,
        0,
      );
      const totalKreditAmount = kreditTransactions.reduce(
        (sum: number, item: TransactionItem) => sum + item.amount,
        0,
      );

      setTotalIuran(totalIuranAmount);
      setTotalKredit(totalKreditAmount);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }, []);

  const requestDataTransaction = async (noRek: string) => {
    setLoadingData(true);
    const obj = {
      no_rek: parseInt(noRek),
    };
    console.log(obj);
    try {
      const result = await postDataKoperasi('/iuranwajibbynorek', obj);
      // console.log('Result from API:', result);
      if (result) {
        setDataIuranWajib(result.iuranWajib);
        setTotalCount(countTotal(result.iuranWajib));
        setLoadingData(false);
        // console.log(result);
      } else {
        setLoadingData(false);
        Toast.show({
          type: 'error',
          text1: result?.error || 'Terjadi kesalahan',
        });
      }
    } catch (error: any) {
      setLoadingData(false);
      console.log(' error:', error);
      Toast.show({
        type: 'error',
        text1: error.message || 'Terjadi kesalahan',
      });
    }
  };

  const requestDataTransactionSukarelaOrKredit = async (
    noAnggota: string,
    type: string,
  ) => {
    setLoadingData(true);
    const endPoint =
      type === 'sukarela' ? '/iuransukarelabynoanggota' : '/kreditbynorek';
    const obj = {
      no_anggota: noAnggota,
    };
    const objKredit = {
      no_rek: noAnggota,
    };
    console.log(obj);
    try {
      const result = await postDataKoperasi(
        endPoint,
        type === 'sukarela' ? obj : objKredit,
      );
      console.log('Result from API --->>:', result);
      if (result) {
        if (type === 'sukarela') {
          setDataIuranSukarela(result.iuranSukarela);
        } else {
          setDataKredit(result.kredit);
        }
        setLoadingData(false);
      } else {
        setLoadingData(false);
        Toast.show({
          type: 'error',
          text1: result?.error || 'Terjadi kesalahan',
        });
      }
    } catch (error: any) {
      setLoadingData(false);
      console.log(' error:', error);
      Toast.show({
        type: 'error',
        text1: error.message || 'Terjadi kesalahan',
      });
    }
  };

  // Initial load
  // useEffect(() => {
  //   loadTransactions();
  // }, [loadTransactions]);

  // Refresh on focus
  useFocusEffect(
    React.useCallback(() => {
      loadTransactions();
      return () => {
        // Cleanup if needed
      };
    }, [loadTransactions]),
  );

  const getFormattedDateRange = () => {
    if (!selectedStartDate || !selectedEndDate) {
      return '';
    }
    const startStr = moment(selectedStartDate).format('DD MMM YYYY');
    const endStr = moment(selectedEndDate).format('DD MMM YYYY');
    console.log('Formatted date range:', {startStr, endStr});
    return `${startStr} - ${endStr}`;
  };
  const handleDateChange = (
    date: Date | null,
    type: 'START_DATE' | 'END_DATE',
  ) => {
    if (!date) {
      if (type === 'START_DATE') {
        setSelectedStartDate(undefined);
      } else {
        setSelectedEndDate(undefined);
      }
      return;
    }

    const newDate = date;
    if (type === 'START_DATE') {
      setSelectedStartDate(newDate);
      if (selectedEndDate && moment(newDate).isAfter(moment(selectedEndDate))) {
        setSelectedEndDate(undefined);
      }
    } else {
      if (
        selectedStartDate &&
        moment(newDate).isBefore(moment(selectedStartDate))
      ) {
        return;
      }
      setSelectedEndDate(newDate);
    }
  };

  const resetDateFilter = () => {
    setSelectedStartDate(undefined);
    setSelectedEndDate(undefined);
  };

  const filteredTransactions = useMemo(() => {
    if (!selectedStartDate || !selectedEndDate) {
      return activeTab === 0
        ? iuranData
        : activeTab === 1
        ? kreditData
        : sukarelaData;
    }

    const currentData = activeTab === 0 ? iuranData : kreditData;
    const start = moment(selectedStartDate).startOf('day');
    const end = moment(selectedEndDate).endOf('day');

    return currentData.filter(item => {
      const date = moment(item.date);
      return date.isSameOrAfter(start) && date.isSameOrBefore(end);
    });
  }, [activeTab, selectedStartDate, selectedEndDate, iuranData, kreditData]);

  const countTotal = (iuranWajib: IuranWajib[]) => {
    const currentYear = new Date().getFullYear();
    return iuranWajib
      .filter(
        item =>
          item.status_verifikasi === 'BERHASIL' &&
          item.periode &&
          new Date(item.periode).getFullYear() === currentYear,
      )
      .reduce((total, item) => {
        // Ambil jumlah_bayar jika ada, kalau null pakai jumlah_tagihan
        const bayar =
          item.jumlah_bayar !== null && item.jumlah_bayar !== undefined
            ? item.jumlah_bayar
            : item.jumlah_tagihan !== null && item.jumlah_tagihan !== undefined
            ? item.jumlah_tagihan
            : 0;

        return total + bayar;
      }, 0);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  }, [loadTransactions]);

  const TabItem = ({
    isActive,
    icon: Icon,
    label,
    onPress,
  }: {
    isActive: boolean;
    icon: any;
    label: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}>
      <View style={styles.tabContent}>
        <Icon size={toDp(18)} color={isActive ? '#06367C' : '#666666'} />
        <GlobalText
          size={toDp(12)}
          typeText={isActive ? 'bold' : 'regular'}
          style={{color: isActive ? '#06367C' : '#666666'}}>
          {label}
        </GlobalText>
      </View>
    </TouchableOpacity>
  );

  const renderTransactionItem = (item: any) => {
    if (typeTab === 'iuran') {
      return (
        <View style={styles.transactionContainer}>
          <View key={item.id} style={styles.transactionItem}>
            <View style={styles.transactionHeader}>
              <GlobalText size={toDp(14)} typeText="bold">
                Iuran Wajib
              </GlobalText>
              <GlobalText
                size={toDp(11)}
                typeText="bold"
                style={{
                  color:
                    item.status_verifikasi === 'BERHASIL'
                      ? '#4CAF50'
                      : '#FFA000',
                }}>
                {item.status_verifikasi}
              </GlobalText>
            </View>
            <View style={styles.transactionDetails}>
              <View>
                <GlobalText size={toDp(12)} style={styles.dateText}>
                  {item.nama}
                </GlobalText>
                <GlobalText size={toDp(12)} style={styles.dateText}>
                  No. Rek : {item.no_rek}
                </GlobalText>
                <GlobalText size={toDp(12)} style={styles.dateText}>
                  Periode : {moment(item.periode).format('MMMM YYYY')}
                </GlobalText>
              </View>

              <GlobalText
                size={toDp(14)}
                typeText="bold"
                style={styles.amountText}>
                Rp{' '}
                {item.jumlah_bayar
                  ? item.jumlah_bayar.toLocaleString('id-ID')
                  : item.status_verifikasi === 'BERHASIL' &&
                    item.jumlah_bayar === null
                  ? item.jumlah_tagihan.toLocaleString('id-ID')
                  : 0}
              </GlobalText>
            </View>
          </View>
        </View>
      );
    } else if (typeTab === 'sukarela') {
      return (
        <View style={styles.transactionContainer}>
          <View key={item.id} style={styles.transactionItem}>
            <View style={styles.transactionHeader}>
              <GlobalText size={toDp(14)} typeText="bold">
                Sukarela
              </GlobalText>
              <GlobalText
                size={toDp(11)}
                typeText="bold"
                style={{
                  color: item.status === 'BERHASIL' ? '#4CAF50' : '#FFA000',
                }}>
                {item.status}
              </GlobalText>
            </View>
            <View style={styles.transactionDetails}>
              <View>
                <GlobalText size={toDp(12)} style={styles.dateText}>
                  {dataUser?.nama}
                </GlobalText>
                <GlobalText size={toDp(12)} style={styles.dateText}>
                  No. Rek : {dataUser?.no_rek_dki}
                </GlobalText>
                <GlobalText size={toDp(12)} style={styles.dateText}>
                  Periode : {moment(item.periode_iuran).format('MMMM YYYY')}
                </GlobalText>
              </View>

              <GlobalText
                size={toDp(14)}
                typeText="bold"
                style={styles.amountText}>
                Rp {item.jumlah.toLocaleString('id-ID')}
              </GlobalText>
            </View>
          </View>
        </View>
      );
    } else if (typeTab === 'kredit') {
      return (
        <View style={styles.transactionContainer}>
          <View key={item.id} style={styles.transactionItem}>
            <View style={styles.transactionHeader}>
              <GlobalText size={toDp(14)} typeText="bold">
                Kredit
              </GlobalText>
              <GlobalText
                size={toDp(11)}
                typeText="bold"
                style={{
                  color: item.status === 'BERHASIL' ? '#4CAF50' : '#FFA000',
                }}>
                {item.status}
              </GlobalText>
            </View>
            <View style={styles.transactionDetails}>
              <View style={{width: toDp(200)}}>
                <GlobalText size={toDp(12)} style={styles.dateText}>
                  {dataUser?.nama}
                </GlobalText>
                <GlobalText size={toDp(12)} style={styles.dateText}>
                  No. Rek : {dataUser?.no_rek_dki}
                </GlobalText>
                <GlobalText size={toDp(12)} style={styles.dateText}>
                  Tanggal :{' '}
                  {moment(item.created_at).format('DD MMM YYYY - HH:mm')}
                </GlobalText>
                <GlobalText size={toDp(12)} style={styles.dateText}>
                  Tujuan Pinjaman : {item.tujuan_pinjaman}
                </GlobalText>
                <GlobalText size={toDp(12)} style={styles.dateText}>
                  Jangka Waktu : {item.jangka_waktu} Bulan
                </GlobalText>
              </View>

              <GlobalText
                size={toDp(14)}
                typeText="bold"
                style={styles.amountText}>
                Rp {Number(item.jumlah).toLocaleString('id-ID')}
              </GlobalText>
            </View>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedStartDate && selectedEndDate && (
        <View style={[styles.header, {paddingTop: insets.top}]}>
          <View style={styles.dateRangeContainer}>
            <GlobalText size={toDp(12)} style={styles.dateRangeText}>
              {getFormattedDateRange()}
            </GlobalText>
            <TouchableOpacity onPress={resetDateFilter}>
              <GlobalText size={toDp(12)} style={styles.resetText}>
                Reset
              </GlobalText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View
        style={[
          styles.tabContainer,
          {
            marginTop:
              Platform.OS === 'ios'
                ? 0
                : selectedStartDate && selectedEndDate
                ? toDp(16)
                : insets.top + toDp(10),
          },
        ]}>
        <View style={styles.tabBarContainer}>
          {/* <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowCalendar(true)}>
            <CalendarClock size={toDp(20)} color="#06367C" />
          </TouchableOpacity> */}
          <View style={styles.tabBar}>
            <TabItem
              isActive={activeTab === 0}
              icon={CalendarDays}
              label="Iuran"
              onPress={() => handleTabPress(0)}
            />
            <TabItem
              isActive={activeTab === 1}
              icon={CreditCard}
              label="Sukarela"
              onPress={() => handleTabPress(1)}
            />
            <TabItem
              isActive={activeTab === 2}
              icon={CreditCard}
              label="kredit"
              onPress={() => handleTabPress(2)}
            />
          </View>
        </View>
        <RNAnimated.View
          style={[
            styles.tabIndicator,
            {
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, toDp(160)],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {show && typeTab === 'iuran' && (
        <Animated.View style={styles.summary} entering={FadeInUp.delay(200)}>
          <View style={styles.summaryItem}>
            <GlobalText size={toDp(14)} style={styles.summaryLabel}>
              Total{' '}
              {activeTab === 0
                ? 'Iuran Periode' + ' - ' + moment().format('YYYY')
                : 'Kredit'}
            </GlobalText>
            <GlobalText
              size={toDp(16)}
              typeText="bold"
              style={styles.summaryValue}>
              Rp{' '}
              {(activeTab === 0 ? totalCount : totalKredit).toLocaleString(
                'id-ID',
              )}
            </GlobalText>
          </View>
        </Animated.View>
      )}
      {loadingData ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#06367C" />
        </View>
      ) : (
        <FlatList
          data={
            activeTab === 0
              ? dataIuranWajib
              : activeTab === 1
              ? dataIuranSukarela
              : dataKredit
          }
          renderItem={({item}) => renderTransactionItem(item)}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={() => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={images.empty}
                style={{width: toDp(250), height: toDp(250)}}
              />
              <GlobalText size={toDp(14)} style={styles.emptyText}>
                Tidak Ada Data
              </GlobalText>
            </View>
          )}
          ListFooterComponent={() => <View style={{height: toDp(120)}} />}
          contentContainerStyle={{marginTop: toDp(10)}}
        />
      )}

      <Modal
        visible={showCalendar}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <GlobalText size={toDp(18)} typeText="bold">
                Pilih Rentang Tanggal
              </GlobalText>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <GlobalText size={toDp(16)} style={styles.closeButton}>
                  ✕
                </GlobalText>
              </TouchableOpacity>
            </View>
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              onDateChange={handleDateChange}
              selectedDayColor="#2196F3"
              selectedDayTextColor="#FFFFFF"
              textStyle={{fontFamily: 'Poppins-Regular'}}
              monthTitleStyle={{fontFamily: 'Poppins-Medium'}}
              yearTitleStyle={{fontFamily: 'Poppins-Medium'}}
              previousTitle="Sebelumnya"
              nextTitle="Selanjutnya"
              width={toDp(340)}
              todayBackgroundColor="#E6EEF8"
              todayTextStyle={{color: '#06367C'}}
              maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
              minDate={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.resetButton]}
                onPress={resetDateFilter}>
                <GlobalText style={styles.buttonText}>Reset</GlobalText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.applyButton]}
                onPress={() => setShowCalendar(false)}>
                <GlobalText style={styles.buttonText}>Terapkan</GlobalText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: toDp(16),
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E0E0E0',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: toDp(8),
    paddingHorizontal: toDp(4),
  },
  dateRangeText: {
    color: '#06367C',
  },
  resetText: {
    color: '#F44336',
  },
  tabContainer: {
    paddingHorizontal: toDp(16),
    // marginTop: toDp(16),
  },
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: toDp(12),
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
  tabBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: toDp(12),
    padding: toDp(4),
  },
  tab: {
    flex: 1,
    height: toDp(40),
    borderRadius: toDp(8),
    justifyContent: 'center',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: toDp(8),
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    borderWidth: toDp(1),
    borderColor: '#06367C',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: toDp(4),
    left: toDp(20),
    width: toDp(160),
    height: toDp(40),
    backgroundColor: '#FFFFFF',
    borderRadius: toDp(8),
    zIndex: -1,
  },
  content: {
    flex: 1,
    padding: toDp(16),
  },
  summary: {
    padding: toDp(16),
    backgroundColor: '#E8F0FF',
    // borderRadius: toDp(12),
    marginBottom: toDp(4),
    marginTop: toDp(12),
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#666666',
    marginBottom: toDp(4),
  },
  summaryValue: {
    color: '#06367C',
  },
  transactionItem: {
    backgroundColor: '#FFFFFF',
    padding: toDp(12),
    borderRadius: toDp(8),
    marginBottom: toDp(8),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: toDp(8),
    alignItems: 'center',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: '#666666',
  },
  amountText: {
    color: '#06367C',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666666',
    // marginTop: toDp(10),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: toDp(16),
    padding: toDp(16),
    width: '90%',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: toDp(16),
  },
  closeButton: {
    color: '#666666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: toDp(16),
    gap: toDp(12),
  },
  modalButton: {
    flex: 1,
    padding: toDp(12),
    borderRadius: toDp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#F44336',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: toDp(14),
    fontFamily: 'Inter-Bold',
  },
  transactionContainer: {
    paddingHorizontal: toDp(12),
  },
});

export default HistoriScreenKops;
