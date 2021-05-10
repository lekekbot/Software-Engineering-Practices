import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from './Register.module.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useForm} from 'react-hook-form';
import { Link } from 'react-router-dom';
import config from '../../config.js';
//I had to use RHFInput to build a data driven drop down list
import { RHFInput } from 'react-hook-form-input';
const Register = () => {
  const { register, handleSubmit, errors, watch, setValue } = useForm();
  const history = useHistory();
  const [institutions,setInstitutions] = useState();
  const [message, setMessage] = useState();
  // You need the loading state so that the Login button can
  // effectively show the button label or 'loading....' 
  const [loading, setLoading] = useState(false);
  const [institutionIdOptions, setInstitutionIdOptions] = useState([{value:'',label:'Select institution'}]);


  useEffect(() => {
    
    axios.get(`${config.baseUrl}/institutions`, 
    {})
    .then(response => {
        console.log(response.data.data);
        const institutionData = response.data.data.map(oneData => ({ value: oneData.institutionId, label: oneData.name }));
        setInstitutionIdOptions(institutionIdOptions.concat(institutionData));
        
    }).catch(error => {
        console.log(error);
    });
  }, [setInstitutions]);
  useEffect(() => {
    
   console.log(institutionIdOptions);
  }, [institutionIdOptions]);

  // Handle the form submit of Registration form
  const onSubmit = (data,e) => { 
    console.dir(data);
    setMessage({
      data: 'Registration is in progress...',
      type: 'alert-warning',
    });
    setLoading(true);
    axios.post(`${config.baseUrl}/users/register`, 
    data)
    .then(response => {
      setLoading(false);
      setMessage({
        data:  'You have registered. Redirecting .... ',
        type:  'alert-success',
      });
      
      history.push(`/userstatus/${data.email}`);
    }).catch(error => {
      setLoading(false);
      if (error.response?.status==500){
        setMessage({data:'Something went wrong. Please try again later. Send a support ticket if problem persists.', type:'alert-danger'});
      }
      if (error.response?.status==405){
        setMessage({data:'Your account has already been created, please login instead', type:'alert-danger'});
      }
      // Reset the form state
      e.target.reset();
    });
  }// End of onSubmit
  https://stackoverflow.com/questions/62574713/react-form-hooks-how-to-validate-select-option

  return (
    <div
      className={`${styles.container} container-fluid d-flex align-items-top justify-content-center `}
    >
      <div className="{styles.registrationFormContainer}" style={{width:'100%'}}>
        <div className="row ">
        <div className="col" style={{border:'solid 1px #ff0000'}}>
        {message && (
          <div
            className={`alert fade show d-flex ${message.type}`}
            role="alert">
            {message.data}
            <span
              aria-hidden="true"
              className="ml-auto cursor-pointer"
              onClick={() => setMessage(null)}
            >
              &times;
            </span>
          </div>
        )}
        <fieldset className="border p-3 rounded">
          <legend
            className={`${styles.registrationFormLegend} border rounded p-1 text-center`}
          >
            Registration Form
          </legend>
          <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
            <div className="form-group">
              <label htmlFor="emailInput">Email address</label>
              <span className="mandatory">*</span>
              <input
                id="emailInput"
                name="email"
                type="email"
                className="form-control"
                aria-describedby="Enter email address"
                placeholder="Enter email address"
                ref={register({
                  required: {
                    value: true,
                    message: 'Please enter your email address',
                  },
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Enter a valid email address',
                  },
                  minLength: {
                    value: 6,
                    message: 'Minimum 6 characters are allowed',
                  },
                  maxLength: {
                    value: 255,
                    message: 'Maximum 255 characters are allowed',
                  },
                })}
              />
              {/**
               * we provide validation configuration for email field above
               * error message are displayed with code below
               */}
              {errors.email && (
                <span className={`${styles.errorMessage} mandatory`}>
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="firstNameInput">First Name</label>
              <span className="mandatory">*</span>
              <input
                id="firstNameInput"
                name="firstName"
                type="text"
                className="form-control"
                aria-describedby="Enter your first name"
                placeholder="Enter your first name"
                ref={register({
                  required: {
                    value: true,
                    message: 'Please enter your first name.',
                  },
                  minLength: {
                    value: 1,
                    message: 'First name is required.',
                  },
                  maxLength: {
                    value: 255,
                    message: 'Maximum 255 characters are allowed',
                  },
                })}
              />
              {errors.name && (
                <span className={`${styles.errorMessage} mandatory`}>
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="lastNameInput">Last name</label>
              <span className="mandatory">*</span>
              <input
                id="lastNameInput"
                name="lastName"
                type="text"
                className="form-control"
                aria-describedby="Enter your last name."
                placeholder="Enter your last name."
                ref={register({
                  required: {
                    value: true,
                    message: 'Please enter your last name',
                  },
                  minLength: {
                    value: 1,
                    message: 'Last name is required.',
                  },
                  maxLength: {
                    value: 255,
                    message: 'Maximum 255 characters are allowed',
                  },
                })}
              />
              {errors.name && (
                <span className={`${styles.errorMessage} mandatory`}>
                  {errors.name.message}
                </span>
              )}
            </div>            
            <div className="form-group">
              <label htmlFor="passwordInput">Password</label>
              <span className="mandatory">*</span>
              <input
                type="password"
                name="password"
                className="form-control"
                id="passwordInput"
                placeholder="Enter password"
                ref={register({
                  required: {
                    value: true,
                    message: 'Please enter password',
                  },
                  minLength: {
                    value: 6,
                    message: 'Minimum 5 characters are allowed',
                  },
                  maxLength: {
                    value: 255,
                    message: 'Maximum 255 characters are allowed',
                  },
                })}
              />
              {errors.password && (
                <span className={`${styles.errorMessage} mandatory`}>
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPasswordInput">Password</label>
              <span className="mandatory">*</span>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                id="confirmPasswordInput"
                placeholder="Enter confirm password"
                ref={register({
                  validate: (value) => value === watch('password')|| "Passwords don't match.",
                  required: {
                    value: true,
                    message: 'Please enter password',
                  },
                  minLength: {
                    value: 6,
                    message: 'Minimum 5 characters are allowed',
                  },
                  maxLength: {
                    value: 255,
                    message: 'Maximum 255 characters are allowed',
                  },
                })}
              />
              {errors.confirmPassword && (
                <span className={`${styles.errorMessage} mandatory`}>
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="institutionIdInput">Institution</label>
              <span className="mandatory">*</span>
            
                  <RHFInput
                    as={<Select options={institutionIdOptions} />}
                    rules={{ required: 'Please select an institution' }}
                    name="institution"
                    register={register}
                    setValue={setValue}
                  />
                  {errors.institution && (
                    <span className={`${styles.errorMessage} mandatory`}>
                      {errors.institution.message}
                    </span>
                  )}
              
            </div>




            <div className="d-flex align-items-center justify-content-center">
              <button type="submit" className="btn btn-outline-primary">
              {loading ? 'Registering now ...' : 'Register'}
              </button>
              <button className="btn btn-link">
                <Link to="/login">Cancel</Link>
              </button>
            </div>
          </form>
        </fieldset>
      </div>
      
      
      <div className="col" style={{border:"solid 1px #ff0000"}}>
      <table>
        <thead>
        <tr><th>First name</th><th>Last name</th><th>Email</th></tr>
        
        </thead>
        <tbody>
        <tr><td>Mary</td><td>Nat</td><td>marynat@abc.com@abc.com</td></tr>
        <tr><td>Samuel</td><td>Simpsons</td><td>samuelsimpsons@abc.com</td></tr>
        <tr><td>Rita</td><td>Kennedy</td><td>ritakennedy@abc.com</td></tr>
        </tbody>
      </table>
    </div>
    </div>{/* div className=row*/}  
    </div>
    </div>

  );
};

export default Register;