
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styles from "./Header.css";
import config from "../../Config.js";
import { getUserIdFromLocalStore } from '../../Utils/Common.js'

import { Form, Button, FormGroup, FormControl, ControlLabel, Dropdown } from "react-bootstrap";


import { getUserDisplayNameFromLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
const Header = () => {

  const history = useHistory();
  const location = useLocation()

  const [id, setId] = useState()
  const [master, setmaster] = useState(false)


  useEffect(() => {
    if (location.state != undefined) {
      setId(location.state.email)
      // console.log(location)
      localStorage.setItem('email', location.state.email);
    }
    GetId()

  }, [location])

  const GetId = () => {
    var email = localStorage.getItem('email')
    axios.get(`${config.baseUrl}/a/admin/adminid/${email}`)
      .then((response) => {
        if (response.data[0].role_name === 'master_admin') {
          setmaster(true)
        } else {
          setmaster(false)
        }
      })
      .catch(err => {
        console.log(err)
        setmaster(false)
      })
  }

  // Careful on using the useEffect because wrong usage can cause
  // infinite REST API calls
  // https://medium.com/@andrewmyint/infinite-loop-inside-useeffect-react-hooks-6748de62871
  const handleClickLogout = () => {
    //https://eslint.org/docs/2.13.1/user-guide/configuring
    /* eslint-disable */
    const toLogout = confirm("Are you sure to logout ?");
    /* eslint-enable */
    if (toLogout) {
      //Clear the local storage at the web browser client side.
      localStorage.clear();
      //Call the push method of the history object to open the
      //Login view.
      history.push("/login");
    }
  }

  return (

      <div class="sticky-header">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="/">
            RnR Business Plan Competitione
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link" href="/dashboard">
                  Dashboard <span className="sr-only .sr-only-focusable ">(current)</span>
                </a>
              </li>
              <li className="nav-item active">
                <a className="nav-link" href="/user">
                  User
                </a>
              </li>
              <li className="nav-item active">
                <a className="nav-link" href="/team">
                  Team
                </a>
            </li>

            <li className="nav-item active">
              <a className="nav-link" href="/remove">
                Delete User
                </a>
              </li>
              {master ?
                <li className="nav-item active">
                  <a className="nav-link" href="/AddAdmin">
                    Add New Admin
                </a>
                </li>
                : ''}
              <li className="nav-item">
                <span
                  className="nav-link cursor-pointer"
                  onClick={() => handleClickLogout()} >
                  Logout
                </span>
              </li>
            </ul>
            <span className="navbar-text">Welcome! {getUserDisplayNameFromLocalStore()}</span>
          </div>
        </nav>
      </div>
 
  );

}
export default Header;