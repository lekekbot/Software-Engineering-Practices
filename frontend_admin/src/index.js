//*************** Setup boostrap dependencies *******************/
//I used dependency strategy instead of CDN strategy as mentioned inside
//https://blog.logrocket.com/how-to-use-bootstrap-with-react-a354715d1121/
//https://youtu.be/8pKjULHzs0s
//I did not import jQuery and popper
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
//With the above imports I can use Bootstrap JavaScript components in your React app.
//************************************************************* */
//After facing a lot of problems for 2 days on react-bootstrap-table, I noticed that
//it has already been upgraded to version2. As a result I followed the documentation
//at https://react-bootstrap-table.github.io/react-bootstrap-table2/docs/getting-started.html
//Note that, detailed usage is found at 
//https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html?selectedKind=Cell%20Editing&selectedStory=Dropdown%20Editor&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Routes from './Routes.js';
import 'react-toastify/dist/ReactToastify.css';
ReactDOM.render( <Routes />,document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
