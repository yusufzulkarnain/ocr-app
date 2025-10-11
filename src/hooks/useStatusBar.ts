import {useEffect, useCallback} from 'react';
import {StatusBar, Platform} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

interface StatusBarConfig {
  barStyle: 'light-content' | 'dark-content';
  backgroundColor: string;
  translucent: boolean;
}

export const useStatusBar = (config: StatusBarConfig) => {
  const setStatusBarConfig = useCallback(() => {
    // For Android: Set background color and translucent
    if (Platform.OS === 'android') {
      // Make sure status bar is translucent first
      StatusBar.setTranslucent(true);
      // Then set the background color
      StatusBar.setBackgroundColor(config.backgroundColor);
    }

    // For both platforms: Set the bar style
    if (Platform.OS === 'ios') {
      // On iOS, animate the status bar style change
      StatusBar.setBarStyle(config.barStyle, true);
    } else {
      // On Android, don't animate to avoid flickering
      StatusBar.setBarStyle(config.barStyle, false);
    }
  }, [config]);

  // Set initial config when component mounts
  useEffect(() => {
    setStatusBarConfig();
  }, [setStatusBarConfig]);

  // Update config when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setStatusBarConfig();

      return () => {
        // No cleanup needed as the next screen will set its own config
      };
    }, [setStatusBarConfig]),
  );
};
