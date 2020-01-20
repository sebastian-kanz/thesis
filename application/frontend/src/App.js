import React from 'react';
import logo from './logo.svg';
import './App.css';
//import Test from './components/layout/Test';
//import ButtonAppBar from './components/layout/ButtonAppBar';
import Web3Manager from './manager/Web3Manager';
import RentalAgreementContainer from './components/layout/RentalAgreement/RentalAgreementContainer';



export class App extends React.Component {
  state = {
    manager: new Web3Manager()
  };

  componentDidMount() {
    const { manager } = this.state;
  }

  checkStatus = async(identity) => {
    const { manager } = this.state;
    identity = manager.account;
    console.log(await manager.identityManager.isIdentityVerified(identity));
  }

  getBalance = async() => {
    const { manager } = this.state;
    console.log(await manager.getBalance());
  }

  getRentalAgreementIDs = async() => {
    const { manager } = this.state;
    console.log(await manager.rentalManager.getRentalAgreementIDs());
  }

  addTestData = async() => {
    const { manager } = this.state;
    await manager.addTestRentalAgreement();
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.state.manager.login}>
          Login
        </button>
        <button onClick={() => this.checkStatus(null)}>
          Status
        </button>
        <button onClick={this.state.manager.logout}>
          Logout
        </button>
        <button onClick={this.getBalance}>
          Balance
        </button>
        <button onClick={() => this.addTestData()}>
          Test1
        </button>
        <button onClick={() => this.getRentalAgreementIDs()}>
          Test2
        </button>
        <button onClick={this.state.manager.testSigning}>
          Test3
        </button>
        <RentalAgreementContainer/>
      </div>
    );
  }
}

export default App;
