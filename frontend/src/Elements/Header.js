import React, { useEffect, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { Form, Button, FormGroup, FormControl, ControlLabel, Dropdown } from "react-bootstrap";
import jwt from 'jsonwebtoken'

import Title from "../Pages/Title/Title";
import config from "../config";
import axios from 'axios';
import { getUserDisplayNameFromLocalStore, getTokenFromLocalStore } from '../Utils/Common.js';// Common.js don't use export default
const Header = () => {
  const history = useHistory();

  const handleClickLogout = () => {
    /* eslint-disable */
    const toLogout = confirm("Are you sure to logout ?");
    /* eslint-enable */
    if (toLogout) {
      localStorage.clear();
      history.push("/login");
    }
  }

  const getUserId = () => {
    const token = getTokenFromLocalStore();
    let decoded = jwt.decode(token);
    return decoded?.userId
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">
          RnR Business Plan Competition
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
              <a className="nav-link" href={"/manageteam/"} >
                Manage Proposal
                </a>
            </li>
            <li className="nav-item">
              <Dropdown>
                <Dropdown.Toggle variant="" id="dropdown-basic">
                  My account
              </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => history.push("/UserProfile")}>Profile</Dropdown.Item>
                  <Dropdown.Item onClick={() => history.push("/reset_password")}>Reset my password!</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
            <li className="nav-item">
              <span
                className="nav-link cursor-pointer"
                onClick={() => handleClickLogout()}
              >
                Logout
                </span>
            </li>
          </ul>
          <span className="navbar-text">Welcome! {getUserDisplayNameFromLocalStore()}</span>
        </div>
      </nav>
    </>

  );

}
export default Header;