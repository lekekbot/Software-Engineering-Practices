import { useState } from "react";

//styling
import './ResetPassword.css';
import styles from './ResetPassword2.css';
import check from './check.svg'
import close from './close.svg'

//imports
import axios from 'axios';
import config from '../../config.js';
import { useForm } from 'react-hook-form';
import { useHistory } from "react-router-dom";
import { saveUserDataToLocalStore, getTokenFromLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
import { usePasswordValidation } from "./hooks/usePasswordValidation";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

function App() {
    const history = useHistory();
    const token = getTokenFromLocalStore();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, errors } = useForm();
    const [password, setPassword] = useState({ firstPassword: "", secondPassword: "", });
    const [message, setMessage] = useState({ data: '', type: '' });
    const [validLength, hasNumber, upperCase, lowerCase, match, specialChar,] = usePasswordValidation({ firstPassword: password.firstPassword, secondPassword: password.secondPassword, });

    const setFirst = (event) => {
        setPassword({ ...password, firstPassword: event.target.value });
    };

    const setSecond = (event) => {
        setPassword({ ...password, secondPassword: event.target.value });
    };

    // Logic missing
    const onSubmit = (data, e) => {
        var userNewPassword = (password.firstPassword)
        if (validLength && hasNumber && upperCase && lowerCase && match && specialChar) {
            setMessage({
                data: 'Verification in progress...',
                type: 'alert-warning',
            });
            //execute db call
        } else {
            const message = 5;
            var stringMessage = "The following of the requirements are lacking:"
            switch (false) {
                case (validLength):
                    stringMessage += "- Should be greater than 6 characters"
                case (hasNumber):
                    stringMessage += "- Should consist of a number"
                case (upperCase):
                    stringMessage += "- Should consist of a upper case character"
                case (lowerCase):
                    stringMessage += "- should consist of a lower case character"
                case (match):
                    stringMessage += "- The password don't match!"
                case (specialChar):
                    stringMessage += "- Should be consist of special characters"
            }
            if (!match) {
                setMessage({
                    data: `Your password doesn't match!`,
                    type: 'alert-success',
                });
            } else {
                setMessage({
                    data: `Your password doesn't meet one or more of the requirement`,
                    type: 'alert-success',
                });
            }
        }

        setLoading(true);
    }
    //Redirects the user, instead of using href we can use history
    const redirect = () => {
        history.push('/register');
    }
    return (
        <div class="OverallContainer" id="root">
            <div className='App'>
                <div className="outer vertical-center">
                    <div className="inner">
                        <Form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                            <div className={styles.loginFormContainer}>
                                {message && (
                                    <div
                                        className={`alert fade show d-flex ${message.type}`}
                                        role="" >
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
                            <h3>Reset Password</h3>
                            {/**Email Form Column */}

                            {/**First Password */}
                            <Form.Group controlId="formEmail">
                                <Form.Label for="password">New password:</Form.Label >
                                <input onChange={setFirst} type='password' className="PasswordLabel" />

                                {/* <div className="text-danger">{hasNumber.confirm_password}</div> */}
                            </Form.Group>

                            {/**Second Password */}
                            <Form.Group>
                                <Form.Label for="password">Re-type new</Form.Label >
                                <input onChange={setSecond} type='password' className="PasswordLabel" />
                            </Form.Group>

                            {/**Statuses */}
                            <Form.Group>
                                <div>
                                    <ul>
                                        <li>
                                            {validLength ? <img src={check} alt="this is car image" style={{ width: "16px", marginRight: "1rem", marginRight: "1rem" }} /> : <img src={close} alt="this is car image" style={{ width: "16px", marginRight: "1rem" }} />} Valid Length
                                        </li>
                                        <li>
                                            {hasNumber ? <img src={check} alt="this is car image" style={{ width: "16px", marginRight: "1rem" }} /> : <img src={close} alt="this is car image" style={{ width: "16px", marginRight: "1rem" }} />} Has a Number:
                                        </li>
                                        <li>
                                            {upperCase ? <img src={check} alt="this is car image" style={{ width: "16px", marginRight: "1rem" }} /> : <img src={close} alt="this is car image" style={{ width: "16px", marginRight: "1rem" }} />} UpperCase:
                                        </li>
                                        <li>
                                            {lowerCase ? <img src={check} alt="this is car image" style={{ width: "16px", marginRight: "1rem" }} /> : <img src={close} alt="this is car image" style={{ width: "16px", marginRight: "1rem" }} />} LowerCase:
                                        </li>
                                        <li>
                                            {match ? <img src={check} alt="this is car image" style={{ width: "16px", marginRight: "1rem" }} /> : <img src={close} alt="this is car image" style={{ width: "16px", marginRight: "1rem" }} />} Match:
                                            </li>
                                        <li>
                                            {specialChar ? <img src={check} alt="this is car image" style={{ width: "16px", marginRight: "1rem" }} /> : <img src={close} alt="this is car image" style={{ width: "16px", marginRight: "1rem" }} />} Special Character:{" "}
                                        </li>
                                    </ul>
                                </div>
                                <Form.Text className="danger">All this requirement are needed to be met for a new password!</Form.Text>
                            </Form.Group>

                            {/**Submit button */}
                            <Button type="submit" className="btn btn-dark btn-lg btn-block" disabled={loading}>{loading ? 'Verifying with requirements...' : 'Reset'}</Button>

                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

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
