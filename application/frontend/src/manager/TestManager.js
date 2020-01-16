import React from "react";
import Web3 from 'web3'
import { isNullOrUndefined } from "util";
// import { Resolver } from 'did-resolver'
// import getResolver from 'ethr-did-resolver'
import EthrDID from 'ethr-did'
import DidRegistryContract from 'ethr-did-registry'
import JWT from "did-jwt"
import {Resolver} from 'did-resolver'
import EthrDIDResolver from 'ethr-did-resolver'

class TestManager {

  logNetID(netId) {
    switch (netId) {
      case 1:
        console.log('Network: Mainnet')
        break
      case 2:
        console.log('Network: Morden (Testnet,deprecated)')
        break
      case 3:
        console.log('Network: Ropsten (Testnet)')
        break
      case 4:
        console.log('Network: Rinkeby (Testnet)')
        break;
      case 5:
        console.log('Network: Goerli (Testnet)')
        break;
      case 10:
        console.log('Network: Quorum')
        break;
      case 43:
        console.log('Network: Kovan (Testnet)')
        break;
      default:
        console.log('Network: Unknown')
    }
  }

  // /**
  //  * Signs a claim and returns it as jwt
  //  *
  //  * @param {object} claim - full claim as json
  //  *
  //  * @return {Object} JWT (JSON Web Token) containing the signed claim.
  //  */
  // async createClaimJwt(claim) {
  //     let key = this.ethereumAccount.privateKey;
  //     key = key.slice(2,key.length);
  //     const signer = JWT.SimpleSigner(key);
  //     const jwt = await JWT.createJWT(claim, {
  //       issuer: `did:ethr:${this.ethereumAccount.address}`,
  //       signer,
  //       alg: "ES256K-R"
  //     });
  //     return Promise.resolve(jwt);
  // }


  async verifyCredential(jwt) {
    let ethrDid = EthrDIDResolver.getResolver();
    let resolver = new Resolver.Resolver(ethrDid)
    let response = await JWT.verifyJWT(jwt, {resolver: resolver, audience: 'did:ethr:0x2C7dcD0205456acc63032EC560a51Db6c50b8B83'});
    console.log(response);
  }


  async createCredential() {
      const claim = {
        type: ["VerifiableCredential", "PersonCredential"],
        credentialSubject: {
          id: "did:ethr:0xa688dDC9f3D0BD516B93B15651e0c221D3569722",
          name: "Sebastian Kanz",
          address: {
            "addressCountry": "DE",
            "addressLocality": "Büttelborn",
            "postalCode": "64572",
            "streetAddress": "Spessartstr. 18"
          },
          "birthDate": "1994-06-13T00:00:00Z"
        }
      };
      let key = "0xD244CA7778199DCA2841285313066D1D4EACBEE3F42AFB52021685C560CE8765";
      key = key.slice(2,key.length);
      const signer = JWT.SimpleSigner(key);
      const jwt = await JWT.createJWT(claim, {
        issuer: `did:ethr:0x2C7dcD0205456acc63032EC560a51Db6c50b8B83`,
        signer,
        alg: "ES256K-R"
      });
      return Promise.resolve(jwt);

  }


  async test() {
    const ethereum = window.ethereum;
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
      ethereum.autoRefreshOnNetworkChange = false;
      const web3 = new Web3(Web3.givenProvider);
      ethereum.on('chainChanged', chainId => {
        console.log("chain changed.");
        // document.location.reload();
      })
      ethereum.on('networkChanged', networkId => {
        console.log("network changed.");
        // document.location.reload();
      })
      ethereum.on('accountsChanged', accounts => {
        console.log("account changed.");
        // document.location.reload();
      });

      const provider = window['ethereum'] || window.web3.currentProvider
      try {
        const accounts = await window.ethereum.enable()
        const account = accounts[0];
        const ethrDid = new EthrDID({provider: provider, address: account});
        console.log("DID: ", ethrDid);
        console.log("DID: ", ethrDid.did);
        web3.eth.getBalance(account, (err, balance) => {
          balance = Web3.utils.fromWei(balance.toString(), "ether")
          console.log("Balance: ", balance, "ETH");
        });
        this.logNetID(parseInt(await ethereum.networkVersion));
      } catch (error) {
        // Handle error. Likely the user rejected the login:
        console.log("User rejected provider access or an error occured.");
        console.log(error);
      }
    } else {
      console.log("not supported.");
    }

    let vc = await this.createCredential();
    console.log(vc);
    console.log(await this.verifyCredential(vc));
    // const ethrDid = new EthrDID({address: '0x...', privateKey: '...',})
    // console.log(ethrDid);
    // const providerConfig = { rpcUrl: 'https://rinkeby.infura.io/ethr-did', registry: registry.address }
    //
    // // getResolver will return an object with a key/value pair of { "ethr": resolver } where resolver is a function used by the generic did resolver.
    // const ethrDidResolver = getResolver(providerConfig)
    // const didResolver = Resolver(ethrDidResolver)
    //
    // didResolver.resolve('did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74').then(doc => console.log)
    //
    // // You can also use ES7 async/await syntax
    // const doc = await didResolver.resolve('did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74')
    // console.log(doc);
  }



}

export default new TestManager();
