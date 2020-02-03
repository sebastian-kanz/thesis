import React, { useReducer } from 'react';
import PaymentContext from './paymentContext';
import paymentReducer from './paymentReducer';
import Web3 from 'web3'
import {
  PAYMENT_ERROR,
  GET_PAYMENT_HISTORY,
  CHARGE,
  GET_PAYMENT_DATA,
  REDEEM,
  SET_PAYMENT_ACCOUNT,
  GET_BALANCE
} from '../types';

export const PAYMENTPROVIDER_CONTRACT_ADDR = '0xE1D50f9f4fCC94E02EeEd3Ca1B635dc33533FBE6';
export const PAYMENTPROVIDER_CONTRACT_ABI =
[
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
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			},
			{
				"internalType": "address payable",
				"name": "_receiver",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "_sender",
				"type": "address"
			}
		],
		"name": "addPaymentAgreement",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "charge",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "empty",
		"outputs": [],
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
		"constant": false,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "getPaymentHistory",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
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
		"constant": false,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "_timestampStart",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_timestampEnd",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_units",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_cost",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_signature",
				"type": "bytes"
			}
		],
		"name": "redeem",
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
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "registerRentalProvider",
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

const PaymentState = props => {
  const initialState = {
    account: null,
    web3: new Web3(window.web3.currentProvider),
    paymentProviderContract: new (new Web3(window.web3.currentProvider)).eth.Contract(PAYMENTPROVIDER_CONTRACT_ABI, PAYMENTPROVIDER_CONTRACT_ADDR),
    balance: 0,
    paymentHistory: [],
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(paymentReducer, initialState);


  const charge = async(hash, amount) => {
    try {
      await state.paymentProviderContract.methods.charge(hash).send({from: state.account, value: amount});

      dispatch({
        type: CHARGE,
        payload: amount
      });
    } catch (err) {
      dispatch({
        type: PAYMENT_ERROR,
        payload: err
      });
    }
  }

  const getBalance = async(hash) => {
    try {
      let balance = await state.paymentProviderContract.methods.getBalance(hash).call({from: state.account});
      dispatch({
        type: GET_BALANCE,
        payload: balance
      });
    } catch (err) {
      dispatch({
        type: PAYMENT_ERROR,
        payload: err
      });
    }
  }

  const getPaymentHistory = async(hash) => {
    try {
      let history = await state.paymentProviderContract.methods.getPaymentHistory(hash).call({from: state.account});
      dispatch({
        type: GET_PAYMENT_HISTORY,
        payload: history
      });
    } catch (err) {
      dispatch({
        type: PAYMENT_ERROR,
        payload: err
      });
    }
  }

  const setPaymentAccount = (account) => {
    try {
      dispatch({
        type: SET_PAYMENT_ACCOUNT,
        payload: account
      });
    } catch (err) {
      dispatch({
        type: PAYMENT_ERROR,
        payload: err
      });
    }
  }

  const getPaymentData = async(paymentHash) => {
    try {
      let timestampStart = 1580386022;
      let timestampEnd = 1580396024;
      let units = 1;
      let costs = units * 58000000000000000;
      let hash = await state.web3.utils.soliditySha3(PAYMENTPROVIDER_CONTRACT_ADDR, timestampStart, timestampEnd, units, costs);
      let signature = await state.web3.eth.personal.sign(hash,state.account);
      console.log("timestampStart: ", timestampStart);
      console.log("timestampEnd: ", timestampEnd);
      console.log("units: ", units);
      console.log("costs: ", costs);
      console.log("signature: ",signature);
      console.log("hash: ",paymentHash);
      dispatch({
        type: GET_PAYMENT_DATA
      });
    } catch (err) {
      dispatch({
        type: PAYMENT_ERROR,
        payload: err
      });
    }
  }

  //bytes32 _hash, uint256 _timestampStart, uint256 _timestampEnd, uint256 _units, uint256 _cost, bytes memory _signature
  const redeem = async(hash, timestampStart, timestampEnd, units, costs, signature) => {
    try {
      await state.paymentProviderContract.methods.redeem(hash, timestampStart, timestampEnd, units, costs, signature).send({from: state.account});

      dispatch({
        type: REDEEM
      });
    } catch (err) {
      dispatch({
        type: PAYMENT_ERROR,
        payload: err
      });
    }
  }


  return (
    <PaymentContext.Provider
      value={{
        account: state.account,
        web3: state.web3,
        paymentProviderContract: state.paymentProviderContract,
        balance: state.balance,
        paymentHistory: state.paymentHistory,
        loading: state.loading,
        error: state.error,
        setPaymentAccount,
        charge,
        getPaymentHistory,
        getPaymentData,
        redeem,
        getBalance
      }}
    >
      {props.children}
    </PaymentContext.Provider>
  );
};

export default PaymentState;
