import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  SafeAreaView,
  FlatList,
  ImageBackground,
  Dimensions,
  StatusBar,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import FONTS from '../../conts/fonts';
import COLORS from '../../styles/colors';
import Text from '../components/Text';
const {height, width} = Dimensions.get('window');
const fullHeight = StatusBar?.currentHeight + height;

const slides = [
  {
    id: '1',
    image: require('../../assets/images/onboardingScreenImages/background1.png'),
    title: `Access & opt in our${'\n'}  courses & events`,
    color: COLORS.secondary,
  },
  {
    id: '2',
    image: require('../../assets/images/onboardingScreenImages/background2.png'),
    title: `Join our communities${'\n'}  of brilliant Techiescess`,
    color: COLORS.primary,
  },
  {
    id: '3',
    image: require('../../assets/images/onboardingScreenImages/background3.png'),
    title: `Get notified about${'\n'} our courses discount`,
    color: COLORS.primary,
  },
];

const Slide = ({item, currentSlideIndex, goToNextSlide, navigation}) => {
  return (
    <ImageBackground source={item?.image} style={{height: fullHeight, width}}>
      <View style={style.slideContainer}>
        <Image
          style={{width: 250, resizeMode: 'contain', marginTop: 20}}
          source={require('../../assets/images/logos/logoWhite.png')}
        />
        <View style={{alignItems: 'center', paddingBottom: 20}}>
          <Text style={style.title}>{item.title}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={
              currentSlideIndex != slides.length - 1
                ? goToNextSlide
                : () => navigation.navigate('SignUpScreen')
            }>
            <View style={[style.btn, {backgroundColor: item.color}]}>
              <Text style={{color: COLORS.white, fontFamily: FONTS.bold}}>
                {currentSlideIndex != slides.length - 1 ? ' NEXT' : 'ENTER'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const OnboardingScreen = ({navigation}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = React.useRef(null);
  const data = useSelector(state => state.userData);

  const setAppIsOpened = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (JSON.parse(userData)?.appHasBeenOpened == false) {
      AsyncStorage.setItem(
        'userData',
        JSON.stringify({...data, appHasBeenOpened: true}),
      );
    }
  };

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    setAppIsOpened();
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({offset});
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  return (
    <SafeAreaView>
      <StatusBar translucent backgroundColor="transparent" />
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        data={slides}
        renderItem={({item}) => (
          <Slide
            item={item}
            goToNextSlide={goToNextSlide}
            currentSlideIndex={currentSlideIndex}
            navigation={navigation}
          />
        )}
      />
      <View style={style.footer}>
        <View style={{flexDirection: 'row'}}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                style.indicatorOut,
                index == currentSlideIndex && {
                  borderWidth: 1,
                  borderRadius: 25,
                },
              ]}>
              <View style={[style.indicator]} />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  indicator: {
    height: 10,
    width: 10,
    backgroundColor: COLORS.white,
    borderRadius: 5,
    margin: 2,
  },
  indicatorOut: {
    borderColor: COLORS.white,
    marginHorizontal: 2,
  },
  footer: {
    height: fullHeight * 0.4,
    width,
    position: 'absolute',
    zIndex: 100,
    left: 0,
    bottom: 0,
    alignItems: 'center',
    paddingTop: 60,
  },
  slideContainer: {
    width,
    height: fullHeight * 0.6,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 23,
    color: COLORS.white,
    maxWidth: '70%',
    textAlign: 'center',
    lineHeight: 36,
  },
  btn: {
    width: 180,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    borderRadius: 20,
  },
});

export default OnboardingScreen;
