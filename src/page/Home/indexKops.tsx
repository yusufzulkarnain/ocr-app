import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {toDp} from '../../hepers/PercentageToDp';
import GlobalText from '../../component/globalText';
import moment from 'moment';
import 'moment/locale/id';
import {Mail} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BalanceCard} from '../../component/BalanceCard';
import {MenuGrid} from '../../component/MenuGrid';
import {BannerSlider} from '../../component/BannerSlider';
import {useStatusBar} from '../../hooks/useStatusBar';
import {getUserData, getUserTransactions} from '../../utils/storage';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {images} from '../../assets';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {FadeIn} from 'react-native-reanimated';
import getInitials from '../../hepers/InitialName';

moment.locale('id');

// Example banner data
const bannerData = [
  {id: 1, banner: images.banner1},
  {id: 2, banner: images.banner2},
  {id: 3, banner: images.banner3},
  {id: 4, banner: images.banner2},
];
interface TransactionItem {
  id: number;
  userId: string;
  date: string;
  amount: number;
  description: string;
  status: 'success' | 'pending';
  type: 'iuran' | 'kredit';
}

// Tipe untuk properti navigation
type HomeScreenKopsProps = {
  navigation: NativeStackNavigationProp<any>;
};

const HomeScreenKops: React.FC<HomeScreenKopsProps> = ({
  navigation: _navigation,
}) => {
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = React.useState<any>(null);
  const [totalIuranAmount, setTotalIuranAmount] = React.useState(0);
  const [totalKreditAmount, setTotalKreditAmount] = React.useState(0);
  const isFocused = useIsFocused();
  const show = isFocused;

  // Use the status bar hook
  useStatusBar({
    barStyle: 'dark-content',
    backgroundColor: 'transparent',
    translucent: true,
  });

  const [balanceVisibility, setBalanceVisibility] = React.useState({
    blempol: false,
    getho: false,
  });

  useEffect(() => {
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

    _navigation.getParent()?.setOptions({
      tabBarStyle: tabBarStyle,
    });

    return () => {
      _navigation.getParent()?.setOptions({
        tabBarStyle: tabBarStyle,
      });
    };
  }, [_navigation]);
  const fetchData = React.useCallback(async () => {
    const fetchUserData = async () => {
      const localUserData = await getUserData();
      // console.log('userData', localUserData);
      setUserData(localUserData);
    };

    const fetchUserTransactions = async () => {
      if (userData?.id) {
        const userTransactions = await getUserTransactions(
          userData.id,
          'iuran',
        );
        const userTransactionsKredit = await getUserTransactions(
          userData.id,
          'kredit',
        );
        const LocalTotalIuranAmount = userTransactions.reduce(
          (sum: number, item: TransactionItem) => sum + item.amount,
          0,
        );
        const LocalTotalKreditAmount = userTransactionsKredit.reduce(
          (sum: number, item: TransactionItem) => sum + item.amount,
          0,
        );
        setTotalIuranAmount(LocalTotalIuranAmount);
        setTotalKreditAmount(LocalTotalKreditAmount);
      }
    };

    await fetchUserData();
    await fetchUserTransactions();
  }, [userData?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      console.log('fetchData');
    }, [fetchData]),
  );

  const toggleVisibility = (type: 'blempol' | 'getho') => {
    setBalanceVisibility(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#E8F0FF', '#1E3B70']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.headerGradient}>
        <View style={[styles.header, {paddingTop: insets.top + toDp(10)}]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.roundedImage}>
              <GlobalText
                size={toDp(16)}
                typeText="bold"
                style={styles.shadTextAlias}>
                {getInitials(userData?.nama)}
              </GlobalText>
            </View>
            <View style={{marginLeft: toDp(8)}}>
              <GlobalText
                size={toDp(16)}
                typeText="bold"
                style={styles.textHeader}>
                {userData?.nama}
              </GlobalText>
              <GlobalText
                size={toDp(12)}
                typeText="regular"
                style={styles.textHeader}>
                {userData?.no_anggota}
              </GlobalText>
            </View>
          </View>
          {/* <TouchableOpacity>
            <Mail size={toDp(24)} color="#06367C" />
          </TouchableOpacity> */}
        </View>
        <View style={styles.headerBody}>
          <View style={styles.saldoContent}>
            <View style={styles.balanceContainer}>
              <BalanceCard
                title="Saldo"
                amount={`Rp. 100.000`}
                isHidden={!balanceVisibility.blempol}
                onToggleVisibility={() => toggleVisibility('blempol')}
              />
              <BalanceCard
                title="Kredit"
                amount={`Rp. 0`}
                isHidden={!balanceVisibility.getho}
                onToggleVisibility={() => toggleVisibility('getho')}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
      <ScrollView>
        <View style={styles.sectionMenu}>
          <MenuGrid />
        </View>
        {show && (
          <Animated.View entering={FadeIn.delay(100)}>
            <BannerSlider data={bannerData} />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingBottom: Platform.select({
      ios: toDp(90),
      android: toDp(100),
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: toDp(16),
    // backgroundColor: 'red',
    width: '100%',
  },
  roundedImage: {
    width: toDp(40),
    height: toDp(40),
    borderRadius: toDp(20),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: Platform.OS === 'ios' ? toDp(8) : toDp(4),
    borderWidth: toDp(2),
    borderColor: '#06367C',
  },
  textHeader: {
    color: '#06367C',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  headerBody: {
    // backgroundColor: '#06367C',
    width: '100%',
    overflow: 'hidden',
  },
  saldoContent: {
    padding: toDp(16),
    alignItems: 'center',
    gap: toDp(16),
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: toDp(16),
    width: '100%',
  },
  sectionMenu: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: toDp(16),
    paddingVertical: toDp(6),
  },
  headerGradient: {
    backgroundColor: 'red',
    borderBottomLeftRadius: toDp(30),
    borderBottomRightRadius: toDp(30),
    // marginBottom: toDp(6),
    elevation: Platform.OS === 'ios' ? toDp(8) : toDp(6),
    zIndex: 1,
  },
  shadText: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  shadTextAlias: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    color: '#06367C',
  },
});

export default HomeScreenKops;
