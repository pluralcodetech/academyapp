import FormData from 'form-data';
import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Image from '../components/Image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {API} from '../../conts/api';
import FONTS from '../../conts/fonts';
import COLORS from '../../styles/colors';
import Header from '../components/Layouts/Header';
import ScreenLoader from '../components/loaders/ScreenLoader';
import Text from '../components/Text';
import PreLoader from '../components/loaders/PreLoader';
import VideoPlayer from '../components/VideoPlayer';
const {height} = Dimensions.get('window');
const headerHeight = height * 0.45;

const EpisodeDetailsScreen = ({route}) => {
  const {details, time} = route.params;

  const [state, setState] = React.useState({
    details,
    loading: true,
    showPreloader: false,
  });
  const aniValue = React.useRef(new Animated.Value(0)).current;
  const setTimeoutRef = React.useRef();
  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      loading: true,
      details,
    }));
    getEpisodeDetails(details?.id);
  }, [time]);

  const getEpisodeDetails = async id => {
    clearTimeout(setTimeoutRef.current);
    try {
      //Create and append to form
      const form = new FormData();
      form.append('id', id);
      // Send request to reg the user

      const response = await fetch(API + 'webseriesdetails.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: form,
      });

      const resData = await response.json();

      if (resData) {
        setState(prevState => ({
          ...prevState,
          details: resData,
          loading: false,
        }));
      } else {
        setTimeoutRef.current = setTimeout(getEpisodeDetails, 5000);
      }
    } catch (error) {
      console.log(error);
      setTimeoutRef.current = setTimeout(getEpisodeDetails, 5000);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.light}}>
      <PreLoader visible={state.showPreloader} />

      <ScreenLoader loading={state.loading} />

      <Header
        title={details?.name}
        stick
        aniValue={aniValue}
        headerHeight={headerHeight}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: aniValue,
                },
              },
            },
          ],
          {useNativeDriver: false},
        )}>
        <View
          style={{
            height: headerHeight,
          }}>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: 65,
              zIndex: 1,
              bottom: 0,
              backgroundColor: 'rgba(38,55,171,0.8)',
            }}
          />
          <Image
            errorImage={require('../../assets/images/loadIcon.png')}
            source={{uri: details.image}}
            style={{width: '100%', height: '100%', position: 'absolute'}}
          />
          <View style={style.epidDetails}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 65,
              }}>
              <Image
                errorImage={require('../../assets/images/avatar.png')}
                source={{uri: details?.authorimage}}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 25,
                  borderWidth: 0.5,
                  borderColor: COLORS.white,
                }}
              />
              <View style={{flexDirection: 'row', marginLeft: 10}}>
                <Icon name="microphone" color={COLORS.white} />
                <Text style={{color: COLORS.white, fontSize: 10}}>
                  {details?.date}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            padding: 20,
            minHeight: height * 0.45,
          }}>
          <View>
            <Text
              numberOfLines={2}
              style={{
                marginTop: 20,
                fontFamily: FONTS.bold,
                fontSize: 22,
                color: COLORS.secondary,
              }}>
              {details.name}
            </Text>
          </View>
          <View>
            {state.details?.youtubelink != '' && (
              <VideoPlayer videoId={state.details?.youtubelink} time={time} />
            )}
          </View>

          <View style={{justifyContent: 'space-between', flex: 1}}>
            <Text style={{fontSize: 12, color: COLORS.primary, marginTop: 10}}>
              {details.description}
            </Text>

            {state.details?.youtubelink == '' && (
              <TouchableOpacity
                style={style.btn}
                activeOpacity={0.7}
                onPress={() => Linking.openURL(state?.details?.zoomlink)}>
                <Icon name="headphones" color={COLORS.white} size={16} />
                <Text style={{color: COLORS.white, fontFamily: FONTS.bold}}>
                  JOIN EPISODE
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  btn: {
    height: 45,
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  epidDetails: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    zIndex: 100,
  },

  detailsText: {
    color: COLORS.white,
    fontSize: 10,
    marginLeft: 10,
    fontFamily: FONTS.bold,
  },
  actionIconCon: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    borderRadius: 20,
    elevation: 1.3,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  actionText: {
    color: '#8190F7',
    fontSize: 10,
    marginLeft: 5,
    fontFamily: FONTS.bold,
  },
});
export default EpisodeDetailsScreen;
