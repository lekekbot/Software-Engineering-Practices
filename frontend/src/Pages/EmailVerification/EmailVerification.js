import React from 'react';
import './EmailVerification.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "left" }} className="outer">
                <div style={{ width: "450px", margin: "auto", background: "#ffffff", borderRadius: "15px" }} className="inner">
                    <h3>Reset password</h3>
                    <form>
                        <div className="auth-form-body mt-3">
                            <label style={{ display: "inline-block", marginBottom: ".5rem", marginTop: "-5rem" }} for="email_field">Enter your user account's verified email address and we will send you a password reset link.</label>
                            <input type="email" className="form-control input-block" id="email_field" placeholder="Enter your email address" autofocus="autofocus" />
                            <input name="commit" type="submit" value="Send password reset email" className="btn btn-primary btn-block" disabled=""
                                style={{ alignSelf: "stretch", display: "block", height: "2.2rem" }, style.inner__btn_block, style.inner__btn_primary, style.inner__btn_not__disabled__not__disabled} />
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
}

export default App;

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