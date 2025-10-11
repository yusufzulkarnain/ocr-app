import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import GlobalText from '../../../component/globalText';
import {toDp} from '../../../hepers/PercentageToDp';
import {useStatusBar} from '../../../hooks/useStatusBar';
import {ChevronLeft, Share2} from 'lucide-react-native';
import {formatCurrency} from '../../../hepers/CurrencyFormat';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

type DetailProdukScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: any;
};

const DetailProdukScreen: React.FC<DetailProdukScreenProps> = ({
  navigation,
  route,
}) => {
  const {product} = route.params;
  const scale = useSharedValue(1);
  const insets = useSafeAreaInsets();

  useStatusBar({
    barStyle: 'dark-content',
    backgroundColor: '#FFFFFF',
    translucent: true,
  });

  useFocusEffect(
    React.useCallback(() => {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 100,
      });
    }, [scale]),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, {top: insets.top + toDp(12)}]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#06367C" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Share2 size={24} color="#06367C" />
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[
            styles.imageContainer,
            animatedStyle,
            {marginTop: insets.top + toDp(12)},
          ]}>
          <Animated.Image
            sharedTransitionTag={`product.${product.id}.image`}
            source={{uri: product.image}}
            style={styles.productImage}
            resizeMode="contain"
          />
        </Animated.View>

        <View style={styles.detailsContainer}>
          {/* <View style={styles.divider} /> */}
          <GlobalText size={toDp(20)} typeText="bold" style={styles.title}>
            {product.title}
          </GlobalText>

          <GlobalText size={toDp(20)} typeText="bold" style={styles.price}>
            Rp {formatCurrency(product.price.toString())}
          </GlobalText>

          <View style={styles.divider} />
          <GlobalText size={toDp(14)} style={styles.description}>
            {product.description}
          </GlobalText>
        </View>
      </ScrollView>

      {/* <View style={styles.footer}>
        <TouchableOpacity style={styles.buyButton}>
          <GlobalText
            size={toDp(16)}
            typeText="bold"
            style={styles.buyButtonText}>
            Beli Sekarang
          </GlobalText>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    paddingHorizontal: toDp(16),
    zIndex: 10,
  },
  backButton: {
    padding: toDp(8),
  },
  shareButton: {
    padding: toDp(8),
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: toDp(100),
  },
  imageContainer: {
    width: '100%',
    height: toDp(300),
    backgroundColor: '#FFFFFF',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: toDp(16),
  },
  title: {
    color: '#06367C',
  },
  price: {
    color: '#0A5D3B',
    marginBottom: toDp(16),
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: toDp(16),
  },
  description: {
    color: '#666666',
    lineHeight: toDp(20),
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: toDp(8),
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: toDp(16),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  buyButton: {
    backgroundColor: '#0A5D3B',
    padding: toDp(16),
    borderRadius: toDp(12),
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#FFFFFF',
  },
});

export default DetailProdukScreen;
