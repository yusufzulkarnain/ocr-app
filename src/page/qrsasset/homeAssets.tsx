import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Headers from '../../component/headers';
import GlobalText from '../../component/globalText';
import moment from 'moment';
import 'moment/locale/id';
import {toDp} from '../../hepers/PercentageToDp';
import axios from 'axios';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  FlipInEasyX,
  FlipInEasyY,
  SlideInLeft,
} from 'react-native-reanimated';
import {useFocusEffect} from '@react-navigation/native';
import {images} from '../../assets';
import {Scroll} from 'lucide-react-native';
import {Rows3, LayoutGrid, LayoutList} from 'lucide-react-native';

moment.locale('id');
type HomeScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

interface AssetData {
  name: string;
  value: number;
}

const HomeAssetScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [state, setState] = React.useState({
    totalAsset: 0,
    loading: false,
    dataAsset: [] as AssetData[],
    layout: 'grid',
  });

  //   React.useEffect(() => {
  //     getData();
  //   }, []);
  useFocusEffect(
    React.useCallback(() => {
      getData();
      setState(prev => ({...prev, layout: 'grid'}));
    }, []),
  );

  const getData = async () => {
    setState(prev => ({...prev, loading: true}));
    try {
      const response = await axios.get(
        'https://aset.transjakarta.co.id/antarmuka',
      );

      const dataObject = response?.data?.data || {};

      const array = Object.entries(dataObject).map(([key, value]) => ({
        name: key,
        value: Number(value),
      }));

      setState(prev => ({...prev, dataAsset: array}));
      console.log('Response data:', array);
      setState(prev => ({...prev, loading: false}));
      return array;
    } catch (error) {
      setState(prev => ({...prev, loading: false}));
      console.error('Error getData:', error);
      throw error;
    }
  };

  const handleLayoutChange = (layout: string) => {
    setState(prev => ({...prev, layout}));
  };

  return (
    <>
      <Headers title="TJ-ASSET" logOut={() => {}} />
      <View style={styles.container}>
        {state.loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={images.hourglass} style={styles.loadingGif} />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: toDp(85),
              alignItems: 'center',
              paddingTop: toDp(12),
            }}>
            <View>
              <View
                style={[
                  styles.rowTitleDaftarAsset,
                  {paddingHorizontal: state.layout === 'grid' ? toDp(16) : 0},
                ]}>
                <GlobalText
                  size={toDp(18)}
                  typeText="bold"
                  style={{color: '#0F172A', marginBottom: toDp(12)}}>
                  Daftar Asset
                </GlobalText>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => handleLayoutChange('list')}
                    style={{
                      borderWidth: toDp(1),
                      borderColor:
                        state.layout === 'grid' ? '#5B6C83' : '#16509B',
                      paddingHorizontal: toDp(8),
                      paddingVertical: toDp(4),
                      borderTopLeftRadius: toDp(4),
                      borderBottomLeftRadius: toDp(4),
                      backgroundColor:
                        state.layout === 'grid' ? '#FFFFFF' : '#16509B',
                    }}>
                    <LayoutList
                      size={20}
                      color={state.layout === 'grid' ? '#5B6C83' : '#FFFFFF'}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleLayoutChange('grid')}
                    style={{
                      borderWidth: toDp(1),
                      borderColor:
                        state.layout === 'grid' ? '#16509B' : '#5B6C83',
                      paddingHorizontal: toDp(8),
                      paddingVertical: toDp(4),
                      borderTopRightRadius: toDp(4),
                      borderBottomRightRadius: toDp(4),
                      borderLeftWidth: toDp(0),
                      backgroundColor:
                        state.layout === 'grid' ? '#16509B' : '#FFFFFF',
                    }}>
                    <LayoutGrid
                      size={20}
                      color={state.layout === 'grid' ? '#FFFFFF' : '#5B6C83'}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {state.layout === 'grid' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    // paddingHorizontal: toDp(16),
                    // justifyContent: 'center',
                    marginTop: toDp(4),
                    gap: toDp(8),
                    justifyContent: 'center',
                  }}>
                  {state.dataAsset.map((item, index) => (
                    <Animated.View
                      key={index}
                      style={{position: 'relative'}}
                      entering={FlipInEasyY.delay(index * 200)}>
                      <View
                        style={{
                          width: toDp(100),
                          height: toDp(80),
                          // paddingVertical: toDp(12),
                          borderRadius: toDp(4),
                          backgroundColor: 'white',
                          elevation: toDp(4),
                          justifyContent: 'center',
                          // paddingHorizontal: toDp(8),
                          alignItems: 'center',
                        }}>
                        <GlobalText
                          size={toDp(12)}
                          typeText="regular"
                          style={{color: '#0F172A'}}>
                          {item.name}
                        </GlobalText>
                        <View style={{marginTop: toDp(4)}}>
                          <GlobalText
                            size={toDp(14)}
                            typeText="bold"
                            style={{color: '#06367C'}}>
                            {item.value}
                          </GlobalText>
                        </View>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              ) : (
                <View style={{marginTop: toDp(6)}}>
                  {state.dataAsset.map((item, index) => (
                    <Animated.View
                      key={`${item.name}-${item.value}-${Date.now() + index}`}
                      style={styles.rowListAsset}
                      entering={FlipInEasyX.delay(index * 100)}>
                      <GlobalText
                        size={toDp(18)}
                        typeText="regular"
                        style={{color: '#0F172A'}}>
                        {item.name}
                      </GlobalText>
                      <View style={styles.boxCount}>
                        <GlobalText
                          size={toDp(14)}
                          typeText="bold"
                          style={{color: '#0F172A'}}>
                          {item.value}
                        </GlobalText>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              )}

              {/* {state.dataAsset.map((item, index) => (
                <Animated.View
                  key={`${item.name}-${item.value}-${Date.now() + index}`}
                  style={styles.rowListAsset}
                  entering={FlipInEasyX.delay(index * 100)}>
                  <GlobalText
                    size={toDp(18)}
                    typeText="regular"
                    style={{color: '#0F172A'}}>
                    {item.name}
                  </GlobalText>
                  <View style={styles.boxCount}>
                    <GlobalText
                      size={toDp(14)}
                      typeText="bold"
                      style={{color: '#0F172A'}}>
                      {item.value}
                    </GlobalText>
                  </View>
                </Animated.View>
              ))} */}
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  rowListAsset: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingHorizontal: toDp(16),
    // paddingVertical: toDp(12),
    padding: toDp(12),
    borderWidth: toDp(1),
    marginBottom: toDp(10),
    width: toDp(340),
    borderRadius: toDp(8),
    backgroundColor: '#FFFFFF',
    // elevation: toDp(1),
    borderColor: '#5B6C83',
    alignItems: 'center',
  },
  loadingGif: {
    width: toDp(50),
    height: toDp(50),
  },
  boxCount: {
    borderWidth: toDp(1),
    borderColor: '#5B6C83',
    borderRadius: toDp(4),
    paddingVertical: toDp(4),
    backgroundColor: '#F2F7FC',
    alignItems: 'center',
    width: toDp(40),
  },
  rowTitleDaftarAsset: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default HomeAssetScreen;
