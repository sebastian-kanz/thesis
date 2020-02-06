import Web3 from 'web3'
import { isNullOrUndefined } from "util";
import IdentityManager from './IdentityManager';
import RentalManager from './RentalManager';

export default class Web3Manager {

  constructor() {
    this.account = '0x0000000000000000000000000000000000000001';
    const ethereum = window.ethereum;
    const rpcURL = 'http://localhost:8545' // Your RCP URL goes here

    this.identityManager = new IdentityManager(this.account);
    this.rentalManager = new RentalManager(this.account);
    this.role = 0;
    this.loggedin = false;
    this.initialized = false;
    this.balance = 0;
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
      ethereum.autoRefreshOnNetworkChange = false;
      // this.web3 = new Web3(rpcURL)
      this.web3 = new Web3(window.ethereum || Web3.givenProvider);
      ethereum.on('chainChanged', chainId => {
        console.log("Metamask chain changed. Reloading data.");
        this.reload();
      })
      ethereum.on('networkChanged', networkId => {
        console.log("Metamask network changed. Reloading data.");
        this.reload();
      })
      ethereum.on('accountsChanged', accounts => {
        console.log("Metamask account changed. Reloading data.");
        this.reload();
      });
    }
  }

  login = async() => {
    console.log("Logging in...");
    await this.init();
  }

  logout = async() => {
    console.log("Logging out...");
    var accounts = await window.ethereum.enable();
    this.account = '0x0000000000000000000000000000000000000001';
    this.identityManager = new IdentityManager(this.account);
    this.rentalManager = new RentalManager(this.account);
    this.loggedin = false;
    this.initialized = false;
    this.balance = 0.0;
  }

  reload = () => {
    if(this.loggedin) {
      console.log("Reloading...");
      this.initialized = false;
      this.init();
    }
  }

  getBalance = async() => {
    let balance = await this.web3.eth.getBalance(this.account);
    return await Web3.utils.fromWei(balance.toString(), "ether");
  }

  addTestRentalAgreement = async() => {
    console.log(this.role);
    if(this.role == 1) {
      await this.rentalManager.addTestData();
    } else {
      console.log("addTestRentalAgreement only callable by Manufacturer.");
    }
  }

  async init() {
    if(this.initialized) {
      console.log("Web3Manager already initialized.");
    } else {
      console.log("Initializing...");
      try {
        this.account = (await window.ethereum.enable())[0];
				this.identityManager = new IdentityManager(this.account);
				this.rentalManager = new RentalManager(this.account);
        this.role = await this.identityManager.getIdentityRole(this.account);
        this.loggedin = true;
        this.initialized = true;
        this.balance = await this.getBalance();
      } catch(err) {
        console.error(err);
      }
    }
  }

}
