import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import {View, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import Text from '../components/Text';
import COLORS from '../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NewAndEventsScreen from '../screens/NewAndEventsScreen';
import CoursesScreen from '../screens/CoursesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EventsDetails from '../screens/EventsDetails';
import CourseDetailsScreen from '../screens/CourseDetailsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import {openScreenOnOneSignalNotificationClick} from '../../logics/pushNotification/oneSignal';
import {useSelector} from 'react-redux';
import EpisodesScreen from '../screens/EpisodesScreen';
import EpisodeDetailsScreen from '../screens/EpisodeDetailsScreen';
import PdfScreen from '../screens/PdfScreen';
const Tab = createBottomTabNavigator();

const TabIcon = ({label, focus}) => {
  let MainIcon = null;
  if (label == 'Home') {
    MainIcon = <Icon name="home-variant" color={COLORS.secondary} size={20} />;
  } else if (label == 'New & Events') {
    MainIcon = (
      <Icon name="calendar-outline" color={COLORS.secondary} size={20} />
    );
  } else if (label == 'Courses') {
    MainIcon = <Icon name="school" color={COLORS.secondary} size={20} />;
  } else if (label == 'Profile') {
    MainIcon = <Icon name="account" color={COLORS.secondary} size={20} />;
  }

  return (
    <View
      style={[
        style.iconContainer,
        {backgroundColor: focus ? COLORS.white : 'transparent'},
      ]}>
      {MainIcon}
    </View>
  );
};
const TabBar = ({state, descriptors, navigation}) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={style.tabBar}>
      <StatusBar backgroundColor={COLORS.primary} />
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        let isFocused = state.index === index;

        //Force focus on some screen
        if (
          (state.index == 4 && index == 1) ||
          (state.index == 5 && index == 2) ||
          (state.index == 6 && index == 3)
        ) {
          isFocused = true;
        }

        const onPress = () => {
          navigation.navigate(route.name, {time: new Date().getTime()});
        };
        if (
          label != 'EventsDetails' &&
          label != 'CourseDetailsScreen' &&
          label != 'EditProfileScreen' &&
          label != 'EpisodesScreen' &&
          label != 'EpisodeDetailsScreen' &&
          label != 'PdfScreen'
        ) {
          return (
            <TouchableOpacity
              key={'Tab' + index}
              activeOpacity={0.7}
              onPress={onPress}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}>
              <TabIcon label={label} focus={isFocused} />
              <Text style={{color: COLORS.white, fontSize: 10}}>{label}</Text>
            </TouchableOpacity>
          );
        }
      })}
    </View>
  );
};
const BottomTabNavigator = ({navigation}) => {
  const {loggedIn} = useSelector(state => state.userData);
  React.useEffect(() => {
    openScreenOnOneSignalNotificationClick(navigation, loggedIn);
  }, []);
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{tabBarLabel: 'Home'}}
      />
      <Tab.Screen
        name="NewAndEventsScreen"
        component={NewAndEventsScreen}
        options={{tabBarLabel: 'New & Events'}}
      />
      <Tab.Screen
        name="CoursesScreen"
        component={CoursesScreen}
        options={{tabBarLabel: 'Courses'}}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{tabBarLabel: 'Profile'}}
      />
      <Tab.Screen
        name="EventsDetails"
        component={EventsDetails}
        options={{tabBarLabel: 'EventsDetails'}}
      />
      <Tab.Screen
        name="CourseDetailsScreen"
        component={CourseDetailsScreen}
        options={{tabBarLabel: 'CourseDetailsScreen'}}
      />
      <Tab.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{tabBarLabel: 'EditProfileScreen'}}
      />
      <Tab.Screen
        name="EpisodesScreen"
        component={EpisodesScreen}
        options={{tabBarLabel: 'EpisodesScreen'}}
      />
      <Tab.Screen
        name="EpisodeDetailsScreen"
        component={EpisodeDetailsScreen}
        options={{tabBarLabel: 'EpisodeDetailsScreen'}}
      />
      <Tab.Screen
        name="PdfScreen"
        component={PdfScreen}
        options={{tabBarLabel: 'PdfScreen'}}
      />
    </Tab.Navigator>
  );
};

const style = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  iconContainer: {
    height: 30,
    width: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
  },
});

export default BottomTabNavigator;
