import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Image,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Text from '../../components/Text';
import FONTS from '../../../conts/fonts';
import COLORS from '../../../styles/colors';
import CustomInput from '../../components/inputs/CustomInput';
import InputContainer from '../../components/inputs/InputContainer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyles from '../../../styles/globalStyles';
import PreLoader from '../../components/loaders/PreLoader';
import {API} from '../../../conts/api';
import MESSAGES from '../../../conts/messages';
import {openMessageModal} from '../../components/modals/MessageAlertModal';
const SignUpScreen = ({navigation}) => {
  const [state, setState] = React.useState({
    name: '',
    lastname: '',
    email: '',
    phonenumber: '',
    showPreloader: false,
  });
  const [error, setError] = React.useState({});

  const SignUp = async () => {
    //Validate individual input
    if (!state.name?.trim()) {
      setError(prevState => ({...prevState, name: 'Please input first name'}));
    }
    if (!state.lastname?.trim()) {
      setError(prevState => ({
        ...prevState,
        lastname: 'Please input last name',
      }));
    }
    if (!state.email?.trim()) {
      setError(prevState => ({...prevState, email: 'Please input email'}));
    }
    if (!state.phonenumber?.trim()) {
      setError(prevState => ({
        ...prevState,
        phonenumber: 'Please input phone number',
      }));
    }

    if (
      state.phonenumber.trim() &&
      state.name.trim() &&
      state.email.trim() &&
      state.lastname.trim()
    ) {
      setState(prevState => ({...prevState, showPreloader: true}));
      try {
        // Send request to reg the user

        const response = await fetch(API + 'signin.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(state),
        });
        console.log(response);
        const data = await response.json();
        console.log(data);
        setState(prevState => ({...prevState, showPreloader: false}));
        if (data.status == 'success') {
          openMessageModal(
            'Success',
            'Registration was succesful, You can now sign in.',
          );
          navigation.replace('SignInScreen');
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
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.light}}>
      <PreLoader visible={state.showPreloader} />
      <StatusBar translucent={false} backgroundColor={COLORS.primary} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            alignItems: 'center',
            padding: 20,
          }}>
          <Image
            source={require('../../../assets/images/logos/logoColored.png')}
            style={style.image}
          />
          <Text style={{...globalStyles.title, marginTop: 40}}>
            Let’s Get Started
          </Text>

          <Text
            style={{
              fontSize: 12,
              fontFamily: FONTS.regular,
              color: COLORS.grey,
            }}>
            Create a new account
          </Text>

          {/* Inputs */}
          <View style={{marginTop: 40}}>
            <InputContainer style={{alignItems: 'center'}}>
              <CustomInput
                autoCapitalize="none"
                placeholder="First Name"
                icon="account"
                value={state.name}
                onChangeText={value => setState({...state, name: value})}
                error={error.name}
                onFocus={() => setError({...error, name: null})}
              />
              <CustomInput
                autoCapitalize="none"
                placeholder="Last Name"
                icon="account"
                value={state.lastname}
                onChangeText={value => setState({...state, lastname: value})}
                error={error.lastname}
                onFocus={() => setError({...error, lastname: null})}
              />
              <CustomInput
                autoCapitalize="none"
                placeholder="Enter Your Email"
                icon="email"
                value={state.email}
                onChangeText={value => setState({...state, email: value})}
                error={error.email}
                onFocus={() => setError({...error, email: null})}
              />
              <CustomInput
                keyboardType="numeric"
                placeholder="Enter Your Telephone Number"
                icon="cellphone"
                value={state.phonenumber}
                onChangeText={value => setState({...state, phonenumber: value})}
                error={error.phonenumber}
                onFocus={() => setError({...error, phonenumber: null})}
              />

              {/* Signup button */}
              <TouchableOpacity
                style={style.btn}
                activeOpacity={0.7}
                onPress={SignUp}>
                <Text style={{color: COLORS.white, fontFamily: FONTS.bold}}>
                  SIGN UP
                </Text>
                <Icon name="chevron-right" color={COLORS.white} size={28} />
              </TouchableOpacity>
              <Text
                style={{
                  marginTop: 20,
                  marginBottom: 40,
                  fontSize: 10,
                  color: COLORS.primary,
                }}>
                Already have an account?{' '}
                <Text
                  style={{color: COLORS.secondary, fontFamily: FONTS.bold}}
                  onPress={() => navigation.navigate('SignInScreen')}>
                  Log In
                </Text>
              </Text>
            </InputContainer>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  btn: {
    marginTop: 20,
    height: 49,
    width: 200,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {height: 30, resizeMode: 'contain', marginTop: 20},
});

export default SignUpScreen;
