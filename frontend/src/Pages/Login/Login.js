import React, { Component, useState } from 'react';
import styles from './Login.module.css';
import './Login.module2.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import axios from 'axios';
import { Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

import { useForm } from 'react-hook-form';
import config from '../../config.js';
import { saveUserDataToLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
// Therefore, you need to use the {what function do you need} technique.

function Login(props) {
  const { register, handleSubmit, errors } = useForm();
  const history = useHistory();
  //After finished working on this Login.js, I noticed that applying state for email and password, combining it with
  //input controls are "not really necessary". I still kept the code here for the Login.js because it is useful for certain scenarios.
  //But I won't implement this technique for Register.js useFormInput definition is found at line 159 and below.
  const email = useFormInput('dazzelneo@abc.com');
  const password = useFormInput('ezy123');
  // You need the message state so that you can update the message inside the  handleLogin code. 
  // The React engine will automatically help you show the  error message at the appropriate location
  // inside the UI without typing additional code.
  const [message, setMessage] = useState({ data: '', type: '' });
  // You need the loading state so that the Login button can
  // effectively show the button label or 'loading....' 
  const [loading, setLoading] = useState(false);

  // Handle the form submit of login form
  const onSubmit = (data, e) => {
    // console.dir(data);
    setMessage({
      data: 'Login is in progress...',
      type: 'alert-warning',
    });
    setLoading(true);
    axios.post(`${config.baseUrl}/u/users/signin`, { email: data.email, password: data.password })
      .then(response => {
        setLoading(false);
        if (response.data.status != 'pending') {
          setMessage({
            data: 'Logged in successfully, redirecting...',
            type: 'alert-success',
          });
          //Direct the user to the dashboard page.
          saveUserDataToLocalStore(response.data.token, response.data.displayName, response.data.email);
          history.push('/dashboard');
        } else {
          setMessage({
            data: 'Logged in successfully. Your registration is still pending. Redirecting...',
            type: 'alert-success',
          });
          //Direct the user to the user status page
          saveUserDataToLocalStore('', response.data.displayName, response.data.email);
          history.push(`/userstatus/${response.data.email}`);
        }
      }).catch(error => {
        //If you purposely make the database unavailable (backend failed to connect to db),
        //the error.response.request is "empty string". Therefore, the experession
        //error.response.request.status will cause run time error.
        console.dir(error);
        setLoading(false);
        //https://stackoverflow.com/questions/3390396/how-can-i-check-for-undefined-in-javascript
        if (typeof (error.response) != 'undefined') {
          if (error.response.request.status === 401) {
            setMessage({
              data: 'Login credential is not valid. Please provide your email and password.',
              type: 'alert-danger'
            });
          } else {
            setMessage({
              data: 'You are unable to login. If situation persists, please send a support ticket to seek assistance.',
              type: 'alert-danger'
            });
          }// end if ( error.response.request.status === 401)
        } else {
          setMessage({
            data: 'You are unable to login. If situation persists, please send a support ticket to seek assistance.',
            type: 'alert-danger'
          });

        }
        // end if(error.response.request!='')

        // Reset the form state
        e.target.reset();
      });
  }

  return (
    <div className="App">
      <div className="outer">
        <div className="inner">
          <Form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.loginFormContainer}>
              {message && (
                <div
                  className={`alert fade show d-flex ${message.type}`}
                  role="alert" >
                  {message.data}
                  <span
                    aria-hidden="true"
                    className="ml-auto cursor-pointer"
                    onClick={() => setMessage(null)} >
                    &times;
                  </span>
                </div>
              )}
            </div>
            <h3>Log in</h3>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              {/* You cannot use such attribute value="abrizrio@abc.com" here */}
              <Form.Control type="email" name="email" {...email} placeholder="Email"
                ref={register({
                  required: {
                    value: true,
                    message: 'Please enter your email address',
                  },
                })} />
              <Form.Text className="text-muted"> We'll never share your email with anyone else.</Form.Text>
              {/** We provide validation configuration for email field above error message are displayed with code below */}
              {errors.email && (
                <span className={`${styles.errorMessage} mandatory`}>
                  {errors.email.message}
                </span>
              )}
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password"
                {...password} placeholder="Password"
                ref={register({
                  required: {
                    value: true,
                    message: 'Please enter password',
                  },
                })} />
              {errors.password && (
                <span className={`${styles.errorMessage} mandatory`}>
                  {errors.password.message}
                </span>
              )}
            </Form.Group>
            <div className="form-group">
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id="customCheck1" />
                <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
              </div>
            </div>

            <Button type="submit" className="btn btn-dark btn-lg btn-block" disabled={loading}>{loading ? 'Signing in now ...' : 'Login'}</Button>

            <div className='forgot-password-row'>
              <p className="forgot-password text-left">
                <a href="#">Sign up?</a>
              </p>

              <p className="forgot-password text-right">
                <a href="#">Forgot password?</a>
              </p>
            </div>

          </Form>
        </div>
      </div>
    </div>
  );
}

//The author at cluemediator used this technique so that he does not need to 
//prepare "two sets" of code just to manage or remember the user name and password. 
const useFormInput = initialValue => {
  //Note advisable to change the value name to something else
  //because it is used as a value attribute in the JSX which defines the textboxes.  
  const [value, setValue] = useState(initialValue);
  const handleChange = e => {
    setValue(e.target.value);
    // More information about setValue and hooks is at https://reactjs.org/docs/hooks-state.html
  }
  return {
    value,// This is tied to the JSX 
    onChange: handleChange, // This is tied to the JSX 
  }
}

export default Login;