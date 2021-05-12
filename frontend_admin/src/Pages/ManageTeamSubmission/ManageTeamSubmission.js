import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';

//styling
import './ManageTeamSubmission.css'

//imports
import { Link, useHistory } from 'react-router-dom';
import ManageSubmissionsRowMenu from '../../Elements/ManageSubmissionRowMenu';
import axios from 'axios';
import Popup from 'reactjs-popup';
import config from '../../Config';
import Title from "../../Elements/Title/Title";
import Header from '../../Elements/Header/Header';
import DateTimePicker from 'react-datetime-picker';
import BootstrapTable from 'react-bootstrap-table-next';
import { Button, Container, Row, Col, Spinner, DropDown } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'

import cellEditFactory from 'react-bootstrap-table2-editor';
import { getUserIdFromLocalStore, getTokenFromLocalStore } from '../../Utils/Common.js'

import { ToastContainer, toast } from 'react-toastify';

export default function User({ props }) {
  const history = useHistory();
  const [removeSubmissionActionCounter, setRemoveSubmissionActionCounter] = useState(0);
  const [submissionData, setSubmissionData] = useState([]);
  const token = getTokenFromLocalStore();
  const userId = getUserIdFromLocalStore();

  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateval, setdateval] = useState(new Date());
  const [deadline, setDeadLine] = useState([]);
  const [numProposalSinceLastLogout, setNumProposalSinceLastLogout] = useState(null);
  useEffect(() => {
    setLoading(true);
    //tan
    axios.get(`${config.baseUrl}/a/teaminfo`, {}).then(response => {
      let records = response.data.content;
      const formattedRecords = records.map(data => {
        console.log('Checking data variable in the map callback ', data);
        var date_created = data.date_created
        date_created = moment(date_created).local().format('YYYY-MM-DD HH:mm:ss');
        data.date_created = date_created
        data.dummyId1 = data.fileId;
        return data;
      });

      axios.get(`${config.baseUrl}/users/${userId}`).then(response2 => {
        let last_logout = new Date(response2.data.userdata.last_logout);
        console.log(last_logout)

        let numberOfProposalSinceLastLogout = records.reduce((totalValue, record) => {
          console.log(`totalValue: ${totalValue}, record: ${record}, record.date_created ${record.date_created}`)
          if (new Date(record.date_created).toISOString() > last_logout.toISOString()) {
            console.log("total value + 1");
            return totalValue + 1;
          }
          return totalValue;
        }, 0);
        setNumProposalSinceLastLogout(numberOfProposalSinceLastLogout)

      }).catch(error => {
        console.log(error);
      });

      console.dir(formattedRecords);
      setUserData(formattedRecords);
      setLoading(false);
    }).catch(error => {
      console.log(error);
    });

    //ours
    axios.get(`${config.baseUrl}/a/getdeadline`, {}).then(response => {
      setDeadLine(moment(response.data).local().format('YYYY-MM-DD HH:mm:ss'));
      // alert(response.data)
      setLoading(false);
    }).catch(error => {
      console.log(error);
    });

  }, [removeSubmissionActionCounter]);

  const handleRemoveSubmissionAction = (event, fileId, cloudinaryFileId) => {
    event.stopPropagation();
    console.log('Inpect the fileId, cloudinaryFileId variable value inside handleRemoveSubmissionAction');
    console.log('cloudinaryFileId ', cloudinaryFileId);
    console.log('fileId ', fileId);
    const token = getTokenFromLocalStore();
    const payload = { fileId: fileId, cloudinaryFileId: cloudinaryFileId };
    confirmAlert({
      title: 'Confirm to remove file?',
      message: 'Are you sure to do this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            setLoading(true);
            //https://stackoverflow.com/questions/51069552/axios-delete-request-with-body-and-headers
            axios.delete(`${config.baseUrl}/u/proposalsPZ`, { headers: { 'Authorization': `Bearer ${token}` }, data: payload }).then(response => {
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
              setRemoveSubmissionActionCounter(removeSubmissionActionCounter + 1);
              alert("Delete was successful!")
            }).catch(error => {
              setLoading(false);
              if (error.response != null) {
                toast.error(error.response.data.description, {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined
                });
              }

              event.preventDefault();
            });

          }// End of onClick section (YES)
        },
        {
          label: 'No',
          onClick: () => setLoading(false)
        }
      ]
    });
  }// End of handleRemoveSubmissionAction

  const columns = [{
    dataField: 'id',
    text: 'User id',
    sort: false,
    hidden: true
  }, {
    dataField: 'teamName',
    text: 'Team Name',
    sort: true
  }, {
    dataField: 'firstName',
    text: 'First Name',
    sort: true
  }, , {
    dataField: 'lastName',
    text: 'Last Name',
    sort: true
  },
  {
    dataField: 'email',
    text: 'Team Leader Email',
    sort: true
  },
  {
    dataField: 'date_created',
    text: 'Submission Date & Time',
    sort: true,
  },
  {
    dataField: 'dummyId1',
    isDummyField: true,
    text: 'Actions',

    sort: false,
    /*You need the formatter property for the cell which has the navigation menu*/
    formatter: (cell, row) => {

      return 'You can ...';
    },
    editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => {
      var params = {
        editorProps: editorProps,
        value: value,
        row: row,
        rowIndex: rowIndex,
        columnIndex: columnIndex,
        parentThis: this
      };

      return <ManageSubmissionsRowMenu {...editorProps} {...params} handleRemoveSubmissionAction={handleRemoveSubmissionAction.bind(this)} />
    }
  }];

  const defaultSorted = [{
    dataField: 'email',
    order: 'desc'
  }];

  function ShowLoadingSpinner(props) {
    const isLoading = props.loading;
    if (isLoading) {
      return (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      )
    } else {
      return '';
    }
  }// End of conditional rendering Bootstrap Spinner logic

  const handleCalendarChange = (e) => {
    setdateval(e)
  }

  const timingSubmit = () => {
    //the timing will be reflected here
    axios.put(`${config.baseUrl}/a/setdeadline`, { setDate: dateval })
      .then(response => {
        alert("Deadline updated!")
      }).catch(error => {
        alert("error!")
      });
  }

  const handleUserStatusChange = (oldValue, newValue, row, column) => {
    row.changeStatus = true;
  };

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
          <Col md={{ size: 9, offset: -1 }}>
            <p className="font-weight-light">This UI has client-side code example which triggers useEffect when there are data changes (e.g. deleted a file)</p>
          </Col>
        </Row>

        <Row>
          <Col style={{ border: 'solid 1px black' }}>
            <h3>View/download proposal file(s)</h3>
          </Col>
        </Row>
        <Row>
          <Col style={{ border: 'solid 1px black' }}>
            <h4>Proposal submission deadline: {deadline}</h4>
          </Col>
        </Row>
        <Row>
          <Col style={{ border: 'solid 1px black' }}>
            <h4>Number of proposals submitted since last logged in: {numProposalSinceLastLogout}</h4>
          </Col>
        </Row>
        <Row>
          <Col md={{ size: 10 }} style={{ border: 'solid 1px black' }} >
            <Popup trigger={
              <button className="btn btn-info btn-lg float-right">Set Deadline</button>} modal>
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
                  <button className="btn btn-outline-danger btn-lg btn-block float-right" onClick={() => close()}>Cancel</button>
                  <button className="btn btn-outline-primary btn-lg btn-block float-right" onClick={() => { close() }} onClick={() => { timingSubmit() }}>Save</button>
                </div>
              )}
            </Popup>
          </Col>
        </Row>

        <Row>
          <Col md={{ size: 9, offset: -1 }} lg={{ size: 9, offset: -1 }} style={{ border: 'solid 1px black' }} >
            <div className="d-flex justify-content-center">
              <ShowLoadingSpinner loading={loading} />
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={{ size: 9, offset: -1 }} lg={{ size: 9, offset: -1 }} style={{ border: 'solid 1px black' }} >
            <BootstrapTable
              bootstrap4
              keyField="id"
              data={userData}
              columns={columns}
              defaultSorted={defaultSorted}
              cellEdit={cellEditFactory({ mode: 'click', blurToSave: false })}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
} //End of User functional component