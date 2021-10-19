import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SignUpScreen from '../screens/authScreens/SignUpScreen';
import SignInScreen from '../screens/authScreens/SignInScreen';
import OtpScreen from '../screens/authScreens/OtpScreen';
import BottomTabNavigator from './BottomTabNavigator';
import {useSelector} from 'react-redux';
import {
  closeMessageModal,
  MessageAlertModal,
} from '../components/modals/MessageAlertModal';

const Stack = createStackNavigator();
const RootNavigator = () => {
  const [loggedIn, setLoggedIn] = React.useState(null);
  const [appHasBeenOpened, setAppHasBeenOpened] = React.useState(false);
  const [showSplashScreen, setShowSplashScreen] = React.useState(true);
  const data = useSelector(state => state.userData);
  const messageAlertData = useSelector(state => state.messageAlertData);

  React.useEffect(() => {
    setLoggedIn(data.loggedIn);
    setAppHasBeenOpened(data.appHasBeenOpened);
  }, [data]);

  React.useEffect(async () => {
    //Hide splashscreen after 4s
    setTimeout(() => setShowSplashScreen(false), 3000);
  }, []);

  {
    return showSplashScreen ? (
      <SplashScreen />
    ) : (
      <NavigationContainer>
        {/* Render custom message alert */}
        <MessageAlertModal
          visible={messageAlertData?.visible}
          title={messageAlertData?.title}
          message={messageAlertData?.message}
          option={messageAlertData?.option}
          closeModal={closeMessageModal}
        />
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {loggedIn ? (
            <>
              <Stack.Screen name="Home" component={BottomTabNavigator} />
            </>
          ) : (
            <>
              {!appHasBeenOpened && (
                <Stack.Screen
                  name="OnboardingScreen"
                  component={OnboardingScreen}
                />
              )}
              <Stack.Screen name="SignInScreen" component={SignInScreen} />
              <Stack.Screen name="OtpScreen" component={OtpScreen} />
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default RootNavigator;
