import React, { useState, useEffect } from 'react';
import Header from '../../Elements/Header';
import Title from "../Title/Title";
import styles from './JoinTeam.module.css';
import { Link } from "react-router-dom";
import { Button, Container, Row , Col, Card  } from 'react-bootstrap';
import axios from 'axios';
import { getEmailFromLocalStore,getTokenFromLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
import config from '../../config.js';
const JoinTeam = ({match}) => {

    //Using the following command to see whether I am able to capture the 
    //:teamId and :teamName inside this JoinTeam functional component.
    console.log(match.params.teamId);   
    console.log(match.params.teamName); 
    const teamId = match.params.teamId;
    const teamName = match.params.teamName;
    //Retrieve the token and email from the localstorage. We need the token
    //for making REST API request. We need the email for the logic here
    //to disable the Join button.
    const token = getTokenFromLocalStore(); 
    const email = getEmailFromLocalStore();
    //Setup the state variables.
    const [message, setMessage] = useState();
    const [teamMembersData, setTeamMembersData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [canJoin, setCanJoin] = useState(true);
    const [memberDataIsUpdated, setMemberDataIsUpdated]=useState(false);
    
  useEffect(() => {

    if (loading) { return; }
    setLoading(true);
    setMessage({
      data: 'Retrieving latest team details is in progress...',
      type: 'alert-warning',
    });
    axios.get(`${config.baseUrl}/u/teams/${teamId}/teammembers/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setTeamMembersData(response.data.content);
        setMessage({
          data: 'Review the following team details before joining. You can\'t leave the team after joining.',
          type: 'alert-success',
        });
        let searchResult = response.data.content.find(o => o.email === email);
        console.dir(searchResult);
        if (searchResult != null) {
          setMessage({
            data: 'You have joined the team.',
            type: 'alert-success',
          });
          setCanJoin(false);
        }
        setMemberDataIsUpdated(false);
        //Using the console.dir to keep checking whether I got the
        //structure of the array content correct so that I can display team member data
        //inside this functional component view.
        console.dir(response.data.content);


      }).catch(error => {
        setLoading(false);
        if ((error.response!=null) && (error.response.status === 500)) {
          setMessage({
            data: 'Something went wrong. Please try again.',
            type: 'alert-warning',
          });    
        }else if(error.message!=null){
          setMessage({
            data:  error.message,
            type: 'alert-danger',
          });      
        }else{
          setMessage({
            data: 'Something went wrong. Please try again.',
            type: 'alert-danger',
          }); 
        }  
        setCanJoin(false);      
      });
  }, [memberDataIsUpdated]);//End of useEffect({function code,[membersDataIsUpdated]})

 
  

  const handleJoinTeamButtonClick = (e) => {
    setLoading(true);
    axios.post(`${config.baseUrl}/u/teams/${teamId}/teammembers/`, 
    {},{
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      })
    .then(response => {
      setLoading(false);
      setMemberDataIsUpdated(true);
    }).catch(error => {
      setLoading(false);
      if ((error.response!=null) && (error.response.status === 500)) {
        setMessage({
          data: 'Something went wrong. Please try again.',
          type: 'alert-warning',
        });    
      }else if(error.message!=null){
        setMessage({
          data:  error.message,
          type: 'alert-danger',
        });      
      }else{
        setMessage({
          data: 'Something went wrong. Please try again.',
          type: 'alert-danger',
        }); 
      }
     
    });
  }// End of handleJoinTeamButtonClick
  const TeamMemberList = (props) => (
    <ul>
      {props.list.map(item => {
            console.log('Check each team member data');
            console.dir(item);
        return <p className={`${styles.teamMemberLineText} card-text`} key={item.memberId}>
        {item.displayName} ({item.email}) {item.type}</p>            
      })}
    </ul>
  );
  return (
    <div>
      <Header />
      <Title title="Dashboard"></Title>
      <Container className={`${styles.container} container-fluid justify-content-center `}>
      <Row>
        <Col  md={{ size: 10, offset: 0 }} style={{border:'solid 1px black'}}>
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
        <Row className="row col-md-12">
          <Col md={{ size: 10, offset: 0 }} style={{border:'solid 1px black'}}>
          <Card>

           
            <Card.Body className={`${styles.teamCard} `}>
                <h5 className="card-title">{teamName}</h5>
                <p className="card-text">Current team member(s)</p>

                { console.log('Check the teamMemberData',teamMembersData) }
                <TeamMemberList list={teamMembersData} />

                <p className="card-text float-right">
                <Button disabled={!canJoin}
                 className="btn btn-primary" onClick={handleJoinTeamButtonClick}>Join</Button>
                
               
                <Button variant="btn btn-link"  >
                {(canJoin) && 
                    <Link to="/dashboard">Let me think about it</Link>
                }
                {!(canJoin) && 
                    <Link to="/dashboard">Back to dashboard ^^</Link>
                }
                </Button>
                
                </p>
            </Card.Body>
 
    </Card>
</Col>
        </Row>
    </Container>   
   </div>
  );
};

export default JoinTeam;
