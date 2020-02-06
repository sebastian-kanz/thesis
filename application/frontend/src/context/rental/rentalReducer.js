import {
  RENTAL_RESET,
  SET_RENTAL_ACCOUNT,
  GET_AGREEMENTS,
  GET_RENTABLE_DEVICES,
  ACCEPT_RENTAL_AGREEMENT,
  RENTAL_ERROR,
  ADD_REQUEST,
  GET_REQUESTS,
  ADD_TEST_RENTAL_AGREEMENTS,
  TERMINATE_RENTAL_AGREEMENT,
  ADD_AGREEMENT
} from '../types';

import RENTAL_CONTRACT_ADDR from './RentalState'

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
        account: RENTAL_CONTRACT_ADDR,
        rentalAgreements: [],
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
    case ADD_TEST_RENTAL_AGREEMENTS:
      return {
        ...state,
        loading: false
      };
    case TERMINATE_RENTAL_AGREEMENT:
      return {
        ...state,
        numActiveAgreements: state.numActiveAgreements--,
        numTerminatedAgreements: state.numTerminatedAgreements++,
        loading: false
      };
    case ADD_REQUEST:
      return {
        ...state,
        rentableDevices: state.rentableDevices.filter(
          device => device !== action.payload
        ),
        loading: false
      };
    case ADD_AGREEMENT:
      return {
        ...state,
        rentalAgreements: [action.payload, ...state.rentalAgreements],
        loading: false
      };
    case GET_REQUESTS:
      return {
        ...state,
        requests: action.payload,
        numRequests: action.payload[Object.keys(action.payload)[0]].length,
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
