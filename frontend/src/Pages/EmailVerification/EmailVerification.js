import React, { Component, useState } from 'react';

//Styling
import styles from '../Login/Login.module.css';
import './EmailVerification.css';

//Imports
import axios from 'axios';
import config from '../../config.js';
import { useForm } from 'react-hook-form';
import { useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

export default function EmailVerification() {
    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();
    const [message, setMessage] = useState({ data: '', type: '' });
    const [loading, setLoading] = useState(false);
    const email = useFormInput('chaipinzheng@gmail.com');

    const onSubmit = (data, e) => {
        setMessage({
            data: 'Verifying your email...',
            type: 'alert-warning',
        });
        setLoading(true);
        axios.post(`${config.baseUrl}/u/users/resetpassword/:userEmail`, { email: data.email })
            .then(response => {
                setLoading(false);
                setMessage({
                    data: 'Done!',
                });
                history.push(`/one_time_password`);
            }).catch(error => {
                // Validation Logic
                setLoading(false);
                if (typeof (error.response) != 'undefined') {
                    setMessage({
                        data: '',
                    });
                    if (error.response.request.status === 401) {
                        setMessage({
                            data: "We can't find an email tied to your account! Please try again!",
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
                        <h3>Reset password</h3>
                        <Form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                            <div className="auth-form-body mt-3">
                                <Form.Group controlId="formEmail">
                                    <Form.Label style={{ display: "inline-block", marginBottom: ".5rem", marginTop: "-5rem" }} for="email_field">To reset your password, please provide your email you signed up with Competiton Management System.</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        id="email_field"
                                        {...email}
                                        className="form-control input-block"
                                        autofocus="autofocus"
                                        placeholder="Enter your email address"
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
