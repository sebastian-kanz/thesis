import {
  LOGIN,
  LOGOUT,
  AUTH_ERROR
} from '../types';

export default (state, action) => {
  switch (action.type) {
    // case SET_IDENTITY_ACCOUNT:
    //   return {
    //     ...state,
    //     account: action.payload
    //   };
    case LOGIN:
      return {
        ...state,
        account: action.account,
        balance: action.balance,
        authenticated: true
      };
    case LOGOUT:
      return {
        ...state,
        account: null,
        balance: 0.0,
        authenticated: false
      };
    case AUTH_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};
