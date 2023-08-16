import React, { useState,useEffect,useMemo } from "react";
import { Container, Row, Col, Navbar, Nav, Card } from 'react-bootstrap';
import FileCard from "./FileCard";
import FileLine from "./FileLine";
import UploadModal from "./UploadModal";
import { faList, faTh,faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const fileData1 = [
  { id: '1', name: 'File 1', extension: 'txt', size: '1mb', url: 'https://example.com/file1.txt' },
  { id: '2', name: 'File 2', extension: 'pdf', size: '1mb', url: 'https://example.com/file2.pdf' },
  { id: '3', name: 'File 3', extension: 'jpg', size: '1mb', url: 'https://example.com/file3.jpg' },
  { id: '4', name: 'File 4', extension: 'docx', size: '1mb', url: 'https://example.com/file4.docx' },
  { id: '5', name: 'a', extension: 'txt', size: '1mb', url: 'https://example.com/file1.txt' },
];


function FileContainer({ handleSelectedFile,fileData }) {
  console.log('FILE CONTAINER JS - render');
  const [currentIcon, setCurrentIcon] = useState(faList);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedFileCard, setSelectedFileCard] = useState(null);
  const [infoButtonClicked, setInfoButtonState] = useState(false);
  const [showModal, setShowModal] = useState(false);



  const handleDragOver = (e) => {
    { /* Removing default browser functions */ }
    e.preventDefault(); 
  };
  
  const handleDrop = (e) => {
    {/* Logic of dragged files */}
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files); // Array of uploaded files

    // Fetching
    files.forEach(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name);
  
      const res = await fetch("http://localhost:8000/users/files/", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());
  
      setResponseMessage(`${res.message}, status: ${res.status}`);
    });

  };
  
  const handleInfoClick = () => {
    console.log('Clicked on Info button');
    setInfoButtonState(!infoButtonClicked);
    infoButtonClicked ? handleSelectedFile(selectedFileCard) : handleSelectedFile(-1);
  }

  const handleCardClick = (file) => {
    selectedFileCard === file ? setSelectedFileCard(null) : setSelectedFileCard(file);  
    setInfoButtonState(true);
    console.log("Selected file: ",file.id);
    handleSelectedFile(selectedFileCard);
  };

  const handleIconClick = () => {
    setCurrentIcon(currentIcon === faList ? faTh : faList);
  };
  
  const handleMenuClick = (fileId) => {
    setOpenMenu((prevMenu) => (prevMenu === fileId ? null : fileId));
  };

  const handleMenuItemClick = (eventKey) => {
    // logic
    console.log("Menu item clicked:", eventKey);
    const selectedFileCard = fileData.find((file) => file.id === openMenu);
    setSelectedFileCard(selectedFileCard);
    handleselectedFil(selectedFileCard); // callback to FileDetails
    setOpenMenu(null);
  };

  
  const fileCards = useMemo(() => {
    return fileData.map((file, index) => (
      <Col key={index}>
        {currentIcon === faList ? (
          <FileCard 
            file={file} 
            handleMenuClick={handleMenuClick} 
            openMenu={openMenu} 
            handleMenuItemClick={handleMenuItemClick}
            handleCardClick={handleCardClick}
            isSelected={file === selectedFileCard}
          />
        ) : (
          <FileLine 
            file={file} 
            handleMenuClick={handleMenuClick} 
            openMenu={openMenu} 
            handleMenuItemClick={handleMenuItemClick} 
          />
        )}
      </Col>
    ));
  }, [fileData, currentIcon, openMenu, handleMenuClick, handleMenuItemClick, handleCardClick, selectedFileCard]);


  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop}>
        <Container>
            <Card style={{outline:'none',border:'none'}}>
              <Card.Body>
                <div style ={{ position:'absolute',right:'45px',top:'5px',color: infoButtonClicked ? 'lightblue' : 'black'}}> <FontAwesomeIcon icon={faInfoCircle} onClick={handleInfoClick} /> </div>
                <div style ={{ position:'absolute',right:'15px',top:'5px'}}> <FontAwesomeIcon icon={currentIcon} onClick={handleIconClick}/> </div>
                <div style ={{ position:'absolute',left:'15px',top:'5px'}}> Files </div>
                
              </Card.Body>
            </Card>
        </Container>
      <Container style = {{
          maxHeight: '800px',
          overflowY: 'auto'
        }}>
        <h6>Справка: файлы и папки располагаются в этом контейнере</h6>
        <Row className="">{fileCards}</Row>
      </Container>
    </div>
  );
}

export default FileContainer;
