import React, { Component, useState } from 'react';

//Styling
import './EmailVerification.css';
import styles from '../Login/Login.module.css';

//Imports
import { useHistory } from "react-router-dom";

import axios from 'axios';
import { Form, Button } from "react-bootstrap";

import { useForm } from 'react-hook-form';
import config from '../../config.js';
import { saveUserDataToLocalStore } from '../../Utils/Common.js';// Common.js don't use export default

export default function EmailVerification() {
    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();
    const [message, setMessage] = useState({ data: '', type: '' });
    const [loading, setLoading] = useState(false);

    const onSubmit = (data, e) => {
        setMessage({
            data: 'Trying to reset your password...',
            type: 'alert-warning',
        });
        setLoading(true);
        axios.post(`${config.baseUrl}/u/users/resetpassword/:userEmail`, { email: data.email })
            .then(response => {
                alert("Success!")
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
                    setMessage({
                        data: '',
                    });
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
                e.target.reset();
            });
    }
    const redirect = () => {
        history.push('/login');
    }

    console.log(register)
    return (
        <div className="App">
            <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "left" }} className="outer">
                <div style={{ width: "450px", margin: "auto", background: "#ffffff", borderRadius: "15px" }} className="inner">
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
                    <h3>Reset password</h3>
                    <Form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                        <div className="auth-form-body mt-3">
                            <Form.Group>
                                <Form.Label style={{ display: "inline-block", marginBottom: ".5rem", marginTop: "-5rem" }} for="email_field">Enter your user account's verified email address and we will send you a password reset link.</Form.Label>
                                <Form.Control type="email" name="email" id="email_field"
                                    className="form-control input-block"
                                    autofocus="autofocus" placeholder="Enter your email address"
                                    ref={register({
                                        required: {
                                            value: true,
                                            message: 'Please enter your email address',
                                        },
                                    })} />
                            </Form.Group>
                            <input name="commit" type="submit" value="Send password reset email" className="btn btn-primary btn-block" disabled=""
                                style={{ alignSelf: "stretch", display: "block", height: "2.2rem" }, style.inner__btn_block, style.inner__btn_primary, style.inner__btn_not__disabled__not__disabled} />
                        </div>
                    </Form>
                </div>
            </div>
        </div >
    );
}

const style = ({
    inner__btn_block: {
        display: "block",
        width: "100%",
        textAlign: "center",
        height: "2.2rem",
        marginTop: "1rem"
    },
    inner__btn_primary: {
        color: "#fff",
        backgroundColor: "#2ea44f",
        borderColor: "rgba(27, 31, 35, 0.15)",
        boxShadow: "0 1px 0 rgba(27, 31, 35, 0.1), inset 0 1px 0 hsla(0, 0%, 100%, 0.03)"
    },
    inner__btn_not__disabled__not__disabled: {
        cursor: "pointer",
        backgroundColor: "#2ea44f",
        marginTop: "1rem"
    },
})