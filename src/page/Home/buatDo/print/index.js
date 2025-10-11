import React, {Component} from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  DeviceEventEmitter,
  NativeEventEmitter,
  Switch,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} from 'react-native';
// import {
//   BluetoothEscposPrinter,
//   BluetoothManager,
//   BluetoothTscPrinter,
// } from 'react-native-bluetooth-escpos-printer';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
} from 'react-native-thermal-receipt-printer';
import moment from 'moment';
// import EscPos from './escpos';
// import Tsc from './tsc';

var {height, width} = Dimensions.get('window');
export default class Print extends Component {
  _listeners = [];

  constructor(props) {
    super();
    this.state = {
      devices: null,
      pairedDs: [],
      foundDs: [],
      bleOpend: false,
      loading: true,
      boundAddress: '',
      debugMsg: '',
      data: props.route.params?.data || {},
    };
  }

  componentDidMount() {
    console.log('ini props', this.state.data);
    //alert(BluetoothManager)
    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        this.setState({
          bleOpend: Boolean(enabled),
          loading: false,
        });
      },
      err => {
        err;
      },
    );

    if (Platform.OS === 'ios') {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      this._listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          rsp => {
            this._deviceAlreadPaired(rsp);
          },
        ),
      );
      this._listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND,
          rsp => {
            this._deviceFoundEvent(rsp);
          },
        ),
      );
      this._listeners.push(
        bluetoothManagerEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST,
          () => {
            this.setState({
              name: '',
              boundAddress: '',
            });
          },
        ),
      );
    } else if (Platform.OS === 'android') {
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
          rsp => {
            this._deviceAlreadPaired(rsp);
          },
        ),
      );
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_DEVICE_FOUND,
          rsp => {
            this._deviceFoundEvent(rsp);
          },
        ),
      );
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_CONNECTION_LOST,
          () => {
            this.setState({
              name: '',
              boundAddress: '',
            });
          },
        ),
      );
      this._listeners.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
          () => {
            ToastAndroid.show(
              'Device Not Support Bluetooth !',
              ToastAndroid.LONG,
            );
          },
        ),
      );
    }
  }

  componentWillUnmount() {
    //for (let ls in this._listeners) {
    //    this._listeners[ls].remove();
    //}
  }

  _deviceAlreadPaired(rsp) {
    var ds = null;
    if (typeof rsp.devices === 'object') {
      ds = rsp.devices;
    } else {
      try {
        ds = JSON.parse(rsp.devices);
      } catch (e) {}
    }
    if (ds && ds.length) {
      let pared = this.state.pairedDs;
      pared = pared.concat(ds || []);
      this.setState({
        pairedDs: pared,
      });
    }
  }

  _deviceFoundEvent(rsp) {
    //alert(JSON.stringify(rsp))
    var r = null;
    try {
      if (typeof rsp.device === 'object') {
        r = rsp.device;
      } else {
        r = JSON.parse(rsp.device);
      }
    } catch (e) {
      //alert(e.message);
      //ignore
    }
    //alert('f')
    if (r) {
      let found = this.state.foundDs || [];
      if (found.findIndex) {
        let duplicated = found.findIndex(function (x) {
          return x.address == r.address;
        });
        //CHECK DEPLICATED HERE...
        if (duplicated == -1) {
          found.push(r);
          this.setState({
            foundDs: found,
          });
        }
      }
    }
  }

  _renderRow(rows) {
    let items = [];
    for (let i in rows) {
      let row = rows[i];
      if (row.address) {
        items.push(
          <TouchableOpacity
            key={new Date().getTime() + i}
            style={styles.wtf}
            onPress={() => {
              this.setState({
                loading: true,
              });
              BluetoothManager.connect(row.address).then(
                s => {
                  this.setState({
                    loading: false,
                    boundAddress: row.address,
                    name: row.name || 'UNKNOWN',
                  });
                },
                e => {
                  this.setState({
                    loading: false,
                  });
                  alert(e);
                },
              );
            }}>
            <Text style={styles.name}>{row.name || 'UNKNOWN'}</Text>
            <Text style={styles.address}>{row.address}</Text>
          </TouchableOpacity>,
        );
      }
    }
    return items;
  }

  _printText = async () => {
    try {
      const dateTime = moment().format('YYYY-MM-DD HH:mm');
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );

      // Header
      await BluetoothEscposPrinter.printText('[TRANSJAKARTA]\n', {
        fonttype: 1,
        widthtimes: 1,
        heighttimes: 1,
      });

      await BluetoothEscposPrinter.printText('DRIVING ORDER\n', {
        fonttype: 1,
        widthtimes: 1,
        heighttimes: 1,
      });

      // Tanggal dan waktu
      await BluetoothEscposPrinter.printText(`${dateTime}\n\n`, {});
      // Align left untuk detail
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );

      await BluetoothEscposPrinter.printQRCode(
        `${this.state.data.kode_do}`,
        300, // Ukuran QR Code
        BluetoothEscposPrinter.ERROR_CORRECTION.M,
      );
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.LEFT,
      );

      // Kode DO
      await BluetoothEscposPrinter.printText(`${this.state.data.kode_do}\n`, {
        fonttype: 1,
        widthtimes: 1,
        heighttimes: 1,
      });
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.printText(`${dateTime}\n\n`, {});
      await BluetoothEscposPrinter.printText(`${this.state.data.bus_name}\n`, {
        fonttype: 1,
        widthtimes: 1,
        heighttimes: 1,
      });
      // Detail informasi
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.LEFT,
      );
      await BluetoothEscposPrinter.printText('Rute    : test\n', {});
      await BluetoothEscposPrinter.printText(
        `Lokasi  : ${this.state.data.rute}\n`,
        {},
      );
      await BluetoothEscposPrinter.printText(
        `Odometer: ${this.state.data.km}\n`,
        {},
      );
      await BluetoothEscposPrinter.printText(
        `Pramudi : ${this.state.data.pramudi}/${this.state.data.nik}\n\n`,
        {},
      );

      // Rute tujuan
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );

      // await BluetoothEscposPrinter.printText('KALIDERES - MUARA ANGKE\n\n', {
      //   fonttype: 1,
      //   widthtimes: 1,
      //   heighttimes: 1,
      // });

      // Petugas
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.LEFT,
      );
      await BluetoothEscposPrinter.printText('Petugas : 102131\n', {});
      await BluetoothEscposPrinter.printText('JHON DOE\n\n', {});

      // Footer
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.printText('=== STRUK PRAMUDI ===\n\n', {
        fonttype: 1,
        widthtimes: 1,
        heighttimes: 1,
      });

      // Versi
      await BluetoothEscposPrinter.printText('ver1.0.0\n\n', {});

      // Beberapa baris kosong
      await BluetoothEscposPrinter.printText('\n\n\n', {});

      // Potong kertas (jika didukung printer)
      await BluetoothEscposPrinter.printText('\x1B\x69', {});

      console.log('Print Success!');
    } catch (e) {
      console.error('Print Error:', e.message);
    }
  };

  // _printText = async () => {
  //   try {
  //     // Align left untuk teks
  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.LEFT,
  //     );

  //     // Kode DO
  //     await BluetoothEscposPrinter.printText('Kode DO:\n', {
  //       fonttype: 1,
  //       widthtimes: 1,
  //       heighttimes: 1,
  //     });
  //     await BluetoothEscposPrinter.printText('PRM-2038-GF7S6QL2012D\n\n', {
  //       fonttype: 1,
  //       widthtimes: 1,
  //       heighttimes: 1,
  //     });

  //     // Nomor Bus dan Rute
  //     await BluetoothEscposPrinter.printText('Nomor Bus: PRM 2038\n', {});
  //     await BluetoothEscposPrinter.printText('Rute     : JAK43B\n\n', {});

  //     // Cetak QR Code - pastikan ukurannya besar dan di tengah
  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     );
  //     await BluetoothEscposPrinter.printQRCode(
  //       'PRM-2038-GF7S6QL2012D',
  //       250, // Ukuran QR diperbesar
  //       BluetoothEscposPrinter.ERROR_CORRECTION.M, // Koreksi kesalahan menengah
  //     );

  //     // Beberapa baris kosong (untuk memberi ruang di bawah QR)
  //     await BluetoothEscposPrinter.printText('\n\n\n', {});

  //     // Potong kertas (jika didukung printer)
  //     await BluetoothEscposPrinter.printText('\x1B\x69', {}); // ESC i (auto-cut command)

  //     console.log('Print Success!');
  //   } catch (e) {
  //     console.error('Print Error:', e.message);
  //   }
  // };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>{this.state.debugMsg}</Text>
        <Text style={styles.title}>
          Blutooth Opended:{this.state.bleOpend ? 'true' : 'false'}{' '}
          <Text>Open BLE Before Scanning</Text>{' '}
        </Text>
        <View>
          <Switch
            value={this.state.bleOpend}
            onValueChange={v => {
              this.setState({
                loading: true,
              });
              if (!v) {
                BluetoothManager.disableBluetooth().then(
                  () => {
                    this.setState({
                      bleOpend: false,
                      loading: false,
                      foundDs: [],
                      pairedDs: [],
                    });
                  },
                  err => {
                    alert(err);
                  },
                );
              } else {
                BluetoothManager.enableBluetooth().then(
                  r => {
                    var paired = [];
                    if (r && r.length > 0) {
                      for (var i = 0; i < r.length; i++) {
                        try {
                          paired.push(JSON.parse(r[i]));
                        } catch (e) {
                          //ignore
                        }
                      }
                    }
                    this.setState({
                      bleOpend: true,
                      loading: false,
                      pairedDs: paired,
                    });
                  },
                  err => {
                    this.setState({
                      loading: false,
                    });
                    alert(err);
                  },
                );
              }
            }}
          />
          <Button
            disabled={this.state.loading || !this.state.bleOpend}
            onPress={() => {
              this._scan();
            }}
            title="Scan"
          />
        </View>
        <Text style={styles.title}>
          Connected:
          <Text style={{color: 'blue'}}>
            {!this.state.name ? 'No Devices' : this.state.name}
          </Text>
        </Text>
        {/* <Text style={styles.title}>Found(tap to connect):</Text> */}
        {/* {this.state.loading ? <ActivityIndicator animating={true} /> : null} */}
        {/* <View style={{flex: 1, flexDirection: 'column'}}>
          {this._renderRow(this.state.foundDs)}
        </View> */}
        <Text style={styles.title}>Paired:</Text>
        {this.state.loading ? <ActivityIndicator animating={true} /> : null}
        <View style={{flex: 1, flexDirection: 'column'}}>
          {this._renderRow(this.state.pairedDs)}
        </View>
        <Button
          disabled={!this.state.boundAddress}
          onPress={() => this._printText()}
          title="Print Text Simple"
        />
      </ScrollView>
    );
  }

  _selfTest() {
    this.setState(
      {
        loading: true,
      },
      () => {
        BluetoothEscposPrinter.selfTest(() => {});

        this.setState({
          loading: false,
        });
      },
    );
  }

  _scan() {
    this.setState({
      loading: true,
    });
    BluetoothManager.scanDevices().then(
      s => {
        var ss = s;
        var found = ss.found;
        try {
          found = JSON.parse(found); //@FIX_it: the parse action too weired..
        } catch (e) {
          //ignore
        }
        var fds = this.state.foundDs;
        if (found && found.length) {
          fds = found;
        }
        console.log('fds');
        console.log(JSON.stringify(fds));
        this.setState({
          foundDs: fds,
          loading: false,
        });
      },
      er => {
        this.setState({
          loading: false,
        });
        alert('error' + JSON.stringify(er));
      },
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  title: {
    width: width,
    backgroundColor: '#eee',
    color: '#232323',
    paddingLeft: 8,
    paddingVertical: 4,
    textAlign: 'left',
  },
  wtf: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    textAlign: 'left',
  },
  address: {
    flex: 1,
    textAlign: 'right',
  },
});
