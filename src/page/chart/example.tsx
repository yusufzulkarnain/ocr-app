import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DonutChart from './indexEx';

const DonutChartExample: React.FC = () => {
  const [currentValue, setCurrentValue] = useState(30);
  const maxValue = 100;

  const examples = [
    {value: 25, maxValue: 100, title: '25% - Dalam Range Biru'},
    {value: 50, maxValue: 100, title: '50% - Tepat Setengah (Biru)'},
    {value: 75, maxValue: 100, title: '75% - Melebihi Biru (Biru + Merah)'},
    {value: 90, maxValue: 100, title: '90% - Hampir Penuh'},
    {value: 30, maxValue: 200, title: '30/200 - Nilai Dinamis'},
    {value: 150, maxValue: 200, title: '150/200 - Melebihi Setengah'},
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Donut Chart Examples</Text>

      {/* Interactive Example */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interactive Example</Text>
        <DonutChart
          value={currentValue}
          maxValue={maxValue}
          size={250}
          strokeWidth={25}
          gap={15}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCurrentValue(Math.max(0, currentValue - 10))}>
            <Text style={styles.buttonText}>-10</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              setCurrentValue(Math.min(maxValue, currentValue + 10))
            }>
            <Text style={styles.buttonText}>+10</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.valueText}>
          Current Value: {currentValue}/{maxValue}
        </Text>
      </View>

      {/* Static Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Static Examples</Text>
        {examples.map((example, index) => (
          <View key={index} style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>{example.title}</Text>
            <DonutChart
              value={example.value}
              maxValue={example.maxValue}
              size={150}
              strokeWidth={15}
              gap={8}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 30,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 20,
  },
  button: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  valueText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  exampleContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#555',
  },
});

export default DonutChartExample;
