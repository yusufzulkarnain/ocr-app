import React, {useEffect, useState} from 'react';
import {View, Text, Button, PermissionsAndroid, Platform} from 'react-native';
// import BlePeripheral from 'react-native-ble-peripheral';

const SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
const CHARACTERISTIC_UUID = 'abcd1234-5678-90ab-cdef-1234567890ab';

const BlePeripheralExample = () => {
  const [count, setCount] = useState(0);

  // useEffect(() => {
  //   const setup = async () => {
  //     if (Platform.OS === 'android') {
  //       await PermissionsAndroid.requestMultiple([
  //         PermissionsAndroid.PERMISSIONS.BLUETOOTH,
  //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
  //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       ]);
  //     }

  //     await BlePeripheral.setName('MyBLEDevice');

  //     await BlePeripheral.addService({
  //       uuid: SERVICE_UUID,
  //       characteristics: [
  //         {
  //           uuid: CHARACTERISTIC_UUID,
  //           properties: ['read', 'notify'],
  //           permissions: ['readable'],
  //           value: 'Hello from React Native!',
  //         },
  //       ],
  //     });

  //     await BlePeripheral.start();
  //     console.log('🔊 BLE Peripheral started');
  //   };

  //   setup();

  //   return () => {
  //     BlePeripheral.stop();
  //     console.log('🛑 BLE Peripheral stopped');
  //   };
  // }, []);

  // const sendData = async () => {
  //   const newValue = `Counter: ${count + 1}`;
  //   await BlePeripheral.updateValue(CHARACTERISTIC_UUID, newValue);
  //   setCount(count + 1);
  //   console.log('📤 Sent:', newValue);
  // };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>BLE Peripheral Active</Text>
      {/* <Button title="Send Data" onPress={sendData} /> */}
    </View>
  );
};

export default BlePeripheralExample;
