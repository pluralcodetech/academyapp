import FormData from 'form-data';
import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
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
import ScreenLoader from '../components/loaders/ScreenLoader';
import {openMessageModal} from '../components/modals/MessageAlertModal';
import Paystack from '../components/paystack';
import Text from '../components/Text';
import PreLoader from '../components/loaders/PreLoader';
import VideoPlayer from '../components/VideoPlayer';
import downloadFile from '../../logics/downloadFile';
const {height} = Dimensions.get('window');
const headerHeight = height * 0.45;

const CourseDetailsScreen = ({route, navigation}) => {
  const {data} = useSelector(state => state.userData);

  const {details, time} = route.params;
  const [state, setState] = React.useState({
    details,
    loading: true,
    showPaystack: false,
    registered: 'NO',
    showPreloader: false,
    showPdf: false,
    source: {uri: ''},
  });
  const aniValue = React.useRef(new Animated.Value(0)).current;
  const setTimeoutRef = React.useRef();

  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      loading: true,
      details,
      showPaystack: false,
    }));
    getCourseDetails(details?.id);
  }, [time]);

  const getCourseDetails = async id => {
    clearTimeout(setTimeoutRef.current);
    try {
      //Create and append to form
      const form = new FormData();
      form.append('studentid', data?.id);
      form.append('id', id);
      // Send request to reg the user

      const response = await fetch(API + 'coursedetails.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: form,
      });

      const resData = await response.json();

      if (resData.course.length == 1) {
        setState(prevState => ({
          ...prevState,
          details: resData.course[0],
          loading: false,
          registered: resData?.status[0]?.register,
        }));
      } else {
        setTimeoutRef.current = setTimeout(getCourseDetails, 5000);
      }
    } catch (error) {
      console.log(error);
      setTimeoutRef.current = setTimeout(getCourseDetails, 5000);
    }
  };
  const payForCourse = async tranId => {
    setState(prevState => ({
      ...prevState,
      showPreloader: true,
    }));

    try {
      //Create and append to form
      const form = new FormData();
      form.append('student_id', data.id);
      form.append('course_id', state?.details?.id);
      form.append(
        'amount',
        state?.details?.discountprice > 0
          ? state?.details?.discountprice
          : state?.details?.price,
      );
      form.append('reference', tranId);

      // Send request to reg the user

      const response = await fetch(API + 'payment.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: form,
      });

      const resData = await response.json();
      console.log(resData);

      if (resData.status == 'success') {
        setState(prevState => ({
          ...prevState,
          showPreloader: false,
          registered: 'YES',
        }));
        openMessageModal('Success', 'Payment completed');
      } else {
        setState(prevState => ({
          ...prevState,
          showPreloader: false,
        }));
        openMessageModal('Error', resData?.message, 'error');
      }
    } catch (error) {
      console.log(error);
      setState(prevState => ({
        ...prevState,
        showPreloader: false,
      }));
      openMessageModal('Error', MESSAGES.error, 'error');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.light}}>
      <PreLoader visible={state.showPreloader} />
      {/* Show Paystack */}

      <ScreenLoader loading={state.loading} />
      {state.showPaystack && (
        <Paystack
          setState={setState}
          onSuccess={payForCourse}
          amount={
            state?.details?.discountprice > 0
              ? state?.details?.discountprice
              : state?.details?.price
          }
        />
      )}

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
              height: 110,
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
          <View style={style.imageBackgroundCon}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 25,
                fontFamily: FONTS.bold,
                color: COLORS.white,
              }}>
              {details?.name}
            </Text>

            <View style={{flexDirection: 'row'}}>
              {/* Date and time */}
              <View style={{flex: 1}}>
                <Text style={{color: COLORS.white, fontSize: 10}}>
                  Course sub title
                </Text>

                <View style={{flexDirection: 'row', flex: 1}}>
                  <View style={style.iconDetailsCon}>
                    <Icon name="calendar" color={COLORS.secondary} size={18} />
                    <Text style={style.detailsText}>{details?.start_date}</Text>
                  </View>

                  <View style={style.iconDetailsCon}>
                    <Icon
                      name="clock-time-four-outline"
                      color={COLORS.secondary}
                      size={18}
                    />
                    <Text style={style.detailsText}>weekends</Text>
                  </View>
                </View>
              </View>

              {/* Pirces*/}

              <View style={{height: 40}}>
                <View style={style.iconDetailsCon}>
                  <Icon name="cash" color={COLORS.secondary} size={18} />
                  <View style={{justifyContent: 'center'}}>
                    {state?.details?.discountprice > 0 && (
                      <View
                        style={{
                          position: 'absolute',
                          width: '80%',
                          left: 9,
                          height: 1.5,
                          backgroundColor: COLORS.white,
                          top: 8,
                          zIndex: 2,
                        }}
                      />
                    )}

                    <Text numberOfLines={2} style={style.detailsText}>
                      {state?.details?.price}
                    </Text>
                  </View>
                </View>

                {state?.details?.discountprice > 0 && (
                  <View style={style.iconDetailsCon}>
                    <Icon
                      name="cash-multiple"
                      color={COLORS.secondary}
                      size={18}
                    />
                    <Text style={[style.detailsText]}>
                      {state?.details?.discountprice}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
        <View style={{padding: 20}}>
          {/* Action buttons container */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                downloadFile(
                  state?.details?.name,
                  state?.details?.curriculum,
                  setState,
                  navigation,
                )
              }>
              <View style={style.actionIconCon}>
                <Icon name="download" color={COLORS.primary} size={18} />
                <Text style={style.actionText}>Download curriculum</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={state.registered == 'YES'}
              onPress={() =>
                setState(prevState => ({...prevState, showPaystack: true}))
              }
              activeOpacity={0.7}
              style={[
                style.payNowIconCon,
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
                {state.registered == 'YES' ? ' Paid' : ' Pay'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => openDialer(data.supportline)}>
              <View style={style.actionIconCon}>
                <Icon name="face-agent" color={COLORS.primary} size={18} />
                <Text style={style.actionText}>Call Support</Text>
              </View>
            </TouchableOpacity>
          </View>
          {state.details?.videolink != '' && (
            <VideoPlayer videoId={state.details?.videolink} time={time} />
          )}

          <View>
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
              {details.description}
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  imageBackgroundCon: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    zIndex: 100,
  },
  iconDetailsCon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  detailsText: {
    color: COLORS.white,
    fontSize: 13,
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
  payNowIconCon: {
    height: 65,
    width: 65,
    backgroundColor: COLORS.secondary,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 7,
  },
});
export default CourseDetailsScreen;
