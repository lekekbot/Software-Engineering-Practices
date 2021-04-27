import React, { useState ,useEffect} from 'react';
import styles from './UpdateTeam.module.css';
import { Form, Button, Container, Row , Col  } from "react-bootstrap";
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Header from '../../Elements/Header';
import Title from '../Title/Title';
import config from '../../config.js';
import { getTokenFromLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
const UpdateTeam = ({match}) => {
  const history = useHistory();
  //Using the following command to see whether I am able to capture the 
  //:teamId inside this UpdateTeam functional component.
  console.log(match.params.teamId);
  console.log('Managed to capture the param information from the match variabe');
  const token = getTokenFromLocalStore();
  const [oneTeamData, setOneTeamData] = useState([]);
  const { register, handleSubmit, errors, setValue } = useForm();
  const [message, setMessage] = useState();
  // You need the loading state so that the Save button can
  // effectively show the button label or 'loading....' 
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
    axios.get(`${config.baseUrl}/u/team/${match.params.teamId}`, 
    {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      })
    .then(response => {
        console.log(response.data.data);
        let oneRecord = response.data.data[0];
        console.dir('Inspect oneRecord : ',oneRecord);
        setOneTeamData(oneRecord);
        setLoading(false);
    }).catch(error => {
        console.log(error);
        setLoading(false);
    });
  }, []);//End of useEffect({function code,[]})
  // Handle the delete operation for the Delete button inside the form
  const handleDelete = () => {
   
    setMessage({
      data: "Delete team is in progress...",
      type: "alert-warning",
    });
    const token = getTokenFromLocalStore();
    setLoading(true);
    axios.delete(`${config.baseUrl}/u/team/delete/${oneTeamData.id}`,{
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      })
    .then(response => {
      setLoading(false);
      setMessage({
        data:  'You have deleted the team.',
        type:  'alert-success',
      });
      history.push('/manageteam');
      
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
      
    });
  }// End of handleDelete
  // Handle the form submit of Update team form
  const onSubmit = (data,e) => {
    console.dir(data);
    setMessage({
      data: "Update team is in progress...",
      type: "alert-warning",
    });
    const token = getTokenFromLocalStore();
    setLoading(true);
    axios.put(`${config.baseUrl}/u/team/update`, 
    data,{
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      })
    .then(response => {
      setLoading(false);
      setMessage({
        data:  'You have saved your changes.',
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
  useEffect(() => {
    console.log('Inspect oneTeamData inside the useEffect() ', oneTeamData);
    if (oneTeamData!=[]) {
      setValue('id', oneTeamData.id, { shouldValidate: true });
      setValue('name', oneTeamData.name, { shouldValidate: true });
    }
  }, [oneTeamData]);

  return (
    
    <div>
    <Title title="Update Team"></Title>
    <Header/>
    <Container className="fluid mw-100" style={{border:'solid 1px black'}}
        className="justify-content-center">
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
          <h3>Update your team</h3>
        </Col>
        </Row>
        <Row>
        <Col  md={{ size: 10, offset: 1 }} style={{border:'solid 1px black'}}> 
        <Form noValidate autoComplete="off" 
          onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" name="id" 
            ref={register({})}/>
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
        
            {loading ? 'Updating now ...' : 'Update'}
            </Button>
            <Button variant="danger" type="button"  onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting now ...' : 'Delete' }
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

export default UpdateTeam;