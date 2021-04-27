import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
//https://code.tutsplus.com/tutorials/working-with-tables-in-react-part-one--cms-29682
//react-bootstrap-table-next is actually, 
//react-bootstrap-table2 - is the new version 2, do not get confused
//thinking that it is the old now
import BootstrapTable from 'react-bootstrap-table-next';
import { getTokenFromLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
import { Link } from "react-router-dom";
import Header from '../../Elements/Header';
import axios from 'axios';
import Title from '../Title/Title';
import config from '../../config.js';
import { Button, Container, Row , Col, Spinner, Card } from 'react-bootstrap';
//The following library is for creating notification alerts when user 
//clicks the save button.
import { ToastContainer, toast } from 'react-toastify';
//Reference: https://fkhadra.github.io/react-toastify/introduction/

const UserStatus = ({match}) => {
    console.log(match);
    console.log(match.params.userEmail);
    const history = useHistory();
  const [oneUserData, setOneUserData] = useState([]);
  const token = getTokenFromLocalStore();
  // You need the loading state so that the Save button can
  // effectively show the button label or 'loading....' 
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');


  useEffect(() => {
    setLoading(true);
    //You don't need to setup the JWT token for the request because
    //this REST API does not of any authorization protection middleware function.
    axios.get(`${config.baseUrl}/u/users/status/${match.params.userEmail}`)
    .then(response => {
        console.log(response.data.content);
        const oneUserData = response.data.content;
        setOneUserData(oneUserData);
        setStatus(oneUserData.status);
        setLoading(false);
    }).catch(error => {
        // If you study the error by purposely induce an SQL syntax error at the 
        // backend, authService getOneUserStatusData method (e.g. SELECT1 ...)
        // you can find the backend REST API response body inside error.response.data
        console.dir(error);
        toast.error(error.response.data.description + ' Please submit a ticket to seek assistance.', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
          });
        setLoading(false);
    });
  }, []);//End of useEffect({function code,[]})

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

      <Title title="User registration status"></Title>
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

      <Container className="fluid" style={{border:'solid 1px black'}}>
        <Row>
          <Col md={{ size: 9, offset: -1}} align={'center'}  
          lg={{ size: 9, offset: -1}}
           style={{border:'solid 1px black'}}>
             <ShowLoadingSpinner loading={loading}  />
<Card style={{ width: '100%' }}>
  <Card.Body>
    <Card.Title>{status!=''? `Your registration is ${status}`:''}</Card.Title>
    <Card.Subtitle className="mb-2 text-muted">Useful stuff to know ....</Card.Subtitle>
    <Card.Text>
      Your user registration will be approved within 3 working days. We will
      send you an email to inform your registration status. <br/>
      Please check out the competition rules and other information such as team forming
      in the rules page.
    </Card.Text>
    <Card.Link href="/login" >Login</Card.Link>
    <Card.Link href="/rules">Check competition rules</Card.Link>
  </Card.Body>
</Card>
   
          </Col>
        </Row>
   
 
      </Container>
    </div>
  );
} //End of UserStatus functional component

export default UserStatus;