import React, { useReducer } from 'react';
import PaymentContext from './paymentContext';
import paymentReducer from './paymentReducer';
import Web3 from 'web3'
import {
  PAYMENT_ERROR,
  GET_PAYMENT_AGREEMENTS,
  ADD_PAYMENT_HASH,
  CHARGE,
  GET_SIGNED_PAYMENT_JSON,
  REDEEM,
  SET_PAYMENT_ACCOUNT,
  GET_BALANCE_OF_PAYMENT_AGREEMENT
} from '../types';

import {PROVIDER} from '../../constants.js';

import PAYMENTPROVIDER_CONTRACT_ABI from './PaymentProvider.js'
export const PAYMENTPROVIDER_CONTRACT_ADDR = '0x3BE0C37e881EA08D99e1acb017A68028e410B3Af';


// address payable sender;
// address payable receiver;
// address device;
// uint256 balance;
// history

const PaymentState = props => {
  const initialState = {
    account: localStorage.getItem('account') || null,
    web3: new Web3(PROVIDER),
    paymentProviderContract: new (new Web3(PROVIDER)).eth.Contract(PAYMENTPROVIDER_CONTRACT_ABI, PAYMENTPROVIDER_CONTRACT_ADDR),
    paymentAgreements: [],
    paymentHashes: [],
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const charge = async(hash, amount) => {
    try {
      await state.paymentProviderContract.methods.charge(hash).send({from: state.account, value: amount});
      let tmp = {};
      state.paymentAgreements.map(paymentAgreement => {
        if(paymentAgreement['paymentHash'] === hash) {
          tmp = paymentAgreement;
        }
      });
      tmp['balance'] = parseInt(tmp['balance']) + parseInt(amount);
      dispatch({
        type: CHARGE,
        hash: hash,
        newPaymentAgreement: tmp
      });
    } catch (err) {
      dispatch({
        type: PAYMENT_ERROR,
        payload: err
      });
    }
  }

  const addPaymentHash = async(hash) => {
    try {
      dispatch({
        type: ADD_PAYMENT_HASH,
        payload: hash
      });
    } catch (err) {
      dispatch({
        type: PAYMENT_ERROR,
        payload: err
      });
    }
  }

  const getPaymentAgreements = async(controller) => {
    try {
      let paymentAgreements = [];
      for (var hash of state.paymentHashes) {
        let sender = await state.paymentProviderContract.methods.getSender(hash).call({from: state.account});
        let receiver = await state.paymentProviderContract.methods.getReceiver(hash).call({from: state.account});
        let device = await state.paymentProviderContract.methods.getDevice(hash).call({from: state.account});
        let history = await state.paymentProviderContract.methods.getPaymentHistory(hash).call({from: state.account});
        let balance = await state.paymentProviderContract.methods.getBalance(hash).call({from: state.account});
        let paymentAgreement = {
          'paymentHash': hash,
          'sender': sender,
          'receiver': receiver,
          'device': device,
          'balance': balance,
          'history': history,
        }
        paymentAgreements.push(paymentAgreement);
      }
      if(!controller.cancelled) {
        dispatch({
          type: GET_PAYMENT_AGREEMENTS,
          payload: paymentAgreements
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

  const getSignedPaymentJSON = async(paymentHash, timestampStart, timestampEnd, units, usageFee, device, controller) => {
    try {
      let costs = units * usageFee;
      let hash = await state.web3.utils.soliditySha3(PAYMENTPROVIDER_CONTRACT_ADDR, timestampStart, timestampEnd, units, costs, device);
      // let signature = await state.web3.eth.personal.sign(hash,state.account);
      let signature = await state.web3.eth.personal.sign(hash,state.account);
      let payment = {
        'timestampStart': timestampStart,
        'timestampEnd': timestampEnd,
        'units': units,
        'costs': costs,
        'signature': signature,
        'hash': paymentHash,
        'device': device,
      }
      console.log(JSON.stringify(payment));
      if(!controller.cancelled) {
        dispatch({
          type: GET_SIGNED_PAYMENT_JSON
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
  const redeem = async(hash, timestampStart, timestampEnd, units, costs, signature, device) => {
    try {
      await state.paymentProviderContract.methods.redeem(hash, timestampStart, timestampEnd, units, costs.toString(), signature, device).send({from: state.account});

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
        paymentHashes: state.paymentHashes,
        paymentAgreements: state.paymentAgreements,
        loading: state.loading,
        error: state.error,
        setPaymentAccount,
        addPaymentHash,
        getPaymentAgreements,
        charge,
        getSignedPaymentJSON,
        redeem
      }}
    >
      {props.children}
    </PaymentContext.Provider>
  );
};

export default PaymentState;
