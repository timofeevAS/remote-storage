import React, { useEffect, useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col } from 'react-bootstrap';

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

  function truncateFileName(fileName, maxLength) {
    if (fileName.length <= maxLength) return fileName;
    return fileName.slice(0, maxLength - 3) + '...';
  }

  return (
    <div className="App">
      <h1>File Cards</h1>
      <Container>
        <Row>
          {fileData.map((file, index) => (
            <React.Fragment key={index}>
              <Col md={2}>
                {index}
              </Col>
            </React.Fragment>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default App;