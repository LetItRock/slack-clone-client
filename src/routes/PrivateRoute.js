import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    decode(token);
    decode(refreshToken);
    console.log('authenticaated§');
    return true;
  } catch (e) {
    return false;
  }
};

const PrivateRoute = ({ component: Component, ...rest}) => (
  <Route
    {...rest}
    render={props => (
      isAuthenticated()
      ? (<Component {...props} />)
      : (<Redirect to={{ pathname: '/login', state: { from: props.location } }} />)
    )}
  />
);

export default PrivateRoute;
