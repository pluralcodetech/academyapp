const messageAlertData = (
  state = {visible: false, title: '', message: ''},
  action,
) => {
  switch (action.type) {
    case 'UPDATE_MODAL':
      return action.payload;
    default:
      return state;
  }
};

export default messageAlertData;
