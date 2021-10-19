import RNFetchBlob from 'rn-fetch-blob';
import {openMessageModal} from '../view/components/modals/MessageAlertModal';
import MESSAGES from '../conts/messages';
import {PermissionsAndroid, Platform} from 'react-native';

function getExtention(fileName) {
  return '.' + fileName.replace(/^.*?\.([a-zA-Z0-9]+)$/, '$1');
}

const downloadFile = async (name, link, setState, navigation) => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const ext = getExtention(link);
        const dirs = RNFetchBlob.fs.dirs.DownloadDir;
        const fliePath = dirs + '/' + name.replace(/\s+/g, '_') + '' + ext;
        setState(prevState => ({...prevState, showPreloader: true}));
        const file = await RNFetchBlob.config({
          fileCache: true,
          addAndroidDownloads: {
            notification: true,
            title: name,
            useDownloadManager: true,
            path: fliePath,
          },
        }).fetch('GET', link, {});

        setState(prevState => ({...prevState, showPreloader: false}));
        openMessageModal(
          'Success',
          `${name} curriculum downloaded to your device.`,
          [
            {
              text: 'OPEN CURRICULUM',
              onPress: () =>
                navigation.navigate('PdfScreen', {
                  source: {uri: link},
                  time: new Date().getTime(),
                }),
            },
          ],
        );
      } else {
        openMessageModal(
          'Error',
          'Please allow storage permission to continue',
          'error',
        );
      }
    } catch (error) {
      console.log(error);
      openMessageModal('Error', MESSAGES.error, 'error');
      setState(prevState => ({...prevState, showPreloader: false}));
    }
  }
};

export default downloadFile;
