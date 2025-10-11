import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DonutChart from './indexEx';
import AnimatedDonutChart from '../../component/AnimatedDonutChart';

const DonutChartExample: React.FC = () => {
  const [currentValue, setCurrentValue] = useState(30);

  return (
    <View style={styles.container}>
      <AnimatedDonutChart
        value={currentValue}
        maxValue={100}
        radius={100}
        strokeWidth={20}
        colorBlue={'#08448F'}
        colorRed={'#CFCFCF'}
        gapDegree={15}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DonutChartExample;
