import {
  IDENTITY_RESET,
  SET_OWN_IDENTITY,
  GET_KNOWN_DEVICES,
  GET_KNOWN_MANUFACTURERS,
  GET_KNOWN_SERVICEPROVIDERS,
  GET_KNOWN_SUPPLIERS,
  ADD_IDENTITY,
  ADD_IDENTITIES,
  IDENTITY_ERROR,
  LOGIN,
  LOGOUT,
  GET_BALANCE
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        account: action.account,
        balance: action.balance,
        ownIdentity: action.ownIdentity,
        authenticated: true
      };
    case LOGOUT:
      return {
        ...state,
        account: '0x0000000000000000000000000000000000000001',
        balance: 0.0,
        ownIdentity: null,
        authenticated: false
      };
    case GET_KNOWN_DEVICES:
      return {
        ...state,
        knownDevices: action.payload,
        loading: false
      };
    case GET_KNOWN_MANUFACTURERS:
      return {
        ...state,
        knownManufacturers: action.payload,
        loading: false
      };
    case GET_KNOWN_SERVICEPROVIDERS:
      return {
        ...state,
        knownServiceProviders: action.payload,
        loading: false
      };
    case GET_KNOWN_SUPPLIERS:
      return {
        ...state,
        knownSuppliers: action.payload,
        loading: false
      };
    case ADD_IDENTITY:
      return {
        ...state,
        identities: action.payload,
        loading: false
      };
    case ADD_IDENTITIES:
      return {
        ...state,
        identities: action.payload,
        loading: false
      };
    case GET_BALANCE:
      return {
        ...state,
        balance: action.payload
      };
    case IDENTITY_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};
