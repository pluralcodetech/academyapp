import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Image,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Text from '../../components/Text';
import FONTS from '../../../conts/fonts';
import COLORS from '../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyles from '../../../styles/globalStyles';
import PreLoader from '../../components/loaders/PreLoader';
import MESSAGES from '../../../conts/messages';
import {API} from '../../../conts/api';
import {updateUserData} from '../../../logics/auth/auth';
import {openMessageModal} from '../../components/modals/MessageAlertModal';
import TouchPad from '../../components/TouchPad';
const {height} = Dimensions.get('window');

const OtpScreen = ({navigation}) => {
  const [state, setState] = React.useState({
    currentNumber: '',
    showPreloader: false,
    showMessageModal: false,
    message: '',
    messageTitle: '',
  });

  const verifyOtp = async () => {
    //Validate individual input
    if (!state.currentNumber?.trim()) {
      openMessageModal('Error', 'Please input Otp', 'error');
    } else {
      setState(prevState => ({...prevState, showPreloader: true}));
      try {
        // Send request to verify otp
        const response = await fetch(API + 'checkotp.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...state, otpcheck: state.currentNumber}),
        });

        const data = await response.json();
        setState(prevState => ({...prevState, showPreloader: false}));

        if (data.status == 'success') {
          const userData = {
            loggedIn: true,
            data,
            appHasBeenOpened: true,
            settings: {pushNotification: true},
          };

          //dispatch to store and save data to users phone
          await updateUserData(userData);
          navigation.navigate('Home', {showMessageModal: true});
        } else {
          openMessageModal('Error', data.message, 'error');
        }
      } catch (error) {
        console.log(error);
        setState(prevState => ({...prevState, showPreloader: false}));
        openMessageModal('Error', MESSAGES.error, 'error');
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <PreLoader visible={state.showPreloader} />
      <StatusBar translucent={false} backgroundColor={COLORS.primary} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.topCon}>
          <Image
            source={require('../../../assets/images/otpBackground.png')}
            style={{
              position: 'absolute',
              height: '110%',
              width: '100%',
            }}
          />
          <View style={{padding: 20, alignItems: 'center'}}>
            <Text style={{...globalStyles.title, color: COLORS.secondary}}>
              Enter OTP Code
            </Text>

            <Image
              source={require('../../../assets/images/phone.png')}
              style={style.image}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextInput
                editable={false}
                onChangeText={value =>
                  setState({...state, currentNumber: value})
                }
                keyboardType="numeric"
                maxLength={6}
                value={state.currentNumber}
                placeholderTextColor={COLORS.light}
                placeholder="OTP"
                style={style.textInput}
                textAlign="center"
              />
              <TouchableOpacity onPress={verifyOtp} style={style.iconContainer}>
                <Icon name="chevron-right" color={COLORS.white} size={23} />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 12,
                fontFamily: FONTS.regular,
                color: COLORS.white,
                marginTop: 10,
              }}>
              I didn’t receive OTP
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: FONTS.bold,
                color: COLORS.secondary,
              }}>
              Resend OTP
            </Text>
          </View>
        </View>

        <View style={style.bottomCon}>
          <TouchPad setState={setState} maxNum={6} />
          <View style={{height: 80}}>
            <Image source={require('../../../assets/images/wave.png')} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  image: {height: 80, resizeMode: 'contain', marginTop: 40},
  topCon: {
    alignItems: 'center',
    minHeight: height * 0.42,
  },
  bottomCon: {
    minHeight: height * 0.58,
    backgroundColor: COLORS.primary,
  },
  textInput: {
    marginTop: 20,
    fontSize: 13,
    fontFamily: FONTS.regular,
    width: 200,
    borderBottomWidth: 1,
    paddingBottom: 0,
    borderColor: COLORS.light,
    color: COLORS.light,
  },
  iconContainer: {
    height: 30,
    width: 30,
    borderRadius: 15,
    position: 'absolute',
    right: -40,
    top: 30,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OtpScreen;
