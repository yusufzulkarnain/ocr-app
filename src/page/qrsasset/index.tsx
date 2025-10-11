import React, {useEffect, useRef, useState} from 'react';
import {
  Linking,
  TextInput,
  View,
  StyleSheet,
  AppState,
  AppStateStatus,
  Image,
} from 'react-native';
import {images} from '../../assets';
import {toDp} from '../../hepers/PercentageToDp';
import GlobalText from '../../component/globalText';
import Modal from 'react-native-modal';
import {useFocusEffect} from '@react-navigation/native';
import {Keyboard} from 'react-native';
import {useStatusBar} from '../../hooks/useStatusBar';

const ScannerScreen = () => {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const appState = useRef(AppState.currentState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);
  useStatusBar({
    backgroundColor: '#06367C',
    barStyle: 'light-content',
    translucent: true,
  });
  useFocusEffect(
    React.useCallback(() => {
      // Kadang scanner butuh delay agar bisa "rebind" input
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 500); // Bisa coba 300–1000 tergantung device

      return () => {
        clearTimeout(timeout);
      };
    }, []),
  );

  useEffect(() => {
    inputRef.current?.focus();

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      setTimeout(() => {
        inputRef.current?.blur();
        inputRef.current?.focus();
      }, 500); // Delay penting agar scanner bisa attach
    }

    appState.current = nextAppState;
  };

  // const onChangeText = (input: string) => {
  //   console.log('Input:', input);
  //   setText(input);
  //   setLoading(true);

  //   if (timeoutRef.current) clearTimeout(timeoutRef.current);

  //   timeoutRef.current = setTimeout(() => {
  //     const cleaned = input.trim().replace(/[\n\r]/g, '');

  //     if (cleaned.length > 5) {
  //       Linking.openURL(
  //         `https://aset.transjakarta.co.id/data/${cleaned}`,
  //       ).catch(err => console.warn('URL Error:', err));

  //       setTimeout(() => {
  //         setText('');
  //         setLoading(false);
  //         inputRef.current?.focus();
  //       }, 500);
  //     }
  //   }, 300);
  // };

  const onChangeText = (input: string) => {
    console.log('Input:', input);
    setText(input);

    // Bersihkan timeout sebelumnya (untuk debounce)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Set debounce timeout
    timeoutRef.current = setTimeout(() => {
      const cleaned = input.trim().replace(/[\n\r]/g, '');

      if (cleaned.length > 5) {
        setLoading(true); // ⏳ Tampilkan modal loading sebelum proses openURL

        // Tambahkan delay agar modal sempat terlihat (opsional tapi disarankan)
        setTimeout(() => {
          Linking.openURL(`https://aset.transjakarta.co.id/data/${cleaned}`)
            .catch(err => console.warn('URL Error:', err))
            .finally(() => {
              // Reset input & loading setelah delay
              setTimeout(() => {
                setText('');
                setLoading(false);
                inputRef.current?.focus();
              }, 300); // beri waktu sedikit untuk user lihat transisi
            });
        }, 100); // delay kecil untuk pastikan modal tampil sebelum openURL
      }
    }, 300);
  };

  return (
    <View style={styles.container}>
      <Modal
        isVisible={loading}
        style={{justifyContent: 'center', alignItems: 'center'}}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.5}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: toDp(12),
            justifyContent: 'center',
            alignItems: 'center',
            padding: toDp(12),
          }}>
          <Image source={images.hourglass} style={styles.loadingGif} />
        </View>
      </Modal>
      <View style={styles.rowGif}>
        <Image source={images.barcode_gif} style={styles.gifImage} />
        <GlobalText size={toDp(16)} typeText="regular">
          Pindai QR Asset Dengan Scanner
        </GlobalText>
      </View>

      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Scan barcode..."
        value={text}
        onChangeText={onChangeText}
        blurOnSubmit={false}
        showSoftInputOnFocus={false}
        keyboardType="default"
        autoFocus
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    // borderColor: '#000',
    // borderWidth: 1,
    // fontSize: 18,
    padding: 10,
    width: 1,
    height: 1,
    opacity: 0,
  },
  gifImage: {
    width: toDp(200),
    height: toDp(200),
    // alignSelf: 'center',
  },
  rowGif: {
    alignItems: 'center',
  },
  loadingGif: {
    width: toDp(60),
    height: toDp(60),
  },
});

export default ScannerScreen;
