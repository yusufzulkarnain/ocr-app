import React from 'react';
import {
  StyleSheet,
  Text,
  ImageBackground,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {toDp} from '../../hepers/PercentageToDp';
import LinearGradient from 'react-native-linear-gradient';
import GlobalText from '../../component/globalText';
import {Eye, EyeOff} from 'lucide-react-native';
import {postData} from '../../hepers/Api';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipe untuk properti navigation
type LoginScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [visiblePassword, setVisiblePassword] = React.useState(false);
  const [nik, setNik] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const handleLoginPost = async () => {
    setLoading(true);
    try {
      const result = await postData('/mikro/app/login', {
        nik: parseInt(nik),
        password: password,
      });
      console.log('Result from API:', result);
      if (result.code === 200) {
        setLoading(false);
        saveUserToStorage(result.data, result.messages);
      } else {
        setLoading(false);
        Toast.show({
          type: 'info',
          text1: result.messages,
        });
      }
    } catch (error: any) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: error.response.data.messages,
      });
      console.log('Login error:', error.response.data);
    }
  };

  const saveUserToStorage = async (item: object, message: string) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(item));
      console.log('berhasil simpan user lokal');
      console.log('message1', message);
      Toast.show({
        type: 'success',
        text1: 'Berhasil',
        text2: message,
      });
      setTimeout(() => {
        navigation.navigate('Home');
      }, 800);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Gagal Login',
      });
      console.error(error);
    }
  };
  return (
    <ImageBackground
      source={require('../../assets/img/Mikrotrans.png')}
      style={styles.container}>
      <View style={styles.contain}>
        <View style={styles.header}>
          <Image
            resizeMode="contain"
            style={styles.logoHeader}
            source={require('../../assets/img/LogoLogin.png')}
          />
        </View>
        <GlobalText typeText="bold" size={toDp(20)} style={styles.textTitle}>
          NIK
        </GlobalText>
        <TextInput
          style={styles.inputText}
          // onFocus={handleFocus}
          // onBlur={handleBlur}
          value={nik}
          onChangeText={setNik}
          placeholder="Masukkan NIK"
        />
        <View style={styles.spacer} />
        <GlobalText typeText="bold" size={toDp(20)} style={styles.textTitle}>
          Sandi
        </GlobalText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TextInput
            style={styles.inputText}
            // onFocus={handleFocus}
            // onBlur={handleBlur}
            value={password}
            onChangeText={setPassword}
            placeholder="Masukkan Sandi"
            secureTextEntry={!visiblePassword}
          />
          <Pressable
            style={{position: 'absolute', right: toDp(18)}}
            onPress={() => setVisiblePassword(!visiblePassword)}>
            {visiblePassword ? (
              <Eye
                size={toDp(20)}
                color="#16509B"
                onPress={() => setVisiblePassword(!visiblePassword)}
              />
            ) : (
              <EyeOff
                size={toDp(20)}
                color="#16509B"
                onPress={() => setVisiblePassword(!visiblePassword)}
              />
            )}
          </Pressable>
        </View>

        <View style={styles.spacer} />
        <View style={styles.spacer} />
        <View style={styles.rowBtn}>
          <Pressable onPress={handleLoginPost} style={styles.btnLogin}>
            <GlobalText
              typeText="regular"
              size={toDp(14)}
              style={styles.txtBtn}>
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                'Masuk'
              )}
            </GlobalText>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: toDp(16),
    justifyContent: 'center',
  },
  contain: {
    // justifyContent: 'center',
    // flex: 1,
    // borderWidth: toDp(1),
    height: Dimensions.get('window').height / 1.5,
    marginTop: toDp(40),
  },
  header: {
    alignItems: 'center',
    // paddingTop: toDp(20),
    // borderWidth: toDp(1),
  },
  formBox: {
    width: toDp(320),
  },
  inputText: {
    borderWidth: toDp(1),
    borderColor: '#6D6D6D',
    borderRadius: toDp(25),
    height: toDp(42),
    backgroundColor: '#FFFFFF80',
    fontSize: toDp(12),
    paddingLeft: toDp(12),
    fontFamily: 'PlusJakartaSans-Regular',
    width: toDp(320),
  },
  textTitle: {
    color: '#06367C',
    marginBottom: toDp(10),
  },
  spacer: {
    marginTop: toDp(10),
  },
  rowBtn: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    width: toDp(320),
  },
  btnLoginLinear: {
    borderRadius: toDp(8),
    padding: toDp(8),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 2,

    width: toDp(148),
  },
  txtBtn: {
    color: '#ffff',
  },
  btnLogin: {
    alignItems: 'center',
    borderRadius: toDp(25),
    width: '100%',
    height: toDp(40),
    backgroundColor: '#308CF6',
    justifyContent: 'center',
  },
  logoHeader: {
    width: toDp(199),
    height: toDp(90),
  },
  title: {
    fontSize: toDp(22),
    fontFamily: 'Inter-Bold',
    color: '#FFFF',
  },
});

export default LoginScreen;
