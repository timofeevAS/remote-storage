import React, { useState,useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import TopNavbar from './TopNavbar';
import SideBarMenu from './SideBarMenu';
import FileContainer from './FileContainer';
import FileDetailsCanvas from "./FileDetailsCanvas";
import FileDetails from './FileDetails'; // Import the FileDetails component here
import { filter } from "lodash";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDetailsVisible, setFileDetailsVisible] = useState(false); // Currency state of fileDetails
  const [fileData, setFileData] = useState([]);
  const [fetchConfig, setFetchConfig] = useState({
    department:null,
    search:null,
    uploadDateFrom:null,
    uploadDateTo:null,
    selectedFileType:null,
    });
  const [infoButtonClicked, setInfoButtonState] = useState(false);
  const [currentSort, setCurrentSort] = useState({
    reverse:true,
    compare:'date'
  })

  { /*Flag to check is mobile device*/ }
  const isMobile = window.innerWidth <= 768;
    
  { /*Output current fetch configuration*/ }
  console.log('Current fetch config  ===>',fetchConfig);
  

  const handleClearFilters = () => {
    {/* Method to clear filters */}
    setFetchConfig({
      department: null,
      search: null,
      uploadDateFrom: null,
      uploadDateTo: null,
      selectedFileType: null,
    });
  };

  const handleSortFiles = (sortParams, data) => {
    { /*Method to sorting file data*/ }
    console.log('Sorting files... ===>',sortParams,data);
    const sortedFileData = [...data].sort((a, b) => {
      if(sortParams.compare === 'name'){
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if(sortParams.compare === 'date'){
        const dateA = a.created_at.toLowerCase();
        const dateB = b.created_at.toLowerCase();
        return dateA.localeCompare(dateB);
      }
    });

    if (sortParams.reverse) {
      sortedFileData.reverse();
    } 

    setFileData(sortedFileData);
    setCurrentSort(sortParams);
    console.log('Sorted files:', sortedFileData);
  }

  const handleSelectedFile = (file) => {
    setSelectedFile(file);
    file === -1 ? setFileDetailsVisible(false) : setFileDetailsVisible(true);
  };

  useEffect(() => {
    {/* Update fetch data, when fetchConfig edit */}
    fetchFileData();
  }, [fetchConfig]); 

  useEffect(() => {
    {/* Update data with sorting when sort config update */}
    handleSortFiles(currentSort,fileData);
  }, [currentSort]); 


  const fetchFileData = () => {
    const queryString = Object.keys(fetchConfig)
      .filter(key => fetchConfig[key] !== null && fetchConfig[key] !== '')
      .map(key => `${key}=${fetchConfig[key]}`)
      .join('&');
  
    const apiUrl = `http://127.0.0.1:8000/users/files/?${queryString}`;
  
    console.log('API URL:', apiUrl);
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // console.log('Fetched data:', data);
        handleSortFiles(currentSort,data);  
      })
      .catch(error => console.error('Error fetching file data:', error));
  };
  

  const handleUploadSuccess = () => {
    {/* While data upload success -> fetching new data from API */}
    fetchFileData();
    handleClearFilters();
  }



  const handleFilterSubmit =  (filterConfig) => {
    {/* Function to edit fetch config when user add filters */}
    setFetchConfig({ 
      ...fetchConfig, 
      ...filterConfig
    });
  };

  const handleDepartment =  (curDepartment) => {
    {/* Function to catch department from SideBarMenu */} 
    setFetchConfig({...fetchConfig,
       department: curDepartment
      });
  }

  return (
    <>
      <TopNavbar handleFilterSubmit={handleFilterSubmit} selectedDepartment={fetchConfig.department}/>
      <Container fluid>
        <Row>
          <Col md={2} className=''>
          <SideBarMenu handleUploadSuccess={handleUploadSuccess} handleDepartment={(cur) => handleDepartment(cur)} />
          </Col>
          <Col md={10}>
            {/* */}
            <div
              style={{
                marginLeft: fileDetailsVisible && !isMobile ? "-500px" : 0, // Negative margin when details opened
                transition: "margin-left 0.3s ease",
              }}
            >
              <FileContainer 
              handleSelectedFile={handleSelectedFile} 
              fileData={fileData} 
              setCurrentSort={(params)=>setCurrentSort(params)} 
              handleUploadSuccess={()=>handleUploadSuccess()}
              infoButtonClicked={infoButtonClicked}
              setInfoButtonState={setInfoButtonState}/>
              {/* Details of files if it has chosen  */}
              {fileDetailsVisible != false && (
                <Col md={3} >
                  {<FileDetailsCanvas file={selectedFile} setFileDetailsVisible={setFileDetailsVisible} setInfoButtonState={setInfoButtonState}/>}
                </Col>
              )}
            </div>
          </Col>
          
        </Row>
      </Container>
    </>
  );}
          

export default App;
