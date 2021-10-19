import React from 'react';
import {View} from 'react-native';
import COLORS from '../../../styles/colors';

const InputContainer = ({children, style}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.01)',
        width: '100%',
        paddingVertical: 7,
        paddingHorizontal: 7,
        borderRadius: 8,
      }}>
      <View
        style={{
          paddingHorizontal: 23,
          paddingVertical: 42,
          backgroundColor: COLORS.white,
          width: '98%',
          borderRadius: 7,
          ...style,
        }}>
        {children}
      </View>
    </View>
  );
};

export default InputContainer;
