import React from 'react';
import ReactDOM from 'react-dom/client';
//import ReactDOM from 'react-dom';
import App from './App';
import 'typeface-roboto';


import { library } from '@fortawesome/fontawesome-svg-core';
import { faDownload, faTrashCan } from '@fortawesome/free-solid-svg-icons';

library.add(faDownload, faTrashCan);


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

  <App />

);
//root.render(
//  <h1>Hello, World!</h1>
//);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

