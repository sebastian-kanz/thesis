import React, { useContext } from 'react';


import IdentityContext from './../../context/identity/identityContext';

import Customer from './../views/Customer'
import Manufacturer from './../views/Manufacturer'
import ServiceProvider from './../views/ServiceProvider'
import Supplier from './../views/Supplier'
import ErrorPage from './../pages/ErrorPage'

const Overview = () => {

  const identityContext = useContext(IdentityContext);
  const { ownIdentity, authenticated } = identityContext;


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
    window.location.reload();
  }
};

export default Overview;
