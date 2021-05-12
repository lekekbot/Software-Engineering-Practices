import React, { useEffect, useState } from "react";
import axios from 'axios';

import Header from '../../Elements/Header/Header';
import Title from "../../Elements/Title/Title";
import styles from "./Addadmin.module.css";
import config from '../../Config.js';


// react related shit
import { Form, Button, Container, Row , Col,  } from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import { useForm } from "react-hook-form";


//might convert to class

const AddAdmin = () => {
    const { register, handleSubmit, errors } = useForm();
    const [data, setData] = useState([])
    const [resendState, setresendState] = useState({btnmessage: 'Resend Invitation', resend: false})


    const firstName = useFormInput('Hi')
    const lastName = useFormInput('Bye')
    const email = useFormInput('bryangoh843@gmail.com')
    //componenetDidMount
    useEffect(()=> {
        //get table data for pending fucks
        axios.get(`${config.baseUrl}/a/admin/list`)
        .then(response => {
            let records = response.data
            setData(records)
        }).catch(err =>
            console.log(err)
        )
    }, [data,resendState])  

    //send email verification and create temp row 
    const onSubmit = (data,e) => {
        // console.dir(data)
        axios.post(`${config.baseUrl}/a/addadmin`,
        {first_name: data['first-name'], last_name: data['last-name'], email: data.email})
        .then(response => {
            console.log(response)
            if(response.status == 204) {
                return alert('user has already been created!')
            }
            return alert('user created')
        }).catch(err => {
            console.log(err)
            return alert('error')
        })
     }

     //table stuff

     const linkCell = (cell,row) => {
            let accepted = row.accepted
            let id = row.user_id
    
            return(
                <div>
                    {accepted == 1 ? 
                    <Button
                    key={id}
                    onClick={() => handleDelete(id)}>
                        Delete Record
                    </Button> :
                    <Button 
                    key={id}
                    onClick={e => 
                    resendInvite(e,id)
                    } 
                    disabled={resendState.resend}>
                        {resendState.btnmessage}  
                    </Button>}
                </div>
            )
     }

    const resendInvite = (e,id) => { 
        // brute force the button 
        e.target.disabled = true
        e.target.innerHTML = 'Invitation Sent'

        //resend invite to email
        axios.post(`${config.baseUrl}/a/admin/resend`, {id:id})
        .then(response => {
            console.log(response)
        })
        .catch(err => {
            return console.log(err)
        })
    }

    const handleDelete = (id) => {
        axios.delete(`${config.baseUrl}/a/admin/removetemp/${id}`)
        .then(response => {
            return alert('user deleted')
        })
        .catch(err => {
            return console.log(err)
        })
    }
     const columns = [{
        dataField: 'user_id',
        text: 'User id',
        sort: false,
        hidden: true
      }, {
        dataField: 'first_name',
        text: 'First name',
        sort: true
      }, {
        dataField: 'last_name',
        text: 'Last name',
        sort: true
      },
      {
        dataField: 'email',
        text: 'Email',
        sort: true
     },
    {
        dataField: 'Accepted',
        text: 'Accepted',
        sort: true,
        formatter: linkCell

    }]
    const defaultSorted = [{
        dataField: 'email',
        order: 'desc'
      }];


    return (
        <div>
            {/* header */}
            <Header />

            {/* form thing */}
            <Row>
                <Col md={{size: 6}}>
                    <Title title='Add New Admin'/>

                    <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                        <h3>Add New Admin</h3>
                        <Form.Group controlId='form-first-name'>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" name="first-name" placeholder="First Name"
                            {...firstName}
                            ref={register({
                                required: {
                                    value: false,
                                    message: 'Please enter First name'
                                }
                            })}
                            />
                        </Form.Group>

                        <Form.Group controlId='form-last-name'>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name="last-name" placeholder="Last Name"
                            {...lastName}
                            ref={register({
                                required: {
                                    required: false,
                                    message: "Please enter last name"
                                }
                            })}/>
                        </Form.Group>     

                        <Form.Group controlId='form-email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" placeholder="Email"
                            {...email}
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'Please enter Email'
                                }
                            })}/>
                        </Form.Group>

                        <Button variant="primary" type="submit" >Submit</Button>
                    </Form>
                </Col>
            </Row>
            
            {/* table thing for pending admins */}
            <Row>
                <h1>Pending List</h1>
                <BootstrapTable
                boostrap4
                keyField="id"
                data={data}
                columns={columns}
                defaultSorted={defaultSorted}
                />
            </Row>
        </div>
    )
}


const useFormInput = initialValue => {
    //Note advisable to change the value name to something else
    //because it is used as a value attribute in the JSX which defines the textboxes.  
    const [value, setValue] = useState(initialValue);
    
    const handleChange = e => {
      setValue(e.target.value);
      // More information about setValue and hooks is at https://reactjs.org/docs/hooks-state.html
    }
    return {
      value,// This is tied to the JSX 
      onChange: handleChange, // This is tied to the JSX 
     
    }
  }
   
export default AddAdmin