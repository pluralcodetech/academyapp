import React from 'react';
import {Text as RNText} from 'react-native';
import FONTS from '../../conts/fonts';
const Text = ({children, style, ...props}) => {
  return (
    <RNText
      style={
        Array.isArray(style)
          ? [{fontFamily: FONTS.regular}, ...style]
          : {fontFamily: FONTS.regular, ...style}
      }
      {...props}>
      {children}
    </RNText>
  );
};

export default Text;
