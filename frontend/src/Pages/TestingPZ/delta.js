import React, { Component, useState } from 'react';
import { render } from 'react-dom';
import './delta.css'
import OtpInput from 'react-otp-input';

export default class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: '',
        };
    }

    handleOtpChange = otp => {
        this.setState({ otp });
    };

    handleSubmit = e => {
        e.preventDefault();
        alert(this.state.otp);
    };

    render() {
        const { otp, numInputs } = this.state;

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
                            <button
                                className="btn margin-top--large"
                                disabled={otp.length < numInputs}
                            >
                                Get OTP
              </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}