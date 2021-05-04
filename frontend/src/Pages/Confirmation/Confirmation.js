import React, { Component, useState } from 'react';
import styles from './Confirmation.css';
import './Confirmation2.css';

import axios from 'axios';
import config from '../../config.js';
import { useForm } from 'react-hook-form';
import { useHistory } from "react-router-dom";
import { saveUserDataToLocalStore } from '../../Utils/Common.js';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

export default function Confirmation(props) {
    const history = useHistory();
    const [message, setMessage] = useState();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, errors } = useForm();

    // Handle the form submit of login form
    const onSubmit = (data) => {
        let token = window.location.href.split("/").slice(-1)
        setMessage({
            data: 'Verifying in progress',
            type: 'alert-warning',
        });
        axios.post(`${config.baseUrl}/users/confirmation/:${token}`)
            .then(response => {
                console.log(response.data.status + " this is the status");
                setLoading(false);
                if (response.data.status != 'pending') {
                    setMessage({
                        data: 'Email has successfully been confirmed.Redirecting...',
                        type: 'alert-success',
                    });
                    history.push(`/login`);
                } else {
                    setMessage({
                        data: 'Email has successfully been confirmed. Your verification is still pending. Redirecting...',
                        type: 'alert-success',
                    });
                    history.push(`/login`);
                }
            }).catch(error => {
                if (typeof (error.response) != 'undefined') {
                    setMessage({
                        data: '',
                    });
                    if (error.response.request.status === 401) {
                        setMessage({
                            data: "Unable to verify your status!",
                            type: 'alert-danger'
                        });
                    } else if(error.response.request.status === 500){
                        setMessage({
                            data: "Error! Your link is broken",
                            type: 'alert-danger'
                        });
                    }else {
                        setMessage({
                            data: "Unable to verify your status!",
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
            <div className="App">
                <div className="outer vertical-center">
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
                            <h3>Verify me</h3>
                            <input name="commit" type="submit" value="Click to verify" className="btn btn-primary btn-block" disabled=""
                                style={{ alignSelf: "stretch", display: "block", height: "2.2rem" }, style.inner__btn_block, style.inner__btn_primary, style.inner__btn_not__disabled__not__disabled} />                        </Form>
                    </div>
                </div>
            </div>
        </div>

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