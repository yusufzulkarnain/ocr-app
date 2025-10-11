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
  ToastAndroid,
  Alert,
  ActivityIndicator,
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
import {postDataKoperasi} from '../../../hepers/Api';
import {set} from 'date-fns';

type LoanScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

interface LoanForm {
  amount: string;
  duration: string;
  purpose: string;
  income: string;
  occupation: string;
}

const MIN_AMOUNT = 500000; // 500 ribu
const MAX_AMOUNT = 10000000; // 10 juta
const STEP_AMOUNT = 500000; // 500 ribu

const LoanScreen: React.FC<LoanScreenProps> = ({navigation}) => {
  // Use the status bar hook
  useStatusBar({
    barStyle: 'dark-content',
    backgroundColor: '#FFFFFF',
    translucent: true,
  });

  const [form, setForm] = React.useState<LoanForm>({
    amount: MIN_AMOUNT.toString(),
    duration: '',
    purpose: '',
    income: '',
    occupation: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [userData, setUserData] = React.useState<userInterface | null>(null);
  const [stateCicilan, setStateCicilan] = React.useState({
    cicilanPerbulan: '0',
    tenor: 0,
    pinjaman: '0',
  });

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

  React.useEffect(() => {
    hitungCicilanDinamis(
      Number(form.amount),
      form.duration === '' ? 0 : Number(form.duration),
    );
  }, [form]);

  const getLocalUserData = async () => {
    try {
      const userDataLocal = await getUserData();
      // console.log('userData', userDataLocal);
      setUserData(userDataLocal);
      return userDataLocal;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const handleChange = (field: keyof LoanForm, value: string) => {
    if (field === 'amount' || field === 'income') {
      // Format currency for amount and income fields
      setForm(prev => ({
        ...prev,
        [field]: formatCurrency(value),
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleAmountChange = (value: number) => {
    setForm(prev => ({
      ...prev,
      amount: value.toString(),
    }));
  };

  const hitungCicilanDinamis = (
    totalPinjaman: number,
    lamaPinjaman: number,
  ) => {
    if (!totalPinjaman || !lamaPinjaman) return null;

    const cicilanPerBulan = Math.round(totalPinjaman / lamaPinjaman);

    // Jangan hitung totalPembayaran dari cicilanPerBulan × lamaPinjaman
    // Tapi langsung gunakan totalPinjaman supaya tidak ada selisih
    const totalPembayaran = totalPinjaman;

    const formatRupiah = (angka: number) =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(angka);

    setStateCicilan({
      cicilanPerbulan: formatRupiah(cicilanPerBulan),
      tenor: lamaPinjaman,
      pinjaman: formatRupiah(totalPembayaran),
    });
    return {
      cicilanPerBulan: formatRupiah(cicilanPerBulan),
      lamaPinjaman,
      totalPembayaran: formatRupiah(totalPembayaran),
    };
  };

  const handleSubmit = async () => {
    setLoading(true);
    const obj = {
      no_rek: userData?.no_rek_dki,
      nama: userData?.nama,
      jumlah: unformatCurrency(form.amount),
      jangka_waktu: Number(form.duration),
      tujuan_pinjaman: form.purpose,
      penghasilan: unformatCurrency(form.income),
    };
    console.log('Form Data:', obj);
    try {
      const result = await postDataKoperasi('/pengajuankredit', obj);
      console.log('Result from API', result);
      if (result) {
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: result.message,
        });
        navigation.goBack();
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: result?.error || 'Terjadi kesalahan',
        });
      }
    } catch (error: any) {
      setLoading(false);
      console.log('Register error:', error);
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
        <View style={styles.infoContainer}>
          <GlobalText size={toDp(12)} typeText="regular">
            Pengajuan kredit pinjamana hanya bisa diajukan dengan masa
            keanggotan minimal 5 tahun
          </GlobalText>
        </View>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <GlobalText size={toDp(14)} typeText="bold" style={styles.label}>
                Jumlah Pinjaman
              </GlobalText>
              <View style={styles.sliderContainer}>
                <GlobalText
                  size={toDp(20)}
                  typeText="bold"
                  style={styles.amountText}>
                  Rp {formatCurrency(form.amount)}
                </GlobalText>
                <Slider
                  style={styles.slider}
                  minimumValue={MIN_AMOUNT}
                  maximumValue={MAX_AMOUNT}
                  step={STEP_AMOUNT}
                  value={Number(form.amount)}
                  onValueChange={handleAmountChange}
                  minimumTrackTintColor="#06367C"
                  maximumTrackTintColor="#E0E0E0"
                  thumbTintColor="#06367C"
                />
                <View style={styles.rangeLabels}>
                  <GlobalText size={toDp(12)} style={styles.rangeText}>
                    Rp 500.000
                  </GlobalText>
                  <GlobalText size={toDp(12)} style={styles.rangeText}>
                    Rp 10.000.000
                  </GlobalText>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <GlobalText size={toDp(14)} typeText="bold" style={styles.label}>
                Jangka Waktu (bulan)
              </GlobalText>
              <TextInput
                style={[styles.input, {paddingLeft: toDp(16)}]}
                placeholder="Contoh: 12"
                keyboardType="numeric"
                value={form.duration}
                onChangeText={value => {
                  hitungCicilanDinamis(Number(form.amount), Number(value));
                  handleChange('duration', value);
                }}
              />
              <View style={styles.infoCicilan}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{width: toDp(100)}}>
                    <GlobalText size={toDp(12)} typeText="regular">
                      Cicilan per bulan
                    </GlobalText>
                  </View>
                  <View style={{width: toDp(10)}}>
                    <GlobalText size={toDp(12)} typeText="regular">
                      :
                    </GlobalText>
                  </View>
                  <View style={{width: toDp(180)}}>
                    <GlobalText size={toDp(12)} typeText="bold">
                      {stateCicilan.cicilanPerbulan}
                    </GlobalText>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{width: toDp(100)}}>
                    <GlobalText size={toDp(12)} typeText="regular">
                      Tenor
                    </GlobalText>
                  </View>
                  <View style={{width: toDp(10)}}>
                    <GlobalText size={toDp(12)} typeText="regular">
                      :
                    </GlobalText>
                  </View>
                  <View style={{width: toDp(180)}}>
                    <GlobalText size={toDp(12)} typeText="bold">
                      {stateCicilan.tenor} bln
                    </GlobalText>
                  </View>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{width: toDp(100)}}>
                    <GlobalText size={toDp(12)} typeText="regular">
                      Pinjaman
                    </GlobalText>
                  </View>
                  <View style={{width: toDp(10)}}>
                    <GlobalText size={toDp(12)} typeText="regular">
                      :
                    </GlobalText>
                  </View>
                  <View style={{width: toDp(180)}}>
                    <GlobalText size={toDp(12)} typeText="bold">
                      {stateCicilan.pinjaman}
                    </GlobalText>
                  </View>
                </View>
                <View>
                  <GlobalText
                    size={toDp(11)}
                    typeText="italic"
                    style={{marginTop: toDp(4)}}>
                    Cicilan bulanan dihitung sebesar 10% dari total pinjaman,
                    tanpa bunga. Total pembayaran sama dengan jumlah pinjaman.
                    Lama pinjaman akan otomatis menyesuaikan.
                  </GlobalText>
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <GlobalText size={toDp(14)} typeText="bold" style={styles.label}>
                Tujuan Pinjaman
              </GlobalText>
              <TextInput
                style={[styles.input, {paddingLeft: toDp(16)}]}
                placeholder="Contoh: Modal Usaha"
                value={form.purpose}
                onChangeText={value => handleChange('purpose', value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <GlobalText size={toDp(14)} typeText="bold" style={styles.label}>
                Penghasilan per Bulan
              </GlobalText>
              <View style={styles.inputContainer}>
                <GlobalText
                  size={toDp(14)}
                  typeText="regular"
                  style={styles.prefix}>
                  Rp
                </GlobalText>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={form.income}
                  onChangeText={value => handleChange('income', value)}
                />
              </View>
            </View>

            {/* <View style={styles.inputGroup}>
              <GlobalText size={toDp(14)} typeText="bold" style={styles.label}>
                Pekerjaan
              </GlobalText>
              <TextInput
                style={[styles.input, {paddingLeft: toDp(16)}]}
                placeholder="Contoh: Wiraswasta"
                value={form.occupation}
                onChangeText={value => handleChange('occupation', value)}
              />
            </View> */}
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
                Ajukan Pinjaman
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
  sliderContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: toDp(8),
    padding: toDp(16),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  amountText: {
    color: '#06367C',
    textAlign: 'center',
    marginBottom: toDp(16),
  },
  slider: {
    width: '100%',
    height: toDp(40),
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: toDp(8),
  },
  rangeText: {
    color: '#666666',
  },
  infoContainer: {
    padding: toDp(13),
    alignItems: 'center',
    backgroundColor: '#f06d0640',
    // width: toDp(350),
    // alignSelf: 'center',
  },
  infoCicilan: {
    padding: toDp(12),
    backgroundColor: '#E8F0FF',
    // width: toDp(350),
    // alignSelf: 'center',
  },
});

export default LoanScreen;
