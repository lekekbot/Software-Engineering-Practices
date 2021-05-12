import moment from 'moment-timezone';
import React, { useState, useEffect } from 'react';

//styling

//imports
import axios from 'axios';
import Title from '../Title/Title';
import config from '../../config.js';
import Header from '../../Elements/Header';
import { ToastContainer, toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { Link, useHistory } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import ManageSubmissionsRowMenu from '../../Elements/ManageSubmissionsRowMenu';
import { Button, Container, Row, Col, Spinner, DropDown } from 'react-bootstrap';
import { getTokenFromLocalStore } from '../../Utils/Common.js';// Common.js don't use export default

const ManageSubmissions = ({ match }) => {
  const teamId = match.params.teamId;
  const history = useHistory();
  const [removeSubmissionActionCounter, setRemoveSubmissionActionCounter] = useState(0);
  const [submissionData, setSubmissionData] = useState([]);
  const token = getTokenFromLocalStore();
  // You need the loading state so that the Save button can
  // effectively show the button label or 'loading....' 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${config.baseUrl}/u/teams/${teamId}/proposals`, { headers: { 'Authorization': `Bearer ${token}` } }).then(response => {
      console.log(response.data.content);
      let records = response.data.content;
      // I need to apply the following map method to rebuild the
      // array of team data so that the Browser don't give warnings such as
      // Warning: Failed prop type: The prop `column.text` is marked as required in `HeaderCell`, but its value is `undefined`.
      const formattedRecords = records.map(data => {
        console.log('Checking data variable in the map callback ', data);
        data.dummyId1 = data.fileId;
        return data;
      });
      console.dir(formattedRecords);
      setSubmissionData(formattedRecords);
      setLoading(false);
    }).catch(error => {
      console.log(error);
      setLoading(false);
    });
  }, [removeSubmissionActionCounter]);//End of useEffect({function code,[removeSubmissonActionCounter]})

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
            axios.delete(`${config.baseUrl}/u/proposals`, { headers: { 'Authorization': `Bearer ${token}` }, data: payload }).then(response => {
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
    dataField: 'fileId',
    text: 'File id',
    sort: false,
    hidden: true
  }, {
    dataField: 'cloudinaryFileId',
    text: 'Cloudinary file id',
    sort: false,
    hidden: true
  }, {
    dataField: 'fileName',
    text: 'File name',
    editable: false,
    sort: true
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
    dataField: 'fileId',
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
      <Title title="Manage your team submissions"></Title>
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
          <Col md={{ size: 9, offset: -1 }}>
            <p className="font-weight-light">This UI has client-side code example which triggers useEffect when there are data changes (e.g. deleted a file)</p>
          </Col>
        </Row>
        <Row>
          <Col md={{ size: 9, offset: -1 }}
            lg={{ size: 9, offset: -1 }}
            style={{ border: 'solid 1px black' }}>
            <h3>
              Manage your team proposal submissions
            </h3>
          </Col>
        </Row>
        <Row >
          <Col md={{ size: 9, offset: -1 }} lg={{ size: 9, offset: -1 }} style={{ border: 'solid 1px black' }} >
            <Button variant="btn btn-link btn-lg btn-light float-right">
              <Link to={`/manageteam/${teamId}`}>Cancel</Link>
            </Button>
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
              data={submissionData}
              columns={columns}
              defaultSorted={defaultSorted}
              cellEdit={cellEditFactory({ mode: 'click', blurToSave: false })}
            />
          </Col>
        </Row>

        {/* <Row >
          <Col md={{ size: 9, offset: -1 }} lg={{ size: 9, offset: -1 }} style={{ border: 'solid 1px black' }} >
            <Button variant="btn btn-link float-right">
              <Link to={`/manageteam/${teamId}`}>Cancel</Link>
            </Button>
          </Col>
        </Row> */}
      </Container>
    </div>
  );
} //End of ManageSubmissions functional component

export default ManageSubmissions;