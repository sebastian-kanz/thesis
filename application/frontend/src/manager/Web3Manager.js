import Web3 from 'web3'
import { isNullOrUndefined } from "util";
import IdentityManager from './IdentityManager';
import RentalManager from './RentalManager';

export default class Web3Manager {

  constructor() {
    this.account = '0x0000000000000000000000000000000000000000';
    const ethereum = window.ethereum;
    const rpcURL = 'http://localhost:8545' // Your RCP URL goes here
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

  login = () => {
    console.log("Logging in...");
    this.init();
  }

  logout = async() => {
    console.log("Logging out...");
    var accounts = await window.ethereum.enable();
    this.account = '0x0000000000000000000000000000000000000000';
    this.identityManager = new IdentityManager(this.account);
    this.rentalManager = new RentalManager(this.account);
    this.loggedin = false;
    this.initialized = false;
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
    if(await this.identityManager.getIdentityRole(this.account) == 1) {
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
        await this.rentalManager.init();
        this.loggedin = true;
        this.initialized = true;
      } catch(err) {
        console.error(err);
      }
    }
  }

  async testSigning() {

  }

}
