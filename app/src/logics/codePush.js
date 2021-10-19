const codePushUpdate = async codePush => {
  codePush.notifyAppReady();
  try {
    const update = await codePush.checkForUpdate();
    //update is availaible show alert
    if (!update) {
      console.log('The app is up to date!');
    } else if (update) {
      codePush.sync(
        {updateDialog: false, installMode: codePush.InstallMode.IMMEDIATE},
        status => {},
      );
    }
    // console.log(update);
  } catch (error) {
    console.log(error);
  }
};

export default codePushUpdate;
