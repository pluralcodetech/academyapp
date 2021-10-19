import {Linking} from 'react-native';
import {openMessageModal} from '../view/components/modals/MessageAlertModal';

const openDialer = async num => {
  const supported = await Linking.canOpenURL('tel:' + num);

  if (supported) {
    Linking.openURL('tel:' + num);
  } else {
    openMessageModal('Error', 'Could not open dialer', 'error');
  }
};

export default openDialer;
