import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Animated, Platform, Dimensions} from 'react-native';
import * as Icons from 'lucide-react-native';

// import HomeScreen from '../page/Home';
import HomeScreen from '../page/Home/indexKops';
import LokasiTugasScreen from '../page/Home/lokasiTugas';
import HistoriScreen from '../page/Histori/indexKops';
import ProfileScreenKops from '../page/Profile/indexKops';
import LoginScreen from '../page/Login/indexKop';
import PrintScreen from '../page/Home/buatDo/print';
import ScanQR from '../page/Home/buatDo/scanQr';
import ScanQrKops from '../page/Home/ScanQr';
import BuatDoScreen from '../page/Home/buatDo';
import LoanScreen from '../page/Home/Loan';
import ProdukScreen from '../page/Home/Produk';
import TransaksiScreen from '../page/Transaksi';
import DetailProdukScreen from '../page/Home/detailProduk';
import CarouselScreen from '../page/Home/Carousel';
import {toDp} from '../hepers/PercentageToDp';
import QrAsset from '../page/qrsasset';
import KeuanganScrenn from '../page/Home/Keuangan';
import {SplashScreen} from '../screens/SplashScreen';
import ChangePassword from '../page/Profile/ChangePassword';
import CameraScreen from '../page/camera';
import HomeNfcScreen from '../page/nfc/home';
import TransaksiNfc from '../page/nfc/transakasi';

interface AnimatedTabIconProps {
  focused: boolean;
  icon: React.ReactNode;
}

interface AnimatedTabLabelProps {
  focused: boolean;
  label: string;
  style?: any;
}

function AnimatedTabIcon({focused, icon}: AnimatedTabIconProps) {
  const scaleValue = React.useRef(
    new Animated.Value(focused ? 1 : 0.8),
  ).current;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: focused ? 1.2 : 0.8,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [focused, scaleValue]);

  return (
    <Animated.View style={{transform: [{scale: scaleValue}]}}>
      {icon}
    </Animated.View>
  );
}

function AnimatedTabLabel({focused, label, style}: AnimatedTabLabelProps) {
  const scaleValue = React.useRef(
    new Animated.Value(focused ? 1 : 0.8),
  ).current;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: focused ? 1.2 : 0.8,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [focused, scaleValue]);

  return (
    <Animated.Text
      style={[
        {
          color: focused ? '#06367C' : '#808080',
          fontFamily: 'PlusJakartaSans-Bold',
          transform: [{scale: scaleValue}],
        },
        style,
      ]}>
      {label}
    </Animated.Text>
  );
}

const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      {/* <HomeStack.Screen
        name="QrAsset"
        component={QrAsset}
        options={{
          headerShown: false,
        }}
      /> */}
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="LokasiTugas"
        component={LokasiTugasScreen}
        options={{title: 'Lokasi Tugas', animation: 'slide_from_right'}}
      />
      <HomeStack.Screen
        name="Print"
        component={PrintScreen}
        options={{title: 'Print', animation: 'slide_from_right'}}
      />
      <HomeStack.Screen
        name="ScanQR"
        component={ScanQR}
        options={{title: 'Scan Barcode', animation: 'slide_from_right'}}
      />
      <HomeStack.Screen
        name="ScanQrKops"
        component={ScanQrKops}
        options={{title: 'Scan QR', animation: 'slide_from_right'}}
      />
      <HomeStack.Screen
        name="BuatDo"
        component={BuatDoScreen}
        options={{title: 'Driver order', animation: 'slide_from_right'}}
      />
      <HomeStack.Screen
        name="LoanScreen"
        component={LoanScreen}
        options={{
          title: 'Pinjaman',
          animation: 'slide_from_right',
        }}
      />
      <HomeStack.Screen
        name="ProdukScreen"
        component={ProdukScreen}
        options={{
          title: 'Produk',
          animation: 'slide_from_right',
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="DetailProduk"
        component={DetailProdukScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <HomeStack.Screen
        name="CarouselScreen"
        component={CarouselScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <HomeStack.Screen
        name="Keuangan"
        component={KeuanganScrenn}
        options={{
          headerShown: true,
          animation: 'slide_from_right',
        }}
      />
    </HomeStack.Navigator>
  );
}

function HomeNfcStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeNfcScreen"
        component={HomeNfcScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="TransaksiNfcScreen"
        component={TransaksiNfc}
        options={{title: 'Transaksi', animation: 'slide_from_right', headerShown: false}}
      />
    </HomeStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreenKops}
        options={{headerShown: false}}
      />
      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{title: 'Pengaturan', animation: 'slide_from_right'}}
      />
      <ProfileStack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          title: 'Camera',
          animation: 'slide_from_right',
          headerShown: false,
        }}
      />
    </ProfileStack.Navigator>
  );
}

