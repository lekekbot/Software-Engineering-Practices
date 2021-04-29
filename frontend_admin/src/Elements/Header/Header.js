
import React from "react";
import {useHistory} from "react-router-dom";


import { getUserDisplayNameFromLocalStore } from '../../Utils/Common.js';// Common.js don't use export default
const Header = () => {

const history = useHistory();
// Careful on using the useEffect because wrong usage can cause
// infinite REST API calls
// https://medium.com/@andrewmyint/infinite-loop-inside-useeffect-react-hooks-6748de62871
    const handleClickLogout = () =>{
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

    return(
       
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
                <a className="nav-link" href="/AddAdmin">
                  Add New Admin
                </a>
              </li> 
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
      </>
           
        );
    
}
export default Header;