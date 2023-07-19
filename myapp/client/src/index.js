import React from 'react';
import ReactDOM from 'react-dom/client';
//import ReactDOM from 'react-dom';
import App from './App';



import { library } from '@fortawesome/fontawesome-svg-core';
import { faDownload, faTrashCan } from '@fortawesome/free-solid-svg-icons';

library.add(faDownload, faTrashCan);


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

  <App />

);
