import React, { Component, useState } from 'react';
import './delta.css'
import OtpInput from 'react-otp-input';

export default function OneTimePassword(props) {
    const [otp, setOtp] = useState(0);

    const handleOtpChange = (otp) => {
        setOtp({ otp });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(e.otp);
    };

    return (
        <div className="container">
            <div className="view">
                <div className="card">
                    <form onSubmit={handleSubmit}>
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
                                onChange={handleOtpChange}
                                separator={<span>-</span>}
                                isInputNum={true}
                                shouldAutoFocus
                            />
                        </div>
                        <button className="btn margin-top--large" disabled={otp.length < 0}>Verify OTP</button>
                    </form>
                </div>
            </div>
        </div>
    );
}