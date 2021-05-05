import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';
import decoder from 'jwt-decode'
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import User from './Pages/User/User';
import Team from './Pages/Team/Team'
import AddAdmin from './Pages/AddAdmin/AddAdmin'
import VerifyAdmin from './Pages/verifyAdmin/verifyAdmin'
import DeleteUser from './Pages/DeleteUser/DeleteUser'
import ManageTeamSubmission from './Pages/ManageTeamSubmission/ManageTeamSubmission'
console.log(User);

const authGuard = (Component) => () => {
  return localStorage.getItem('token') ? (
    <Component />
  ) : (
    <Redirect to='/login' />
  );
};
//might need to get master from backend (thoughts)
const authMasterGuard = (Component) => () => {
  let token = localStorage.getItem('token')
  token = decoder(token)
  return token.role == 'admin' ? <Redirect to='/dashboard' /> : <Component />
};
/* I set the border with red appearing so that I know this is the Route.js*/
const Routes = (props) => (

  <div style={{ width: '100%', border: 'solid 1px red' }}>
    <Router {...props} >
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/user" render={authGuard(User)} />
        <Route path="/team" render={authGuard(Team)} />
        <Route path='/AddAdmin' render={authMasterGuard(AddAdmin)} />
        <Route path='/remove' render={authGuard(DeleteUser)} />
        <Route path='/admin/confirmation/:token'>
          <VerifyAdmin />
        </Route>

        <Route path="/dashboard" render={authGuard(Dashboard)} />

        <Route exact path="/">
          <Redirect to="/dashboard" />
        </Route>
      </Switch>
    </Router>
  </div>
);

export default Routes;