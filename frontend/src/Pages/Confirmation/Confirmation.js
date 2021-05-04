import React, { Component, useState } from 'react';
// import styles from './Login.module.css';
// import './Login.module2.css';

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import axios from 'axios';
import { Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

import { useForm } from 'react-hook-form';
import config from '../../config.js';
import { saveUserDataToLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
// Therefore, you need to use the {what function do you need} technique.

function Confirmation(props) {

    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();
    //After finished working on this Login.js, I noticed that applying state for email and password, combining it with
    // inside the UI without typing additional code.
    const [message, setMessage] = useState();
    // You need the loading state so that the Login button can
    // effectively show the button label or 'loading....' 
    const [loading, setLoading] = useState(false);

    // Handle the form submit of login form
    const onSubmit = (data) => {
        alert("Hello World")
        let token = window.location.href.split("/").slice(-1)
        // history.push(`/login`);
        // console.dir(data);
        setMessage({
            data: 'Login is in progress...',
            type: 'alert-warning',
        });
        axios.post(`${config.baseUrl}/users/confirmation/:${token}`)
            .then(response => {
                console.log(response.data.status + " this is the status");
                history.push(`/login`);
                setLoading(false);
                if (response.data.status != 'pending') {
                    setMessage({
                        data: 'Email has successfully been confirmed.Redirecting...',
                        type: 'alert-success',
                    });
                } else {
                    setMessage({
                        data: 'Email has successfully been confirmed. Your verification is still pending. Redirecting...',
                        type: 'alert-success',
                    });
                    //Direct the user to the user status page
                    history.push(`/login`);
                }
            }).catch(error => {
                //If you purposely make the database unavailable (backend failed to connect to db),
                //the error.response.request is "empty string". Therefore, the experession
                //error.response.request.status will cause run time error.
                console.dir(error);
                //https://stackoverflow.com/questions/3390396/how-can-i-check-for-undefined-in-javascript
                if (typeof (error.response) != 'undefined') {
                    setMessage({
                        data: '',
                    });
                    console.log(error.response.request.status);
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
            });
    }
    return (

        <div class="OverallContainer" id="root">
            {message && (
          <div
            className={`alert fade show d-flex ${message.type}`}
            role="alert">
            {message.data}
            <span
              aria-hidden="true"
              className="ml-auto cursor-pointer"
              onClick={() => setMessage(null)}
            >
              &times;
            </span>
          </div>
        )}
            <form noValidate autoComplete="off">
                <button onClick={onSubmit}>
                    Verify user
                    </button>
            </form>
        </div>
    );
}


export default Confirmation;