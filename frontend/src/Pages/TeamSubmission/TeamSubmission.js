import React, { useState, useEffect } from 'react';
//https://code.tutsplus.com/tutorials/working-with-tables-in-react-part-one--cms-29682
//react-bootstrap-table-next is actually, 
//react-bootstrap-table2 - is the new version 2, do not get confused
//thinking that it is the old now
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import styles from "./TeamSubmission.module.css";
import Header from '../../Elements/Header';
import axios from 'axios';
import Title from "../Title/Title";
import config from '../../config.js';
import { Button, Container, Row, Col } from "react-bootstrap";
//The following library is for creating notification alerts when user 
//clicks the save button.
import { ToastContainer, toast } from 'react-toastify';
//Reference: https://fkhadra.github.io/react-toastify/introduction/

const User = () => {
  const [userData, setUserData] = useState([]);

  // You need the loading state so that the Save button can
  // effectively show the button label or 'loading....' 
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios.get(`${config.baseUrl}/u/teaminfo`,
      {})
      .then(response => {
        console.log(response.data.data);
        let records = response.data.data;
        records.forEach((element) => {
          element.changeStatus = false;
        });
        setUserData(records);
      }).catch(error => {
        console.log(error);
      });
  }, []);//End of useEffect({function code,[]})

  //Had issues trying to change the roleId when the user choose an option
  //in the drop-down listbox. It requires formatting logic.
  //Reference: https://github.com/react-bootstrap-table/react-bootstrap-table2/issues/1106
  const userRoles = [
    { value: 1, label: 'admin' },
    { value: 2, label: 'user' },
    { value: 3, label: 'master admin' }

  ];
  const handleSaveChanges = () => {
<<<<<<< Updated upstream
    const filteredUserData = userData.filter(data => data.changeStatus == true);

    setLoading(true);
    axios.put(`${config.baseUrl}/u/teams/proposals/teamid`, filteredUserData)
=======
    //console.log(userData);
    const filteredUserData = userData.filter(data => data.changeStatus == true);
    //console.log(filteredUserData);

    //After inspecting the userData and filteredUserData, I have continued
    //to build the logic which calls the REST API to save changes to the databse.
    //Note that, I need to find out how to use the useEffect to reload the user
    //data from the server-side after the save operation has completed.

    setLoading(true);
    axios.put(`${config.baseUrl}/a/users`,
      filteredUserData)
>>>>>>> Stashed changes
      .then(response => {
        setLoading(false);
        toast.success('Saved changes.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      }).catch(error => {
        setLoading(false);


        if ((error.response != null) && (error.response.status === 401)) {
          toast.error(error.response.data.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });

        } else if (error.message != null) {
          toast.error(error.message, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });

        } else {
          toast.error('Something went wrong. Please try again.', {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          });
        }
      });
  }
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
    editor: {
      type: Type.SELECT,
      options: userRoles
    }
  },
  ];

  const defaultSorted = [{
    dataField: 'email',
    order: 'desc'
  }];

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
              Submit proposal file(s)
            </h3>

          </Col>
        </Row>
        <Row>
          <Col style={{ border: 'solid 1px black' }}>
            <h4>
              Proposal submission deadline:
                </h4>
          </Col>
        </Row>
        <Row >
          <Col md={{ size: 10 }} style={{ border: 'solid 1px black' }} >
            <Button
              className="btn btn-primary float-left"
              onClick={handleSaveChanges}>
              {'Submit Proposal'}
            </Button>
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
            // cellEdit={cellEditFactory({ mode: 'click', blurToSave: true, afterSaveCell: handleUserStatusChange })}
            />
          </Col>
        </Row>

        <Row >
          <Col md={{ size: 10 }} style={{ border: 'solid 1px black' }} >
            <Button
              className="btn btn-primary float-right"
              onClick={handleSaveChanges}>
              {loading ? 'Saving changes now ...' : 'Save'}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
} //End of User functional component

export default User;