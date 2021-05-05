import React from "react";
//https://ui.dev/react-router-v4-pass-props-to-link/
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect,
} from 'react-router-dom';
import ManageSubmissions from './Pages/ManageSubmissions/ManageSubmissions';
import Login from './Pages/Login/Login';
import Rules from './Pages/Rules/Rules';
import Register from './Pages/Register/Register';
import Confirmation from './Pages/Confirmation/Confirmation';
import Dashboard from './Pages/Dashboard/Dashboard';
import NotFound from './Pages/NotFound/NotFound';
import UserStatus from './Pages/UserStatus/UserStatus';
import CreateTeam from './Pages/CreateTeam/CreateTeam';
import UpdateTeam from './Pages/UpdateTeam/UpdateTeam';
import JoinTeam from './Pages/JoinTeam/JoinTeam';
import ManageInviteTeamMembers from './Pages/ManageInviteTeamMembers/ManageInviteTeamMembers';
import ManageTeam from './Pages/ManageTeam/ManageTeam';
import ManageTeamMembers from './Pages/ManageTeamMembers/ManageTeamMembers';
import UploadFile from './Pages/UploadFile/UploadFile';
import EmailVerification from './Pages/EmailVerification/EmailVerification'
import OneTimePassword from './Pages/OneTimePassword/OneTimePassword';
<<<<<<< Updated upstream
import ResetPassword from './Pages/ResetPassword/ResetPassword';
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> parent of ac7f003 (COmmit)
import TeamSubmission from './Pages/TeamSubmission/TeamSubmission'
=======
>>>>>>> parent of d8cd51d (Merge branch 'main' of https://github.com/lekekbot/SEP-Project into main)

// FOR TESTING AND EXPERIMENTATION
import Test from './Pages/TestingPZ/ResetPassword';
>>>>>>> Stashed changes

const authGuard = (Component) => (props) => {
  console.log(props);
  return localStorage.getItem('token') ? (
    <Component {...props} />
  ) : (
    <Redirect to="/login" />
  );
};

const Routes = (props) => (

  <Router {...props}>
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/password_reset">
        <EmailVerification />
      </Route>
      <Route path="/confirmation">
        <Confirmation />
      </Route>
      <Route path="/one_time_password">
        <OneTimePassword />
      </Route>
      <Route path="/userstatus/:userEmail" render={(props) => <UserStatus {...props} />} />
      <Route path="/rules" render={Rules}></Route>
      <Route path="/dashboard" render={authGuard(Dashboard)}></Route>
      <Route path="/createteam" render={authGuard(CreateTeam)}></Route>
      <Route path="/manageteam" render={authGuard(ManageTeam)}></Route>
      <Route path="/resetpassword" render={authGuard(ResetPassword)}></Route>
      <Route path="/updateteam/:teamId" render={authGuard(UpdateTeam)} />
      <Route path="/jointeam/:teamId/:teamName" render={authGuard(JoinTeam)} />
      <Route path="/manageinvites/:teamId" render={authGuard(ManageInviteTeamMembers)} />
      <Route path="/manageteammembers/:teamId" render={authGuard(ManageTeamMembers)} />
      <Route path="/submitproposal/:teamId" render={authGuard(UploadFile)} />
<<<<<<< HEAD
<<<<<<< HEAD
      <Route path="/teamsubmission" render={authGuard(TeamSubmission)} />
=======
>>>>>>> parent of d8cd51d (Merge branch 'main' of https://github.com/lekekbot/SEP-Project into main)
=======
      <Route path="/teamsubmission" render={authGuard(TeamSubmission)}/>
>>>>>>> parent of ac7f003 (COmmit)
      <Route path="/managesubmissions/:teamId" render={authGuard(ManageSubmissions)}></Route>
      <Route exact path="/">
        <Redirect to="/dashboard" />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  </Router>
);

export default Routes;
