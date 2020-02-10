import React, { useReducer } from 'react';
import RentalContext from './rentalContext';
import rentalReducer from './rentalReducer';
import Web3 from 'web3'
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

import RENTAL_CONTRACT_ABI from './RentalProvider.js'
export const RENTAL_CONTRACT_ADDR = '0xC58627f5EA824690d5f952B56ECbaaBCEE988ffE';


const RentalState = props => {
  const initialState = {
    account: localStorage.getItem('account') || null,
    web3: new Web3(window.web3.currentProvider),
    rentalContract: new (new Web3(window.web3.currentProvider)).eth.Contract(RENTAL_CONTRACT_ABI, RENTAL_CONTRACT_ADDR),
    rentalAgreements: [],
    requests: [],
    numRequests: 0,
    rentableDevices: [],
    numPendingAgreements: 0,
    numActiveAgreements: 0,
    numTerminatedAgreements: 0,
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(rentalReducer, initialState);

  const resetRental = () => {
    try {
      dispatch({
        type: RENTAL_RESET
      });
    } catch (err) {
      dispatch({
        type: RENTAL_ERROR,
        payload: err
      });
    }
  }

  const setRentalAccount = (account) => {
    try {
      dispatch({
        type: SET_RENTAL_ACCOUNT,
        payload: account
      });
    } catch (err) {
      dispatch({
        type: RENTAL_ERROR,
        payload: err
      });
    }
  }

  // Get Agreements
  const getAgreements = async (controller) => {
    let stateIDs = [0, 1, 2];
    try {
      let agreements = [];
      let numPending = 0;
      let numActive = 0;
      let numTerminated = 0;
      for (const stateID of stateIDs) {
        let ids = await state.rentalContract.methods.getIDs(stateID).call({from: state.account});
        for (const id of ids) {
         const agreement = await state.rentalContract.methods.getByID(id).call({from: state.account});
         switch (agreement[8]) {
           case '0':
             numPending++;
             break;
           case '1':
             numActive++;
             break;
           case '2':
             numTerminated++;
             break;
           default:
             break;
         }
         const hash = await state.rentalContract.methods.getRentalAgreementHash(id).call({from: state.account});
         agreement[10]=id;
         agreement[11]=hash;
         agreements.push(agreement);
        }
      }
      if(!controller.cancelled) {
        dispatch({
          type: GET_AGREEMENTS,
          payload: agreements,
          numPending: numPending,
          numActive: numActive,
          numTerminated: numTerminated
        });
      } else {
        console.log("cancelled");
      }
    } catch (err) {
      if(!controller.cancelled) {
        dispatch({
          type: RENTAL_ERROR,
          payload: err
        });
      } else {
        console.log("cancelled");
      }
    }
  };

  // Get rentableDevices
  const getRentableDevices = async (controller) => {
    try {
      let rentableDevices = await state.rentalContract.methods.getRentableDevices().call();

      if(!controller.cancelled) {
        dispatch({
          type: GET_RENTABLE_DEVICES,
          payload: rentableDevices
        });
      } else {
        console.log("cancelled");
      }
    } catch (err) {
      if(!controller.cancelled) {
        dispatch({
          type: RENTAL_ERROR,
          payload: err
        });
      } else {
        console.log("cancelled");
      }
    }
  };

  // Accep rentalAgreement
  const acceptRentalAgreement = async (tenant,lessor,device,usageFee,contractTerm,id) => {
    try {
      let agreementHash = await state.web3.utils.soliditySha3(tenant,lessor,device,usageFee,contractTerm);
      // let agreementHash = await this.web3.utils.soliditySha3("0xFF3904784BeF847991C7705Eef89164A32F31A19","0x6Aa031Ecb47018c081ae968FE157cB9f74a584fD","0xbB8f0d80e1B66e71629D47AB547042E5004F39Df",'10000000000000000','1589255236');
      let signature = await state.web3.eth.personal.sign(agreementHash, state.account);
      await state.rentalContract.methods.accept(id, signature).send({from: state.account, value: 100});

      dispatch({
        type: ACCEPT_RENTAL_AGREEMENT
      });
    } catch (err) {
      dispatch({
        type: RENTAL_ERROR,
        payload: err
      });
    }
  };

  // Add rentalAgreements for testing
  const addTestRentalAgreements = async () => {
    try {
      let tenant1 = "0xFF3904784BeF847991C7705Eef89164A32F31A19";
      // let tenant2 = "0x87deeC84694929a63Aa8ccA01dE58eEA0a6A0e8b";
      let lessor = "0x6Aa031Ecb47018c081ae968FE157cB9f74a584fD";
      let device1 = "0xbB8f0d80e1B66e71629D47AB547042E5004F39Df";
      // let device2 = "0x6A7b417aC5A2e20b47fa7717963ce24068B2b3c9";
      // let device3 = "0x0fd6f673BC51400B5022eeF84c4a87EBA7D4ac29";
      // let device4 = "0x158A17F73c8ca58f929B0cbAF0434Dd02a8cC159";
      let fee = '1';
      let term = 1589378681;
      let hash1 = state.web3.utils.soliditySha3(tenant1,lessor,device1,fee,term);
      // let hash2 = state.web3.utils.soliditySha3(tenant1,lessor,device2,fee,term);
      // let hash3 = state.web3.utils.soliditySha3(tenant2,lessor,device3,fee,term);
      // let hash4 = state.web3.utils.soliditySha3(tenant2,lessor,device4,fee,term);
      let signature1 = await state.web3.eth.personal.sign(hash1, state.account);
      // let signature2 = await state.web3.eth.personal.sign(hash2, state.account);
      // let signature3 = await state.web3.eth.personal.sign(hash3, state.account);
      // let signature4 = await state.web3.eth.personal.sign(hash4, state.account);
      // let result1 = await state.rentalContract.methods.verify(tenant1, lessor, device1, fee, term, signature1, this.account).call();
      // let result2 = await state.rentalContract.methods.verify(tenant1, lessor, device2, fee, term, signature2, this.account).call();
      // let result3 = await state.rentalContract.methods.verify(tenant2, lessor, device3, fee, term, signature3, this.account).call();
      // let result4 = await state.rentalContract.methods.verify(tenant2, lessor, device4, fee, term, signature4, this.account).call();
      console.log(signature1);
      // console.log(signature2);
      // console.log(signature3);
      // console.log(signature4);
      // let signature1 = "0x08583087daa63888213b72accfb2ddad7749bc95743420d226b9eaf91fd24d851ad53944e2744a68b27911d949f5b0680c0e60ae487da7a81a72c07503a12c821c";
      // let signature2 = "0x0a6c385d393a56b2b0d78c87fd70b7050474db78d58759534d71447342dccc193f77c9a5cd4217d6d19a662cb096aca702e9b3ad0b40f333ea8cb1132967bc4b1c";
      // let signature3 = "0xd70103566140835f14af6e17a8a0124c0196ccaff9ba088b698e3db8ac74c8e706a4548f0789ca5efd9d7bc9ee16a17e259a18fdf07f4927e10f5918e2b1f0921c";
      // let signature4 = "0x11f0648d05ceb6950df42279a065ad66528a90e5966be7c48a97ce1fb963ccb76b9296d84673012cdd150a79555873fd9b595b5304206eb2d1e9270e851ba1321b";
      let result1 = await state.rentalContract.methods.createRenting(tenant1, signature1, device1, fee, term).send({from: state.account});
      // let result2 = await state.rentalContract.methods.createRenting(tenant1, signature2, device2, fee, term).send({from: state.account});
      // let result3 = await state.rentalContract.methods.createRenting(tenant2, signature3, device3, fee, term).send({from: state.account});
      // let result4 = await this.RentalContract.methods.createRenting(tenant2, signature4, device4, fee, term).send();

      dispatch({
        type: ADD_TEST_RENTAL_AGREEMENTS
      });
    } catch (err) {
      dispatch({
        type: RENTAL_ERROR,
        payload: err
      });
    }
  };

  // terminate rentalAgreement
  const terminateRentalAgreement = async (id) => {
    try {
      await state.rentalContract.methods.terminate(id).send({from: state.account});

      dispatch({
        type: TERMINATE_RENTAL_AGREEMENT
      });
    } catch (err) {
      dispatch({
        type: RENTAL_ERROR,
        payload: err
      });
    }
  };


  // get rentalRequests
  const getRequests = async (role, controller) => {
    try {
      let requests;
      switch (role) {
        case "1":
          requests = await state.rentalContract.methods.getRequestsAsLessor().call({from: state.account});
          if(!controller.cancelled) {
            dispatch({
              type: GET_REQUESTS,
              payload: requests
            });
          } else {
            console.log("cancelled");
          }
          break;
        case "2":
          requests = await state.rentalContract.methods.getRequestsAsTenant().call({from: state.account});
          if(!controller.cancelled) {
            dispatch({
              type: GET_REQUESTS,
              payload: requests
            });
          } else {
            console.log("cancelled");
          }
          break;
        default:

      }
    } catch (err) {
      if(!controller.cancelled) {
        console.error(err);
        dispatch({
          type: RENTAL_ERROR,
          payload: err
        });
      } else {
        console.log("cancelled");
      }
    }
  };


  // add rentalRequest
  const addRequest = async (device, lessor, term) => {
    try {
      await state.rentalContract.methods.createRequest(device, lessor, term).send({from: state.account});
      dispatch({
        type: ADD_REQUEST,
        payload: device
      });
    } catch (err) {
      dispatch({
        type: RENTAL_ERROR,
        payload: err
      });
    }
  };

  // add rentalAgreement
  const addAgreement = async (tenant, device, usageFee, contractTerm) => {
    try {
      usageFee = usageFee * 1000000000000000000;
      let hash = await state.web3.utils.soliditySha3(tenant, state.account, device, usageFee.toString(), contractTerm);
      let signature = await state.web3.eth.personal.sign(hash,state.account);
      await state.rentalContract.methods.createRenting(tenant, signature, device, usageFee.toString(), contractTerm).send({from: state.account});
      dispatch({
        type: ADD_AGREEMENT,
        payload: device
      });
    } catch (err) {
      dispatch({
        type: RENTAL_ERROR,
        payload: err
      });
    }
  };

  return (
    <RentalContext.Provider
      value={{
        account: state.account,
        web3: state.web3,
        rentalContract: state.rentalContract,
        rentalAgreements: state.rentalAgreements,
        requests: state.requests,
        numRequests: state.numRequests,
        rentableDevices: state.rentableDevices,
        loading: state.loading,
        error: state.error,
        numPendingAgreements: state.numPendingAgreements,
        numActiveAgreements: state.numActiveAgreements,
        numTerminatedAgreements: state.numTerminatedAgreements,
        setRentalAccount,
        getAgreements,
        addAgreement,
        getRentableDevices,
        acceptRentalAgreement,
        addTestRentalAgreements,
        resetRental,
        terminateRentalAgreement,
        getRequests,
        addRequest,
      }}
    >
      {props.children}
    </RentalContext.Provider>
  );
};

export default RentalState;



// const domain = [
//     { name: "name", type: "string" },
//     { name: "version", type: "string" },
//     { name: "chainId", type: "uint256" },
//     { name: "verifyingContract", type: "address" },
//     { name: "salt", type: "bytes32" },
// ];
//
// const rentalSignatureObject = [
//     { name: "tenant", type: "address" },
//     { name: "lessor", type: "address" },
//     { name: "device", type: "address" },
//     { name: "fee", type: "uint256" },
//     { name: "term", type: "uint256" },
// ];
//
// const domainData = {
//   name: "Device Rental",
//   version: "1",
//   chainId: 1579447585291,
//   verifyingContract: RENTAL_CONTRACT_ADDR,
//   salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558"
// };
//
// var message = {
//     tenant: "0x57Ce662Ef0d719bB1D43aA3A6140A98e0c9D6b2C",
//     lessor: "0xed62d9d8a84B23d7aF1714F1ea9647b572767834",
//     device: "0xcFce6D1Ec1647A7867AD922ecDd57e12bbfE1885",
//     fee: 100,
//     term: 1589255236
// };
//
// const data = JSON.stringify({
//     types: {
//         EIP712Domain: domain,
//         RentalSignatureObject: rentalSignatureObject,
//     },
//     domain: domainData,
//     primaryType: "RentalSignatureObject",
//     message: message
// });
//
// let signer = this.web3.utils.toChecksumAddress(this.account);
// let contract = this.RentalContract;
// let innerWeb3 = this.web3;
// console.log(data);
// let temp = await this.web3.currentProvider.send(
//   {
//     method: "eth_signTypedData_v3",
//     params: [signer, data],
//     from: signer
//   },
//   async function(err, result) {
//     if (err || result.error) {
//       return console.error(result);
//     } else {
// 			let signature = result.result;
// 			console.log(signature);
//
// 		}
// });
