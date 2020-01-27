import {
  RENTAL_RESET,
  SET_RENTAL_ACCOUNT,
  PAY,
  GET_AGREEMENTS,
  GET_PAYMENTS,
  GET_RENTABLE_DEVICES,
  ACCEPT_RENTAL_AGREEMENT,
  RENTAL_ERROR,
  ADD_TEST_RENTAL_AGREEMENTS
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case SET_RENTAL_ACCOUNT:
      return {
        ...state,
        account: action.payload
      };
    case RENTAL_RESET:
      return {
        ...state,
        account: null,
        rentalAgreements: [],
        payments: [],
        rentableDevices: [],
        numPendingAgreements: 0,
        numActiveAgreements: 0,
        numTerminatedAgreements: 0,
        loading: false
      };
    case GET_AGREEMENTS:
      return {
        ...state,
        rentalAgreements: action.payload,
        numPendingAgreements: action.numPending,
        numActiveAgreements: action.numActive,
        numTerminatedAgreements: action.numTerminated,
        loading: false
      };
    case GET_PAYMENTS:
      return {
        ...state,
        payments: action.payload,
        loading: false
      };
    case GET_RENTABLE_DEVICES:
      return {
        ...state,
        rentableDevices: action.payload,
        loading: false
      };
    case ACCEPT_RENTAL_AGREEMENT:
      return {
        ...state,
        loading: false
      };
    case PAY:
      return {
        ...state,
        loading: false
      };
    case ADD_TEST_RENTAL_AGREEMENTS:
      return {
        ...state,
        loading: false
      };
    case RENTAL_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};
