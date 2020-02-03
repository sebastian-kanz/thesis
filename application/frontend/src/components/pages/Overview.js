import React, { useContext } from 'react';


import AuthContext from './../../context/auth/authContext';
import IdentityContext from './../../context/identity/identityContext';

import Customer from './../views/Customer'
import Manufacturer from './../views/Manufacturer'
import ServiceProvider from './../views/ServiceProvider'
import Supplier from './../views/Supplier'
import ErrorPage from './../pages/ErrorPage'

const Overview = () => {

  const authContext = useContext(AuthContext);
  const identityContext = useContext(IdentityContext);
  const { authenticated } = authContext;
  const { ownIdentity } = identityContext;


  if(authenticated && ownIdentity) {
    switch (parseInt(ownIdentity['role'])) {
      case 1:
        return <Manufacturer/>
      case 2:
        return <Customer/>
      case 3:
        return <ServiceProvider/>
      case 4:
        return <Supplier/>
      default:
        return <ErrorPage/>

    }
  } else {
    return <ErrorPage/>
  }
};

export default Overview;
