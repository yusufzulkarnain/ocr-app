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
import HomeAssetScreen from '../page/qrsasset/homeAssets';
import BarcodeScreen from '../page/qrsasset/barcode';
import QrCodeScreen from '../page/qrsasset/indexbak';

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
          color: focused ? '#FFFFFF' : '#FFFFFF',
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
const Tab = createBottomTabNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="QrAsset"
        component={QrAsset}
        options={{
          headerShown: false,
        }}
      />
    </HomeStack.Navigator>
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
          backgroundColor: '#06367C',
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
              elevation: toDp(6),
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
                color={focused ? '#FFFFFF' : '#FFFFFF'}
                strokeWidth={2}
              />
            );
          } else if (route.name === 'Scanner') {
            icon = (
              <Icons.ScanBarcode
                size={iconSize}
                color={focused ? '#FFFFFF' : '#FFFFFF'}
                strokeWidth={2}
              />
            );
          } else if (route.name === 'ScanQr') {
            icon = (
              <Icons.ScanQrCode
                size={iconSize}
                color={focused ? '#FFFFFF' : '#FFFFFF'}
                strokeWidth={2}
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
        component={HomeAssetScreen}
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
        name="Scanner"
        component={HomeStackScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <AnimatedTabLabel
              focused={focused}
              label="Scanner"
              style={{
                fontSize: isSmallDevice ? toDp(8) : toDp(10),
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ScanQr"
        component={QrCodeScreen}
        options={{
          tabBarLabel: ({focused}) => (
            <AnimatedTabLabel
              focused={focused}
              label="Scan QR"
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

// Export HomeTabs component
export {HomeTabs};

function Navigators() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = false;
    setIsLoggedIn(loggedIn);
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <HomeTabs />
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            options={{headerShown: false}}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            options={{headerShown: false, animation: 'fade'}}
            name="Home"
            component={HomeTabs}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default Navigators;
