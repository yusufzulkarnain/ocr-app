import React from 'react';
import {TouchableOpacity, StyleSheet, View, StatusBar, Image} from 'react-native';
import {toDp} from '../hepers/PercentageToDp';
import GlobalText from './globalText';
import moment from 'moment';
import {LogOut} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { images } from '../assets';
// import 'moment/locale/id';
moment.locale('id'); // set locale ke Indonesia

// Tipe untuk properti komponen
type HeaderProps = {
  title: string;
  logOut: () => void;
};

export const Headers: React.FC<HeaderProps> = ({title, logOut}) => {
  const currentDate = new Date();
  const formattedDate = moment(currentDate).format('dddd, DD MMMM YYYY');
  return (
    <View style={styles.container}>
      <View style={styles.contentHeaders}>
        <GlobalText typeText="bold" size={16} style={styles.headerTitle}>
          {title}
        </GlobalText>
        <GlobalText typeText="regular" size={14} style={styles.headerTextDate}>
          {formattedDate}
        </GlobalText>
      </View>
      <GlobalText typeText="regular" size={12} style={styles.title}>
        v1.0.2
      </GlobalText>
      {/* <TouchableOpacity style={styles.logout} onPress={logOut}>
        <LogOut color={'#06367C'} size={18} />
      </TouchableOpacity> */}
    </View>
  );
};

export const HeadersNfc: React.FC<HeaderProps> = ({title, logOut}) => {
  const currentDate = new Date();
  const formattedDate = moment(currentDate).format('dddd, DD MMMM YYYY');
  return (
    <LinearGradient colors={['#132440', '#1d345f']} style={styles.containerHeaderNfc}>
      <Image source={images.gub} style={styles.gub} resizeMode='contain'/>
      <View style={[styles.contentHeadersNfc, {height: toDp(174), justifyContent: 'center', alignItems: 'center'}]}>
        <GlobalText typeText="bold" size={16} style={styles.headerTitleNfc}>
          {/* {title} */}
          Kartu Huma
        </GlobalText>
        <GlobalText typeText="bold" size={16} style={styles.headerTitleNfc}>
          {/* {title} */}
          Betang Sejahtera
        </GlobalText>
        {/* <GlobalText typeText="regular" size={10} style={styles.headerTextDate}>
          {formattedDate}
        </GlobalText> */}
      </View>
      <Image source={images.wagub} style={styles.wagub} resizeMode='contain'/>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#06367C',
    elevation: toDp(2),
    paddingRight: toDp(12),
    borderBottomLeftRadius: toDp(16),
    borderBottomRightRadius: toDp(16),
  },
  containerHeaderNfc: {
    width: '100%',
    alignItems: 'center',
    elevation: toDp(4),
    borderBottomLeftRadius: toDp(16),
    borderBottomRightRadius: toDp(16),
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    marginBottom: toDp(8),
  },
  headerTitleNfc: {
    color: '#FFFFFF',
  },
  headerTextDate: {
    color: '#FFFFFF',
  },
  contentHeaders: {
    paddingHorizontal: toDp(16),
    paddingBottom: toDp(16),
    paddingTop: (StatusBar.currentHeight ?? 0) + toDp(8),
  },
  contentHeadersNfc: {
    paddingHorizontal: toDp(16),
    paddingBottom: toDp(16),
    // paddingTop: (StatusBar.currentHeight ?? 0) + toDp(8),
  },
  logout: {
    marginRight: toDp(12),
  },
  title: {
    color: '#FFFFFF',
  },
  gub: {
    width: toDp(130),
    height: toDp(130),
    position: 'absolute',
    bottom: toDp(0),
    left: toDp(-30),
  },
  wagub: {
    width: toDp(130),
    height: toDp(130),
    position: 'absolute',
    bottom: toDp(0),
    right: toDp(-30),
  }
});

// export default Headers;
