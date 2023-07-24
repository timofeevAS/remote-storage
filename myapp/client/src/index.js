import React from 'react';
import ReactDOM from 'react-dom/client';
//import ReactDOM from 'react-dom';
import App from './App';
import FileForm from './FileForm'
import 'typeface-roboto';

import 'bootstrap/dist/css/bootstrap.min.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faDownload, faTrashCan } from '@fortawesome/free-solid-svg-icons';




library.add(faDownload, faTrashCan);


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <>
    <FileForm />
    <App />
  </>
);

