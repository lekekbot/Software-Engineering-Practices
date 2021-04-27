import React, { useState, useEffect } from 'react';
import Header from '../../Elements/Header';
import Title from "../Title/Title";
import styles from "./Dashboard.module.css";
import axios from 'axios';
import { getTokenFromLocalStore,getEmailFromLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
import config from '../../config.js';
const Dashboard = () => {
  const [team, setTeam] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [inviteListData, setInviteListData] = useState([]);
  const token = getTokenFromLocalStore(); 
  const email= getEmailFromLocalStore();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
   
    if (loading){return;}

    setLoading(true);
    console.log(`${config.baseUrl}/u/teaminvitelist?email=${email}`);
    axios.get(`${config.baseUrl}/u/teaminvitelist?teamId=0&email=${email}`, 
    {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      })
    .then(response => {
        console.log(response.data.content);
        let records = response.data.content;
        console.dir(records);
        setInviteListData(records);
        setLoading(false);
    }).catch(error => {
        console.log(error);
        setLoading(false);
    });
   
  }, []);//End of useEffect({function code,[]})

  const InviteList = (props) => (
    <ul>
      {props.list.map(item => {
            console.log('Inspect the item variable inside the map method.');
            console.dir(item);
        return <p className="card-text" key={item.team_invite_list_id}>
        {item.name} team has invited you. <a href={`/jointeam/${item.team_id}/${item.name}`} className="btn btn-sm btn-primary">Join</a></p>              
      })}
    </ul>
  );
  return (
    <div>
      <Header />
      <Title title="Dashboard"></Title>
      <div className={`${styles.container} container-fluid d-flex align-items-top justify-content-center `}>
        <div className="row col-md-12 h-50">
          <div className="card col-md-5 offset-md-1">
          <div className={`${styles.cardhorizontal}`}>
           
            <div className={`${styles.teamcard} card-body`}>
              <h5 className="card-title">Quick links</h5>
              <p className="card-text">You can create a team first before submitting your business plan.</p>
              <a href="/createteam" className="btn btn-primary">Create team</a>
              
              <InviteList list={inviteListData} />
           
              <p className="card-text">Your team must have members before you can submit proposal documents.</p>
              <a href="#" className="btn btn-primary">Manage team members</a>
            </div>
          </div>
          </div>

          <div className="card col-md-5 ">
          <div className={`${styles.cardhorizontal}`}>
            <img className={`${styles.submissioncard}`} />
            <div className="card-body">
              <h5 className="card-title">No of submissions : 0</h5>
              <p className="card-text">Submit your business plans after you have created a team.</p>
              <a href="#" className="btn btn-primary">Submit business plans</a>
            </div>
          </div>
          </div>          
        </div>
    </div>
   </div>
  );
};

export default Dashboard;
