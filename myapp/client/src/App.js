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
  const [folderData, setFolderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State of loading data
  const [fetchConfig, setFetchConfig] = useState({
    department:null,
    search:null,
    uploadDateFrom:null,
    uploadDateTo:null,
    selectedFileType:null,
    folder:null,
    });
  const [infoButtonClicked, setInfoButtonState] = useState(false);
  const [currentSort, setCurrentSort] = useState({
    reverse:true,
    compare:'date'
  })
  const [needToClear, setNeedToClear] = useState(false);

  { /*Flag to check is mobile device*/ }
  const isMobile = window.innerWidth <= 768;
    
  { /*Output current fetch configuration*/ }
  //console.log('Current fetch config  ===>',fetchConfig);
  
  useEffect(() => {
    {/* Reset states */}
    setSelectedFile(-1);
    setFileDetailsVisible(false);
    setInfoButtonState(false);
  }, [fetchConfig]); 

  useEffect(() => {
    // Request for getting size of file list
    const queryString = Object.keys(fetchConfig)
      .filter(key => fetchConfig[key] !== null && fetchConfig[key] !== '')
      .map(key => `${key}=${fetchConfig[key]}`)
      .join('&');
  
    fetch(`http://127.0.0.1:8000/users/files/size/?${queryString}`)
      .then((response) => response.json())
      .then((data) => {
        const numberOfFiles = data.size;
        // Make placeholders array
        const placeholders = Array.from({ length: numberOfFiles }, () => null);
        console.log(numberOfFiles);
        setFileData(placeholders); 
        setIsLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching file count:", error);
      });
  }, [fetchConfig]);

  useEffect(() => {
    {/* Update fetch data, when fetchConfig edit */}
    fetchFileData();
  }, [fetchConfig]); 

  useEffect(() => {
    {/* Update data with sorting when sort config update */}
    handleSortFiles(currentSort,fileData);
  }, [currentSort]); 

  const handleClickFolder = (folder) => {
    {/* Method to handle double click on folder card and fetch new data */}
    console.log(folder);
    setFetchConfig({
      ...fetchConfig,
      folder:folder.id,
    })
    
  }


  const handleClearFilters = (maybeDepartment = null) => {
    {/* Method to clear filters */}
    setFetchConfig({
      ...fetchConfig,
      department:maybeDepartment,
      search:null,
      uploadDateFrom:null,
      uploadDateTo:null,
      selectedFileType:null,
    });
  };

  const clearFilters = () => {
    {/* Method to clear filters */}
    setFetchConfig({
      ...fetchConfig,
      search: null,
      uploadDateFrom: null,
      uploadDateTo: null,
      selectedFileType: null,
    });
    setNeedToClear(!needToClear);
  };

  const handleSortFiles = (sortParams, data) => {
    { /*Method to sorting file data*/ }
    //console.log('Sorting files... ===>',sortParams,data);
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
    //console.log('Sorted files:', sortedFileData);
  }

  const handleSelectedFile = (file) => {
    setSelectedFile(file);
    file === -1 ? setFileDetailsVisible(false) : setFileDetailsVisible(true);
  };




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
        // here we getting files from Server
        handleSortFiles(currentSort,data.files);
        setFolderData(data.folders);
      })
      .catch(error => console.error('Error fetching file data:', error));
  };
  

  const handleUploadSuccess = () => {
    {/* While data upload success -> fetching new data from API */}
    fetchFileData();
    var curDepartment = fetchConfig['department'];
    console.log(curDepartment);
    handleClearFilters(curDepartment);
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


  console.log(fileData);
  return (
    <>
      <TopNavbar 
      handleFilterSubmit={handleFilterSubmit} 
      selectedDepartment={fetchConfig.department} 
      initFilters={fetchConfig}
      needToClear={needToClear} 
      />
      <Container fluid>
        <Row>
          <Col xxl={2} >
          <SideBarMenu handleUploadSuccess={handleUploadSuccess} handleDepartment={(cur) => handleDepartment(cur)} folder={fetchConfig.folder} />
          </Col>
          <Col xxl={10} >
            {/* */}
            <div
              style={{
                marginLeft: fileDetailsVisible && !isMobile ? "-00px" : 0, // Negative margin when details opened
                transition: "margin-left 0.3s ease",
              }}
            >
              <FileContainer 
              
              handleSelectedFile={handleSelectedFile} 
              fileData={fileData}
              folderData={folderData} 
              setCurrentSort={(params)=>setCurrentSort(params)} 
              handleUploadSuccess={()=>handleUploadSuccess()}
              infoButtonClicked={infoButtonClicked}
              setInfoButtonState={setInfoButtonState}
              filterConfig={fetchConfig}
              clearFilters={clearFilters}
              handleClickFolder={handleClickFolder}
              />
              {/* Details of files if it has chosen  */}
              {fileDetailsVisible != false && (
                <>
                  {<FileDetailsCanvas file={selectedFile === null ? -1 : selectedFile} setFileDetailsVisible={setFileDetailsVisible} setSelectedFile={setSelectedFile} setInfoButtonState={setInfoButtonState} handleUploadSuccess={()=>handleUploadSuccess()}/>}
                </>
              )}
            </div>
          </Col>
          
        </Row>
      </Container>
    </>
  );}
          

export default App;
