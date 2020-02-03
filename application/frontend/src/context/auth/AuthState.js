import React, { useReducer } from 'react';
import AuthContext from './authContext';
import authReducer from './authReducer';
import Web3 from 'web3'

import {
  LOGIN,
  LOGOUT,
  AUTH_ERROR
} from '../types';

// this.loggedin = false;
// this.initialized = false;

const AuthState = props => {
  const initialState = {
    account: '0x0000000000000000000000000000000000000000',
    web3: new Web3(window.ethereum || Web3.givenProvider),
    balance: null,
    authenticated: false,
    loading: null,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async() => {
    try {
      let account = (await window.ethereum.enable())[0];
      let tmp = await state.web3.eth.getBalance(account);
      let balance = await Web3.utils.fromWei(tmp.toString(), "ether");
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
