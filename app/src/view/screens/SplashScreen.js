import React from 'react';
import {
  SafeAreaView,
  ImageBackground,
  Dimensions,
  StatusBar,
  Image,
  StyleSheet,
} from 'react-native';

import COLORS from '../../styles/colors';
const {height} = Dimensions.get('window');
const fullHeight = StatusBar?.currentHeight + height;

const SplashScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        style={style.imageBg}
        source={require('../../assets/images/splashScreenBackground.png')}>
        <Image
          source={require('../../assets/images/logos/logoWhite.png')}
          style={{width: 250, resizeMode: 'contain'}}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  imageBg: {
    height: fullHeight,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default SplashScreen;
