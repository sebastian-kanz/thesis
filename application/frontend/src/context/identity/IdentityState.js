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
  IDENTITY_ERROR
} from '../types';

export const IDENTITY_CONTRACT_ADDR = '0x41161C77e50607BAa13185BB3b2a49cbbB6DB17B';
export const IDENTITY_CONTRACT_ABI =
[
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_roleID",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_identity",
				"type": "address"
			}
		],
		"name": "addIdentity",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_roleID",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_identity",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "addIdentityOwnedBy",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "addTestData",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "_identity",
				"type": "address"
			}
		],
		"name": "deleteIdentity",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "_identity",
				"type": "address"
			}
		],
		"name": "getIdentityCreationTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "_identity",
				"type": "address"
			}
		],
		"name": "getIdentityName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "_identity",
				"type": "address"
			}
		],
		"name": "getIdentityOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "_identity",
				"type": "address"
			}
		],
		"name": "getIdentityRole",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "_identity",
				"type": "address"
			}
		],
		"name": "getIdentityRoleName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getKnownDevices",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getKnownManufacturers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getKnownServiceProviders",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getKnownSuppliers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "_identity",
				"type": "address"
			}
		],
		"name": "identityExists",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "testConnection",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const IdentityState = props => {
  const initialState = {
    account: null,
    web3: new Web3(window.web3.currentProvider),
    identityContract: new (new Web3(window.web3.currentProvider)).eth.Contract(IDENTITY_CONTRACT_ABI, IDENTITY_CONTRACT_ADDR),
    ownIdentity: null,
    knownDevices: [],
    knownManufacturers: [],
    knownServiceProviders: [],
    knownSuppliers: [],
    identities: [],
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(identityReducer, initialState);

  const resetIdentity = () => {
    try {
      dispatch({
        type: IDENTITY_RESET
      });
    } catch (err) {
      dispatch({
        type: IDENTITY_ERROR,
        payload: err
      });
    }
  }

  const setOwnIdentity = async(address) => {
    try {
      let identity = await addIdentity(address);
      dispatch({
        type: SET_OWN_IDENTITY,
        payload: identity
      });
    } catch (err) {
      dispatch({
        type: IDENTITY_ERROR,
        payload: err
      });
    }
  }

  const getKnownDevices = async() => {
    try {
      let devices = await state.identityContract.methods.getKnownDevices().call();
      dispatch({
        type: GET_KNOWN_DEVICES,
        payload: devices
      });
    } catch (err) {
      dispatch({
        type: IDENTITY_ERROR,
        payload: err
      });
    }
  }

  const getKnownManufacturers = async() => {
    try {
      let manufacturers = await state.identityContract.methods.getKnownManufacturers().call();
      dispatch({
        type: GET_KNOWN_MANUFACTURERS,
        payload: manufacturers
      });
    } catch (err) {
      dispatch({
        type: IDENTITY_ERROR,
        payload: err
      });
    }
  }

  const getKnownServiceProviders = async() => {
    try {
      let serviceProviders = await state.identityContract.methods.getKnownServiceProviders().call();
      dispatch({
        type: GET_KNOWN_SERVICEPROVIDERS,
        payload: serviceProviders
      });
    } catch (err) {
      dispatch({
        type: IDENTITY_ERROR,
        payload: err
      });
    }
  }

  const getKnownSuppliers = async() => {
    try {
      let suppliers = await state.identityContract.methods.getKnownSuppliers().call();
      dispatch({
        type: GET_KNOWN_SUPPLIERS,
        payload: suppliers
      });
    } catch (err) {
      dispatch({
        type: IDENTITY_ERROR,
        payload: err
      });
    }
  }

  const addIdentity = async(address) => {
    try {
      let alreadyKnown = false;
      if(state.identities.length > 0) {
        state.identities.map((identity) => {
          if(identity['address'] == address.toLowerCase()) {
            alreadyKnown = true;
            return;
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
          return;
        }
        let name = await state.identityContract.methods.getIdentityName(address).call({from: state.account});
        let role = await state.identityContract.methods.getIdentityRole(address).call({from: state.account});
        let owner = await state.identityContract.methods.getIdentityOwner(address).call({from: state.account});
        let identity = { 'address': address.toLowerCase(), 'name': name, 'role': role, 'owner': owner }
        let identities = state.identities;
        identities.push(identity);
        dispatch({
          type: ADD_IDENTITY,
          payload: identities
        });
        return identity;
      } else {
        return null;
      }
    } catch (err) {
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
              return;
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
            return;
          }
          let name = await state.identityContract.methods.getIdentityName(address).call({from: state.account});
          let role = await state.identityContract.methods.getIdentityRole(address).call({from: state.account});
          let owner = await state.identityContract.methods.getIdentityOwner(address).call({from: state.account});
          let identity = { 'address': address.toLowerCase(), 'name': name, 'role': role, 'owner': owner }
          identities.push(identity);
        }
      }
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


  return (
    <IdentityContext.Provider
      value={{
        web3: state.web3,
        identityContract: state.identityContract,
        ownIdentity: state.ownIdentity,
        knownDevices: state.knownDevices,
        knownManufacturers: state.knownManufacturers,
        knownServiceProviders: state.knownServiceProviders,
        knownSuppliers: state.knownSuppliers,
        identities: state.identities,
        loading: state.loading,
        error: state.error,
        setOwnIdentity,
        getKnownDevices,
        getKnownManufacturers,
        getKnownServiceProviders,
        getKnownSuppliers,
        addIdentity,
        addIdentities,
        resetIdentity
      }}
    >
      {props.children}
    </IdentityContext.Provider>
  );
};

export default IdentityState;
