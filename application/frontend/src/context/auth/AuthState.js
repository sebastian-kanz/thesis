import React, { useReducer } from 'react';
import AuthContext from './authContext';
import authReducer from './authReducer';
import Web3 from 'web3'

import {
  LOGIN,
  LOGOUT,
  AUTH_ERROR
} from '../types';

import IDENTITY_CONTRACT_ADDR from '../identity/IdentityState'

// this.loggedin = false;
// this.initialized = false;

const AuthState = props => {
  const initialState = {
    account: localStorage.getItem('account') || IDENTITY_CONTRACT_ADDR,
    web3: new Web3(window.ethereum || Web3.givenProvider),
    balance: localStorage.getItem('balance') || 0,
    authenticated: localStorage.getItem('authenticated') || false,
    loading: null,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async() => {
    try {
      let account = (await window.ethereum.enable())[0];
      localStorage.setItem('account', account);
      let tmp = await state.web3.eth.getBalance(account);
      let balance = await Web3.utils.fromWei(tmp.toString(), "ether");
      localStorage.setItem('balance', balance);
      localStorage.setItem('authenticated', true);
      dispatch({
        type: LOGIN,
        account: account,
        balance: balance
      });
      return account;
    } catch (err) {
      dispatch({
        type: AUTH_ERROR,
        payload: err
      });
    }
  }

  const logout = async() => {
    localStorage.removeItem('account');
    localStorage.removeItem('balance');
    localStorage.removeItem('authenticated');
    try {
      dispatch({
        type: LOGOUT
      });
    } catch (err) {
      dispatch({
        type: AUTH_ERROR,
        payload: err
      });
    }
  }


  return (
    <AuthContext.Provider
      value={{
        account: state.account,
        web3: state.web3,
        balance: state.balance,
        authenticated: state.authenticated,
        loading: state.loading,
        error: state.error,
        login,
        logout
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
