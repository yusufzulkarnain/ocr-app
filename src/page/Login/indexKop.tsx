import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {toDp} from '../../hepers/PercentageToDp';
import GlobalText from '../../component/globalText';
import Toast from 'react-native-toast-message';
import * as Icons from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useStatusBar} from '../../hooks/useStatusBar';
import {storeUserData} from '../../utils/storage';
import {images} from '../../assets';
import Modal from 'react-native-modal';
import {postDataKoperasi} from '../../hepers/Api';
import DeviceInfo from 'react-native-device-info';
import {set} from 'date-fns';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

// Tipe untuk properti navigation
type LoginKopsScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

type LoginStackParamList = {
  Login: undefined;
  Register: undefined;
};

const LoginKops: React.FC<LoginKopsScreenProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [nik, setNik] = React.useState('');
  const [nikRegis, setNikRegis] = React.useState('');
  const [nikKtp, setNikKtp] = React.useState('');
  const [namaRegis, setNamaRegis] = React.useState('');
  const [norekRegis, setNorekRegis] = React.useState('');
  const [passwordRegis, setPasswordRegis] = React.useState('');
  const [repassRegis, setRepassRegis] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [showPasswordRegis, setShowPasswordRegis] = React.useState(false);
  const [showRepassRegis, setShowRepassRegis] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingRegis, setLoadingRegis] = React.useState(false);
  const scrollViewRef = React.useRef<ScrollView>(null);
  useStatusBar({
    barStyle: 'dark-content',
    backgroundColor: 'transparent',
    translucent: true,
  });
  React.useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => {
        setKeyboardHeight(e.endCoordinates.height);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({animated: true});
        }, 100);
      },
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0),
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // const handleLogin = async () => {
  //   if (!nik || !password) {
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Error',
  //       text2: 'Mohon isi semua field',
  //     });
  //     return;
  //   }
  //   try {
  //     const userData = {
  //       id: '1',
  //       nik: nik,
  //       nama: 'John Doe',
  //       nomorKartu: '123456789',
  //       nomorAnggota: 'A123',
  //       email: 'john.doe@example.com',
  //     };

  //     await storeUserData(userData);

  //     Toast.show({
  //       type: 'success',
  //       text1: 'Login Berhasil',
  //       text2: `Selamat datang, ${userData.nama}`,
  //     });

  //     setTimeout(() => {
  //       navigation.replace('Home');
  //     }, 800);
  //   } catch (error) {
  //     console.error('Error during login:', error);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Gagal Login',
  //       text2: 'Terjadi kesalahan saat menyimpan data',
  //     });
  //   }
  // };

  const handleLogin = async () => {
    if (!nik || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Mohon isi semua field',
      });
      return;
    }
    Keyboard.dismiss();
    const obj = {
      nik_karyawan: parseInt(nik),
      password: password,
    };
    console.log(obj);
    try {
      setLoading(true);
      const result = await postDataKoperasi('/login', obj);
      console.log('Result from API:', result);
      if (result?.message) {
        await storeUserData(result.user);
        setModalVisible(false);
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: result.message,
        });
        navigation.replace('Home');
      } else {
        Toast.show({
          type: 'error',
          text1: result?.error || 'Terjadi kesalahan',
        });
      }
    } catch (error: any) {
      setModalVisible(false);
      setLoading(false);
      console.log('Register error:', error);
      Toast.show({
        type: 'error',
        text1: error.message || 'Terjadi kesalahan saat mendaftar',
      });
    }
  };

  const handleRegisterSubmit = async () => {
    setLoadingRegis(true);
    Keyboard.dismiss();
    const obj = {
      nik_ktp: parseInt(nikKtp),
      nik_karyawan: parseInt(nikRegis),
      nama: namaRegis,
      no_rek_dki: norekRegis,
      password: passwordRegis,
      device_id: await DeviceInfo.getUniqueId(),
    };
    console.log(obj);
    try {
      const result = await postDataKoperasi('/register', obj);
      console.log('Result from API:', result);
      if (result?.message) {
        setModalVisible(false);
        setLoadingRegis(false);
        Toast.show({
          type: 'success',
          text1: result.message,
        });
      } else {
        setLoadingRegis(false);
        Toast.show({
          type: 'error',
          text1: result?.error || 'Terjadi kesalahan',
        });
      }
    } catch (error: any) {
      setModalVisible(false);
      setLoadingRegis(false);
      console.log('Register error:', error);
      Toast.show({
        type: 'error',
        text1: error.message || 'Terjadi kesalahan saat mendaftar',
      });
    }
  };

  const contentHeight = SCREEN_HEIGHT - keyboardHeight;
  const topPadding = Platform.OS === 'ios' ? insets.top : 0;

  const modalRegister = () => {
    return (
      <Modal
        isVisible={modalVisible}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        style={{margin: 0, justifyContent: 'flex-end'}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{flex: 1, justifyContent: 'flex-end'}}>
          <View
            style={{
              backgroundColor: 'white',
              paddingHorizontal: toDp(16),
              borderTopLeftRadius: toDp(20),
              borderTopRightRadius: toDp(20),
              // minHeight: Dimensions.get('window').height * 0.8,
              paddingTop: toDp(10),
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: toDp(12),
                borderBottomWidth: toDp(2),
                borderBottomColor: '#E0E0E0',
                paddingBottom: toDp(8),
              }}>
              <GlobalText size={16} typeText="bold">
                Daftar Akun
              </GlobalText>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  width: toDp(24),
                  height: toDp(24),
                  borderRadius: toDp(20),
                  backgroundColor: '#E0E0E0',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icons.X size={toDp(16)} color={'#808080'} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <View>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{flexGrow: 1}}>
                <View style={styles.inputContainerRegister}>
                  <GlobalText size={14} style={styles.inputLabelRegister}>
                    NIK KTP
                  </GlobalText>
                  <TextInput
                    style={styles.inputRegister}
                    placeholder="Masukkan NIK KTP"
                    value={nikKtp}
                    onChangeText={setNikKtp}
                    keyboardType="number-pad"
                    returnKeyType="next"
                    placeholderTextColor="rgba(6, 54, 124, 0.5)"
                  />
                </View>
                <View style={styles.inputContainerRegister}>
                  <GlobalText size={14} style={styles.inputLabelRegister}>
                    NIK
                  </GlobalText>
                  <TextInput
                    style={styles.inputRegister}
                    placeholder="Masukkan NIK"
                    value={nikRegis}
                    onChangeText={setNikRegis}
                    keyboardType="number-pad"
                    returnKeyType="next"
                    placeholderTextColor="rgba(6, 54, 124, 0.5)"
                  />
                </View>
                <View style={styles.inputContainerRegister}>
                  <GlobalText size={14} style={styles.inputLabelRegister}>
                    Nama
                  </GlobalText>
                  <TextInput
                    style={styles.inputRegister}
                    placeholder="Masukkan Nama Lengkap"
                    value={namaRegis}
                    onChangeText={setNamaRegis}
                    keyboardType="default"
                    returnKeyType="next"
                    placeholderTextColor="rgba(6, 54, 124, 0.5)"
                  />
                </View>
                <View style={styles.inputContainerRegister}>
                  <GlobalText size={14} style={styles.inputLabelRegister}>
                    No. Rekening Bank DKI
                  </GlobalText>
                  <TextInput
                    style={styles.inputRegister}
                    placeholder="Masukkan No. Rekening Bank DKI"
                    value={norekRegis}
                    onChangeText={setNorekRegis}
                    keyboardType="number-pad"
                    returnKeyType="next"
                    placeholderTextColor="rgba(6, 54, 124, 0.5)"
                  />
                </View>
                <View style={styles.inputContainerRegister}>
                  <GlobalText size={14} style={styles.inputLabelRegister}>
                    Kata Sandi
                  </GlobalText>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInputRegister}
                      placeholder="Masukkan Kata Sandi"
                      value={passwordRegis}
                      onChangeText={setPasswordRegis}
                      secureTextEntry={!showPasswordRegis}
                      returnKeyType="done"
                      // onSubmitEditing={handleLogin}
                      placeholderTextColor="rgba(6, 54, 124, 0.5)"
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPasswordRegis(!showPasswordRegis)}>
                      {showPasswordRegis ? (
                        <Icons.Eye size={12} color="#06367C" />
                      ) : (
                        <Icons.EyeOff size={12} color="#06367C" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.inputContainerRegister}>
                  <GlobalText size={14} style={styles.inputLabelRegister}>
                    Ulangi Kata Sandi
                  </GlobalText>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInputRegister}
                      placeholder="Masukkan Kata Sandi"
                      value={repassRegis}
                      onChangeText={setRepassRegis}
                      secureTextEntry={!showRepassRegis}
                      returnKeyType="done"
                      placeholderTextColor="rgba(6, 54, 124, 0.5)"
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowRepassRegis(!showRepassRegis)}>
                      {showRepassRegis ? (
                        <Icons.Eye size={12} color="#06367C" />
                      ) : (
                        <Icons.EyeOff size={12} color="#06367C" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    marginTop: toDp(10),
                    marginBottom: toDp(16),
                  }}>
                  <TouchableOpacity
                    disabled={loadingRegis}
                    onPress={handleRegisterSubmit}
                    style={{
                      width: toDp(250),
                      backgroundColor: '#06367C',
                      paddingVertical: toDp(12),
                      borderRadius: toDp(8),
                      alignItems: 'center',
                    }}>
                    {loadingRegis ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <GlobalText
                        size={14}
                        typeText="bold"
                        style={{color: '#fff'}}>
                        Simpan
                      </GlobalText>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {modalRegister()}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -insets.bottom : 0}>
        <LinearGradient
          colors={['#FFFFFF', '#E8F0FF', '#1E3B70']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[styles.gradientBackground, {paddingTop: topPadding}]}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.innerContainer, {height: contentHeight}]}>
              <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
                overScrollMode="never">
                <View style={styles.mainContent}>
                  <View
                    style={[
                      styles.logoContainer,
                      {paddingVertical: toDp(20) + insets.top},
                    ]}>
                    <GlobalText
                      size={20}
                      typeText="bold"
                      style={styles.logoTextLogin}>
                      KOPERASI KARYAWAN TRANSJAKARTA
                    </GlobalText>

                    <Image source={images.kopkartrans} style={styles.logo} />
                  </View>

                  <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                      <GlobalText size={16} style={styles.inputLabel}>
                        NIK
                      </GlobalText>
                      <TextInput
                        style={styles.input}
                        placeholder="Masukkan NIK"
                        value={nik}
                        onChangeText={setNik}
                        keyboardType="number-pad"
                        returnKeyType="next"
                        placeholderTextColor="rgba(6, 54, 124, 0.5)"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <GlobalText size={16} style={styles.inputLabel}>
                        Kata Sandi
                      </GlobalText>
                      <View style={styles.passwordContainer}>
                        <TextInput
                          style={styles.passwordInput}
                          placeholder="Masukkan Kata Sandi"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!showPassword}
                          returnKeyType="done"
                          // onSubmitEditing={handleLogin}
                          placeholderTextColor="rgba(6, 54, 124, 0.5)"
                        />
                        <TouchableOpacity
                          style={styles.eyeButton}
                          onPress={() => setShowPassword(!showPassword)}>
                          {showPassword ? (
                            <Icons.Eye size={24} color="#06367C" />
                          ) : (
                            <Icons.EyeOff size={24} color="#06367C" />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.spacer} />
                  </View>
                </View>
              </ScrollView>

              <View
                style={[
                  styles.buttonContainer,
                  {paddingBottom: Math.max(insets.bottom, 16)},
                ]}>
                <TouchableOpacity
                  disabled={loading}
                  style={styles.loginButton}
                  onPress={handleLogin}>
                  {loading ? (
                    <ActivityIndicator color="#fff" size={'small'} />
                  ) : (
                    <GlobalText size={16} style={styles.loginButtonText}>
                      Masuk
                    </GlobalText>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => setModalVisible(true)}>
                  <GlobalText size={16} style={styles.registerButtonText}>
                    Daftar
                  </GlobalText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradientBackground: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: toDp(16),
  },
  logoContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#06367C',
    fontFamily: 'Inter-Bold',
    marginTop: toDp(10),
    letterSpacing: 2,
  },
  formContainer: {
    flex: 1,
    // paddingTop: toDp(18),
  },
  inputContainer: {
    marginBottom: toDp(20),
  },
  inputContainerRegister: {
    marginBottom: toDp(12),
  },
  inputLabel: {
    marginBottom: toDp(8),
    color: '#06367C',
    fontFamily: 'Inter-Bold',
  },
  inputLabelRegister: {
    marginBottom: toDp(8),
    color: '#06367C',
    fontFamily: 'Inter-Bold',
  },
  input: {
    height: toDp(50),
    borderWidth: 1,
    borderColor: 'rgba(6, 54, 124, 0.3)',
    borderRadius: toDp(10),
    paddingHorizontal: toDp(16),
    fontSize: toDp(16),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter-Regular',
    color: '#06367C',
  },
  inputRegister: {
    height: toDp(40),
    borderWidth: 1,
    borderColor: 'rgba(6, 54, 124, 0.3)',
    borderRadius: toDp(10),
    paddingHorizontal: toDp(16),
    fontSize: toDp(12),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter-Regular',
    color: '#06367C',
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(6, 54, 124, 0.3)',
    borderRadius: toDp(10),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  passwordInput: {
    flex: 1,
    height: toDp(50),
    paddingHorizontal: toDp(16),
    fontSize: toDp(16),
    fontFamily: 'Inter-Regular',
    color: '#06367C',
  },
  passwordInputRegister: {
    flex: 1,
    height: toDp(40),
    paddingHorizontal: toDp(16),
    fontSize: toDp(12),
    fontFamily: 'Inter-Regular',
    color: '#06367C',
  },
  eyeButton: {
    padding: toDp(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: toDp(16),
  },
  loginButton: {
    backgroundColor: '#06367C',
    height: toDp(45),
    borderRadius: toDp(10),
    width: toDp(160),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  registerButton: {
    backgroundColor: '#fff',
    height: toDp(45),
    borderRadius: toDp(10),
    width: toDp(160),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor: '#06367C',
    borderWidth: 1,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  registerButtonText: {
    color: '#06367C',
    fontWeight: 'bold',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  spacer: {
    height: Platform.OS === 'ios' ? toDp(100) : toDp(80),
  },
  logo: {
    width: toDp(150),
    height: toDp(150),
    borderRadius: toDp(10),
    marginTop: toDp(12),
  },
  logoTextLogin: {
    color: '#06367C',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    textAlign: 'center',
  },
});

export default LoginKops;
