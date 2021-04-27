import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';// I left this default code alone.
import reportWebVitals from './reportWebVitals';
import Routes from './Routes.js';
// Importing the Bootstrap CSS
// Referred to https://codesandbox.io/s/github/react-bootstrap/code-sandbox-examples/tree/master/basic?file=/src/index.js:87-164

import 'bootstrap/dist/css/bootstrap.min.css'; // Main tutorial only asked me to do this
import $ from 'jquery'; //Additional tutorials mentioned I need these three
import Popper from 'popper.js'; //https://blog.logrocket.com/how-to-use-bootstrap-with-react-a354715d1121/
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'react-toastify/dist/ReactToastify.css';
ReactDOM.render(
  <Routes />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
