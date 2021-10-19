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
} from 'react-native';
import Text from '../../components/Text';
import FONTS from '../../../conts/fonts';
import COLORS from '../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyles from '../../../styles/globalStyles';
import MESSAGES from '../../../conts/messages';
import {API} from '../../../conts/api';
import PreLoader from '../../components/loaders/PreLoader';
import {openMessageModal} from '../../components/modals/MessageAlertModal';
import TouchPad from '../../components/TouchPad';
const {height} = Dimensions.get('window');

const SignInScreen = ({navigation}) => {
  const [state, setState] = React.useState({
    currentNumber: '',
    showPreloader: false,
  });

  const signIn = async () => {
    //Validate individual input
    if (!state.currentNumber?.trim()) {
      openMessageModal('Error', 'Please input phone number', 'error');
    } else {
      setState(prevState => ({...prevState, showPreloader: true}));
      try {
        // Send request to reg the user

        const response = await fetch(API + 'login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({phone_number: state.currentNumber}),
        });
        const data = await response.json();

        setState(prevState => ({...prevState, showPreloader: false}));
        if (data.status == 'success') {
          navigation.navigate('OtpScreen');
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
          <Text style={{...globalStyles.title}}>OTP Verification</Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: FONTS.regular,
              color: COLORS.grey,
            }}>
            Enter Your Phone Number
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
              onChangeText={value => setState({...state, currentNumber: value})}
              keyboardType="numeric"
              maxLength={12}
              value={state.currentNumber}
              placeholderTextColor={COLORS.primary}
              placeholder="Phone number"
              style={style.textInput}
              textAlign="center"
            />
            <TouchableOpacity
              onPress={signIn}
              style={style.iconContainer}
              activeOpacity={0.7}>
              <Icon name="chevron-right" color={COLORS.white} size={23} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('SignUpScreen')}>
            <Text
              style={{
                marginTop: 20,
                color: COLORS.secondary,
                fontFamily: FONTS.bold,
              }}>
              SIGN UP
            </Text>
          </TouchableOpacity>
        </View>
        <View style={style.bottomCon}>
          <TouchPad setState={setState} maxNum={12} />
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
    padding: 20,
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
    borderColor: COLORS.primary,
    color: COLORS.primary,
  },

  iconContainer: {
    height: 30,
    width: 30,
    borderRadius: 15,
    position: 'absolute',
    right: -40,
    top: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignInScreen;
