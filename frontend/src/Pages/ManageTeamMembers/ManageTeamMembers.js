import React, { useState, useEffect } from 'react';
//https://code.tutsplus.com/tutorials/working-with-tables-in-react-part-one--cms-29682
//react-bootstrap-table-next is actually, 
//react-bootstrap-table2 - is the new version 2, do not get confused
//thinking that it is the old now
import BootstrapTable from 'react-bootstrap-table-next';

import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import { getTokenFromLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
import { Link } from "react-router-dom";
import Header from '../../Elements/Header';
import ManageTeamMemberRowMenu from '../../Elements/ManageTeamMemberRowMenu';
import { confirmAlert } from 'react-confirm-alert'; 

import axios from 'axios';
import Title from '../Title/Title';
import config from '../../config.js';
import { Button, Container, Row , Col, Spinner, DropDown } from 'react-bootstrap';
//The following library is for creating notification alerts when user 
//clicks the save button.
import { ToastContainer, toast } from 'react-toastify';
//Reference: https://fkhadra.github.io/react-toastify/introduction/

const ManageTeamMembers = ({match}) => {
  const [teamMemberData, setTeamMemberData] = useState([]);
  const token = getTokenFromLocalStore();
  // You need the loading state so that the Save button can
  // effectively show the button label or 'loading....' 
  const [loading, setLoading] = useState(false);

  const [removeTeamMemberActionCounter, setRemoveTeamMemberActionCounter] = useState(false);

  const teamId = match.params.teamId;
  useEffect(() => {
    setLoading(true);
    //The REST API url naming convention is debateable in this situation:
    //I can use the following /u/teams/<team id>/teammembers
    //Or I can rename my REST API to /u/teammembers?teamId=<teamId>
    //Whatever decision made, it needs to be consistent.
    axios.get(`${config.baseUrl}/u/teams/${teamId}/teammembers`, 
    {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      })
    .then(response => {
        console.log(response.data.content);
        let records = response.data.content;
        // I need to apply the following map method to rebuild the
        // array of team data so that the Browser don't give warnings such as
        // Warning: Failed prop type: The prop `column.text` is marked as required in `HeaderCell`, but its value is `undefined`.
        const formattedRecords = records.map(data => {
          console.log('Checking data variable in the map callback ',data);
          data.dummyId1= data.id;
          return data;
      });
      console.dir(formattedRecords);
        setTeamMemberData(formattedRecords);
        setLoading(false);
    }).catch(error => {
        console.log(error);
        setLoading(false);
    });
  }, [removeTeamMemberActionCounter]);//End of useEffect({function code,[teamMemberDataHasChangedStatus]})

  const handleRemoveTeamMemberAction=(event,teamId, teamMemberId)=>{
    event.stopPropagation();
    console.log('Inpect the teamMemberId, teamId variable value inside handleRemoveTeamMemberAction');
    console.log('teamMemberId',teamMemberId);
    console.log('teamId',teamId);
    const token = getTokenFromLocalStore();
    confirmAlert({
        title: 'Confirm to remove team member?',
        message: 'Are you sure to do this?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
                setLoading(true);
                axios.delete(`${config.baseUrl}/u/teams/${teamId}/teammembers/${teamMemberId}`, 
                {
                    headers: {
                      'Authorization': `Bearer ${token}` 
                    }
                  })
                .then(response => {
                  setLoading(false);
                  toast.success(response.data.description, {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined
                    }); 
                    setRemoveTeamMemberActionCounter(removeTeamMemberActionCounter + 1);
                }).catch(error => {
                  setLoading(false);
                
                    toast.error(error.response.data.description, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined
                        }); 
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
  }// End of handleRemoveTeamMemberAction


  const columns = [{
    dataField: 'teamMemberId',
    text: 'Member id',
    sort: false,
    hidden: true
  }, 
  {dataField: 'teamId',
  text: 'Team id',
  sort: false,
  hidden: true
},{
    dataField: 'displayName',
    text: 'Name',
    editable: false,
    sort: true
  }, 
  {
    dataField: 'email',
    text: 'Email',
    editable: false,
    sort: true
  },
  {
    dataField: 'type',
    text: 'Type',
    editable: false,
    sort: true
  },
  {
    dataField:'dummyId1',
    isDummyField:true,
    text: 'Manage',
  
    sort: false,
    /*You need the formatter property for the cell which has the navigation menu*/
    formatter: (cell, row) => {
      
      return 'Manage';
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
      return <ManageTeamMemberRowMenu { ...editorProps } {...params} handleRemoveTeamMemberAction={handleRemoveTeamMemberAction.bind(this)}  />

    }
  }];

  
  const defaultSorted = [{
    dataField: 'teamMemberId',
    order: 'desc'
  }];

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

      <Title title="Manage team members"></Title>
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

      <Container className="fluid" style={{border:'solid 1px black'}}
        >
        <Row>
          <Col md={{ size: 9, offset: -1}}  
          lg={{ size: 9, offset: -1}}
           style={{border:'solid 1px black'}}>
   
            <h3>
            Manage your team members
            </h3>
   
          </Col>
        </Row>
        <Row >
        <Col md={{ size: 9, offset: -1 }} lg={{ size: 9, offset: -1}} style={{border:'solid 1px black'}} >
          <Button variant="btn btn-link float-right">
                <Link to="/manageteam">Cancel</Link>
              </Button>
          </Col>
        </Row>     
        <Row>
        <Col md={{ size: 9, offset: -1 }} lg={{ size: 9, offset: -1}} style={{border:'solid 1px black'}} >   
        <div className="d-flex justify-content-center">
            <ShowLoadingSpinner loading={loading} />
        </div>
        </Col>
        </Row>   
        <Row>
          <Col md={{ size: 9, offset: -1 }}  lg={{ size: 9, offset: -1}} style={{border:'solid 1px black'}} >
            <BootstrapTable
              bootstrap4
              keyField="teamMemberId"
              data={teamMemberData}
              columns={columns}
              defaultSorted={defaultSorted}
              cellEdit={cellEditFactory({ mode: 'click', blurToSave: false })}             
            />
          </Col>
        </Row>

        <Row >
          <Col md={{ size: 9, offset: -1}}        lg={{ size: 9, offset: -1}} style={{border:'solid 1px black'}} >
          <Button variant="btn btn-link float-right">
                <Link to="/manageteam">Cancel</Link>
              </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
} //End of ManageTeamMembers functional component

export default ManageTeamMembers;