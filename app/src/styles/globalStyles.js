import React from 'react';
import {StyleSheet} from 'react-native';
import FONTS from '../conts/fonts';
import COLORS from './colors';

const globalStyles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
});
export default globalStyles;
