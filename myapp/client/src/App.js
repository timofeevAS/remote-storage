import React, { useEffect, useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrashCan} from '@fortawesome/free-solid-svg-icons';

/*
const fileData = [
  { name: 'File 1', extension: 'txt', size: '1mb', url: 'https://example.com/file1.txt' },
  { name: 'File 2', extension: 'pdf', size: '1mb', url: 'https://example.com/file2.pdf' },
  { name: 'File 3', extension: 'jpg', size: '1mb', url: 'https://example.com/file3.jpg' },
  { name: 'File 4', extension: 'docx', size: '1mb', url: 'https://example.com/file4.docx' },
];
*/

function getColorByExtension(extension) {
  switch (extension) {
    case 'txt':
      return 'green';
    case 'pdf':
      return 'red';
    case 'jpg':
      return 'orange';
    case 'docx':
      return 'blue';
    default:
      return 'black';
  }
}



function App() {
  const [fileData, setFileData] = useState([]);
  const apiURL = "http://localhost:8000"

  useEffect(() => {
    fetch('http://localhost:8000/users/files/')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Вывод полученного JSON в консоль
        setFileData(data);
      })
      .catch(error => console.error(error));
  }, []);



  return (
    <div className="App">
      <h1>File Cards</h1>
      {fileData.map((file, index) => (
        <div key={index} className="FileCard">

          <div className="Extension" style={{ color: getColorByExtension(file.extension) }}>
            {file.extension.toUpperCase()}
          </div>

          <div className="FileName">
            <h3>{file.name}</h3>
          </div>

          <div className="DeleteButtonContainer">
            <FontAwesomeIcon icon={faTrashCan} className="DeleteButton" />
          </div>

          <div className="DownloadButtonContainer">
          <a href= { apiURL+file.url } download
          target="_blank"
          rel="noreferrer">
            <FontAwesomeIcon icon={faDownload} className="DownloadIcon" />
          </a>
          </div>

        </div>

      ))}
    </div>
  );
}

export default App;
