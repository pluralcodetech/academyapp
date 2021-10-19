import {API} from '../../conts/api';
import Store from '../../redux/store';
import FormData from 'form-data';
import {updateUserData} from './auth';

let timeout = null;
//get user data from server and update data
const getAndUpdateUserData = async () => {
  clearTimeout(timeout);
  const {data, settings, loggedIn} = Store.getState().userData;
  try {
    //Create and append to form
    const form = new FormData();
    form.append('id', data.id);

    // Send request to reg the user
    const response = await fetch(API + 'dashboardapi.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: form,
    });

    const resData = await response.json();
    console.log(resData);
    if (resData.status == 'success' && resData.active == 'YES') {
      if (loggedIn) {
        updateUserData({
          loggedIn: true,
          data: resData,
          appHasBeenOpened: true,
          settings: {...settings},
        });
      }
    } else {
      //Logout the user
      await updateUserData({
        loggedIn: false,
        data: {},
        appHasBeenOpened: true,
      });
    }
  } catch (error) {
    timeout = setTimeout(getAndUpdateUserData, 10000);
  }
};

export {getAndUpdateUserData};
