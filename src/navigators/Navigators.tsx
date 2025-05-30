import React, {useState, useEffect, useCallback} from 'react';
import {
  NavigationContainer,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Animated, Text} from 'react-native';
import {Home, History} from 'lucide-react-native';

import HomeScreen from '../page/Home';
// import HomeDetailScreen from '../page/Home/lokasiTugas';
import LokasiTugasScreen from '../page/Home/lokasiTugas';
import HistoriScreen from '../page/Histori';
import LoginScreen from '../page/Login';
import PrintScreen from '../page/Home/buatDo/print';
import ScanQR from '../page/Home/buatDo/scanQr';
import BuatDoScreen from '../page/Home/buatDo';
import BlePeripheralExample from '../page/bluetooth';
import QrAsset from '../page/qrsasset';
import {toDp} from '../hepers/PercentageToDp';

interface AnimatedTabIconProps {
  focused: boolean;
  IconComponent: any;
}
const HomeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
function AnimatedTabIcon({focused, IconComponent}: AnimatedTabIconProps) {
  const scaleValue = React.useRef(
    new Animated.Value(focused ? 1 : 0.8),
  ).current;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: focused ? 1.2 : 0.8,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={{transform: [{scale: scaleValue}]}}>
      <IconComponent size={toDp(18)} color={focused ? '#06367C' : '#808080'} />
    </Animated.View>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
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
        name="BuatDo"
        component={BuatDoScreen}
        options={{title: 'Driver order', animation: 'slide_from_right'}}
      />
    </HomeStack.Navigator>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {backgroundColor: 'white'},
        tabBarIcon: ({focused}) => {
          const icons: {[key: string]: any} = {
            Home: Home,
            Histori: History,
          };
          const IconComponent = icons[route.name];
          return (
            <AnimatedTabIcon focused={focused} IconComponent={IconComponent} />
          );
        },
        tabBarLabel: ({focused}) => {
          const scaleValue = React.useRef(
            new Animated.Value(focused ? 1 : 0.8),
          ).current;

          useEffect(() => {
            Animated.spring(scaleValue, {
              toValue: focused ? 1.2 : 0.8,
              friction: 4,
              useNativeDriver: true,
            }).start();
          }, [focused]);

          return (
            <Animated.Text
              style={{
                color: focused ? '#06367C' : '#808080',
                fontSize: toDp(11),
                fontFamily: 'PlusJakartaSans-Bold',
                transform: [{scale: scaleValue}],
              }}>
              {route.name}
            </Animated.Text>
          );
        },
      })}>
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Histori" component={HistoriScreen} />
    </Tab.Navigator>
  );
}

// Stack Navigator
const Stack = createNativeStackNavigator();

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
