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

export const PAYMENTPROVIDER_CONTRACT_ADDR = '0x363E679332da9824A42673de8B4c03136A07A3f5';
export const PAYMENTPROVIDER_CONTRACT_ABI =
[
	{
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
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "charge",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_hash",
				"type": "bytes32"
			}
		],
		"name": "empty",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
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
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "registerRentalProvider",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
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
		"stateMutability": "view",
		"type": "function"
	},
	{
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
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const PaymentState = props => {
  const initialState = {
    account: localStorage.getItem('account') || null,
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

  const getBalance = async(hash, controller) => {
    try {
      let balance = await state.paymentProviderContract.methods.getBalance(hash).call({from: state.account});
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
          type: PAYMENT_ERROR,
          payload: err
        });
      } else {
        console.log("cancelled");
      }
    }
  }

  const getPaymentHistory = async(hash, controller) => {
    try {
      let history = await state.paymentProviderContract.methods.getPaymentHistory(hash).call({from: state.account});
      if(!controller.cancelled) {
        dispatch({
          type: GET_PAYMENT_HISTORY,
          payload: history
        });
      } else {
        console.log("cancelled");
      }
    } catch (err) {
      if(!controller.cancelled) {
        dispatch({
          type: PAYMENT_ERROR,
          payload: err
        });
      } else {
        console.log("cancelled");
      }
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

  const getPaymentData = async(paymentHash, timestampStart, timestampEnd, units, usageFee, controller) => {
    try {
      let costs = units * usageFee;
      let hash = await state.web3.utils.soliditySha3(PAYMENTPROVIDER_CONTRACT_ADDR, timestampStart, timestampEnd, units, costs);
      let signature = await state.web3.eth.personal.sign(hash,state.account);
      let payment = {
        'timestampStart': timestampStart,
        'timestampEnd': timestampEnd,
        'units': units,
        'signature': signature,
        'hash': hash,
      }
      console.log(JSON.stringify(payment));
      if(!controller.cancelled) {
        dispatch({
          type: GET_PAYMENT_DATA
        });
      } else {
        console.log("cancelled");
      }
    } catch (err) {
      if(!controller.cancelled) {
        dispatch({
          type: PAYMENT_ERROR,
          payload: err
        });
      } else {
        console.log("cancelled");
      }
    }
  }
// {"timestampStart":"1580999861","timestampEnd":"1589639317","units":10,"signature":"0x5d534d729bfdb02a57d9766f002aea0180c8c0d1ac830a1089e45f9c6739912f490914775b6d5e5d4f138bb0fde84283c7a028b257eff030a277c2732ed328ce1c","hash":"0xdfc5cace8d4a967c482581155f177e74276d56324618268c0da5032848582094"}
  //bytes32 _hash, uint256 _timestampStart, uint256 _timestampEnd, uint256 _units, uint256 _cost, bytes memory _signature
  const redeem = async(hash, timestampStart, timestampEnd, units, costs, signature) => {
    try {
      console.log(costs);
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
