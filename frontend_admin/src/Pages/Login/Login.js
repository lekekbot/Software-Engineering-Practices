//Reference:https://github.com/mohanramphp/auth-using-react
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
//Need the following 2 lines to communicate with the REST API
import axios from 'axios';
import { Form, Button, Container, Row , Col  } from "react-bootstrap";
import Title from "../../Elements/Title/Title";
//The following library is for creating notification alerts when user 
//clicks the save button.
import { ToastContainer, toast } from 'react-toastify';
import config from '../../Config.js';
import styles from  './Login.module.css';
import { useForm } from "react-hook-form";
import { saveUserDataToLocalStore } from '../../Utils/Common.js';
// Common.js don't use export default
// Therefore, you need to use the {what function do you need} technique.

function Login() {
  const { register, handleSubmit, errors } = useForm();
  const history = useHistory();
  //After finished working on this Login.js, I noticed that
  //using useFormInput technique on 
  //applying state for email and password, combining them with
  //input controls are "not really necessary". I still kept the code here
  //for the Login.js because it is useful for certain scenarios.
  //But I won't implement this technique for Register.js
  const email = useFormInput('bobsong@abc.com');
  const password = useFormInput('ezy123');
  // You need the message state so that you can update the message inside the 
  // handleLogin code. The React engine will automatically help you show the 
  // error message at the appropriate location inside the UI without typing additional code.
  const [message, setMessage] = useState({data:'',type:''});
  // You need the loading state so that the Login button can
  // effectively show the button label or 'loading....' 
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (message.type=='alert-success'){
    toast.success(message.data, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
      }); 
    }// End of success message type info
    if (message.type=='alert-danger'){
      toast.error(message.data, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
        }); 
      }// End of danger message type info
      if (message.type=='alert-info'){
        toast.info(message.data, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
          }); 
        }// End of danger message type info
  }, [message]);//End of useEffect({function code,[message]})
  // Handle the form submit of login form
  const onSubmit = (data,e) => {
    console.dir(data);
    setMessage({
      data: 'Login is in progress...',
      type: 'alert-warning',
    });
    setLoading(true);
    axios.post(`${config.baseUrl}/a/users/adminsignin`, 
    { email:data.email, password: data.password })
    .then(response => {
      setLoading(false);
      setMessage({
        data:  'Logged in successfully, redirecting...',
        type:  'alert-success',
      });
console.log(response)
    
      saveUserDataToLocalStore(response.data.token, response.data.displayName, response.data.userid);
      history.push({
        pathname: '/dashboard',
        state: {email: data.email}
      });
    }).catch(error => {
      console.dir(error);
      setLoading(false);
      if ((error.response!=null) && (error.response.request.status === 401)) {
        
        setMessage({
          data: error.response.data.message,
          type: 'alert-danger'
        });
      }else if(error.message!=null){
        setMessage({
          data: error.message,
          type: 'alert-danger'
        });
      }else{
        setMessage({data:'Something went wrong. Please try again later.', type:'alert-danger'});
      }
      // Reset the form state
      e.target.reset();
    });
  }
 
  return (
    <div>
    <Title title="Manage users"></Title>
    <ToastContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
  {/* ToastContainer - put it outside the Container. */}

    <Container className="fluid mw-100" style={{border:'solid 1px black'}}
        className="justify-content-center">
      <Row>
        <Col>
        <h3>Login</h3>
        </Col>
      </Row>
      
      <Row>
        <Col  md={{ size: 10, offset: 1 }} style={{border:'solid 1px black'}}>
        <Form noValidate autoComplete="off" 
          onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              {/* You cannot use such attribute value="abrizrio@abc.com" here */ }
              <Form.Control type="email" name="email"
               {...email} placeholder="Email"
               ref={register({
                required: {
                  value: true,
                  message: "Please enter your email address",
                },
              })} />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
              {/**
               * We provide validation configuration for email field above
               * error message are displayed with code below
               */}
              {errors.email && (
                <span className={`${styles.errorMessage} mandatory`}>
                  {errors.email.message}
                </span>
              )}
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password"  name="password"
              {...password} placeholder="Password"
              ref={register({
                required: {
                  value: true,
                  message: "Please enter password",
                },
              })} />
              {errors.password && (
                <span className={`${styles.errorMessage} mandatory`}>
                  {errors.password.message}
                </span>
              )}              
            </Form.Group>
            <Button variant="primary" type="submit"  disabled={loading}>
            {loading ? 'Signing in now ...' : 'Login'}
            </Button>
           
          </Form>
        </Col>
      </Row>
     </Container>
    </div>
);
}
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
 
export default Login;