function HomeTabs() {
  const {height: screenHeight} = Dimensions.get('window');
  const isSmallDevice = screenHeight < 700;
  const tabBarBottomPosition = Platform.select({
    ios: isSmallDevice ? toDp(10) : toDp(20),
    android: toDp(20),
  });
  const tabBarHeight = Platform.select({
    ios: isSmallDevice ? toDp(50) : toDp(60),
    android: toDp(60),
  });

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          position: 'absolute',
          bottom: tabBarBottomPosition,
          left: toDp(20),
          right: toDp(20),
          borderRadius: toDp(15),
          height: tabBarHeight,
          borderTopWidth: 0,
          paddingBottom:
            Platform.OS === 'ios'
              ? toDp(Platform.isPad ? 5 : isSmallDevice ? 3 : 5)
              : 0,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.2,
              shadowRadius: 10,
            },
            android: {
              elevation: 8,
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 8,
              shadowOffset: {
                width: 0,
                height: 0,
              },
            },
          }),
        },
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({focused}) => {
          let icon;
          const iconSize = isSmallDevice ? toDp(14) : toDp(16);
          if (route.name === 'Home') {
            icon = (
              <Icons.Home
                size={iconSize}
                color={focused ? '#06367C' : '#808080'}
              />
            );
          } else if (route.name === 'History') {
            icon = (
              <Icons.History
                size={iconSize}
                color={focused ? '#06367C' : '#808080'}
              />
            );
          } else if (route.name === 'Transaksi') {
            icon = (
              <Icons.ClipboardList
                size={iconSize}
                color={focused ? '#06367C' : '#808080'}
              />
            );
          } else if (route.name === 'Profile') {
            icon = (
              <Icons.User
                size={iconSize}
                color={focused ? '#06367C' : '#808080'}
              />
            );
          }
          return <AnimatedTabIcon focused={focused} icon={icon} />;
        },
        tabBarLabel: ({focused}) => (
          <AnimatedTabLabel
            focused={focused}
            label={route.name}
            style={{
              fontSize: isSmallDevice ? toDp(8) : toDp(10),
              marginBottom: Platform.OS === 'ios' ? toDp(2) : 0,
            }}
          />
        ),
        tabBarItemStyle: {
          paddingVertical: Platform.select({
            ios: isSmallDevice ? toDp(4) : toDp(6),
            android: toDp(6),
          }),
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <AnimatedTabLabel
              focused={focused}
              label="Beranda"
              style={{
                fontSize: isSmallDevice ? toDp(8) : toDp(10),
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoriScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <AnimatedTabLabel
              focused={focused}
              label="Riwayat"
              style={{
                fontSize: isSmallDevice ? toDp(8) : toDp(10),
              }}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Transaksi"
        component={TransaksiScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <AnimatedTabLabel
              focused={focused}
              label="Transaksi"
              style={{
                fontSize: isSmallDevice ? toDp(8) : toDp(10),
              }}
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <AnimatedTabLabel
              focused={focused}
              label="Profil"
              style={{
                fontSize: isSmallDevice ? toDp(8) : toDp(10),
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}




// Stack Navigator
const Stack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();

function LoginStak() {
  return (
    <LoginStack.Navigator initialRouteName="Login">
      <LoginStack.Screen
        options={{headerShown: false}}
        name="Login"
        component={LoginScreen}
      />
      {/* <LoginStack.Screen
        options={{headerShown: true}}
        name="Register"
        component={RegistrasiScreen}
      /> */}
    </LoginStack.Navigator>
  );
}

// Export HomeTabs component
export {HomeTabs, LoginStak, HomeNfcStackScreen};

function Navigators() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = false;
    setIsLoggedIn(loggedIn);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* {isLoggedIn ? (
          <Stack.Screen name="Home" component={HomeTabs} />
        ) : (
          <Stack.Screen name="Auth" component={LoginStak} />
        )} */}
        <Stack.Screen name="Home" component={HomeNfcStackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigators;
