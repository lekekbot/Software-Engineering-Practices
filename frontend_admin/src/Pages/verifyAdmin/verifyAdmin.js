import React, {
    useEffect,
    useState
} from "react";
import axios from 'axios';
import config from '../../Config.js';
import {
    Switch,
    useParams,
    Route
} from "react-router-dom";

export default function Gay() {
    //states
    const {
        token
    } = useParams() //get parameter from URL
    const [verified, setVerified] = useState(false)
    const [data, setData] = useState()
    
    //componentDidMount
    useEffect(async () => {
        await axios.get(`${config.baseUrl}/a/confirmation/${token}`)
            .then(response => {
                console.log(response);
                setData(response.data[0])
                setVerified(true)
            }).catch(error => {
                console.dir(error)
                setVerified(false)
            })

        // if token has expired/ any error that occurs
        if (!setVerified) {
            alert('Your Token has expired, go get help or something')
            window.close()
        }
    })

    return (
        <div>
            <h1>CIBAI</h1>
            <p>IM GAY YKNOW</p>
        </div>
    )
}