import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button, Container, Row, Col, Spinner, DropDown } from 'react-bootstrap';

import axios from 'axios';
import config from '../../config.js';
import { getTokenFromLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
//https://code.tutsplus.com/tutorials/working-with-tables-in-react-part-one--cms-29682
//react-bootstrap-table-next is actually, 
//react-bootstrap-table2 - is the new version 2, do not get confused
//thinking that it is the old now
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

import Title from '../Title/Title';
import moment from 'moment-timezone';
import Header from '../../Elements/Header';
import ManageTeamRowMenu from '../../Elements/ManageTeamRowMenu';
import ManageSubmissionsRowMenu from '../../Elements/ManageSubmissionsRowMenu';
//The following library is for creating notification alerts when user 
//clicks the save button.
import { ToastContainer, toast } from 'react-toastify';
//Reference: https://fkhadra.github.io/react-toastify/introduction/

const ManageTeam = () => {
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deadline, setDeadLine] = useState([]);
  const [canSubmit, setCanSubmit] = useState(true);
  const token = getTokenFromLocalStore();

  useEffect(() => {
    setLoading(true);
    axios.get(`${config.baseUrl}/u/teams`, { headers: { 'Authorization': `Bearer ${token}` } }).then(response => {
      console.log(response.data.content);
      let records = response.data.content;
      const formattedRecords = records.map(data => {
        console.log('Checking data variable in the map callback ', data);
        data.dummyId1 = data.id;
        data.dummyId2 = data.id;
        return data;
      });
      console.dir(formattedRecords);
      setTeamData(formattedRecords);
      setLoading(false);
    }).catch(error => {
      console.log(error);
      setLoading(false);
    });

    axios.get(`${config.baseUrl}/a/getdeadline`, {}).then(response => {
      setDeadLine(moment(response.data).local().format('YYYY-MM-DD HH:mm:ss'));
      //if deadline > current
      const getDeadline = new Date(response.data);
      const currentDate = new Date();

      if (getDeadline < currentDate) {
        console.log("submission is over");
        setCanSubmit(() => (false));
      }

      // if ((response.data) >= moment().tz("Asia/Singapore").format('YYYY-MM-DD HH:mm:ss')) {
      //   setCanSubmit(true)
      // }

      setLoading(false);
    }).catch(error => {
      console.log(error);
    })
  }, []);//End of useEffect({function code,[]})

  const columns = [{
    dataField: 'id',
    text: 'Team id',
    sort: false,
    hidden: true
  }, {
    dataField: 'name',
    text: 'Team name',
    editable: false,
    sort: true
  },
  {
    dataField: 'memberType',
    text: 'Member type',
    editable: false,
    sort: true
  },
    ,
  {
    dataField: 'numOfMembers',
    text: 'Members',
    editable: false,
    sort: true
  },
  {

    dataField: 'dummyId1',
    isDummyField: true,    /*Action column needs isDummyField property*/
    text: 'Change name',
    editable: false,
    formatter: (cell, row, rowIndex, extraData) => (
      <div>
        <a href={`/UpdateTeam/${row.id}`}> {row.id} </a>
      </div>
    )
  },
  {
    dataField: 'dummyId2',
    isDummyField: true,
    text: 'Actions',
    //editable: false,
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
      return <ManageTeamRowMenu {...editorProps} {...params} canSubmit={canSubmit} />

    }
  }];


  const defaultSorted = [{
    dataField: 'id',
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
  return (
    <div>
      <Header />

      <Title title="Manage your team"></Title>
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

      <Container className="fluid" style={{ border: 'solid 1px black' }}>
        <Row>
          <Col md={{ size: 9, offset: -1 }}
            lg={{ size: 9, offset: -1 }}
            style={{ border: 'solid 1px black' }}>
            <h3>
              Manage your team
            </h3>
          </Col>
        </Row>

        <Row>
          <Col style={{ border: 'solid 1px black' }}>
            <h4>Proposal submission deadline: {deadline}</h4>
          </Col>
        </Row>
        <Row>
          <Col md={{ size: 9, offset: -1 }} lg={{ size: 9, offset: -1 }} style={{ border: 'solid 1px black' }} >
            <BootstrapTable
              bootstrap4
              keyField="id"
              data={teamData}
              columns={columns}
              defaultSorted={defaultSorted}
              cellEdit={cellEditFactory({ mode: 'click', blurToSave: false })}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
} //End of ManageTeam functional component

export default ManageTeam;