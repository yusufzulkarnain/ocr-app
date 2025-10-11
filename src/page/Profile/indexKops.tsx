import React, {useEffect, useCallback, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Image,
  Alert,
  ImageBackground,
} from 'react-native';
import {toDp} from '../../hepers/PercentageToDp';
import GlobalText from '../../component/globalText';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  LogOut,
  ChevronRight,
  Shield,
  HelpCircle,
  ImageDown,
  Camera,
  UserCog,
  LockKeyhole,
} from 'lucide-react-native';
import {useStatusBar} from '../../hooks/useStatusBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {getUserData} from '../../utils/storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {useFocusEffect} from '@react-navigation/native';
import {images} from '../../assets';
import {PERMISSIONS, request, check, RESULTS} from 'react-native-permissions';
import ViewShot, {captureRef} from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

type ProfileScreenKopsProps = {
  navigation?: any;
};

interface MenuItem {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
}
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const ProfileScreenKops: React.FC<ProfileScreenKopsProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = React.useState<any>(null);
  const translateX = useSharedValue(SCREEN_WIDTH);
  const opacity = useSharedValue(0);
  const cardRef = React.useRef(null);
  const viewShotRef = React.useRef<ViewShot>(null);
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      translateX.value = SCREEN_WIDTH; // posisi awal dari kanan
      opacity.value = 0;
      // Jalankan animasi saat halaman difokuskan
      translateX.value = withSpring(0, {
        damping: 15,
        stiffness: 70,
        mass: 1,
      });

      opacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.exp),
      });
      fetchUserData();
    }, [opacity, translateX]),
  );

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
    opacity: opacity.value,
  }));

  useStatusBar({
    barStyle: 'dark-content',
    backgroundColor: 'transparent',
    translucent: true,
  });

  const fetchUserData = async () => {
    const localUserData = await getUserData();
    setUserData(localUserData);
    console.log('userDataLocal');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      Toast.show({
        type: 'success',
        text1: 'Berhasil keluar',
      });
      setTimeout(() => {
        navigation?.replace('LoginKops');
      }, 800);
    } catch (error) {
      console.error('Error clearing storage:', error);
      Toast.show({
        type: 'error',
        text1: 'Gagal keluar',
      });
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: <LockKeyhole size={22} color="#06367C" />,
      title: 'Ubah Kata Sandi',
      subtitle: 'Ubah Kata Sandi',
      onPress: () => navigation.navigate('ChangePassword'),
    },
    {
      icon: <ImageDown size={22} color="#06367C" />,
      title: 'Unggah Kartu Anggota',
      subtitle: 'Kartu anggota koperasi',
      onPress: () => captureAndSave(),
    },
    {
      icon: <HelpCircle size={22} color="#06367C" />,
      title: 'Bantuan',
      subtitle: 'FAQ, Kontak',
      onPress: () => console.log('Help pressed'),
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.title}
      style={styles.menuItem}
      onPress={item.onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>{item.icon}</View>
        <View style={styles.menuTextContainer}>
          <GlobalText size={toDp(14)} typeText="bold" style={styles.menuTitle}>
            {item.title}
          </GlobalText>
          {item.subtitle && (
            <GlobalText size={toDp(10)} style={styles.menuSubtitle}>
              {item.subtitle}
            </GlobalText>
          )}
        </View>
      </View>
      <ChevronRight size={18} color="#06367C" />
    </TouchableOpacity>
  );

  const requestStoragePermission = async () => {
    let permission;

    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        // Android 13+
        permission = PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
      } else {
        // Android 12 ke bawah
        permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
      }
    } else {
      // iOS
      permission = PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY;
    }

    const result = await request(permission);
    return result === RESULTS.GRANTED;
  };

  const captureAndSave = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      console.warn('Izin penyimpanan tidak diberikan');
      return;
    }

    if (viewShotRef.current?.capture) {
      try {
        const uri = await viewShotRef.current.capture();
        const destPath = `${
          RNFS.DownloadDirectoryPath
        }/kartu-anggota-koperasi-${Date.now()}.png`;

        await RNFS.copyFile(uri, destPath);
        console.log('Gambar berhasil disimpan di:', destPath);

        // Daftarkan ke MediaStore agar muncul di galeri
        RNFetchBlob.fs
          .scanFile([{path: destPath, mime: 'image/png'}])
          .then(() => {
            Toast.show({
              type: 'success',
              text1: 'Berhasil',
              text2: 'Kartu anggota berhasil diunggah',
            });
            console.log('MediaScanner dijalankan');
          })
          .catch(err => console.error('Gagal memindai media:', err));
      } catch (err) {
        console.error('Gagal menyimpan gambar:', err);
      }
    } else {
      console.warn('viewShotRef belum siap atau tidak memiliki fungsi capture');
    }
  };

  const handleCameraOpen = () => {
    navigation.navigate('Camera');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#E8F0FF', '#1E3B70']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.header, {paddingTop: insets.top + toDp(16)}]}>
        <View style={styles.cardContainer}>
          <ViewShot ref={viewShotRef} options={{format: 'png', quality: 1}}>
            <Animated.View style={[styles.membershipCard, animatedCardStyle]}>
              <TouchableOpacity
                style={styles.btnVisibleTakePhoto}
                onPress={handleCameraOpen}
              />
              {userData?.foto ? (
                <View style={[styles.userProfile, {zIndex: 0}]}>
                  <Image
                    source={{uri: userData?.foto}}
                    style={{width: toDp(92), height: toDp(80)}}
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View style={styles.userProfile}>
                  <View style={{alignItems: 'center'}}>
                    <Camera size={toDp(24)} color="#FFFFFF" />
                    <GlobalText
                      size={toDp(7)}
                      typeText="bold"
                      style={{color: '#FFFFFF'}}>
                      Ambil Foto
                    </GlobalText>
                  </View>
                </View>
              )}

              <ImageBackground
                resizeMode="cover"
                source={images.idcard}
                style={styles.cardImage}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    // position: 'absolute',
                    width: '100%',
                    marginTop: toDp(-40),
                    paddingHorizontal: toDp(10),
                    alignItems: 'center',
                  }}>
                  <Image
                    source={images.logoTj}
                    style={{width: toDp(48), height: toDp(48)}}
                    resizeMode="contain"
                    tintColor={'white'}
                  />
                  <Image
                    source={images.kopkartrans}
                    style={{width: toDp(50), height: toDp(50)}}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.contentCard}>
                  <View style={styles.detailCardInfo}>
                    <GlobalText
                      typeText="bold"
                      size={toDp(16)}
                      style={{color: '#06367C'}}>
                      KARTU ANGGOTA
                    </GlobalText>
                    <GlobalText
                      typeText="bold"
                      size={toDp(8)}
                      style={{color: '#06367C'}}>
                      KOPERASI KONSUMEN KARYAWAN PT TRANSJAKARTA
                    </GlobalText>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: '#06367C',
                        width: '98%',
                        marginBottom: toDp(4),
                      }}
                    />
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          width: toDp(50),
                        }}>
                        <GlobalText
                          typeText="bold"
                          size={toDp(8)}
                          style={{color: '#06367C'}}>
                          Nama
                        </GlobalText>
                      </View>
                      <View
                        style={{
                          width: toDp(18),
                          alignItems: 'center',
                        }}>
                        <GlobalText
                          typeText="bold"
                          size={toDp(8)}
                          style={{color: '#06367C'}}>
                          :
                        </GlobalText>
                      </View>
                      <View
                        style={{
                          width: toDp(128),
                        }}>
                        <GlobalText
                          typeText="bold"
                          size={toDp(8)}
                          style={{color: '#06367C'}}>
                          {userData?.nama}
                        </GlobalText>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          width: toDp(50),
                        }}>
                        <GlobalText
                          typeText="bold"
                          size={toDp(8)}
                          style={{color: '#06367C'}}>
                          NIK
                        </GlobalText>
                      </View>
                      <View
                        style={{
                          width: toDp(18),
                          alignItems: 'center',
                        }}>
                        <GlobalText
                          typeText="bold"
                          size={toDp(8)}
                          style={{color: '#06367C'}}>
                          :
                        </GlobalText>
                      </View>
                      <View
                        style={{
                          width: toDp(128),
                        }}>
                        <GlobalText
                          typeText="bold"
                          size={toDp(8)}
                          style={{color: '#06367C'}}>
                          {userData?.nik}
                        </GlobalText>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          width: toDp(50),
                        }}>
                        <GlobalText
                          typeText="bold"
                          size={toDp(8)}
                          style={{color: '#06367C'}}>
                          Nomor Anggota
                        </GlobalText>
                      </View>
                      <View
                        style={{
                          width: toDp(18),
                          alignItems: 'center',
                        }}>
                        <GlobalText
                          typeText="bold"
                          size={toDp(8)}
                          style={{color: '#06367C'}}>
                          :
                        </GlobalText>
                      </View>
                      <View
                        style={{
                          width: toDp(128),
                        }}>
                        <GlobalText
                          typeText="bold"
                          size={toDp(8)}
                          style={{color: '#06367C'}}>
                          {userData?.no_anggota}
                        </GlobalText>
                      </View>
                    </View>
                  </View>
                </View>
              </ImageBackground>
              {/* </View> */}
            </Animated.View>
          </ViewShot>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={styles.menuContainer}>
          {menuItems.map(item => renderMenuItem(item))}
        </View>

        <View
          style={[
            styles.logoutSection,
            {marginBottom: insets.bottom + toDp(80)},
          ]}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={24} color="#FF3B30" />
            <GlobalText size={toDp(16)} style={styles.logoutText}>
              Keluar
            </GlobalText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: toDp(16),
    paddingBottom: toDp(12),
    elevation: Platform.OS === 'ios' ? 8 : 10,
    zIndex: 1,
  },
  cardContainer: {
    alignItems: 'center',
    // marginTop: toDp(16),
  },
  membershipCard: {
    width: toDp(330),
    height: toDp(208),
    borderRadius: toDp(4),
    overflow: 'hidden',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 8,
    // elevation: 10,
    // zIndex: 1,
    backgroundColor: '#5B6C83',
  },
  cardContent: {
    flex: 1,
    padding: toDp(16),
  },
  memberCardText: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: toDp(18),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    zIndex: 1,
  },
  leftContent: {
    flex: 0.7,
    justifyContent: 'space-between',
    paddingVertical: toDp(16),
  },
  rightContent: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    color: '#FFFFFF',
    // marginBottom: toDp(8),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  memberInfo: {
    marginVertical: toDp(8),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: toDp(4),
  },
  infoLabel: {
    color: '#E0E0E0',
    opacity: 1,
    marginRight: toDp(4),
    fontSize: toDp(13),
  },
  infoValue: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: toDp(13),
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 0.5, height: 0.5},
    textShadowRadius: 1,
  },
  contactInfo: {
    marginTop: toDp(8),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: toDp(8),
    borderRadius: toDp(8),
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: toDp(6),
    paddingHorizontal: toDp(4),
  },
  contactText: {
    color: '#FFFFFF',
    marginLeft: toDp(8),
    opacity: 1,
    fontSize: toDp(12),
    fontFamily: 'PlusJakartaSans-Medium',
  },
  qrContainer: {
    padding: toDp(8),
    backgroundColor: '#FFFFFF',
    borderRadius: toDp(8),
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: toDp(16),
  },
  menuContainer: {
    paddingTop: toDp(16),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: toDp(16),
    paddingHorizontal: toDp(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: toDp(38),
    height: toDp(38),
    borderRadius: toDp(20),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: toDp(12),
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: '#06367C',
  },
  menuSubtitle: {
    color: '#666666',
    marginTop: toDp(2),
  },
  logoutSection: {
    paddingHorizontal: toDp(16),
    paddingTop: toDp(16),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: toDp(16),
    borderRadius: toDp(12),
  },
  logoutText: {
    color: '#FF3B30',
    marginLeft: toDp(12),
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: toDp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  userProfile: {
    width: toDp(92),
    height: toDp(94),
    position: 'absolute',
    zIndex: 10,
    top: toDp(65),
    left: toDp(29),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: toDp(10),
  },
  contentCard: {
    // borderWidth: toDp(1),
    borderColor: '#5B6C83',
    width: '100%',
    // paddingHorizontal: toDp(16),
  },
  detailCardInfo: {
    alignSelf: 'flex-end',
    width: toDp(198),
    // backgroundColor: 'red',
  },
  btnVisibleTakePhoto: {
    height: toDp(90),
    width: toDp(90),
    borderRadius: toDp(25),
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 100,
    top: toDp(65),
    left: toDp(29),
  },
});

export default ProfileScreenKops;
