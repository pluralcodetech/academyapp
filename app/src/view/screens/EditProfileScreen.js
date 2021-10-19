import React from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Text from '../components/Text';
import Image from '../components/Image';
import FONTS from '../../conts/fonts';
import COLORS from '../../styles/colors';
import CustomInput from '../components/inputs/CustomInput';
import InputContainer from '../components/inputs/InputContainer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyles from '../../styles/globalStyles';
import PreLoader from '../components/loaders/PreLoader';
import {API} from '../../conts/api';
import MESSAGES from '../../conts/messages';
import Header from '../components/Layouts/Header';
import {useSelector} from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';
import {getAndUpdateUserData} from '../../logics/auth/user';
import {openMessageModal} from '../components/modals/MessageAlertModal';

const EditProfileScreen = () => {
  const {data} = useSelector(state => state.userData);
  const [state, setState] = React.useState({
    id: data?.id,
    name: data?.name,
    lastname: data?.lastname,
    email: data?.email,
    phonenumber: data?.phonenumber,
    image: data?.image,
    imageFromDevice: '',
    showPreloader: false,
  });
  const [error, setError] = React.useState({});

  const updateUserDetails = async () => {
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
        phonenumber: 'Please phone number',
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
        //Create and append to form
        const form = new FormData();
        form.append('id', state.id);
        form.append('name', state.name);
        form.append('lastname', state.lastname);
        form.append('phonenumber', state.phonenumber);

        form.append('email', state.email);
        if (state.imageFromDevice != '') {
          console.log(state.imageFromDevice);
          form.append('image', state.imageFromDevice);
        }

        // // Send request to reg the user
        const response = await fetch(API + 'profileupdate.php', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          method: 'POST',
          body: form,
        });
        const resData = await response.json();
        console.log(resData);
        setState(prevState => ({...prevState, showPreloader: false}));
        if (resData.status == 'success') {
          getAndUpdateUserData();
          openMessageModal('Success', 'Profile updated.');
        } else {
          openMessageModal('Error', resData.message, 'error');
        }
      } catch (error) {
        console.log(error);
        setState(prevState => ({...prevState, showPreloader: false}));
        openMessageModal('Error', MESSAGES.error, 'error');
      }
    }
  };

  const pickerImage = async () => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status == 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        exif: true,
      });

      if (!result.cancelled) {
        setState(prevState => ({
          ...prevState,
          image: result.uri,
          imageFromDevice: result.uri,
        }));
        console.log(result.type);
      } else {
        openMessageModal('Error', MESSAGES.error, 'error');
      }
    } else {
      openMessageModal(
        'Error',
        'Sorry, we need camera permissions to make this work!',
        'error',
      );
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.light}}>
      <PreLoader visible={state.showPreloader} />
      <Header backgroundColor={COLORS.light} iconColor={COLORS.primary} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            padding: 20,
          }}>
          <Text style={[globalStyles.title, {color: COLORS.secondary}]}>
            Edit Profile
          </Text>
          <View style={{alignItems: 'center'}}>
            <View style={style.imageCon}>
              {/* <TouchableOpacity
                onPress={pickerImage}
                activeOpacity={0.85}
                style={style.cameraIconCon}>
                <Icon name="camera-outline" color={COLORS.white} size={16} />
              </TouchableOpacity> */}
              <Image
                style={{
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  borderRadius: 60,
                }}
                source={require('../../assets/images/avatar.png')}
              />
            </View>
          </View>

          {/* Inputs */}
          <View style={{marginTop: 20}}>
            <InputContainer style={{alignItems: 'center'}}>
              <CustomInput
                type="secondary"
                autoCapitalize="none"
                placeholder="First Name"
                icon="account"
                value={state.name}
                onChangeText={value => setState({...state, name: value})}
                error={error.name}
                onFocus={() => setError({...error, name: null})}
              />
              <CustomInput
                type="secondary"
                autoCapitalize="none"
                placeholder="Last Name"
                icon="account"
                value={state.lastname}
                onChangeText={value => setState({...state, lastname: value})}
                error={error.lastname}
                onFocus={() => setError({...error, lastname: null})}
              />
              <CustomInput
                type="secondary"
                autoCapitalize="none"
                placeholder="Enter Your Email"
                icon="email"
                value={state.email}
                onChangeText={value => setState({...state, email: value})}
                error={error.email}
                onFocus={() => setError({...error, email: null})}
              />
              <CustomInput
                type="secondary"
                keyboardType="numeric"
                placeholder="Enter Your Telephone Number"
                icon="cellphone"
                value={state.phonenumber}
                onChangeText={value => setState({...state, phonenumber: value})}
                error={error.phonenumber}
                onFocus={() => setError({...error, phonenumber: null})}
              />

              {/* Save button */}
              <TouchableOpacity
                style={style.btn}
                activeOpacity={0.7}
                onPress={updateUserDetails}>
                <Text style={{color: COLORS.white, fontFamily: FONTS.bold}}>
                  SAVE
                </Text>
              </TouchableOpacity>
            </InputContainer>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  btn: {
    height: 45,
    width: 200,
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 60,
  },
  imageCon: {
    height: 100,
    width: 100,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconCon: {
    position: 'absolute',
    height: 30,
    width: 30,
    backgroundColor: COLORS.primary,
    zIndex: 2,
    right: 0,
    borderRadius: 40,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfileScreen;
