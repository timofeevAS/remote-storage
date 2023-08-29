import React, { useState,useEffect,useMemo } from "react";
import { Container, Row, Col, Navbar, Nav, Card, Button } from 'react-bootstrap';
import FileCard from "./FileCard";
import FileLine from "./FileLine";
import { faList, faTh,faInfoCircle, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const fileData1 = [
  { id: '1', name: 'File 1', extension: 'txt', size: '1mb', url: 'https://example.com/file1.txt' },
  { id: '2', name: 'File 2', extension: 'pdf', size: '1mb', url: 'https://example.com/file2.pdf' },
  { id: '3', name: 'File 3', extension: 'jpg', size: '1mb', url: 'https://example.com/file3.jpg' },
  { id: '4', name: 'File 4', extension: 'docx', size: '1mb', url: 'https://example.com/file4.docx' },
  { id: '5', name: 'a', extension: 'txt', size: '1mb', url: 'https://example.com/file1.txt' },
];


function FileContainer({ handleSelectedFile,fileData,handleUploadSuccess,setCurrentSort,infoButtonClicked,setInfoButtonState }) {
  console.log('FILE CONTAINER JS - render');
  const [currentIcon, setCurrentIcon] = useState(faList);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedFileCard, setSelectedFileCard] = useState(null);
  //const [infoButtonClicked, setInfoButtonState] = useState(false);
  const [draggingFile, setDraggingFile] = useState(false);
  const [isAscending, setIsAscending] = useState(false); // State to track sorting order
  const [sortParam, setSortParam] = useState('date'); // Default sort params by date


  const handleSortParamChange = () => {
    {/* Switch param for sort */ }
    setSortParam(sortParam => sortParam === 'name' ? 'date' : 'name');
    const params = {
      reverse: !isAscending,
      compare: sortParam === 'name' ? 'date' : 'name',
    }
    setCurrentSort(params);
  };

  const handleDragOver = (e) => {
    { /* Removing default browser functions */ }
    e.preventDefault(); 
  };

  const handleSortClick = () => {
    {/* Method to control sorting logic */}
    setIsAscending((isAscending) => !isAscending);
    const params = {
      reverse: !isAscending,
      compare:sortParam,
    }
    setCurrentSort(params);
    
  };
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    setDraggingFile(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDraggingFile(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDraggingFile(false);
    const files = Array.from(e.dataTransfer.files); // Array of uploaded files
  
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", file.name);
  
        const response = await fetch("http://localhost:8000/users/files/", {
          method: "POST",
          body: formData,
        });
  
        // Handle other status codes if needed
        if (response.status !== 201) {
          console.log("Upload failed. Status code:", response.status);
        }
      }
  
      // If all files were successfully uploaded
      handleUploadSuccess(); // Call your success function
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  
  const handleInfoClick = () => {
    setInfoButtonState(!infoButtonClicked);
  }

  useEffect(() => {
    console.log('Clicked on Info button', infoButtonClicked);
    if (infoButtonClicked) {
      handleSelectedFile(selectedFileCard);
    } else {
      handleSelectedFile(-1);
      setSelectedFileCard(null)
    }
  }, [infoButtonClicked]);

  const handleCardClick = (file) => {
    var selectedCardCopy = file;
    if(selectedFileCard === file){
      setSelectedFileCard(null)
      selectedCardCopy = null;
    }
    else{
      setSelectedFileCard(file);
    }
    setInfoButtonState(true);
    console.log("Selected file: ",file.id);
    handleSelectedFile(selectedCardCopy);
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
    <div >
        <Container>
            <Card style={{outline:'none',border:'none'}}>
              <Card.Body>
                <div style ={{ position:'absolute',right:'45px',top:'5px',color: infoButtonClicked ? 'lightblue' : 'black'}}> <FontAwesomeIcon icon={faInfoCircle} onClick={handleInfoClick} /> </div>
                <div style ={{ position:'absolute',right:'15px',top:'5px'}}> <FontAwesomeIcon icon={currentIcon} onClick={handleIconClick}/> </div>
                <div style ={{ position:'absolute',left:'15px',top:'5px'}}> Files </div>
                <div style ={{ position:'absolute',right:'75px',top:'5px'}} onClick={handleSortClick} > {isAscending ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />}</div>
                <div style ={{ position:'absolute',right:'100px',top:'3px'}}><Button onClick={handleSortParamChange} size="sm" variant="outline-dark">{sortParam === 'name' ? 'name' : 'date'}</Button></div>

              </Card.Body>
            </Card>
        </Container>
      <Container 
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style = {{
          maxHeight: '800px',
          overflowY: 'auto',
          backgroundColor: draggingFile ? '#9fc5e8' : 'transparent',
        }}>
        <h6>Справка: файлы и папки располагаются в этом контейнере</h6>
        <Row className="">{fileCards}</Row>
      </Container>
    </div>
  );
}

export default FileContainer;
