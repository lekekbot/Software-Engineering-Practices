import React, {
    useEffect,
    useState
} from "react";
import axios from 'axios';
import config from '../../Config.js';
import {
    Switch,
    useParams,
    Route,
    Redirect,
    useHistory
} from "react-router-dom";
import { Form, Button, Container, Row , Col  } from "react-bootstrap";
import { useForm } from "react-hook-form";

export default function Gay() {

    //states
    const {
        token
    } = useParams() //get parameter from URL
    const [verified, setVerified] = useState(false)
    const [datas, setData] = useState()
    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();

    //componentDidMount
    useEffect(() => {
        const fetchdata = async () => {
            await axios.get(`${config.baseUrl}/a/confirmation/${token}`)
            .then(response => {
                setData(response.data[0])
                setVerified(true)
            }).catch(error => {

                // console.dir(error)

                //literally close everything 
                alert('Your Token has expired, go get help or something')
                window.close()
            })
        }
        fetchdata()
        // if token has expired/ any error that occurs

    },[])

    //funcs and shit 
    const onSubmit = (data,e) => {
        if(data.password != data.confirm_pass) return alert('Error, password not the same smh')

        axios.post(`${config.baseUrl}/a/admin/createAdmin`, {first_name: data.first_name, last_name: data.last_name, email:data.email, password: data.password, user_id: datas.user_id})
        .then(response => {
            alert('Success! Account Created. Redirecting you to login page')
            history.push('/login');
        })
        .catch(err => console.log(err))
    }

    return (
        <Container>
            <Row>
                <h1>Create Admin Account</h1>
            </Row>

            <Row>
                <Form autoComplete='false' onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group controlId='first_name'>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type='text' name="first_name" value={datas ? datas.first_name : ''}
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'Please enter your first name',
                                }
                            })}/>
                        </Form.Group>

                        <Form.Group controlId='last_name'>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type='text' name="last_name" value={datas ? datas.last_name : ''}                           
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'Please enter your last name',
                                }
                            })}></Form.Control>
                        </Form.Group>    

                        <Form.Group controlId='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='text' name="email" value={datas ? datas.email : ''}                            
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'Please enter your email',
                                }
                            })}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' name="password"                            
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'Please enter your password',
                                }
                            })}></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='confirm_pass'>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type='password' name="confirm_pass"                             
                            ref={register({
                                required: {
                                    value: true,
                                    message: 'Please re-enter your password',
                                },
                            })}></Form.Control>
                        </Form.Group>

                        <Button variant="primary" type="submit" >Accept Invite</Button>
                    </Form>     
            </Row>
        </Container>
    )
}