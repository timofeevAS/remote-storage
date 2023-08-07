import React, { useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import TopNavbar from './TopNavbar';
import SideBarMenu from './SideBarMenu';
import FileContainer from './FileContainer';
import FileDetails from './FileDetails'; // Import the FileDetails component here

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDetailsVisible, setFileDetailsVisible] = useState(false); // Состояние видимости деталей файла


  const handleSelectedFile = (file) => {
    setSelectedFile(file);
    setFileDetailsVisible(true);
  };

  return (
    <>
      <TopNavbar />
      <Container fluid>
        <Row>
          <Col md={2}>
            <SideBarMenu />
          </Col>
          <Col md={10}>
            {/* Оберните все содержимое, кроме меню, в отдельный div */}
            <div
              style={{
                marginLeft: fileDetailsVisible ? "-300px" : 0, // Negative margin when details opened
                transition: "margin-left 0.3s ease",
              }}
            >
              <FileContainer handleSelectedFile={handleSelectedFile} />
              
            </div>
          </Col>
          {/* Показать детали файла, если выбран файл */}
          {selectedFile && (
            <Col md={3} >
              <FileDetails file={selectedFile} />
            </Col>
          )}
        </Row>
      </Container>
    </>
  );}
          

export default App;
