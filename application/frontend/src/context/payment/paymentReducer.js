import {
  PAYMENT_ERROR,
  GET_PAYMENT_HISTORY,
  CHARGE,
  GET_PAYMENT_DATA,
  REDEEM,
  SET_PAYMENT_ACCOUNT,
  GET_BALANCE
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_PAYMENT_HISTORY:
      return {
        ...state,
        paymentHistory: action.payload
      };
    case CHARGE:
      return {
        ...state
      };
    case GET_PAYMENT_DATA:
      return {
        ...state
      };
    case REDEEM:
      return {
        ...state
      };
    case SET_PAYMENT_ACCOUNT:
      return {
        ...state,
        account: action.payload
      };
    case PAYMENT_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case GET_BALANCE:
      return {
        ...state,
        balance: action.payload
      };
    default:
      return state;
  }
};
