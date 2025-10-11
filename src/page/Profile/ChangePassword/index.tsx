import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import GlobalText from '../../../component/globalText';
import {toDp} from '../../../hepers/PercentageToDp';
import {formatCurrency, unformatCurrency} from '../../../hepers/CurrencyFormat';
import {useStatusBar} from '../../../hooks/useStatusBar';
import Slider from '@react-native-community/slider';
import moment from 'moment';
import {getUserData, addNewTransaction} from '../../../utils/storage';
import Toast from 'react-native-toast-message';
import {userInterface} from '../../../hepers/Interface';
import {putDataKoperasi} from '../../../hepers/Api';
import {Eye, EyeOff} from 'lucide-react-native';

type ChangePasswordScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

interface LoanForm {
  amount: string;
  duration: string;
  purpose: string;
  income: string;
  occupation: string;
}
const ChangePassword: React.FC<ChangePasswordScreenProps> = ({navigation}) => {
  // Use the status bar hook
  useStatusBar({
    barStyle: 'dark-content',
    backgroundColor: '#FFFFFF',
    translucent: true,
  });
  const [loading, setLoading] = React.useState(false);
  const [userData, setUserData] = React.useState<userInterface | null>(null);
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [repass, setRepass] = React.useState('');
  const [showRepass, setShowRepass] = React.useState(false);

  React.useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });

    return () => {
      const tabBarStyle = {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? toDp(20) : toDp(20),
        left: toDp(20),
        right: toDp(20),
        elevation: 4,
        borderRadius: toDp(15),
        height: Platform.OS === 'ios' ? toDp(60) : toDp(60),
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: Platform.OS === 'ios' ? 2 : 4,
        },
        shadowOpacity: Platform.OS === 'ios' ? 0.15 : 0.1,
        shadowRadius: Platform.OS === 'ios' ? 6 : 8,
        borderTopWidth: 0,
        paddingBottom: Platform.OS === 'ios' ? toDp(5) : 0,
      };

      navigation.getParent()?.setOptions({
        tabBarStyle,
      });
    };
  }, [navigation]);

  // Add useFocusEffect to handle StatusBar
  useFocusEffect(
    React.useCallback(() => {
      // Set StatusBar style when screen comes into focus
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('#FFFFFF');
      StatusBar.setTranslucent(true);
      getLocalUserData();
      // Cleanup function to run when screen loses focus
      return () => {
        // No cleanup needed for StatusBar
      };
    }, []),
  );

  const getLocalUserData = async () => {
    try {
      const userDataLocal = await getUserData();
      console.log('userData->>>', userDataLocal);
      setUserData(userDataLocal);
      return userDataLocal;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (password !== repass) {
      Toast.show({
        type: 'error',
        text1: 'Kata Sandi tidak sama',
      });
      return;
    } else if (password === '') {
      Toast.show({
        type: 'error',
        text1: 'Kata Sandi tidak boleh kosong',
      });
    } else if (password.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Kata Sandi minimal 8 karakter',
      });
      return;
    }
    const obj = {
      id: userData?.id,
      password: password,
    };
    console.log(obj);
    setLoading(true);
    try {
      const result = await putDataKoperasi('/update-password', obj);
      // console.log('Result from API:', result);
      if (result) {
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Kata sandi berhasil diubah',
          text2: result.message,
        });
        navigation.goBack();
        console.log(result);
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: result?.error || 'Terjadi kesalahan',
        });
      }
    } catch (error: any) {
      setLoading(false);
      console.log(' error:', error);
      Toast.show({
        type: 'error',
        text1: error.message || 'Terjadi kesalahan',
      });
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <GlobalText size={toDp(14)} typeText="bold" style={styles.label}>
                Kata Sandi Baru
              </GlobalText>
              <View>
                <TextInput
                  style={[styles.input, {paddingLeft: toDp(16)}]}
                  placeholder="Masukan Kata Sandi"
                  value={password}
                  onChangeText={value => setPassword(value)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{position: 'absolute', right: 12, top: 14}}>
                  {showPassword ? (
                    <Eye size={toDp(20)} color={'#06367C'} />
                  ) : (
                    <EyeOff size={toDp(20)} color={'#06367C'} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <GlobalText size={toDp(14)} typeText="bold" style={styles.label}>
                Ulangi Kata Sandi
              </GlobalText>
              <View>
                <TextInput
                  style={[styles.input, {paddingLeft: toDp(16)}]}
                  placeholder="Ulangi Kata Sandi"
                  value={repass}
                  onChangeText={value => setRepass(value)}
                  secureTextEntry={!showRepass}
                />
                <TouchableOpacity
                  onPress={() => setShowRepass(!showRepass)}
                  style={{position: 'absolute', right: 12, top: 14}}>
                  {showRepass ? (
                    <Eye size={toDp(20)} color={'#06367C'} />
                  ) : (
                    <EyeOff size={toDp(20)} color={'#06367C'} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            disabled={loading}
            style={styles.submitButton}
            onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <GlobalText
                size={toDp(16)}
                typeText="bold"
                style={styles.buttonText}>
                Simpan
              </GlobalText>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: toDp(16),
    paddingVertical: toDp(12),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: toDp(16),
    gap: toDp(16),
  },
  inputGroup: {
    gap: toDp(8),
  },
  label: {
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: toDp(8),
    overflow: 'hidden',
  },
  prefix: {
    paddingHorizontal: toDp(16),
    color: '#666666',
  },
  input: {
    flex: 1,
    height: toDp(48),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: toDp(8),
    fontSize: toDp(14),
    color: '#000000',
  },
  footer: {
    padding: toDp(16),
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#06367C',
    paddingVertical: toDp(10),
    borderRadius: toDp(8),
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
  },
});

export default ChangePassword;
