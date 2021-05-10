import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';

//styling
import 'reactjs-popup/dist/index.css';
import 'react-calendar/dist/Calendar.css';
import styles from "./ManageTeamSubmission.module.css";

//imports
import axios from 'axios';
import Popup from 'reactjs-popup';
import config from '../../Config.js';
import Calendar from 'react-calendar';
import Title from "../../Elements/Title/Title";
import Header from '../../Elements/Header/Header';
import DateTimePicker from 'react-datetime-picker';
import BootstrapTable from 'react-bootstrap-table-next';
import { Button, Container, Row, Col } from "react-bootstrap";
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

import { ToastContainer, toast } from 'react-toastify';

export default function User(props) {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateval, setdateval] = useState(new Date())

  useEffect(() => {
    axios.get(`${config.baseUrl}/a/teaminfo`, {}).then(response => {
      console.log(response.data.data);
      let records = response.data.data;
      if (records.length != 0) {
        records.forEach((element) => {
          element.changeStatus = false;
        });
      }
      setUserData(records);
    }).catch(error => {
      console.log(error);
    });
  }, []);

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
  },
  ];

  const defaultSorted = [{
    dataField: 'email',
    order: 'desc'
  }];

  const handleCalendarChange = (e) => {
    setdateval(e)
  }

  const timingSubmit = () => {
    //BTW, the timing will be reflected here!!!
    //XiaoLin, now, call a axios get/put/post request of your preference to get the newest timing.

    //I have already converted the time of the local system -> to SG time system(database system)
    setdateval(moment(dateval).tz("Asia/Singapore").format("YYYY-MM-DD HH:mm:ss"))
    alert(dateval)

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
      <Container className="fluid mw-100" style={{ border: 'solid 1px black' }}
        className="justify-content-center">
        <Row>
          <Col style={{ border: 'solid 1px black' }}>
            <h3>View/download proposal file(s)</h3>
          </Col>
        </Row>
        <Row>
          <Col style={{ border: 'solid 1px black' }}>
            <h4>Number of proposals submitted since last logged in:</h4>
          </Col>
        </Row>
        <Row>
          <Col md={{ size: 10 }} style={{ border: 'solid 1px black' }} >
            <Popup trigger={
              <button className="btn btn-primary float-left">Set Deadline</button>} modal>
              {close => (
                <div>
                  <DateTimePicker
                    minDate={new Date()}
                    amPmAriaLabel="Select AM/PM"
                    calendarAriaLabel="Toggle calendar"
                    clearAriaLabel="Clear value"
                    dayAriaLabel="Day"
                    hourAriaLabel="Hour"
                    maxDetail="second"
                    minuteAriaLabel="Minute"
                    monthAriaLabel="Month"
                    nativeInputAriaLabel="Date and time"
                    onChange={e => handleCalendarChange(e)}
                    secondAriaLabel="Second"
                    value={dateval}
                    yearAriaLabel="Year"
                  />
                  <button onClick={() => close()}>cancel</button>
                  <button onClick={() => { close() }} onClick={() => { timingSubmit() }}>Save</button>
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