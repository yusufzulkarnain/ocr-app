import React from 'react';
import {Text, StyleSheet, TextStyle} from 'react-native';

// Tipe untuk props
type CustomTextProps = {
  typeText?: 'bold' | 'regular' | 'italic'; // Jenis teks
  size?: number; // Ukuran teks
  children: React.ReactNode; // Isi teks
  style?: TextStyle;
};

// Komponen CustomText
const GlobalText: React.FC<CustomTextProps> = ({
  typeText = 'regular',
  size = 14,
  children,
  style,
}) => {
  return (
    <Text
      style={[styles.text, {fontSize: size}, getFontStyle(typeText), style]}>
      {children}
    </Text>
  );
};

// Fungsi untuk menentukan font style berdasarkan typeText
const getFontStyle = (type: string): TextStyle => {
  switch (type) {
    case 'bold':
      return {fontFamily: 'PlusJakartaSans-Bold'};
    case 'italic':
      return {fontFamily: 'PlusJakartaSans-Italic'};
    default:
      return {fontFamily: 'PlusJakartaSans-Regular'};
  }
};

const styles = StyleSheet.create({
  text: {
    color: '#000', // Warna default hitam
  },
});

export default GlobalText;
