import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';

import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import User from './Pages/User/User';
console.log(User);
const authGuard = (Component) => () => {
  return localStorage.getItem('token') ? (
    <Component />
  ) : (
    <Redirect to='/login' />
  );
};
/* I set the border with red appearing so that I know this is the Route.js*/
const Routes = (props) => (
 
  <div style={{width:'100%',border:'solid 1px red'}}>
  <Router {...props} >
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/user">
        <User />
      </Route>
      <Route path="/dashboard" render={authGuard(Dashboard)}></Route>
    
      <Route exact path="/">
        <Redirect to="/dashboard" />
      </Route>
    </Switch>
  </Router>
  </div>
);

export default Routes;
