import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import IdentityContext from '../../context/identity/identityContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const identityContext = useContext(IdentityContext);
  const { ownIdentity, authenticated } = identityContext;

  // useEffect(() => {
  //   console.log("test");
  //   console.log(authenticated);
  //   console.log(ownIdentity);
  // }, [authenticated,ownIdentity]);


  return (
    <Route
      {...rest}
      render={props =>
        (authenticated && ownIdentity != null) ? (
          <Component {...props} />
        ) : (
          <Redirect to='/welcome' />
        )
      }
    />
  );
};

export default PrivateRoute;
