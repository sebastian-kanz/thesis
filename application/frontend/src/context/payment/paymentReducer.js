import {
  PAYMENT_ERROR,
  ADD_PAYMENT_HASH,
  CHARGE,
  GET_SIGNED_PAYMENT_JSON,
  REDEEM,
  SET_PAYMENT_ACCOUNT,
  GET_PAYMENT_AGREEMENTS
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case GET_PAYMENT_AGREEMENTS:
      return {
        ...state,
        paymentAgreements: action.payload
      };
    case ADD_PAYMENT_HASH:
      return {
        ...state,
        paymentHashes: [...state.paymentHashes, action.payload]
      };
    case CHARGE:
      return {
        ...state,
        paymentAgreements: state.paymentAgreements.map(paymentAgreement =>
          paymentAgreement.paymentHash === action.hash ? action.newPaymentAgreement : paymentAgreement
        ),
      };
    case GET_SIGNED_PAYMENT_JSON:
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
    default:
      return state;
  }
};
