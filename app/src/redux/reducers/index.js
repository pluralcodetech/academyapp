import {combineReducers} from 'redux';
import userDataReducer from './userData';
import messageAlertData from './messageAlertData';

export default combineReducers({
  userData: userDataReducer,
  messageAlertData,
});
