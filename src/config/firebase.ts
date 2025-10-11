import firebase from '@react-native-firebase/app';

export const initializeFirebase = async () => {
  if (!firebase.apps.length) {
    // Firebase will automatically read the config from google-services.json and GoogleService-Info.plist
    return await firebase.initializeApp();
  }
  return firebase.app();
};
