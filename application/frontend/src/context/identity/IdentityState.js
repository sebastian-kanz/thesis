import React, { useReducer } from 'react';
import IdentityContext from './identityContext';
import identityReducer from './identityReducer';
import Web3 from 'web3'

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

import IDENTITY_CONTRACT_ABI from './IdentityProvider'
export const IDENTITY_CONTRACT_ADDR = '0xA17351BfA16dAE1FD285e11AcC00882Eb459C7cb';


Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

Storage.prototype.removeObject = function(key) {
    this.removeItem(key);
}

const IdentityState = props => {
  const initialState = {
    account: localStorage.getItem('account') || IDENTITY_CONTRACT_ADDR,
    web3: new Web3(window.web3.currentProvider),
    identityContract: new (new Web3(window.web3.currentProvider)).eth.Contract(IDENTITY_CONTRACT_ABI, IDENTITY_CONTRACT_ADDR),
    ownIdentity: localStorage.getObject('ownIdentity') || null,
    balance: localStorage.getItem('balance') || 0,
    authenticated: localStorage.getItem('authenticated') || false,
    knownDevices: [],
    knownManufacturers: [],
    knownServiceProviders: [],
    knownSuppliers: [],
    identities: localStorage.getObject('identities') || [],
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(identityReducer, initialState);

  const login = async() => {
    try {
      let account = (await window.ethereum.enable())[0];
      let tmp = await state.web3.eth.getBalance(account);
      let balance = await Web3.utils.fromWei(tmp.toString(), "ether");
      let identity = await addIdentity(account);
      if(!identity) {
        dispatch({
          type: IDENTITY_ERROR,
          payload: "Unknown identity!"
        });
        console.log("Unknown identity!!!");
        return null;
      }
      localStorage.setItem('account', account);
      localStorage.setObject('ownIdentity', identity);
      localStorage.setItem('balance', balance);
      localStorage.setItem('authenticated', true);
      dispatch({
        type: LOGIN,
        account: account,
        balance: balance,
        ownIdentity: identity
      });
      return account;
    } catch (err) {
      dispatch({
        type: IDENTITY_ERROR,
        payload: err
      });
    }
  }

  const logout = async() => {
    localStorage.removeItem('account');
    localStorage.removeObject('ownIdentity');
    localStorage.removeItem('balance');
    localStorage.removeItem('authenticated');
    localStorage.removeObject('identities');
    try {
      dispatch({
        type: LOGOUT
      });
    } catch (err) {
      dispatch({
        type: IDENTITY_ERROR,
        payload: err
      });
    }
  }

  const getKnownDevices = async(controller) => {
    try {
      let devices = await state.identityContract.methods.getKnownDevices().call();
      if(!controller.cancelled) {
        dispatch({
          type: GET_KNOWN_DEVICES,
          payload: devices
        });
        addIdentities(devices);
      } else {
        console.log("cancelled");
      }
    } catch (err) {
      if(!controller.cancelled) {
        dispatch({
          type: IDENTITY_ERROR,
          payload: err
        });
      } else {
        console.log("cancelled");
      }
    }
  }

  const getKnownManufacturers = async(controller) => {
    try {
      let manufacturers = await state.identityContract.methods.getKnownManufacturers().call();
      if(!controller.cancelled) {
        dispatch({
          type: GET_KNOWN_MANUFACTURERS,
          payload: manufacturers
        });
        addIdentities(manufacturers);
      } else {
        console.log("cancelled");
      }
    } catch (err) {
      if(!controller.cancelled) {
        dispatch({
          type: IDENTITY_ERROR,
          payload: err
        });
      } else {
        console.log("cancelled");
      }
    }
  }

  const getKnownServiceProviders = async(controller) => {
    try {
      let serviceProviders = await state.identityContract.methods.getKnownServiceProviders().call();
      if(!controller.cancelled) {
        dispatch({
          type: GET_KNOWN_SERVICEPROVIDERS,
          payload: serviceProviders
        });
        addIdentities(serviceProviders);
      } else {
        console.log("cancelled");
      }
    } catch (err) {
      if(!controller.cancelled) {
        dispatch({
          type: IDENTITY_ERROR,
          payload: err
        });
      } else {
        console.log("cancelled");
      }
    }
  }

  const getKnownSuppliers = async(controller) => {
    try {
      let suppliers = await state.identityContract.methods.getKnownSuppliers().call();
      if(!controller.cancelled) {
        dispatch({
          type: GET_KNOWN_SUPPLIERS,
          payload: suppliers
        });
        addIdentities(suppliers);
      } else {
        console.log("cancelled");
      }
    } catch (err) {
      if(!controller.cancelled) {
        dispatch({
          type: IDENTITY_ERROR,
          payload: err
        });
      } else {
        console.log("cancelled");
      }
    }
  }

  const addIdentity = async(address) => {
    try {
      let alreadyKnown = false;
      if(state.identities.length > 0) {
        state.identities.map((identity) => {
          if(identity['address'] == address.toLowerCase()) {
            alreadyKnown = true;
            return identity;
          }
        });
      }
      if(!alreadyKnown) {
        let verified = await state.identityContract.methods.identityExists(address).call({from: address});
        if(!verified) {
          dispatch({
            type: IDENTITY_ERROR,
            payload: "Unknown identity!"
          });
          return null;
        }
        let name = await state.identityContract.methods.getIdentityName(address).call({from: address});
        let role = await state.identityContract.methods.getIdentityRole(address).call({from: address});
        let owner = await state.identityContract.methods.getIdentityOwner(address).call({from: address});
        let identity = { 'address': address.toLowerCase(), 'name': name, 'role': role, 'owner': owner }
        let identities = state.identities;
        identities.push(identity);
        localStorage.setObject('identities', identities);
        dispatch({
          type: ADD_IDENTITY,
          payload: identities
        });
        return identity;
      } else {
        return null;
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: IDENTITY_ERROR,
        payload: err
      });
    }
  }


  const addIdentities = async(addresses) => {
    try {
      let identities = state.identities;
      const filtered = addresses.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
      for (const address of filtered) {
        let alreadyKnown = false;
        if(state.identities.length > 0) {
          state.identities.map((identity) => {
            if(identity['address'] == address.toLowerCase()) {
              alreadyKnown = true;
            }
          });
        }
        if(!alreadyKnown) {
          let verified = await state.identityContract.methods.identityExists(address).call({from: state.account});
          if(!verified) {
            dispatch({
              type: IDENTITY_ERROR,
              payload: "Unknown identity!"
            });
            console.log("error");
          }
          let name = await state.identityContract.methods.getIdentityName(address).call({from: state.account});
          let role = await state.identityContract.methods.getIdentityRole(address).call({from: state.account});
          let owner = await state.identityContract.methods.getIdentityOwner(address).call({from: state.account});
          let identity = { 'address': address.toLowerCase(), 'name': name, 'role': role, 'owner': owner }
          identities.push(identity);
        }
      }

      localStorage.setObject('identities', identities);
      dispatch({
        type: ADD_IDENTITY,
        payload: identities
      });
    } catch (err) {
      dispatch({
        type: IDENTITY_ERROR,
        payload: err
      });
    }
  }


  const getBalance = async(controller) => {
    try {

      let tmp = await state.web3.eth.getBalance(state.account);
      let balance = await Web3.utils.fromWei(tmp.toString(), "ether");
      localStorage.setItem('balance', balance);
      if(!controller.cancelled) {
        dispatch({
          type: GET_BALANCE,
          payload: balance
        });
      } else {
        console.log("cancelled");
      }
    } catch (err) {
      if(!controller.cancelled) {
        dispatch({
          type: IDENTITY_ERROR,
          payload: err
        });
      } else {
        console.log("cancelled");
      }
    }
  }

  return (
    <IdentityContext.Provider
      value={{
        web3: state.web3,
        identityContract: state.identityContract,
        ownIdentity: state.ownIdentity,
        balance: state.balance,
        authenticated: state.authenticated,
        knownDevices: state.knownDevices,
        knownManufacturers: state.knownManufacturers,
        knownServiceProviders: state.knownServiceProviders,
        knownSuppliers: state.knownSuppliers,
        identities: state.identities,
        loading: state.loading,
        error: state.error,
        login,
        logout,
        getBalance,
        getKnownDevices,
        getKnownManufacturers,
        getKnownServiceProviders,
        getKnownSuppliers,
        addIdentity,
        addIdentities
      }}
    >
      {props.children}
    </IdentityContext.Provider>
  );
};

export default IdentityState;
