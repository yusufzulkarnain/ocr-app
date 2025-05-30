import {Platform} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

// Fungsi untuk meminta izin akses kamera
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    // Tentukan jenis izin berdasarkan platform
    let permission;

    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.CAMERA;
    } else if (Platform.OS === 'android') {
      permission = PERMISSIONS.ANDROID.CAMERA;
    } else {
      // Jika platform tidak dikenali, kembalikan false atau throw error
      throw new Error('Unsupported platform');
    }

    // Meminta izin dan mendapatkan hasilnya
    const result = await request(permission);

    // Mengecek apakah izin diberikan
    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Permission request failed', error);
    return false;
  }
};

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    // Tentukan jenis izin berdasarkan platform
    let permission;

    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
    } else if (Platform.OS === 'android') {
      permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    } else {
      // Jika platform tidak dikenali, kembalikan false atau throw error
      throw new Error('Unsupported platform');
    }

    // Meminta izin dan mendapatkan hasilnya
    const result = await request(permission);

    // Mengecek apakah izin diberikan
    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Permission request failed', error);
    return false;
  }
};

export const requestNotificationPermission = async () => {
  console.log('Requesting notification permission...');
  try {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY
        : PERMISSIONS.ANDROID.POST_NOTIFICATIONS;

    const result = await request(permission);

    switch (result) {
      case RESULTS.GRANTED:
        console.log('Permission granted');
        return true;
      case RESULTS.DENIED:
        console.log('Permission denied');
        return false;
      case RESULTS.BLOCKED:
        console.log('Permission blocked, please enable manually');
        return false;
      default:
        console.log('Permission status:', result);
        return false;
    }
  } catch (error) {
    console.warn('Permission error:', error);
    return false;
  }
};
