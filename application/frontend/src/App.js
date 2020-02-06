import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Container from '@material-ui/core/Container';
// import logo from './logo.svg';
// import './App.css';
import NavBar from './components/layout/NavBar/NavBar';
import RentalState from './context/rental/RentalState';
import IdentityState from './context/identity/IdentityState';
import AuthState from './context/auth/AuthState';
import PaymentState from './context/payment/PaymentState';
import Alerts from './components/layout/Alerts';
import PrivateRoute from './components/routing/PrivateRoute';
import Overview from './components/pages/Overview';
import About from './components/pages/About';
import Welcome from './components/pages/Welcome';
import Profile from './components/pages/Profile';


export default function App() {
  // window.web3.currentProvider.setMaxListeners(0);
  return (
  <AuthState>
    <IdentityState>
      <RentalState>
        <PaymentState>
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
        </PaymentState>
      </RentalState>
    </IdentityState>
  </AuthState>
  );
}
