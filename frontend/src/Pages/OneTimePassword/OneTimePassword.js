import React, { Component, useState } from 'react';

//Styling
import './OneTimePassword.module.css'
import styles from '../Login/Login.module.css';

//Imports
import axios from 'axios';
import config from '../../config.js';
import { useForm } from 'react-hook-form'
import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { saveUserDataToLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
import OtpInput from 'react-otp-input';

export default function OneTimePassword(props) {
    const [otp, setOtp] = useState(0);
    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();
    const [message, setMessage] = useState({ data: '', type: '' });
    const [loading, setLoading] = useState(false);
    const email = useFormInput('chaipinzheng@gmail.com');

    const handleOtpChange = (otp) => {
        setOtp({ otp });
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     alert(e.otp);
    // };

    const onSubmit = (data, e) => {
        setMessage({
            data: 'Verifying your email...',
            type: 'alert-warning',
        });
        setLoading(true);
        axios.post(`${config.baseUrl}/u/users/resetpassword/:userEmail`, { email: data.email })
            .then(response => {
                alert("Success!")
                setLoading(false);
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

    return (
        <div class="OverallContainer">
            <div className="App">
                <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "left" }} className="outer vertical-center">
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
                        <h3>Two-Factor Authentication</h3>
                        <Form role="validateForm">
                            <div class="input-text-wrap is-full-width" role="authyTokenContainer">

                                <Form.Label class="input-text-label delta1" for="authyTokenContainer-input-id" role="label">
                                    In order to verify who you are, we've sent you a email message. Please enter the code below.
                                </Form.Label>

                                <br />

                                <Form.Control class="input-text" data-field="" id="authyTokenContainer-input-id" type="text" role="input" value="" maxlength="{{max_length}}" autofocus="" />
                                <span class="input-info danger hidden" role="error">

                                </span><span class="input-info hidden" role="info"></span>
                            </div>
                            <input name="commit" type="submit" value="Continue" className="btn btn-primary btn-block" disabled=""
                                style={{ alignSelf: "stretch", display: "block", height: "2.2rem" }, style.inner__btn_block, style.inner__btn_primary, style.inner__btn_not__disabled__not__disabled} />
                            <br />
                            <div role="resendTextBtn"><a class="pointer delta2">Resend code via email &gt;</a></div>
                        </Form>
                    </div>
                </div>
            </div >
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