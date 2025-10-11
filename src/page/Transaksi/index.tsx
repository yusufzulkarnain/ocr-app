import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import {toDp} from '../../hepers/PercentageToDp';
import GlobalText from '../../component/globalText';
import {useStatusBar} from '../../hooks/useStatusBar';
import {getUserData} from '../../utils/storage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Collapsible from 'react-native-collapsible';
import {ChevronDown, ChevronUp, Filter} from 'lucide-react-native';
import {formatCurrency} from '../../hepers/CurrencyFormat';
import BottomSheet from '../../component/BottomSheet';
import {images} from '../../assets';
import Animated, {FadeInDown} from 'react-native-reanimated';

type TransaksiScreenKopsProps = {
  navigation?: any;
};

const transaksi = [
  {
    transaction_id: 'TRX001',
    type: 'pembayaran',
    date: '2025-06-14',
    member_name: 'John Doe',
    payment_details: {
      simpanan_pokok: 100000,
      simpanan_wajib: 50000,
      simpanan_sukarela: 20000,
    },
    total_payment: 170000,
    payment_method: 'Tunai',
  },
  {
    transaction_id: 'TRX002',
    type: 'pembelian',
    date: '2025-06-14',
    member_name: 'John Doe',
    items: [
      {item_name: 'Beras 5kg', quantity: 1, price: 60000},
      {item_name: 'Minyak Goreng 2L', quantity: 1, price: 28000},
    ],
    total_purchase: 88000,
    payment_method: 'QRIS',
  },
  {
    transaction_id: 'TRX003',
    type: 'pengajuan sukarela',
    date: '2025-06-14',
    member_name: 'John Doe',
    items: [
      {item_name: 'Beras 5kg', quantity: 1, price: 60000},
      {item_name: 'Minyak Goreng 2L', quantity: 1, price: 28000},
    ],
    total_purchase: 88000,
    payment_method: 'QRIS',
    total: 50000,
    status: 'proses',
  },
];
const TransaksiScreen: React.FC<TransaksiScreenKopsProps> = () => {
  const insets = useSafeAreaInsets();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('semua');
  const [selectedMethod, setSelectedMethod] = useState<string>('semua');
  const [filteredTransactions, setFilteredTransactions] = useState(transaksi);

  const toggleItem = (id: string) => {
    setActiveId(prev => (prev === id ? null : id));
  };

  const applyFilter = () => {
    let filtered = [...transaksi];

    if (selectedType !== 'semua') {
      filtered = filtered.filter(
        item => item.type === selectedType.toLowerCase(),
      );
    }

    if (selectedMethod !== 'semua') {
      filtered = filtered.filter(
        item => item.payment_method === selectedMethod,
      );
    }

    setFilteredTransactions(filtered);
    setIsFilterVisible(false);
  };

  const resetFilter = () => {
    setSelectedType('semua');
    setSelectedMethod('semua');
    setFilteredTransactions(transaksi);
    setIsFilterVisible(false);
  };

  useStatusBar({
    barStyle: 'dark-content',
    backgroundColor: 'transparent',
    translucent: true,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const localUserData = await getUserData();
      console.log('userDataTR', localUserData);
    };
    fetchUserData();
  }, []);

  const renderItem = ({item, index}: {item: any; index: number}) => {
    const isCollapsed = activeId !== item.transaction_id;

    return (
      <Animated.View
        style={styles.card}
        entering={FadeInDown.delay(index * 200)}>
        <TouchableOpacity
          onPress={() => toggleItem(item.transaction_id)}
          style={styles.header}>
          <View>
            <GlobalText size={toDp(12)} typeText="bold" style={styles.title1}>
              {item.type.toUpperCase()} - {item.transaction_id}
            </GlobalText>
            <GlobalText size={toDp(11)} typeText="regular" style={styles.title}>
              {item.member_name} | {item.date} {index}
            </GlobalText>
          </View>
          {isCollapsed ? (
            <ChevronDown size={toDp(22)} color="#06367C" />
          ) : (
            <ChevronUp size={toDp(22)} color="#06367C" />
          )}
        </TouchableOpacity>

        <Collapsible collapsed={isCollapsed}>
          {item.type === 'pembayaran' && (
            <View style={styles.detail}>
              <GlobalText
                size={toDp(12)}
                typeText="regular"
                style={styles.title}>
                Simpanan Pokok: Rp{' '}
                {formatCurrency(item.payment_details.simpanan_pokok.toString())}
              </GlobalText>
              <GlobalText
                size={toDp(12)}
                typeText="regular"
                style={styles.title}>
                Simpanan Wajib: Rp
                {formatCurrency(item.payment_details.simpanan_wajib.toString())}
              </GlobalText>
              <GlobalText
                size={toDp(12)}
                typeText="regular"
                style={styles.title}>
                Simpanan Sukarela: Rp
                {formatCurrency(
                  item.payment_details.simpanan_sukarela.toString(),
                )}
              </GlobalText>
              <GlobalText
                size={toDp(12)}
                typeText="regular"
                style={styles.title}>
                Total: Rp{formatCurrency(item.total_payment.toString())}
              </GlobalText>
              <GlobalText
                size={toDp(12)}
                typeText="regular"
                style={styles.title}>
                Metode: {item.payment_method}
              </GlobalText>
            </View>
          )}
          {item.type === 'pembelian' && (
            <View style={styles.detail}>
              {item.items.map((itm: any, idx: number) => (
                <GlobalText
                  size={toDp(12)}
                  typeText="regular"
                  style={styles.title}
                  key={idx}>
                  {itm.item_name} x{itm.quantity} - Rp
                  {formatCurrency(itm.price.toString())}
                </GlobalText>
              ))}
              <GlobalText
                size={toDp(12)}
                typeText="regular"
                style={styles.title}>
                Total: Rp{formatCurrency(item.total_purchase.toString())}
              </GlobalText>
              <GlobalText
                size={toDp(12)}
                typeText="regular"
                style={styles.title}>
                Metode: {item.payment_method}
              </GlobalText>
            </View>
          )}
          {item.type === 'pengajuan sukarela' && (
            <View style={styles.detail}>
              <GlobalText
                size={toDp(12)}
                typeText="regular"
                style={styles.title}>
                Pembayaran : {item?.date}
              </GlobalText>
              <GlobalText
                size={toDp(12)}
                typeText="regular"
                style={styles.title}>
                Total: Rp{formatCurrency(item?.total.toString())}
              </GlobalText>
              <GlobalText
                size={toDp(12)}
                typeText="bold"
                style={[
                  styles.title,
                  {color: item?.status === 'proses' ? 'orange' : 'green'},
                ]}>
                {item?.status}
              </GlobalText>
            </View>
          )}
        </Collapsible>
      </Animated.View>
    );
  };

  const renderFilterContent = () => (
    <View style={styles.filterContent}>
      <View style={styles.filterSection}>
        <GlobalText size={toDp(16)} typeText="bold" style={styles.filterTitle}>
          Tipe Transaksi
        </GlobalText>
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedType === 'semua' && styles.selectedFilterOption,
            ]}
            onPress={() => setSelectedType('semua')}>
            <GlobalText
              size={toDp(14)}
              style={selectedType === 'semua' ? styles.selectedFilterText : {}}>
              Semua
            </GlobalText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedType === 'pembayaran' && styles.selectedFilterOption,
            ]}
            onPress={() => setSelectedType('pembayaran')}>
            <GlobalText
              size={toDp(14)}
              style={
                selectedType === 'pembayaran' ? styles.selectedFilterText : {}
              }>
              Pembayaran
            </GlobalText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedType === 'pembelian' && styles.selectedFilterOption,
            ]}
            onPress={() => setSelectedType('pembelian')}>
            <GlobalText
              size={toDp(14)}
              style={
                selectedType === 'pembelian' ? styles.selectedFilterText : {}
              }>
              Pembelian
            </GlobalText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterSection}>
        <GlobalText size={toDp(16)} typeText="bold" style={styles.filterTitle}>
          Metode Pembayaran
        </GlobalText>
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedMethod === 'semua' && styles.selectedFilterOption,
            ]}
            onPress={() => setSelectedMethod('semua')}>
            <GlobalText
              size={toDp(14)}
              style={
                selectedMethod === 'semua' ? styles.selectedFilterText : {}
              }>
              Semua
            </GlobalText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedMethod === 'Tunai' && styles.selectedFilterOption,
            ]}
            onPress={() => setSelectedMethod('Tunai')}>
            <GlobalText
              size={toDp(14)}
              style={
                selectedMethod === 'Tunai' ? styles.selectedFilterText : {}
              }>
              Tunai
            </GlobalText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedMethod === 'QRIS' && styles.selectedFilterOption,
            ]}
            onPress={() => setSelectedMethod('QRIS')}>
            <GlobalText
              size={toDp(14)}
              style={
                selectedMethod === 'QRIS' ? styles.selectedFilterText : {}
              }>
              QRIS
            </GlobalText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterActions}>
        <TouchableOpacity
          style={[styles.filterActionButton, styles.resetButton]}
          onPress={resetFilter}>
          <GlobalText size={toDp(14)} style={{color: '#666'}}>
            Reset
          </GlobalText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterActionButton, styles.applyButton]}
          onPress={applyFilter}>
          <GlobalText size={toDp(14)} style={{color: '#FFFFFF'}}>
            Terapkan
          </GlobalText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.filterContainer}>
        <GlobalText size={toDp(18)} typeText="bold" style={styles.textHeader}>
          Transaksi
        </GlobalText>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsFilterVisible(true)}>
          <Filter size={toDp(18)} color="#06367C" />
        </TouchableOpacity>
      </View>
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

      <BottomSheet
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        title="Filter Transaksi">
        {renderFilterContent()}
      </BottomSheet>
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
    backgroundColor: '#E8F0FF', // Opacity 50%
    borderRadius: 10,
    elevation: 1,
  },
  title1: {
    color: '#06367C',
  },
  title: {
    color: '#000000',
    lineHeight: toDp(18),
  },
  detail: {
    marginTop: toDp(10),
    paddingLeft: toDp(10),
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
    width: toDp(38),
    height: toDp(38),
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    paddingHorizontal: toDp(16),
    paddingTop: toDp(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});

export default TransaksiScreen;
