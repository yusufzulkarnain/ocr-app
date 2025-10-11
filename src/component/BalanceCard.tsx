import React from 'react';
import {View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import GlobalText from './globalText';
import {toDp} from '../hepers/PercentageToDp';
import {Eye, EyeOff, Wallet, CreditCard} from 'lucide-react-native';
import Svg, {Circle, G, Defs, ClipPath, Rect} from 'react-native-svg';

interface BalanceCardProps {
  title: string;
  amount: string;
  isHidden: boolean;
  onToggleVisibility: () => void;
  backgroundColor?: string;
}

const BackgroundPattern = () => (
  <Svg
    width="100%"
    height="100%"
    style={[StyleSheet.absoluteFill]}
    opacity={0.1}>
    <Defs>
      <ClipPath id="clip">
        <Rect width="100%" height="100%" rx={toDp(8)} />
      </ClipPath>
    </Defs>
    <G clipPath="url(#clip)">
      <Circle cx="15%" cy="30%" r="25%" fill="#06367C" />
      <Circle cx="85%" cy="70%" r="20%" fill="#06367C" />
    </G>
  </Svg>
);

export const BalanceCard: React.FC<BalanceCardProps> = ({
  title,
  amount,
  isHidden,
  onToggleVisibility,
  backgroundColor = '#FFFFFF',
}) => {
  const getIcon = () => {
    if (title.toLowerCase().includes('saldo')) {
      return <Wallet size={toDp(20)} color="#06367C" />;
    } else if (title.toLowerCase().includes('kredit')) {
      return <CreditCard size={toDp(20)} color="#06367C" />;
    }
    return null;
  };

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <BackgroundPattern />
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            {getIcon()}
            <GlobalText size={toDp(14)} typeText="bold" style={styles.title}>
              {title}
            </GlobalText>
          </View>
          <TouchableOpacity onPress={onToggleVisibility}>
            {isHidden ? (
              <EyeOff size={toDp(16)} color="#666666" />
            ) : (
              <Eye size={toDp(16)} color="#666666" />
            )}
          </TouchableOpacity>
        </View>
        <GlobalText size={toDp(16)} typeText="bold" style={styles.amount}>
          {isHidden ? '••••••' : amount}
        </GlobalText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: toDp(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: toDp(3),
    elevation: Platform.OS === 'ios' ? toDp(8) : toDp(6),
    overflow: 'hidden',
    position: 'relative',
  },
  contentContainer: {
    padding: toDp(10),
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: toDp(8),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: toDp(8),
  },
  title: {
    color: '#06367C',
  },
  amount: {
    color: '#06367C',
  },
});
