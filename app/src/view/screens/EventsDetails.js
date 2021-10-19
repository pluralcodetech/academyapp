import FormData from 'form-data';
import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Image from '../components/Image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {API} from '../../conts/api';

import FONTS from '../../conts/fonts';
import MESSAGES from '../../conts/messages';
import openDialer from '../../logics/openDialer';
import COLORS from '../../styles/colors';
import Header from '../components/Layouts/Header';
import PreLoader from '../components/loaders/PreLoader';
import ScreenLoader from '../components/loaders/ScreenLoader';
import {openMessageModal} from '../components/modals/MessageAlertModal';
import Text from '../components/Text';
import VideoPlayer from '../components/VideoPlayer';
const {height} = Dimensions.get('window');
const headerHeight = height * 0.42;

const EventsDetails = ({route}) => {
  const {details, time} = route.params;

  const {data} = useSelector(state => state.userData);
  const [state, setState] = React.useState({
    details,
    showPreloader: false,
    message: '',
    messageTitle: '',
    loading: true,
    registered: 'NO',
  });

  const aniValue = React.useRef(new Animated.Value(0)).current;
  const setTimeoutRef = React.useRef();

  React.useEffect(() => {
    setState(prevState => ({...prevState, loading: true, details: details}));
    getEventDetails(details?.id);
  }, [time]);

  const getEventDetails = async id => {
    clearTimeout(setTimeoutRef.current);
    try {
      //Create and append to form
      const form = new FormData();
      form.append('studentid', data?.id);
      form.append('id', id);
      // Send request to reg the user

      const response = await fetch(API + 'eventdetails.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: form,
      });

      const resData = await response.json();

      if (resData.event.length == 1) {
        setState(prevState => ({
          ...prevState,
          details: resData.event[0],
          loading: false,
          registered: resData?.status[0]?.register,
        }));
      } else {
        setTimeoutRef.current = setTimeout(getEventDetails, 5000);
      }
    } catch (error) {
      setTimeoutRef.current = setTimeout(getEventDetails, 5000);
    }
  };
  const registerEvent = async () => {
    setState(prevState => ({
      ...prevState,
      showPreloader: true,
    }));

    try {
      //Create and append to form
      const form = new FormData();
      form.append('studentid', data.id);
      form.append('eventid', state?.details?.id);

      // Send request to reg the user

      const response = await fetch(API + 'registerforevent.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: form,
      });

      const resData = await response.json();

      if (resData.status == 'success') {
        setState(prevState => ({
          ...prevState,
          showPreloader: false,
          registered: 'YES',
        }));
        openMessageModal('Success', 'Registration completed');
      } else {
        setState(prevState => ({
          ...prevState,
          showPreloader: false,
        }));
        Alert.alert('Error', resData?.message);
      }
    } catch (error) {
      console.log(error);
      setState(prevState => ({
        ...prevState,
        showPreloader: false,
      }));
      Alert.alert('Error', MESSAGES.error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.light}}>
      <ScreenLoader loading={state.loading} />
      <PreLoader visible={state.showPreloader} />
      <Header
        title={state?.details?.name}
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
          <Image
            errorImage={require('../../assets/images/loadIcon.png')}
            source={{uri: state?.details?.image}}
            style={{width: '100%', height: '100%'}}
          />
        </View>
        <View style={{padding: 20}}>
          <Text
            style={{
              flex: 1,
              fontSize: 25,
              fontFamily: FONTS.bold,
              color: COLORS.primary,
            }}>
            {state?.details?.name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{flexDirection: 'row', alignItems: 'center', width: 100}}>
              <Icon name="calendar" color={COLORS.secondary} size={18} />
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 10,
                  marginLeft: 10,
                  fontFamily: FONTS.bold,
                }}>
                {state?.details?.start_date}
              </Text>
            </View>
            {details.categorytype == 'EVENT' && (
              <TouchableOpacity
                disabled={state.registered == 'YES'}
                onPress={registerEvent}
                activeOpacity={0.7}
                style={[
                  style.registerEvIconCon,
                  state.registered == 'YES' && {backgroundColor: COLORS.green},
                ]}>
                <Icon name="check-bold" color={COLORS.white} size={25} />
                <Text
                  style={{
                    top: -4,
                    fontSize: 10,
                    color: COLORS.white,
                    fontFamily: FONTS.bold,
                  }}>
                  {state.registered == 'YES' ? ' Registered' : ' Register'}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => openDialer(data.supportline)}>
              <View style={style.actionIconCon}>
                <Icon name="face-agent" color={COLORS.primary} size={18} />
                <Text style={style.actionText}>Call Support</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View>
            {state.details?.videolink != '' && (
              <VideoPlayer videoId={state.details?.videolink} time={time} />
            )}

            <Text
              style={{
                marginTop: 20,
                fontFamily: FONTS.bold,
                fontSize: 22,
                color: COLORS.secondary,
              }}>
              Description
            </Text>
            <Text style={{fontSize: 12, color: COLORS.primary, marginTop: 10}}>
              {state?.details?.description}
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  registerEvIconCon: {
    height: 65,
    width: 65,
    backgroundColor: COLORS.secondary,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 7,
  },
  actionIconCon: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    borderRadius: 20,
    elevation: 1.3,
    alignItems: 'center',
    width: 100,
  },
  actionText: {
    color: '#8190F7',
    fontSize: 10,
    marginLeft: 5,
    fontFamily: FONTS.bold,
  },
});

export default EventsDetails;
