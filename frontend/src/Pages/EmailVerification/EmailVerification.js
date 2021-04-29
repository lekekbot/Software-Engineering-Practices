import React from 'react';
import './EmailVerification.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <div className="outer">
                <div className="inner">
                    <h3>Reset password</h3>
                    <form>
                        <div className="auth-form-body mt-3">
                            <label className="securityLabel" for="email_field">Enter your user account's verified email address and we will send you a password reset link.</label>
                            <input type="email" className="form-control input-block" id="email_field" placeholder="Enter your email address" autofocus="autofocus" />
                            <input name="commit" type="submit" value="Send password reset email" className="btn btn-primary btn-block js-octocaptcha-form-submit" disabled="" />                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;