import React from 'react';
import Svg, {Path, Rect, Text, TSpan} from 'react-native-svg';
import {View} from 'react-native';

interface PaymentOptionsProps {
  width?: number;
  height?: number;
}

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  width = 300,
  height = 60,
}) => {
  return (
    <View>
      <Svg width={width} height={height} viewBox="0 0 300 60">
        {/* Background for BLEMPOL */}
        <Rect x="0" y="0" width="145" height="60" rx="10" fill="#FFFFFF" />

        {/* Background for Getho Saldo */}
        <Rect x="155" y="0" width="145" height="60" rx="10" fill="#FFFFFF" />

        {/* Vertical dotted line separator */}
        <Path
          d="M150 5 L150 55"
          stroke="#E0E0E0"
          strokeWidth="1"
          strokeDasharray="4,4"
        />

        {/* BLEMPOL Text */}
        <Text x="30" y="25" fill="#000000" fontSize="14" fontWeight="bold">
          <TSpan>BLEMPOL</TSpan>
        </Text>

        {/* BLEMPOL Amount */}
        <Text x="30" y="45" fill="#000000" fontSize="12">
          <TSpan>Rp. 1.786.292</TSpan>
        </Text>

        {/* Getho Saldo Text */}
        <Text x="185" y="25" fill="#000000" fontSize="14" fontWeight="bold">
          <TSpan>Getho Saldo</TSpan>
        </Text>

        {/* Getho Saldo Amount */}
        <Text x="185" y="45" fill="#000000" fontSize="12">
          <TSpan>Rp. -</TSpan>
        </Text>
      </Svg>
    </View>
  );
};
