import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import COLORS from '../../../styles/colors';

const BottomLoader = () => {
  return (
    <View style={{width: '100%', marginBottom: 10}}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

export default BottomLoader;
