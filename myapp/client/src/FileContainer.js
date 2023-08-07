import React, { useState,useEffect } from "react";
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import FileCard from "./FileCard";
import FileLine from "./FileLine";
import { faList, faTh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const fileData1 = [
  { id: '1', name: 'File 1', extension: 'txt', size: '1mb', url: 'https://example.com/file1.txt' },
  { id: '2', name: 'File 2', extension: 'pdf', size: '1mb', url: 'https://example.com/file2.pdf' },
  { id: '3', name: 'File 3', extension: 'jpg', size: '1mb', url: 'https://example.com/file3.jpg' },
  { id: '4', name: 'File 4', extension: 'docx', size: '1mb', url: 'https://example.com/file4.docx' },
  { id: '5', name: 'a', extension: 'txt', size: '1mb', url: 'https://example.com/file1.txt' },
];

function FileContainer({ handleSelectedFile }) {
  const [fileData, setFileData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/users/files/")
      .then(response => response.json())
      .then(data => setFileData(data));
  }, []);

  const [currentIcon, setCurrentIcon] = useState(faList);

  const handleIconClick = () => {
    setCurrentIcon(currentIcon === faList ? faTh : faList);
  };

  let xsCount, smCount, lgCount;

  if (currentIcon === faList) {
    xsCount = 2;
    smCount = 2;
    lgCount = 3;
  } else {
    xsCount = 3;
    smCount = 4;
    lgCount = 6;
  }

  const [openMenu, setOpenMenu] = useState(null);

  const handleMenuClick = (fileId) => {
    setOpenMenu((prevMenu) => (prevMenu === fileId ? null : fileId));
  };

  const handleMenuItemClick = (eventKey) => {
    // logic
    console.log("Menu item clicked:", eventKey);
    const selectedFile = fileData.find((file) => file.id === openMenu);
    handleSelectedFile(selectedFile); // callback
    setOpenMenu(null);
  };

  return (
    <div className="Cards">
        <Container>
            <Nav className="justify-content-end">
              <Nav.Item onClick={handleIconClick}>
                <FontAwesomeIcon icon={currentIcon} />
              </Nav.Item>
              <Nav.Item style={{
                position:'relative',
                right:'1270px'//  {/* PROBLEMA */}
              }} > Files</Nav.Item>
            </Nav>
        </Container>
      <Container>
        <h6>Справка: файлы и папки располагаются в этом контейнере</h6>
        <Row  className="">
          {fileData.map((file, index) => (
            <Col key={index}>
              {currentIcon === faList ? <FileCard file={file} handleMenuClick={handleMenuClick} openMenu={openMenu} handleMenuItemClick={handleMenuItemClick} /> : 
              <FileLine file={file} handleMenuClick={handleMenuClick} openMenu={openMenu} handleMenuItemClick={handleMenuItemClick} />}
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default FileContainer;
