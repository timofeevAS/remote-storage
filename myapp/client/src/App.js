import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'




const fileData1 = [
  { name: 'File 1', extension: 'txt', size: '1mb', url: 'https://example.com/file1.txt' },
  { name: 'File 2', extension: 'pdf', size: '1mb', url: 'https://example.com/file2.pdf' },
  { name: 'File 3', extension: 'jpg', size: '1mb', url: 'https://example.com/file3.jpg' },
  { name: 'File 4', extension: 'docx', size: '1mb', url: 'https://example.com/file4.docx' },
  { name: 'a', extension: 'txt', size: '1mb', url: 'https://example.com/file1.txt' },
];

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

{/* Sorting array by param */}
  const handleSort = (param) => {
    const sortedData = [...fileData1].sort((a, b) => {
      if (a[param] < b[param]) return -1;
      if (a[param] > b[param]) return 1;
      return 0;
    });
    setFileData(sortedData);
  };


  return (
    <div className="d-flex justify-content-center">
      <Container>
       <Row xs={1} sm={2} lg={3} className="justify-content-md-center">
       {fileData1.map((file, index) => (
            <Col key={index}>
              <Card style={{ width: '300px', height: '150px', borderRadius: '13px', backgroundColor: '#f5f5f5',marginBottom:'30px' }}>
                <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                  <Card.Title style={{ fontSize: '25px', position: 'relative', top: '15px' }}>
                    {file.name}
                  </Card.Title>
                  <Card.Link href={apiURL + file.url} download target="_blank" rel="noreferrer" style={{ position: 'relative', top: '15px' }}>
                    <FontAwesomeIcon icon={faDownload} className="DownloadIcon" size="lg"/>
                  </Card.Link>
                </Card.Body>
                <Card.Link href="#" style={{ position: 'absolute', top: '13px', right: '15px' }}>
                  <FontAwesomeIcon icon={faTrashCan} className="DeleteButton" size="lg"/>
                </Card.Link>
                <Card.Text style={{ fontSize: '20px', position: 'absolute', top: '10px', left: '15px', fontWeight: 'bold',color:getColorByExtension(file.extension) }}>
                  {file.extension.toUpperCase()}
                </Card.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>

  );
}

export default App;
