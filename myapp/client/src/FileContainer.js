import React, { useState,useEffect,useMemo } from "react";
import { Container, Row, Col, Navbar, Nav, Card, Button } from 'react-bootstrap';
import FileCard from "./FileCard";
import FolderCard from './FolderCard';
import FolderLine from './FolderLine';
import FileLine from "./FileLine";
import CreateFolder from "./CreateFolder"
import { faList, faTh,faInfoCircle, faArrowUp, faArrowDown, faXmark, faUndo} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { filter } from "lodash";
import { useCookies } from 'react-cookie'

const fileData1 = [
  { id: '1', name: 'File 1', extension: 'txt', size: '1mb', url: 'https://example.com/file1.txt' },
  { id: '2', name: 'File 2', extension: 'pdf', size: '1mb', url: 'https://example.com/file2.pdf' },
  { id: '3', name: 'File 3', extension: 'jpg', size: '1mb', url: 'https://example.com/file3.jpg' },
  { id: '4', name: 'File 4', extension: 'docx', size: '1mb', url: 'https://example.com/file4.docx' },
  { id: '5', name: 'a', extension: 'txt', size: '1mb', url: 'https://example.com/file1.txt' },
];


function FileContainer({ handleSelectedFile, fileData,folderData, handleUploadSuccess, setCurrentSort, infoButtonClicked, setInfoButtonState,filterConfig, clearFilters, handleClickFolder }) {
  const [currentIcon, setCurrentIcon] = useState(faList);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedFileCard, setSelectedFileCard] = useState(null);
  const [draggingFile, setDraggingFile] = useState(false);
  const [isAscending, setIsAscending] = useState(true); // State to track sorting order
  const [sortParam, setSortParam] = useState('date'); // Default sort params by date
  const [userFolder, setUserFolder] = useState(null);
  const [folderHistory,setFolderHistory] = useState([{id:'',name:'home'}]); // stack for storage history
  const [userDepartment, setUserDepartment] = useState(null);
  const [showCreateFolderForm, setShowCreateFolderForm] = useState(false);// State for file create modal
  const [cookies] = useCookies(['csrfToken']); // cookies


  const handleCreateFolder = () => {
    {/* showing modal for create folder */}
    setShowCreateFolderForm(true);
  };

  const handleCloseCreateFolderForm = () => {
    {/* closing modal after creating */}
    setShowCreateFolderForm(false);
  };

  
  const fetchFolder = async () => {
    {/* Function for async request for get folder name*/}
    try {
      const response = await fetch(`http://127.0.0.1:8000/users/folders/${filterConfig.folder}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        const responseData = await response.json();
        return responseData;
      }
    } catch (error) {
      console.error("Error fetching file name:", error);
      return null;
    }
  };

  useEffect(() => {
    {/* Effect to change current user folder */}
    const fetchData = async () => {
      if (filterConfig.folder !== null && filterConfig.folder !== '') {
        try {
          const folder = await fetchFolder();
          setUserFolder(folder);
        } catch (error) {
          console.error("Error fetching folder:", error);
          setUserFolder(null);
        }
      } else {
        setUserFolder(null);
      }
    };
  
    fetchData();
    console.log("userFolder==>",userFolder)
  }, [filterConfig.folder]);

  const mostDepartment = () => {
    {/* Function to find most department*/}
    if (fileData.length === 0 && fileData[0] !== null) {
      return null;
    }
  
    // Get dep from first element
    const firstDepartment = fileData[0].department ;
  
    // Checking if all files into one dep
    for (const file of fileData) {
      if(file.department === null){
        return null;
      }
      if (file.department.name !== firstDepartment.name) {
        return null;
      }
    }
    return firstDepartment; // Return our department
  }

  
  useEffect(() => {
    if(filterConfig.department === null || filterConfig.department === ''){
      setUserDepartment('All');
      console.log("userDepartment==>",'All');
      return;
    }
    setUserDepartment(filterConfig.department.toUpperCase());
    console.log("userDepartment==>",filterConfig.department);
  },[filterConfig.department]);


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
        const nullOrEmptyStr = (obj) => {obj !== null && obj !== '' ? true : false};

        formData.append("file", file);
        formData.append("name", file.name);
        formData.append("folder",filterConfig.folder !== null ? filterConfig.folder : '');
        console.log("folder",filterConfig.folder !== null ? filterConfig.folder : '');
        formData.append("department", (filterConfig.department !== 'All' && nullOrEmptyStr(filterConfig.department)) ? filterConfig.department : '');
        
  
        const response = await fetch("http://localhost:8000/users/files/", {
          method: "POST",
          body: formData,
          headers:{
          "X-CSRF-Token": cookies.csrfToken,
          }
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
            style={{ flex: '0 0 20%', margin: '10px' }}
            file={file} 
            handleMenuClick={handleMenuClick} 
            openMenu={openMenu} 
            handleMenuItemClick={handleMenuItemClick}
            handleCardClick={handleCardClick}
            isSelected={file === selectedFileCard}
          />
        ) : (
          <FileLine 
            style={{ flex: '0 0 20%', margin: '10px' }}
            file={file} 
            handleMenuClick={handleMenuClick} 
            openMenu={openMenu} 
            handleMenuItemClick={handleMenuItemClick}
            handleCardClick={(card) => handleCardClick(card)}
            isSelected={file === selectedFileCard}
          />
        )}
      </Col>
    ));
  }, [fileData, currentIcon, openMenu, handleMenuClick, handleMenuItemClick, handleCardClick, selectedFileCard]);


  const folderCards = useMemo(() => {
    return folderData.map((folder, index) => (
      <Col key={index}>
        {/* Folder cards using with useMemo */}
        {currentIcon === faList ? (
        <FolderCard
          folder={folder}
          handleMenuClick={handleMenuClick}
          openMenu={openMenu}
          handleMenuItemClick={handleMenuItemClick}
          handleCardClick={handleCardClick}
          isSelected={folder === selectedFileCard}
          handleClickFolder={handleClickFolder}
          setFolderHistory={setFolderHistory}
          style={{ flex: '0 0 20%', margin: '10px' }}
        />) : (
          <FolderLine
          folder={folder}
          handleMenuClick={handleMenuClick}
          openMenu={openMenu}
          handleMenuItemClick={handleMenuItemClick}
          handleCardClick={handleCardClick}
          isSelected={folder === selectedFileCard}
          handleClickFolder={handleClickFolder}
          setFolderHistory={setFolderHistory}
          style={{ flex: '0 0 20%', margin: '10px' }}   
          />
        )}
      </Col>

      
    ));
  }, [folderData, currentIcon, openMenu, handleMenuClick, handleMenuItemClick, handleCardClick, selectedFileCard]);


  const currentFilters = () => {
    {/* Method to query lining filters*/}
    var filterQuery = '';
    
    const checkIsNotNull = (myObj) => {
     return  (myObj !== null && myObj !== '' ? true : false);
    }

    if (checkIsNotNull(filterConfig.search)){
      filterQuery+=' Поиск по названию: '+filterConfig.search;
    }
    if (checkIsNotNull(filterConfig.uploadDateFrom)){
      filterQuery+=' Дата загрузки: '+filterConfig.uploadDateFrom;
      
      if(checkIsNotNull(filterConfig.uploadDateTo)){
        filterQuery+=' -- ' + filterConfig.uploadDateTo;
      }
      else
      {
        filterQuery+=' -- сегодня';
      }

    }
    if(checkIsNotNull(filterConfig.selectedFileType)){
      filterQuery+=' Выбранные типы файлов: '+filterConfig.selectedFileType;
    }

    return filterQuery !== '' ? "FILTERS: "+filterQuery : filterQuery;
  }

  const headerTitle = () => {
    {/* This method concat mostDepartment and currentFolder */}
    var result = ''
    result += userDepartment + " ";
    // Make folder listing
    //result += " " + (userFolder !== null ? userFolder.name.toUpperCase() : " ");
    return result;
  }

  const folderTitle = () => {
    {/* Method to make folder path */}
    if(folderHistory.length < 2){
      return;
    }

    return (
      <span>
       {folderHistory.map((folder, index) => (
        <span key={folder.id}>
          {index > 0 && <span> / </span>}
          <span onClick={() => navigateToFolder(folder)}>{folder.name}</span>
        </span>
      ))}
      </span>
    )
  }

  const handleBackFolder = () => {
    {/*This method to back to prev folder, use stack of folders */}
    console.log(folderHistory, folderHistory.length - 2);
    const topFolder = folderHistory[folderHistory.length - 2];
    console.log(topFolder, topFolder.id);
    handleClickFolder(topFolder);
    setFolderHistory((prevHistory) => prevHistory.slice(0, -1));
  }

  const navigateToFolder = (folder) => {
    const index = folderHistory.findIndex((f) => f.id === folder.id);

    if (index !== -1) {
      const newHistory = folderHistory.slice(0, index + 1);
      handleClickFolder(folder);
      setFolderHistory(newHistory);
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Container>
            <Card style={{outline:'none',border:'none', margin:'5px'}}>
              <Card.Body>
                <div style ={{ position:'absolute',right:'45px',top:'5px',color: infoButtonClicked ? 'lightblue' : 'black'}}> <FontAwesomeIcon icon={faInfoCircle} onClick={handleInfoClick} /> </div>
                <div style ={{ position:'absolute',right:'15px',top:'5px'}}> <FontAwesomeIcon icon={currentIcon} onClick={handleIconClick}/> </div>
                <div style ={{ position:'absolute',left:'15px',top:'5px'}}> <h5> {headerTitle()} {folderTitle()} {userFolder !== '' && userFolder !== null && <FontAwesomeIcon icon={faUndo} onClick={handleBackFolder} />}  </h5></div>
                <div style ={{ position:'absolute',right:'75px',top:'5px'}} onClick={handleSortClick} > {isAscending ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />}</div>
                <div style ={{ position:'absolute',right:'100px',top:'2px'}}><Button onClick={handleSortParamChange} size="sm" variant="outline-dark">{sortParam === 'name' ? 'name' : 'date'}</Button></div>
                
              </Card.Body>
                  <CreateFolder
                   parentFolderId={filterConfig.folder}
                   onCreate={(newFolder) => {
                    handleCloseCreateFolderForm();
                    handleUploadSuccess();
                  }}
                  />
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
        <h6>
        {currentFilters()}  
        {currentFilters() !== '' && (
          <FontAwesomeIcon
            icon={faXmark}
            onClick={clearFilters}
            style={{ cursor: 'pointer' }}
          />
        )}
        </h6>
        <Row className="" style={{ display: 'flex', flexWrap: 'wrap' }}>
          {folderCards}
          {fileCards}
        </Row>
      </Container>
    </div>
  );
}

export default FileContainer;
