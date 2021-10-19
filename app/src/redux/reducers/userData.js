const userDataReducer = (
  state = {loggedIn: false, data: null, appHasBeenOpened: false},
  action,
) => {
  switch (action.type) {
    case 'UPDATE':
      return action.payload;
    default:
      return state;
  }
};

export default userDataReducer;
