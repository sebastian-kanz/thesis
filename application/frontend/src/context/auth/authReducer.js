import {
  LOGIN,
  LOGOUT,
  AUTH_ERROR
} from '../types';
import IDENTITY_CONTRACT_ADDR from '../identity/IdentityState'

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
        account: IDENTITY_CONTRACT_ADDR,
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
