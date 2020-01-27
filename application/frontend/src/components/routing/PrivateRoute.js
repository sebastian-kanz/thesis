import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);
  const { authenticated } = authContext;
  return (
    <Route
      {...rest}
      render={props =>
        !authenticated ? (
          <Redirect to='/welcome' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
