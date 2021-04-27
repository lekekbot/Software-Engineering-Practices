import React, { useState, useEffect } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import styles from "./ManageInviteTeamMembers.module.css";
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

import { getTokenFromLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
import { Link } from "react-router-dom";
import Header from '../../Elements/Header';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useForm } from "react-hook-form";
import axios from 'axios';
import Title from '../Title/Title';
import config from '../../config.js';
import { Button, Container, Row , Col, Spinner, Form } from 'react-bootstrap';
//The following library is for creating notification alerts when user 
//clicks the save button.
import { ToastContainer, toast } from 'react-toastify';
//Reference: https://fkhadra.github.io/react-toastify/introduction/

const ManageInviteTeamMembers = ({match}) => {
  const { register, handleSubmit, errors, watch, setValue } = useForm();
    console.log(`Managed to capture the param information 
    from the match variabe. So that I can obtain the team id value.`);
    console.log('team id value : ',match.params.teamId);
  const [inviteListData, setInviteListData] = useState([]);
  const token = getTokenFromLocalStore();
  // You need the loading state so that the Save button can
  // effectively show the button label or 'loading....' 
  const [loading, setLoading] = useState(false);

 // Handle the form submit of Registration form
 const onSubmit = (data,e) => {
  console.dir(data);
  data.teamId = match.params.teamId;
  setLoading(true);
  axios.post(`${config.baseUrl}/u/teaminvitelist/`, 
  data,{
    headers: {
      'Authorization': `Bearer ${token}` 
    }
  })
  .then(response => {
    setLoading(false);
    toast.success(response.data.message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
      }); 
      let records = response.data.content;
      // I need to apply the following map method to rebuild the
      // array of team data so that the Browser don't give warnings such as
      // Warning: Failed prop type: The prop `column.text` is marked as required in `HeaderCell`, but its value is `undefined`.
      const formattedRecords = records.map(data => {
        console.log('Checking the "data" variable in the map callback ', data);
        data.dummyId1 = data.id;
        return data;
      });
      console.log('Inspect the variable, formattedRecords');
      console.dir(formattedRecords);
      setInviteListData(formattedRecords);
    
  }).catch(error => {
    setLoading(false);
    toast.error('Something went wrong. Please try again later.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
        }); 
    // Reset the form state
    e.target.reset();
  });
}// End of onSubmit
  useEffect(() => {
   
    if (loading){return;}

    setLoading(true);
    axios.get(`${config.baseUrl}/u/teaminvitelist?teamId=${match.params.teamId}`, 
    {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      })
    .then(response => {
        console.log('Inspect the response.data.content');
        console.log(response.data.content);
        let records = response.data.content;
        // I need to apply the following map method to rebuild the
        // array of team data so that the Browser don't give warnings such as
        // Warning: Failed prop type: The prop `column.text` is marked as required in `HeaderCell`, but its value is `undefined`.
        const formattedRecords = records.map(data => {
          console.log('Checking the "data" variable in the map callback ',data);
          data.dummyId1= data.id;
          return data;
      });
      console.dir(formattedRecords);
        setInviteListData(formattedRecords);
        setLoading(false);
    }).catch(error => {
        console.log(error);
        setLoading(false);
    });
   
  }, []);//End of useEffect({function code,[]})

 
  

 const handleDelete = (id) =>{
    setLoading(true);
    confirmAlert({
      title: 'Confirm to delete?',
      message: 'Are you sure to do this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {

            axios.delete(`${config.baseUrl}/u/teaminvitelist/${id}`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })
              .then(response => {
                console.log(response.data.content);
                let records = response.data.content;
                // I need to apply the following map method to rebuild the
                // array of team data so that the Browser don't give warnings such as
                // Warning: Failed prop type: The prop `column.text` is marked as required in `HeaderCell`, but its value is `undefined`.
                const formattedRecords = records.map(data => {
                  console.log('Checking data variable in the map callback ', data);
                  data.dummyId1 = data.id;

                  return data;
                });
                console.dir(formattedRecords);
                setInviteListData(formattedRecords);
                setLoading(false);
              }).catch(error => {
                console.log(error);
                setLoading(false);
              });


          }// End of onClick section (YES)
        },
        {
          label: 'No',
          onClick: () => setLoading(false)
        }
      ]
    });

 }
  const columns = [{
    dataField: 'id',
    text: 'Id',
    sort: false,
    hidden: true
  }, {
    dataField: 'email',
    text: 'Email',
    editable: true,
    sort: true
  }, 
  {
    dataField: 'joinStatus',
    text: 'Joined?',
    editable: false,
    sort: true
  },
  {
    
    dataField:'dummyId1',
    isDummyField:true,    /*Action column needs isDummyField property*/
    text: 'Manage',
    editable: false,
    formatter: (cellContent, row) => {
        return (
          <button
            className="btn btn-danger btn-xs"
            onClick={() => handleDelete(row.id)} >
            Delete
          </button>
        );
      },
  },
 

  ];

  
  const defaultSorted = [{
    dataField: 'id',
    order: 'desc'
  }];

  function ShowLoadingSpinner(props) {
    const isLoading = props.loading;
    if (isLoading) {
      return  (
      <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
    )
    }else{
    return '';
    }
  }// End of conditional rendering Bootstrap Spinner logic
  return (
    
    <div>
      <Header />

      <Title title="Manage your team invites"></Title>
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

      <Container className="fluid" style={{border:'solid 1px black'}}
        >
        <Row>
          <Col md={{ size: 9, offset:2}}  
          lg={{ size: 8, offset:2}}
           style={{border:'solid 1px black'}}>
   
            <h3>
            Manage your team invites
            </h3>
   
          </Col>
        </Row>
        <Row>
        <Form noValidate autoComplete="off" 
          onSubmit={handleSubmit(onSubmit)} className="form-inline col-md-10 offet-md-2" 
           style={{border:'solid 1px black'}}>
        
          
    
           
            <Form.Group>
              <Form.Label>Email</Form.Label>
              {/* You cannot use such attribute value="abrizrio@abc.com" here */ }
              <Form.Control type="email" name="email"
               placeholder="Email" 
               className={`${styles.InputControl}`}
               ref={register({
                required: {
                  value: true,
                  message: "Please enter email address",
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Enter a valid email address",
                },           
                maxLength: {
                  value: 255,
                  message: "Maximum 255 characters are allowed",
                },
              })} />
              {errors.email && (
                <small  style={{float:'left'}}
                className="text-danger ">
                  {errors.email.message}
                </small>
              )}
              </Form.Group>
              { !(errors.email) && (
              <div className={`float-left text-muted`}>
                We'll send an email invite to the given address.
              </div>
              )

              }
              {/**
               * We provide validation configuration for email field above
               * error message are displayed with code below
               */}

             <Button variant="primary" className={`${styles.InputControl}`} type="submit"  disabled={loading}>
            {loading ? 'Saving now ...' : 'Save'}
            </Button>

      
        
    
    </Form>
    
      
        
        </Row>
          
        <Row >
        <Col md={{ size: 9, offset: -1 }}        lg={{ size: 9, offset: -1}} style={{border:'solid 1px black'}} >
          <Button variant="btn btn-link" className="float-right">
                <Link to="/manageteam">Cancel</Link>
              </Button>
          </Col>
        </Row>     
        <Row>
        <Col md={{ size: 9, offset: -1 }}        lg={{ size: 9, offset: -1}} style={{border:'solid 1px black'}} >   
        <div className="d-flex justify-content-center">
            <ShowLoadingSpinner loading={loading} />
        </div>
        </Col>
        </Row>   
        <Row>
          <Col md={{ size: 9, offset: -1 }}        lg={{ size: 9, offset: -1}} style={{border:'solid 1px black'}} >
            <BootstrapTable
              bootstrap4
              
              keyField="id"
              data={inviteListData}
              columns={columns}
              defaultSorted={defaultSorted}
              cellEdit={cellEditFactory({ mode: 'click', blurToSave: false })}             
            />
          </Col>
        </Row>

        <Row >
          <Col md={{ size: 9, offset: -1}}        lg={{ size: 9, offset: -1}} style={{border:'solid 1px black'}} >
              <Button variant="btn btn-link" className="float-right">
                <Link to="/manageteam">Cancel</Link>
              </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
} //End of ManageInviteTeamMembers functional component

export default ManageInviteTeamMembers;