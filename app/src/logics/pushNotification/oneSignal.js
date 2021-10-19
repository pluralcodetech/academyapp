import OneSignal from 'react-native-onesignal';
const oneSignal = () => {
  //OneSignal Init Code
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId('7e679d42-e3ee-45bd-9c5d-e7e713212c13');
  //END OneSignal Init Code

  //Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(
    notificationReceivedEvent => {},
  );
};

const openScreenOnOneSignalNotificationClick = (navigation, loggedIn) => {
  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler(notification => {
    const data = notification?.notification?.additionalData;

    console.log(data?.cattype?.toUpperCase());
    console.log(data);
    if (loggedIn) {
      if (data?.cattype?.toUpperCase() == 'EVENT') {
        //Navigate user to event details screen
        navigation.navigate('EventsDetails', {
          details: data,
          time: new Date().getTime(),
        });
      } else if (data?.cattype?.toUpperCase() == 'COURSE') {
        //Navigate user to course details screen
        navigation.navigate('CourseDetailsScreen', {
          details: data,
          time: new Date().getTime(),
        });
      } else {
        console.log('episode');
        //Navigate user to course details screen
        navigation.navigate('EpisodeDetailsScreen', {
          details: data,
          time: new Date().getTime(),
        });
      }
    }
  });
};

export {oneSignal, openScreenOnOneSignalNotificationClick};
