 import React, { useState, useEffect } from 'react';
//https://code.tutsplus.com/tutorials/working-with-tables-in-react-part-one--cms-29682
//react-bootstrap-table-next is actually, 
//react-bootstrap-table2 - is the new version 2, do not get confused
//thinking that it is the old now
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import styles from "./ManageTeamSubmission.module.css";
import Header from '../../Elements/Header/Header';
import axios from 'axios';
import Title from "../../Elements/Title/Title";
import config from '../../Config.js';
import { Button, Container, Row, Col } from "react-bootstrap";

import Calendar from 'react-calendar'
import DateTimePicker from 'react-datetime-picker'
import 'react-calendar/dist/Calendar.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

//The following library is for creating notification alerts when user 
//clicks the save button.
import { ToastContainer, toast } from 'react-toastify';
//Reference: https://fkhadra.github.io/react-toastify/introduction/

const User = () => {
  const [userData, setUserData] = useState([]);
  const [dateval, setdateval] = useState(new Date())

  // You need the loading state so that the Save button can
  // effectively show the button label or 'loading....' 
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios.get(`${config.baseUrl}/a/teaminfo`,
      {})
      .then(response => {
        console.log(response.data.data);
        let records = response.data.data;
        if(records.length != 0) {
          records.forEach((element) => {
            element.changeStatus = false;
          });
        }
        setUserData(records);
      }).catch(error => {
        console.log(error);
      });
  }, []);//End of useEffect({function code,[]});//End of useEffect({function code,[]})

  //column data for table
  const columns = [{
    dataField: 'id',
    text: 'User id',
    sort: false,
    hidden: true
  }, {
    dataField: 'team_id',
    text: 'Team No.',
    sort: true
  }, {
    dataField: 'name',
    text: 'Team Name',
    sort: true
  }, {
    dataField: 'first_name',
    text: 'Team Leader',
    sort: true
  },
  {
    dataField: 'email',
    text: 'Team Leader Email',
    sort: true
  },
  {
    dataField: 'cloudinary_url',
    text: 'Download Link',
    sort: true
  },
  {
    dataField: 'created_at',
    text: 'Submission Date & Time',
    sort: true,
    // formatter: (cell, row) => {
    //   return userRoles.find(x => x.value == cell).label;
    // },
  },
  ];

  const defaultSorted = [{
    dataField: 'email',
    order: 'desc'
  }]; 

  const handleCalendarChange = (e) => {
    setdateval(e)
    console.log(e)
  }

  const handleUserStatusChange = (oldValue, newValue, row, column) => {
    row.changeStatus = true;
    //Note that the cell which allows user to see-&-manage role will 
    //only modify the roleId.
    //The user table in the datatabase is only interested with the role id value.
  };// End of handleUserStatusChange

  return (

    <div>
      <Header />

      <Title title="View/download proposal file"></Title>
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

      <Container className="fluid mw-100" style={{ border: 'solid 1px black' }}
        className="justify-content-center">
        <Row>
          <Col style={{ border: 'solid 1px black' }}>

            <h3>
              View/download proposal file(s)
            </h3>

          </Col>
        </Row>
        <Row>
          <Col style={{ border: 'solid 1px black' }}>
            <h4>
              Number of proposals submitted since last logged in:
                </h4>
          </Col>
        </Row>
        <Row>
          <Col md={{ size: 10 }} style={{ border: 'solid 1px black' }} >
            <Popup trigger={<button className="btn btn-primary float-left">Set Deadline</button>} modal>
              {close => (
                <div>
                  <DateTimePicker
                  minDate={new Date()}
                  onChange={e => handleCalendarChange(e)}
                  value={dateval}
                  /> 
                  <button onClick={() => close()}>cancel</button>
                  <button onClick={() => {close()}}>Save</button>

                </div>
              )}
                 
            </Popup>
          </Col>

        </Row>
        <Row>
          <Col md={{ size: 10 }} style={{ border: 'solid 1px black' }} >
            <BootstrapTable
              bootstrap4
              keyField="id"
              data={userData}
              columns={columns}
              defaultSorted={defaultSorted}
              cellEdit={cellEditFactory({ mode: 'click', blurToSave: true, afterSaveCell: handleUserStatusChange })}
            />
          </Col>
        </Row>
      </Container>

    </div>
  );
} //End of User functional component

export default User;