import React, { useEffect, useState } from "react";
import Header from '../../Elements/Header/Header';
import Title from "../../Elements/Title/Title";
import styles from "./Dashboard.module.css";
import axios from 'axios';
import config from '../../Config.js';

const Dashboard = () => {
  const [teamData, setTeamData] = useState(null);
  //I have problem making teamSummaryData a single object.
  //Keep getting the error : "If you meant to render a collection of children, use an array instead"
  const [information, setInformation] = useState(null);
  const [pendingState, setPendingState] = useState(0)
  useEffect(() => {
    axios.get(`${config.baseUrl}/a/teams/summary`, 
    {})
    .then(response => {
        let content = response.data.content;
        console.log('content variable ');
        //Check the content variable to make sure I got the data from the 
        //backend
        console.log(content);
        setTeamData(content);
        //Count teams with no submissions
        const numberOfTeamsWithNoSubmissions = content.filter(element => element.numberOfSubmissions===0).length;
        //Count teams with submissions
        const numberOfTeamsWithSubmissions = content.filter(element => element.numberOfSubmissions>0).length;
        //Count teams which has only one membmer
        const numberOfTeamsWithOneMember = content.filter(element => element.numberOfMembers===1).length;
        //I referenced this https://howtocreateapps.com/how-to-sum-arrays-in-javascript/
        //to manage the total submission calculation using the array's reduce technique
        let totalNumberOfSubmissions = content.reduce((totalValue, element) => {
          console.log(`totalValue: ${totalValue}, element: ${element}`)
          return totalValue + element.numberOfSubmissions;
      }, 0);
 
        setInformation({totalNumOfSubmissions : totalNumberOfSubmissions,
          numOfTeamsWithNoSubmissions : numberOfTeamsWithNoSubmissions,
          numOfTeamsWithSubmissions : numberOfTeamsWithSubmissions,
          numofTeamsWithOneMember : numberOfTeamsWithOneMember});  
    
    
       
    }).catch(error => {
        console.log(error);
    });

    //get pending
    axios.get(`${config.baseUrl}/a/pending`)
    .then(response => {
      let count = response.data[0].count
        setPendingState(count)
    })
    .catch(err => console.log(err))
  }, []);//End of useEffect({function code,[]})
  
  return (
    <div>
      <Header />
      <Title title="Dashboard"></Title>
      <div className={`${styles.container} container-fluid d-flex align-items-top justify-content-center `}>
        <div className="row col-md-12 h-50">
          <div className="card col-md-8 offset-md-1">
          <div className={`${styles.cardhorizontal}`}>
            <img alt="team" className={`${styles.teamcard}`} />
            <div className="card-body">
     
      <h6>Total submissions : {information && information.totalNumOfSubmissions }</h6><p />
      <h6>Number of teams without submissions : {information && information.numOfTeamsWithNoSubmissions}</h6> <p />
      <h6>Number of teams with submissions : {information && information.numOfTeamsWithSubmissions}</h6> <p />
      <h6>Number of teams with only 1 team member : {information && information.numofTeamsWithOneMember} </h6>  <p />     
      <h6>Number of Pending members: {pendingState}</h6>
            </div>
          </div>
          </div>
        </div>
    </div>
   </div>
  );
};

export default Dashboard;



/*

SELECT COUNT('pending') FROM user

*/