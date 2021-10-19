const userDataAction = data => {
  return {
    type: 'UPDATE',
    payload: data,
  };
};

const meessageAlertModalAction = data => {
  return {
    type: 'UPDATE_MODAL',
    payload: data,
  };
};

export {userDataAction, meessageAlertModalAction};
