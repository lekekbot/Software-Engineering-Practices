import React, { Component, useState } from 'react';
import { render } from 'react-dom';
import './delta.css'
import OtpInput from 'react-otp-input';

export default function OneTimePassword(props) {
    var [otp, setOtp] = useState();

    const handleOtpChange = (otp) => {
        this.setState({ otp });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(this.state.otp);
    };

    return (
        <div className="container">
            <div className="view">
                <div className="card">
                    <form onSubmit={this.handleSubmit}>
                        <h2>Enter verification code</h2>
                        <div className="margin-top--small">
                            <OtpInput
                                inputStyle={{
                                    width: '3rem',
                                    height: '3rem',
                                    margin: '0 1rem',
                                    fontSize: '2rem',
                                    borderRadius: 4,
                                    border: '1px solid rgba(0,0,0,0.3)',
                                }}
                                numInputs={6}
                                isDisabled={false}
                                hasErrored={false}
                                errorStyle="error"
                                onChange={this.handleOtpChange}
                                separator={<span>-</span>}
                                isInputNum={true}
                                shouldAutoFocus
                            />
                        </div>
                        <button className="btn margin-top--large" disabled={6 < 6}>Verify OTP</button>
                    </form>
                </div>
            </div>
        </div>
    );
}