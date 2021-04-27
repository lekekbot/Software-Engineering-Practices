import React, { useState } from "react";

import styles from "./Team.module.css";
import { Form, Button, Container, Row , Col  } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { RHFInput } from 'react-hook-form-input';
import axios from 'axios';
import { useForm } from "react-hook-form";

import { Link } from "react-router-dom";
import Header from '../../Elements/Header';
import Title from "../Title/Title";
import config from '../../config.js';
import { getTokenFromLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
const CreateTeam = () => {
  const { register, handleSubmit, errors, setValue } = useForm({defaultValues: {name:'Donald Duck'}});
  const history = useHistory();
  const [message, setMessage] = useState();
  // You need the loading state so that the Login button can
  // effectively show the button label or 'loading....' 
  const [loading, setLoading] = useState(false);
  // Handle the form submit of Registration form
  const onSubmit = (data,e) => {
    console.dir(data);
    setMessage({
      data: "Create new team is in progress...",
      type: "alert-warning",
    });
    const token = getTokenFromLocalStore();
    setLoading(true);
    axios.post(`${config.baseUrl}/u/teams`, 
    data,{
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      })
    .then(response => {
      setLoading(false);
      setMessage({
        data:  'You have created a new team.',
        type:  'alert-success',
      });
      
      
    }).catch(error => {
      setLoading(false);
      if ((error.response!=null) && (error.response.status === 500)) {
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
        setMessage({data:"Something went wrong. Please try again later.", type:'alert-danger'});
      }
      // Reset the form state
      e.target.reset();
    });
  }// End of onSubmit


  return (
    <div>
    <Title title="Add Team"></Title>
    <Header/>
    <Container className="fluid mw-100" style={{border:'solid 1px black'}}
        className="justify-content-center">
      <Row>
        <Col>
        <h3>Create a new team</h3>
        </Col>
      </Row>
      <Row>
        <Col  md={{ size: 10, offset: 1 }} style={{border:'solid 1px black'}}>
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
        </Col>
        </Row>

        <Row>
        <Col  md={{ size: 10, offset: 1 }} style={{border:'solid 1px black'}}> 
        <Form noValidate autoComplete="off" 
          onSubmit={handleSubmit(onSubmit)}>
             <Form.Group controlId="formTeamName">
             <Form.Label>Team name</Form.Label>
              <span className="mandatory">*</span>
              <Form.Control type="text" name="name"
               placeholder="Team name"
               ref={register({
                required: {
                  value: true,
                  message: "Please enter the team name.",
                },
                minLength: {
                  value: 5,
                  message: 'Your team name needs minimum 5 characters',
                },
                maxLength: {
                  value: 255,
                  message: 'Maximum 255 characters are allowed',
                },
              })} />
                {errors.name && (
                <span className={`${styles.errorMessage} mandatory`}>
                  {errors.name.message}
                </span>
              )}
          </Form.Group>

          <div className="d-flex align-items-center justify-content-center">
          <Button variant="primary" type="submit"  disabled={loading}>
            {loading ? 'Creating team now ...' : 'Create'}
            </Button>
              <Button variant="btn btn-link">
                <Link to="/dashboard">Cancel</Link>
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container> 
  
    </div>
  );
};

export default CreateTeam;