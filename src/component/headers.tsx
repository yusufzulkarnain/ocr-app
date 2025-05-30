import React from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {toDp} from '../hepers/PercentageToDp';
import GlobalText from './globalText';
import moment from 'moment';
import {LogOut} from 'lucide-react-native';
import 'moment/locale/id';

// Tipe untuk properti komponen
type HeaderProps = {
  title: string;
  logOut: () => void;
};

const Headers: React.FC<HeaderProps> = ({title, logOut}) => {
  const currentDate = new Date();
  const formattedDate = moment(currentDate).format('DD MMMM YYYY');
  return (
    <View style={styles.container}>
      <View style={styles.contentHeaders}>
        <GlobalText typeText="bold" size={14} style={styles.headerTitle}>
          {title}
        </GlobalText>
        <GlobalText typeText="regular" size={12} style={styles.headerTextDate}>
          {formattedDate}
        </GlobalText>
      </View>
      <TouchableOpacity style={styles.logout} onPress={logOut}>
        <LogOut color={'#06367C'} size={18} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#06367C',
    marginBottom: toDp(8),
  },
  headerTextDate: {
    color: '#000000',
  },
  contentHeaders: {
    padding: toDp(16),
  },
  logout: {
    marginRight: toDp(12),
  },
});

export default Headers;
