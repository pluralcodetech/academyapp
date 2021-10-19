import 'react-native-gesture-handler';
import React from 'react';
import {Provider} from 'react-redux';
import Store from './app/src/redux/store';
import RootNavigator from './app/src/view/navigators/RootNavigator';
import {dispatchUserDataToStore} from './app/src/logics/auth/auth';
import codePushUpdate from './app/src/logics/codePush';
import codePush from 'react-native-code-push';
import {oneSignal} from './app/src/logics/pushNotification/oneSignal';
const PRODUCTION = true;

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
};
const App = () => {
  React.useEffect(() => {
    if (PRODUCTION) {
      codePushUpdate(codePush);
    }
    oneSignal();
    dispatchUserDataToStore();
  }, []);
  return (
    <Provider store={Store}>
      <RootNavigator />
    </Provider>
  );
};

export default codePush(codePushOptions)(App);
