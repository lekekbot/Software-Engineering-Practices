import React, { useEffect, useState } from "react";
import axios from 'axios';

import Header from '../../Elements/Header/Header';
import Title from "../../Elements/Title/Title";
import styles from "./Addadmin.module.css";
import config from '../../Config.js';


// react related shit
import { Form, Button, Container, Row , Col  } from "react-bootstrap";
import { useForm } from "react-hook-form";




const AddAdmin = () => {
    const { register, handleSubmit, errors } = useForm();

    const onSubmit = (data,e) => {
        // console.dir(data)
        axios.post(`${config.baseUrl}/a/addadmin`,
        {first_name: data['first-name'], last_name: data['last-name'], email: data.email})
        .then(response => {
            console.log('quck quack shit shit ')
        })
    }

    return (
        <div>
            {/* header */}
            <Header/>

            {/* form thing ya */}
            <Row>
                <Col md={{size: 6}}>
                    <Title title='Add New Admin'/>

                    <Form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                        <h3>Add New Admin</h3>
                        <Form.Group controlId='form-first-name'>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" name="first-name" placeholder="First Name"
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
            
            {/* table thing for pending admins ya */}
            <Row>
                <h1>Pending List</h1>
                <table>

                </table>
            </Row>
        </div>
    )
}

export default AddAdmin