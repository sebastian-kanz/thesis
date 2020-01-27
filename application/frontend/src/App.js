import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Container from '@material-ui/core/Container';
// import logo from './logo.svg';
// import './App.css';
import NavBar from './components/layout/NavBar/NavBar';
import RentalState from './context/rental/RentalState';
import IdentityState from './context/identity/IdentityState';
import AuthState from './context/auth/AuthState';
import Alerts from './components/layout/Alerts';
import PrivateRoute from './components/routing/PrivateRoute';
import Overview from './components/pages/Overview';
import About from './components/pages/About';
import Welcome from './components/pages/Welcome';
import Profile from './components/pages/Profile';


export default function App() {
  window.web3.currentProvider.setMaxListeners(300);
  return (
  <AuthState>
    <IdentityState>
      <RentalState>
        <Router>
          <Fragment>
            <NavBar/>
            <Container>
              <Alerts />
              <Switch>
                <PrivateRoute exact path='/overview' component={Overview} />
                <PrivateRoute exact path='/profile' component={Profile} />
                <Route exact path='/about' component={About} />
                <Route exact path='/' component={Welcome} />
                <Route path="*" component={Welcome}/>
              </Switch>
            </Container>
          </Fragment>
        </Router>
      </RentalState>
    </IdentityState>
  </AuthState>
  );
}
// export class App extends React.Component {
//   state = {
//     manager: new Web3Manager()
//   };
//
//   componentDidMount() {
//     const { manager } = this.state;
//   }
//
//   checkStatus = async(identity) => {
//     const { manager } = this.state;
//     identity = manager.account;
//     console.log(await manager.identityManager.isIdentityVerified(identity));
//   }
//
//   getBalance = async() => {
//     const { manager } = this.state;
//     console.log(await manager.getBalance());
//   }
//
//   getPendingAgreements = async() => {
//     const { manager } = this.state;
//     console.log(await manager.rentalManager.getPendingAgreements());
//   }
//   getActiveAgreements = async() => {
//     const { manager } = this.state;
//     console.log(await manager.rentalManager.getActiveAgreements());
//   }
//   getTerminatedAgreements = async() => {
//     const { manager } = this.state;
//     console.log(await manager.rentalManager.getTerminatedAgreements());
//   }
//   getRentableDevices = async() => {
//     const { manager } = this.state;
//     console.log(await manager.rentalManager.getRentableDevices());
//   }
//
//
//   addTestData = async() => {
//     const { manager } = this.state;
//     await manager.addTestRentalAgreement();
//   }
//
//   addTestIdentities = async() => {
//     const { manager } = this.state;
//     await manager.identityManager.addTestIdentites();
//   }
//
//   render() {
//     return (
//       <div className="App">
//         <Bar/>
//         <button onClick={this.state.manager.login}>
//           Login
//         </button>
//         <button onClick={() => this.checkStatus(null)}>
//           Status
//         </button>
//         <button onClick={this.getBalance}>
//           Balance
//         </button>
//         <button onClick={this.state.manager.logout}>
//           Logout
//         </button>
//         <button onClick={() => this.addTestData()}>
//           Create
//         </button>
//         <br/>
//         <br/>
//         <button onClick={() => this.getPendingAgreements()}>
//           Pending
//         </button>
//         <button onClick={() => this.getActiveAgreements()}>
//           Active
//         </button>
//         <button onClick={() => this.getTerminatedAgreements()}>
//           Terminated
//         </button>
//         <button onClick={() => this.getRentableDevices()}>
//           Rentable
//         </button>
//         <RentalAgreementContainer rentalManager={this.state.manager.rentalManager}/>
//       </div>
//     );
//   }
// }
//
// export default App;
