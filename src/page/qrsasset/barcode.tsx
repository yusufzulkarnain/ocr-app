import React from 'react';
import {View, StyleSheet} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Headers from '../../component/headers';
import GlobalText from '../../component/globalText';
import moment from 'moment';
import 'moment/locale/id';

moment.locale('id');
// Tipe untuk properti navigation
type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const BarcodeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [state, setState] = React.useState({
    isStayIn: false,
  });

  return (
    <View style={styles.container}>
      <Headers title="PT Transportasi Jakarta" logOut={() => {}} />
      <View>
        <GlobalText>halaman Barcode</GlobalText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
});

export default BarcodeScreen;
