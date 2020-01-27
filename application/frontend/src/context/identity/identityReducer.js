import {
  IDENTITY_RESET,
  SET_OWN_IDENTITY,
  GET_KNOWN_DEVICES,
  GET_KNOWN_MANUFACTURERS,
  GET_KNOWN_SERVICEPROVIDERS,
  GET_KNOWN_SUPPLIERS,
  ADD_IDENTITY,
  ADD_IDENTITIES,
  IDENTITY_ERROR
} from '../types';

export default (state, action) => {
  switch (action.type) {
    case IDENTITY_RESET:
      return {
        ...state,
        account: null,
        ownIdentity: null,
        knownDevices: [],
        knownManufacturers: [],
        knownServiceProviders: [],
        knownSuppliers: [],
        identities: [],
        loading: false
      };
    case SET_OWN_IDENTITY:
      return {
        ...state,
        ownIdentity: action.payload
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
    case IDENTITY_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};
