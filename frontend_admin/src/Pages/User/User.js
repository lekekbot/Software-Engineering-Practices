import React, { useState, useEffect } from 'react';
//https://code.tutsplus.com/tutorials/working-with-tables-in-react-part-one--cms-29682
//react-bootstrap-table-next is actually, 
//react-bootstrap-table2 - is the new version 2, do not get confused
//thinking that it is the old now
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import  "./User.css";
import Header from '../../Elements/Header/Header';
import axios from 'axios';
import Title from "../../Elements/Title/Title";
import config from '../../Config.js';
import { Button, Container, Row, Col } from "react-bootstrap";
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter'

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
    axios.get(`${config.baseUrl}/a/users`,
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
  const userStatus = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];
  const statusSelect = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected'
  };

  const handleSaveChanges = () => {
    const filteredUserData = userData.filter(data => data.changeStatus == true);

    //After inspecting the userData and filteredUserData, I have continued
    //to build the logic which calls the REST API to save changes to the databse.
    //Note that, I need to find out how to use the useEffect to reload the user
    //data from the server-side after the save operation has completed.

    setLoading(true);
    axios.put(`${config.baseUrl}/a/users`,
      filteredUserData)
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
        console.log(error)

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

  const { SearchBar } = Search;

  const columns = [{
    dataField: 'id',
    text: 'User id',
    sort: false,
    hidden: true
  }, {
    dataField: 'firstName',
    text: 'First name',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: '10%' };
    }
  }, {
    dataField: 'lastName',
    text: 'Last name',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: '10%' };
    }
  },
  {
    dataField: 'email',
    text: 'Email',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: '18%' };
    }
  },
  {
    dataField: 'created_at',
    text: 'Time of registration',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: '18%' };
    }
  },
  {
    dataField: 'updated_at',
    text: 'Time of approval',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: '18%' };
    }
  },
  {
    dataField: 'roleId',
    text: 'Role',
    sort: true,
    formatter: (cell, row) => {
      return userRoles.find(x => x.value == cell).label;
    },
    headerStyle: (colum, colIndex) => {
      return { width: '10%' };
    },
    editor: {
      type: Type.SELECT,
      options: userRoles
    }
  },
  {
    dataField: 'status',
    text: 'Status',
    sort: true,
    formatter: cell => statusSelect[cell],
    headerStyle: (colum, colIndex) => {
      return { width: '10%' };
    },

    filter: selectFilter({
      options: userStatus,
    }),
    editor: {
      type: Type.SELECT,
      options: userStatus,
    },
  }];

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
    
    <div class='user'>
      <Header />
      <Title title="Manage users"></Title>
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

      <Container className="fluid mw-100"
        className="justify-content-center">
        <Row>
          <Col style={{ border: 'solid 1px black' }}>

            <h3>
              Manage users
            </h3>

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
        <Row>
          <Col md={{ size: 10 }} style={{ border: 'solid 1px black' }} >
            <ToolkitProvider
              bootstrap4
              keyField="id"
              data={userData}
              columns={columns}
              search
            >
              {
                props => (
                  <div>
                    <h3>Search:</h3>
                    <SearchBar {...props.searchProps} />
                    <hr />
                    <BootstrapTable

                      defaultSorted={defaultSorted}
                      filter={filterFactory()}
                      cellEdit={cellEditFactory({ mode: 'click', blurToSace: true, afterSaveCell: handleUserStatusChange })}
                      {...props.baseProps}
                    />
                  </div>
                )
              }
            </ToolkitProvider>
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