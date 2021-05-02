import './Login.module2.css';
import styles from './Login.module.css';

//Imports
import axios from 'axios';
import config from '../../config.js';
import { useForm } from 'react-hook-form';
import { useHistory } from "react-router-dom";
import { saveUserDataToLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";


export default function ResetPassword(props) {

  return (
    <div className="create_account_screen">

      <div className="create_account_form">
        <h1>Create account</h1>
        <p>Example of form validation built with React.</p>
        <form onSubmit={this.saveAndContinue}>

          <Input
            text="Email Address"
            ref="email"
            type="text"
            defaultValue={this.state.email}
            validate={this.validateEmail}
            value={this.state.email}
            onChange={this.handleEmailInput}
            errorMessage="Email is invalid"
            emptyMessage="Email can't be empty"
            errorVisible={this.state.showEmailError}
          />

          <Input
            text="Company Name"
            ref="companyName"
            validate={this.isEmpty}
            value={this.state.companyName}
            onChange={this.handleCompanyInput}
            emptyMessage="Company name can't be empty"
          />

          <Input
            text="Password"
            type="password"
            ref="password"
            validator="true"
            minCharacters="8"
            requireCapitals="1"
            requireNumbers="1"
            forbiddenWords={this.state.forbiddenWords}
            value={this.state.passsword}
            emptyMessage="Password is invalid"
            onChange={this.handlePasswordInput}
          />

          <Input
            text="Confirm password"
            ref="passwordConfirm"
            type="password"
            validate={this.isConfirmedPassword}
            value={this.state.confirmPassword}
            onChange={this.handleConfirmPasswordInput}
            emptyMessage="Please confirm your password"
            errorMessage="Passwords don't match"
          />

          <Select
            options={STATES}
            ref="state"
            value={this.state.statesValue}
            onChange={this.updateStatesValue}
            searchable={this.props.searchable}
            emptyMessage="Please select state"
            errorMessage="Please select state"
            placeholder="Choose Your State"
            placeholderTitle="Your State"
          />

          <button
            type="submit"
            className="button button_wide">
            CREATE ACCOUNT
            </button>

        </form>

        <a href="https://github.com/mikepro4/react-signup-form" target="_blank" className="github_link" title="View Source Code">
          <Icon type="guthub" />
        </a>
      </div>

    </div>
  )
}