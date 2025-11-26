/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {SplashScreen} from './src/screens/SplashScreen';
import RaceScreen from './src/screens/RaceBox';
import {OnboardingScreen} from './src/screens/OnboardingScreen';
import LoginKops from './src/page/Login/indexKop';
// import LoginKops from './src/page/FitScreen';
import ChartScreen from './src/page/chart/index4';
import {HomeTabs, LoginStak, HomeNfcStackScreen} from './src/navigators/NavigatorsBak';
import Toast from 'react-native-toast-message';
import PushNotification from 'react-native-push-notification';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {requestNotificationPermission} from './src/hepers/PermissionHelper';
import {initializeFirebase} from './src/config/firebase';
// import QrAsset from './src/page/qrsasset/index';

// Initialize Firebase
initializeFirebase();

const Stack = createNativeStackNavigator();

const App = () => {
  React.useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize Firebase
        await initializeFirebase();

        // Request notification permission
        await requestNotificationPermission();

        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initApp();

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      // Send local notification
      pushLocalNotif(
        'microOcr',
        remoteMessage.notification?.body || 'New message',
      );
    });
  }, []);

  React.useEffect(() => {
    const initializePushNotifications = async () => {
      PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: function (token) {
          console.log('TOKEN:', token);
        },

        // (required) Called when a remote is received or opened, or local notification is opened
        onNotification: function (notification) {
          console.log('NOTIFICATION:', notification);
          // process the notification

          // (required) Called when a remote is received or opened, or local notification is opened
          // notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
        onAction: function (notification) {
          console.log('ACTION:', notification.action);
          console.log('NOTIFICATION:', notification);

          // process the action
        },

        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
        onRegistrationError: function (err) {
          console.error(err.message, err);
        },

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         * - if you are not using remote notification or do not have Firebase installed, use this:
         *     requestPermissions: Platform.OS === 'ios'
         */
        requestPermissions: true,
      });

      // Create notification channel
      PushNotification.createChannel(
        {
          channelId: 'TransitApp', // ID unik yang Anda buat
          channelName: 'Your Channel Name',
          channelDescription: 'A channel to categorize your notifications',
          soundName: 'default',
          importance: 4,
          vibrate: true,
        },
        created => {
          if (created) {
            console.log('Notification channel created');
          } else {
            console.log('Notification channel already existed');
          }
        },
      );
    };

    async function requestNotificationPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permission enabled:', authStatus);
      } else {
        Alert.alert('Notification permission not granted');
      }
    }
    requestNotificationPermission();
    initializePushNotifications();
  }, []);

  const pushLocalNotif = (chanel: any, messageBody: any) => {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: 'TransitApp', // (required) channelId, if the channel doesn't exist, notification will not fire.
      ticker: 'My Notification Ticker', // (optional)
      autoCancel: true, // (optional) default: true
      // largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" for no large icon.
      smallIcon: 'ic_launcher', // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: messageBody, // (optional) default: "message" prop
      // subText: 'This is a subText', // (optional) default: none
      // color: 'red', // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      priority: 'high', // (optional) set notification priority, default: high
      visibility: 'public', // (optional) set notification visibility, default: private

      /* iOS and Android properties */
      // title: title, // (optional)
      message: messageBody.body, // (required)
    });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        {/* <Stack.Screen name="Splash" component={RaceScreen} /> */}
        {/* <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="LoginKops" component={LoginStak} /> */}
        {/* <Stack.Screen name="Home" component={HomeTabs} /> */}
        <Stack.Screen name="Splash" component={HomeNfcStackScreen} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default App;
