import React from 'react';
import {TouchableOpacity, StyleSheet, View, StatusBar} from 'react-native';
import {toDp} from '../hepers/PercentageToDp';
import GlobalText from './globalText';
import moment from 'moment';
import {LogOut} from 'lucide-react-native';
import 'moment/locale/id';
moment.locale('id'); // set locale ke Indonesia

// Tipe untuk properti komponen
type HeaderProps = {
  title: string;
  logOut: () => void;
};

const Headers: React.FC<HeaderProps> = ({title, logOut}) => {
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
  headerTitle: {
    color: '#FFFFFF',
    marginBottom: toDp(8),
  },
  headerTextDate: {
    color: '#FFFFFF',
  },
  contentHeaders: {
    paddingHorizontal: toDp(16),
    paddingBottom: toDp(16),
    paddingTop: (StatusBar.currentHeight ?? 0) + toDp(8),
  },
  logout: {
    marginRight: toDp(12),
  },
  title: {
    color: '#FFFFFF',
  },
});

export default Headers;
