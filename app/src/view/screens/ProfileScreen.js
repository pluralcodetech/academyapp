import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Image from '../components/Image';
import {useSelector} from 'react-redux';
import FONTS from '../../conts/fonts';
import COLORS from '../../styles/colors';
import Text from '../components/Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {logoutUser, updateUserData} from '../../logics/auth/auth';
import OneSignal from 'react-native-onesignal';

const ProfileScreen = ({navigation}) => {
  const data = useSelector(state => state.userData);
  const [state, setState] = React.useState({
    pushNotification: data?.settings?.pushNotification,
  });

  const togglePushNotification = async val => {
    setState(prevState => ({...prevState, pushNotification: val}));

    //Dispatch to store and save data to users phone
    await updateUserData({...data, settings: {pushNotification: val}});

    //Disable and enable push notification from one signal
    OneSignal.disablePush(!val);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {/* Header section */}
        <View style={style.header}>
          <View style={style.imageCon}>
            <Image
              source={require('../../assets/images/avatar.png')}
              style={[style.image]}
            />
          </View>
          <View style={{marginLeft: 10, flex: 1}}>
            <Text
              style={{
                color: COLORS.primary,
                fontFamily: FONTS.bold,
                fontSize: 18,
              }}>
              {data?.data?.name} {data?.data?.lastname}
            </Text>
            <Text
              style={{
                lineHeight: 16,
                color: COLORS.grey,
                fontSize: 12,
              }}>
              Edit Personal details
            </Text>
          </View>
          <Icon
            name="chevron-right"
            size={30}
            color={COLORS.primary}
            onPress={() => navigation.navigate('EditProfileScreen')}
          />
        </View>
        <View style={{padding: 20}}>
          <Text style={style.title}>Customise</Text>
          <View style={style.list}>
            <View style={style.listIcon}>
              <Icon name="bell-outline" size={20} color={COLORS.white} />
            </View>
            <Text style={style.listText}>Notification</Text>
            <Switch
              trackColor={{false: COLORS.grey, true: COLORS.primary}}
              thumbColor={
                state.pushNotification ? COLORS.secondary : COLORS.secondary
              }
              onValueChange={val => togglePushNotification(val)}
              value={state.pushNotification}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            style={style.list}
            onPress={logoutUser}>
            <View style={style.listIcon}>
              <Icon name="logout" size={20} color={COLORS.white} />
            </View>
            <Text style={style.listText}>Logout</Text>
            <Icon name="chevron-right" size={30} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    height: 90,
    backgroundColor: 'rgba(222,222,222,0.4)',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageCon: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    borderRadius: 80,
    height: 70,
    width: 70,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  listIcon: {
    height: 40,
    width: 40,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listText: {marginLeft: 10, color: COLORS.primary, flex: 1},
  title: {
    color: COLORS.secondary,
    marginBottom: 20,
    marginTop: 20,
    fontSize: 16,
  },
  image: {
    height: '100%',
    width: '100%',
    borderColor: COLORS.secondary,
    borderWidth: 1,
    borderRadius: 80,
  },
});
export default ProfileScreen;
