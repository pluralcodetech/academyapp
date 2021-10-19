import React from 'react';
import {View, StyleSheet, ActivityIndicator, Dimensions} from 'react-native';
import FONTS from '../../../conts/fonts';
import COLORS from '../../../styles/colors';
import Text from '../Text';
const {height} = Dimensions.get('window');

const ScreenLoader = ({loading}) => {
  return (
    loading && (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
        <Text style={styles.text}>Loading Please wait...</Text>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    height,
    width: '100%',
    zIndex: 10000,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(38,55,171,0.95)',
  },
  text: {
    marginTop: 5,
    fontSize: 17,
    color: '#fff',
    fontFamily: FONTS.bold,
  },
});

export default ScreenLoader;
