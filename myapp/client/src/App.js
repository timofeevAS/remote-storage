import React, { useState,useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import TopNavbar from './TopNavbar';
import SideBarMenu from './SideBarMenu';
import FileContainer from './FileContainer';
import FileDetails from './FileDetails'; // Import the FileDetails component here

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDetailsVisible, setFileDetailsVisible] = useState(false); // Currency state of fileDetails
  const [fileData, setFileData] = useState([]);
  const [fetchConfig, setFetchConfig] = useState({});

  const handleSelectedFile = (file) => {
    setSelectedFile(file);
    file === -1 ? setFileDetailsVisible(false) : setFileDetailsVisible(true);
    console.log('APP.JS: ',selectedFile,fileDetailsVisible);
  };

  useEffect(() => {
    fetchFileData();
  }, [fetchConfig]); // Update fetch data, when fetchConfig edit

  const fetchFileData = () => {
    const queryString = Object.keys(fetchConfig)
      .filter(key => fetchConfig[key] !== null) // Пропускаем null значения
      .map(key => `${key}=${fetchConfig[key]}`)
      .join("&");

    const apiUrl = `http://127.0.0.1:8000/users/files/?${queryString}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => setFileData(data))
      .catch(error => console.error("Error fetching file data:", error));
  };

  const handleUploadSuccess = (uploadedFile) => {
    setFileData(prevFileData => [...prevFileData, uploadedFile]);
  }
  return (
    <>
      <TopNavbar />
      <Container fluid>
        <Row>
          <Col md={2}>
            <SideBarMenu handleUploadSuccess={handleUploadSuccess} />
          </Col>
          <Col md={10}>
            {/* */}
            <div
              style={{
                marginLeft: fileDetailsVisible ? "-300px" : 0, // Negative margin when details opened
                transition: "margin-left 0.3s ease",
              }}
            >
              <FileContainer handleSelectedFile={handleSelectedFile} />
              
            </div>
          </Col>
          {/* Details of files if it has chosen  */}
          {fileDetailsVisible != false && (
            <Col md={3} >
              {<FileDetails file={selectedFile} />}
            </Col>
          )}
        </Row>
      </Container>
    </>
  );}
          

export default App;
