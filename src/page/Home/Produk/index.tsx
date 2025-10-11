import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated as RNAnimated,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
  runOnJS,
  interpolateColor,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import GlobalText from '../../../component/globalText';
import {toDp} from '../../../hepers/PercentageToDp';
import {useStatusBar} from '../../../hooks/useStatusBar';
import {getProduct} from '../../../hepers/Api';
import HapticFeedback from 'react-native-haptic-feedback';
import {CircleX, Search} from 'lucide-react-native';
import CustomModal from '../../../component/customBottomModal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type ProdukScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const HEADER_HEIGHT = Platform.OS === 'ios' ? toDp(100) : toDp(80);
const HEADER_MAX_HEIGHT = toDp(120);
const SEARCH_MAX_WIDTH = Dimensions.get('window').width - toDp(32);
const SEARCH_MIN_WIDTH = toDp(300);

const ProdukScreen: React.FC<ProdukScreenProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const scaleAnim = React.useRef(new RNAnimated.Value(0)).current;
  const fadeAnim = React.useRef(new RNAnimated.Value(0)).current;
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null,
  );
  const [modalBottom, setModalBottom] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Reanimated values
  const scrollY = useSharedValue(0);
  const headerHeight = useSharedValue(HEADER_MAX_HEIGHT);
  const headerBgOpacity = useSharedValue(0);
  const [isScrolled, setIsScrolled] = React.useState(false);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
      headerHeight.value = interpolate(
        scrollY.value,
        [0, HEADER_MAX_HEIGHT - HEADER_HEIGHT],
        [HEADER_MAX_HEIGHT, HEADER_HEIGHT],
        Extrapolate.CLAMP,
      );

      headerBgOpacity.value = interpolate(
        scrollY.value,
        [0, HEADER_MAX_HEIGHT - HEADER_HEIGHT],
        [0, 1],
        Extrapolate.CLAMP,
      );

      const scrolled =
        event.contentOffset.y > HEADER_MAX_HEIGHT - HEADER_HEIGHT;
      if (scrolled !== isScrolled) {
        runOnJS(setIsScrolled)(scrolled);
      }
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: headerHeight.value,
      backgroundColor: interpolateColor(
        headerBgOpacity.value,
        [0, 1],
        ['#FFFFFF', '#06367C'],
      ),
      borderBottomWidth: headerBgOpacity.value,
      borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    };
  });

  const searchBarAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT - HEADER_HEIGHT],
      [0, 1],
      Extrapolate.CLAMP,
    );

    const width = interpolate(
      scrollY.value,
      [0, HEADER_MAX_HEIGHT - HEADER_HEIGHT],
      [SEARCH_MAX_WIDTH, SEARCH_MIN_WIDTH],
      Extrapolate.CLAMP,
    );

    return {
      transform: [
        {
          scale: interpolate(
            scrollY.value,
            [0, HEADER_MAX_HEIGHT - HEADER_HEIGHT],
            [1, 0.8],
            Extrapolate.CLAMP,
          ),
        },
      ],
      width: withSpring(width, {
        damping: 15,
        stiffness: 100,
        mass: 0.5,
      }),
      backgroundColor: interpolateColor(
        opacity,
        [0, 1],
        ['#F5F5F5', 'rgba(255, 255, 255, 0.2)'],
      ),
    };
  });

  useStatusBar({
    barStyle: isScrolled ? 'light-content' : 'dark-content',
    backgroundColor: 'transparent',
    translucent: true,
  });

  React.useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {display: 'none'},
    });

    return () => {
      const tabBarStyle = {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? toDp(20) : toDp(20),
        left: toDp(20),
        right: toDp(20),
        elevation: 4,
        borderRadius: toDp(15),
        height: Platform.OS === 'ios' ? toDp(60) : toDp(60),
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: Platform.OS === 'ios' ? 2 : 4,
        },
        shadowOpacity: Platform.OS === 'ios' ? 0.15 : 0.1,
        shadowRadius: Platform.OS === 'ios' ? 6 : 8,
        borderTopWidth: 0,
        paddingBottom: Platform.OS === 'ios' ? toDp(5) : 0,
      };

      navigation.getParent()?.setOptions({
        tabBarStyle,
      });
    };
  }, [navigation]);

  const handleGetProduct = async () => {
    setIsLoading(true);
    const result = await getProduct('/products');
    setProducts(result);
    setFilteredProducts(result);
    setIsLoading(false);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        product =>
          product.title.toLowerCase().includes(text.toLowerCase()) ||
          product.description.toLowerCase().includes(text.toLowerCase()) ||
          product.category.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  };

  React.useEffect(() => {
    handleGetProduct();
  }, []);

  const openModal = (item: Product) => {
    setSelectedProduct(item);
    setModalVisible(true);

    fadeAnim.setValue(0);
    scaleAnim.setValue(0);

    setTimeout(() => {
      RNAnimated.parallel([
        RNAnimated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        RNAnimated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }, 50);
  };

  const closeModal = () => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      RNAnimated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedProduct(null);
    });
  };

  const handleLongPress = (item: Product) => {
    console.log('item', item);
    HapticFeedback.trigger('impactHeavy', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
    setSelectedProduct(item);
    setModalBottom(true);

    console.log('Long Pressed!');
  };

  const closeBottomModal = () => {
    setModalBottom(false);
    setTimeout(() => {
      setSelectedProduct(null);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <View style={[styles.headerContent, {paddingTop: insets.top}]}>
          <Animated.View
            style={[styles.searchContainer, searchBarAnimatedStyle]}>
            <Search size={20} color={isScrolled ? '#FFF' : '#666'} />
            <TextInput
              style={[
                styles.searchInput,
                {color: isScrolled ? '#FFF' : '#000'},
              ]}
              placeholder="Cari produk..."
              placeholderTextColor={
                isScrolled ? 'rgba(255, 255, 255, 0.7)' : '#666'
              }
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </Animated.View>
        </View>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        {isLoading ? (
          <View style={styles.containerLoading}>
            <ActivityIndicator size="large" color="#06367C" />
            <GlobalText
              typeText="bold"
              size={toDp(16)}
              style={styles.textLoading}>
              Sedang memuat data...
            </GlobalText>
          </View>
        ) : (
          <Animated.FlatList
            data={filteredProducts}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            key={'2-columns'}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapperStyle}
            contentContainerStyle={{
              paddingBottom: toDp(16),
              paddingTop: HEADER_MAX_HEIGHT,
            }}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            renderItem={({item, index}: {item: Product; index: number}) => (
              <Animated.View
                style={styles.containerRenderItem}
                entering={FadeInDown.delay(index * 200)}>
                <TouchableOpacity
                  onLongPress={() => handleLongPress(item)}
                  // onPress={() => openModal(item)}
                  onPress={() =>
                    navigation.navigate('DetailProduk', {product: item})
                  }
                  style={styles.cardProduct}>
                  <Animated.Image
                    sharedTransitionTag={`product.${item.id}.image`}
                    source={{uri: item.image}}
                    style={styles.imageProduct}
                    resizeMode="contain"
                  />
                  <View style={styles.containerTitleProduct}>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles.titleProductText}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
          />
        )}
        <Modal
          visible={modalVisible}
          transparent
          animationType="none"
          onRequestClose={closeModal}
          statusBarTranslucent>
          <View style={styles.modalOverlay}>
            <ScrollView
              contentContainerStyle={styles.contentScrollView}
              bounces={false}>
              <RNAnimated.View
                style={[styles.containerModal, {opacity: fadeAnim}]}>
                <RNAnimated.View
                  style={[
                    styles.contentModal,
                    {
                      transform: [{scale: scaleAnim}],
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={[
                      styles.buttonCloseModal,
                      {top: insets.top + toDp(8)},
                    ]}>
                    <CircleX size={toDp(26)} color="#000" />
                  </TouchableOpacity>

                  <View
                    style={[styles.bodyContentModal, {paddingTop: insets.top}]}>
                    {selectedProduct && (
                      <>
                        <View>
                          <Image
                            source={{uri: selectedProduct.image}}
                            style={styles.imageProductModal}
                            resizeMode="contain"
                          />
                        </View>
                        <View>
                          <GlobalText size={toDp(16)} typeText="bold">
                            {selectedProduct.title}
                          </GlobalText>
                          <GlobalText
                            style={styles.styleTextDescription}
                            size={toDp(14)}
                            typeText="regular">
                            {selectedProduct.description}
                          </GlobalText>
                        </View>
                      </>
                    )}
                  </View>
                </RNAnimated.View>
              </RNAnimated.View>
            </ScrollView>
          </View>
        </Modal>
        <CustomModal
          isVisible={modalBottom}
          onPressbtn={closeBottomModal}
          titleBtn="Oke">
          <View style={styles.containerImageModalBottom}>
            <Image
              source={{uri: selectedProduct?.image}}
              style={styles.imageModalBottom}
              resizeMode="contain"
            />
          </View>
        </CustomModal>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  cardProduct: {
    flex: 1,
    marginHorizontal: toDp(10),
    padding: toDp(10),
    backgroundColor: '#FFFFFF',
    width: Dimensions.get('window').width / 2 - toDp(16),
    height: toDp(180),
    marginTop: toDp(10),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: toDp(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: toDp(3),
  },
  imageProduct: {
    width: '100%',
    height: toDp(100),
    marginBottom: toDp(10),
    borderRadius: 8,
  },
  containerTitleProduct: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleProductText: {
    fontSize: toDp(12),
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#000',
  },
  containerRenderItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
  containerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentModal: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 0,
  },
  buttonCloseModal: {
    position: 'absolute',
    right: toDp(20),
    zIndex: 10,
  },
  textCloseModal: {
    fontSize: toDp(18),
    color: '#000',
  },
  bodyContentModal: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: toDp(16),
  },
  imageProductModal: {
    width: toDp(300),
    height: toDp(300),
    marginBottom: toDp(10),
    marginTop: toDp(20),
  },
  contentScrollView: {
    flex: 1,
  },
  styleTextDescription: {
    marginTop: toDp(10),
    color: '#000',
    lineHeight: toDp(20),
  },
  imageModalBottom: {
    width: toDp(250),
    height: toDp(250),
  },
  containerImageModalBottom: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: toDp(16),
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: toDp(8),
    paddingHorizontal: toDp(12),
    paddingVertical: toDp(8),
    alignSelf: 'center',
    height: Platform.OS === 'ios' ? toDp(42) : toDp(40),
  },
  searchInput: {
    flex: 1,
    marginLeft: toDp(8),
    fontSize: toDp(14),
    fontFamily: 'PlusJakartaSans-Regular',
    padding: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLoading: {
    marginTop: toDp(8),
    color: '#06367C',
  },
});

export default ProdukScreen;
