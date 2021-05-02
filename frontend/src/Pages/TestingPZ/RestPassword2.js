import { useState } from "react";

//styling
import './Login.module2.css';
import styles from './Login.module.css';

//imports
import axios from 'axios';
import config from '../../config.js';
import { useForm } from 'react-hook-form';
import { useHistory } from "react-router-dom";
import { usePasswordValidation } from "./hooks/usePasswordValidation";
import { saveUserDataToLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

function App() {
    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();
    const email = useFormInput('dazzelneo@abc.com');
    const [password, setPassword] = useState({ firstPassword: "", secondPassword: "", });
    const [message, setMessage] = useState({ data: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [validLength, hasNumber, upperCase, lowerCase, match, specialChar,] = usePasswordValidation({ firstPassword: password.firstPassword, secondPassword: password.secondPassword, });

    const setFirst = (event) => {
        setPassword({ ...password, firstPassword: event.target.value });
    };

    const setSecond = (event) => {
        setPassword({ ...password, secondPassword: event.target.value });
    };

    // Logic missing
    const onSubmit = (data, e) => {
        // console.dir(data);
        setMessage({
            data: 'Login is in progress...',
            type: 'alert-warning',
        });
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
                                <input onChange={setFirst} type='text' className="PasswordLabel" />

                                {/* <div className="text-danger">{hasNumber.confirm_password}</div> */}
                            </Form.Group>

                            {/**Second Password */}
                            <Form.Group>
                                <Form.Label for="password">Re-type new</Form.Label >
                                <input onChange={setSecond} type='text' className="PasswordLabel" />
                            </Form.Group>

                            {/**Statuses */}
                            <Form.Group>
                                <div>
                                    <ul>
                                        <li>
                                            Valid Length: {validLength ? <span>True</span> : <span>False</span>}
                                        </li>
                                        <li>
                                            Has a Number: {hasNumber ? <span>True</span> : <span>False</span>}
                                        </li>
                                        <li>
                                            UpperCase: {upperCase ? <span>True</span> : <span>False</span>}
                                        </li>
                                        <li>
                                            LowerCase: {lowerCase ? <span>True</span> : <span>False</span>}
                                        </li>
                                        <li>Match: {match ? <span>True</span> : <span>False</span>}</li>
                                        <li>
                                            Special Character:{" "}
                                            {specialChar ? <span>True</span> : <span>False</span>}
                                        </li>
                                    </ul>
                                </div>
                                <Form.Text className="danger">All this requirement are needed to be met for a new password!</Form.Text>
                            </Form.Group>

                            {/**Submit button */}
                            <Button type="submit" className="btn btn-dark btn-lg btn-block" disabled={loading}>{loading ? 'Signing in now ...' : 'Login'}</Button>

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
