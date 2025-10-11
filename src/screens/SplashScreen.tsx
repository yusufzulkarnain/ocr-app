import React, {useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {getUserData, getHasSeenOnboarding} from '../utils/storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {images} from '../assets';
import {useStatusBar} from '../hooks/useStatusBar';
import {toDp} from '../hepers/PercentageToDp';
import GlobalText from '../component/globalText';
import Animated, {StretchInY} from 'react-native-reanimated';

export const SplashScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  useStatusBar({
    backgroundColor: 'transparent',
    barStyle: 'light-content',
    translucent: true,
  });

  useEffect(() => {
    const checkAuthAndOnboarding = async () => {
      try {
        // Add artificial delay for splash screen visibility
        await new Promise(resolve => setTimeout(resolve, 2000));

        const [userData, hasSeenOnboarding] = await Promise.all([
          getUserData(),
          getHasSeenOnboarding(),
        ]);
        // navigation.replace('Home');
        // if (!hasSeenOnboarding) {
        //   navigation.replace('Onboarding');
        // } else if (userData) {
        //   navigation.replace('Home');
        // } else {
        //   navigation.replace('LoginKops');
        // }
        if (userData) {
          navigation.replace('Home');
        } else {
          navigation.replace('LoginKops');
        }
      } catch (error) {
        console.error('Error in splash screen:', error);
        // navigation.replace('LoginKops');
        // navigation.replace('Auth', {screen: 'Login'});
      }
    };

    checkAuthAndOnboarding();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={styles.body} entering={StretchInY.delay(100)}>
        {/* <GlobalText style={styles.text} typeText="bold" size={toDp(24)}>
          KOPKARTRANS
        </GlobalText> */}
        <Image source={images.kopkartrans} style={styles.logo} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: toDp(200),
    height: toDp(200),
    // borderRadius: toDp(50),
  },
  text: {
    color: '#06367C',
    marginBottom: toDp(20),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  body: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
