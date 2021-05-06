import React, { Component, useState } from 'react';

//Styling
import './OneTimePassword.module.css'
import styles from '../Login/Login.module.css';

//Imports
import axios from 'axios';
import config from '../../config.js';
import { useForm } from 'react-hook-form'
import { useHistory } from "react-router-dom";
import { Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { getEmailFromLocalStore, saveUserDataToLocalStore } from '../../Utils/Common.js';// Common.js don't use export default

export default function OneTimePassword(props) {
    var email = getEmailFromLocalStore()
    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();
    const OTP = useFormInput('');
    const [message, setMessage] = useState({ data: '', type: '' });
    const [loading, setLoading] = useState(false);

    const onSubmit = (data, e) => {
        //Generation of message
        setMessage({
            data: 'Verifying your OTP...',
            type: 'alert-warning',
        });
        setLoading(true);

        //logic
        var email = getEmailFromLocalStore()
        var OTP = data.OTP

        //Verify the OTP the user keyed in as well as the one in the database
        axios.get(`${config.baseUrl}/u/user/validate_2fa/${email}/${OTP}`)
            .then(response => {
                setLoading(false);
                if (response.data.status != 'pending') {
                    setMessage({
                        data: 'Logged in successfully, redirecting...',
                        type: 'alert-success',
                    });
                    saveUserDataToLocalStore(response.data.token, response.data.displayName, response.data.email);
                    history.push('/reset_password');
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
                            data: 'The OTP you have keyed in is wrong! Please try again!',
                            type: 'alert-danger'
                        });
                    } else if (error.response.request.status === 402) {
                        setMessage({
                            data: 'Your OTP has expired! Would you like us to resend?',
                            type: 'alert-danger'
                        });
                    } else if (error.response.request.status === 404) {
                        setMessage({
                            data: 'You have tried this OTP too many times! Its now locked',
                            type: 'alert-danger'
                        });
                    } else {
                        setMessage({
                            data: 'Your OTP has expired! Would you like us to resend?',
                            type: 'alert-danger'
                        });
                    }// end if ( error.response.request.status === 401)
                } else {
                    setMessage({
                        data: 'You are unable to verify. If situation persists, please send a support ticket to seek assistance.',
                        type: 'alert-danger'
                    });

                }
                // end if(error.response.request!='')

                // Reset the form state
                e.target.reset();
            });
    }

    const requestNewOTP = () => {
        setLoading(true);
        setMessage({
            data: 'Resending you a new OTP...',
            type: 'alert-warning',
        });

        //first axios request validates with the server whether timing is optimal to resend to reduce spam
        axios.get(`${config.baseUrl}/u/user/validate/resend/${email}/${OTP}`)
            .then((response) => {
                //this then calls the function to resend the userEmail
                axios.post(`${config.baseUrl}/u/users/resetpassword/userEmail`, { email: email })
                    .then((response) => {
                        setLoading(false);
                        setMessage({
                            data: "Email with the OTP was resent!",
                            type: "alert-success",
                        });
                    })
                    .catch((error) => {
                        setLoading(false);
                        if (typeof error.response != "undefined") {
                            setMessage({
                                data: "",
                            });
                            if (error.response.request.status === 401) {
                                setMessage({
                                    data: "We can't find an email tied to your account! Please try again!",
                                    type: "alert-danger",
                                });
                            } else {
                                setMessage({
                                    data: "You are unable to login. If situation persists, please send a support ticket to seek assistance.",
                                    type: "alert-danger",
                                });
                            }
                        } else {
                            setMessage({
                                data: "You are unable to login. If situation persists, please send a support ticket to seek assistance.",
                                type: "alert-danger",
                            });
                        }
                    });
            })
            .catch((error) => {
                setLoading(false);
                if (typeof error.response != "undefined") {
                    setMessage({
                        data: "",
                    });
                    if (error.response.request.status === 402) {
                        setMessage({
                            data: `Please wait for another minute before requesting!`,
                            type: "alert-danger",
                        });
                    } else {
                        setMessage({
                            data: "Please wait for another minute before requesting!",
                            type: "alert-danger",
                        });
                    }
                } else {
                    setMessage({
                        data: "You are unable to be verified. If situation persists, please send a support ticket to seek assistance.",
                        type: "alert-danger",
                    });
                }
            });
    };

    const redirect = () => {
        history.push('/register');
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
                        <Form role="validateForm" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                            <div class="input-text-wrap is-full-width" role="authyTokenContainer">
                                <Form.Group controlId="formOTP">
                                    <Form.Label class="input-text-label delta1" for="authyTokenContainer-input-id" role="label">
                                        In order to verify who you are, we've sent you a email message. Please enter the code below.
                                    </Form.Label>
                                    <br />

                                    <Form.Control type="text" name="OTP" {...OTP} placeholder="e.g. 0123456"
                                        class="input-text" autofocus="" id="authyTokenContainer-input-id"
                                        ref={register({
                                            required: {
                                                value: true,
                                                message: 'Please key in your OTP',
                                            },
                                        })} />

                                    <span class="input-info danger hidden" role="error"></span><span class="input-info hidden" role="info"></span>
                                </Form.Group>
                            </div>
                            <input name="commit" type="submit" value="Continue" className="btn btn-primary btn-block" disabled=""
                                style={{ alignSelf: "stretch", display: "block", height: "2.2rem" }, style.inner__btn_block, style.inner__btn_primary, style.inner__btn_not__disabled__not__disabled} />
                            <br />
                            <input id="clickMe" type="button" value="Resend code via email &gt;" onClick={requestNewOTP} class="pointer delta2"
                                role="resendTextBtn" />
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