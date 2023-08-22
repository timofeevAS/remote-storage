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

  const handleSelectedFile = (file) => {
    setSelectedFile(file);
    file === -1 ? setFileDetailsVisible(false) : setFileDetailsVisible(true);
    console.log('APP.JS: ',selectedFile,fileDetailsVisible);
  };

  useEffect(() => {
    {/* Update fetch data, when fetchConfig edit */}
    fetchFileData();
  }, [fetchConfig]); 

  const fetchFileData = () => {
    const queryString = Object.keys(fetchConfig)
      .filter(key => (fetchConfig[key] !== null && fetchConfig[key] !== '') )
      .map(key => `${key}=${fetchConfig[key]}`)
      .join("&");
  
    const apiUrl = `http://127.0.0.1:8000/users/files/?${queryString}`;
  
    console.log("API URL:", apiUrl); // Output url with fetch config
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched data:", data); // fetched data
        setFileData(data);
      })
      .catch(error => console.error("Error fetching file data:", error));
  };
  

  const handleUploadSuccess = () => {
    {/* While data upload success -> fetching new data from API */}
    fetchFileData();
  }

  const handleSearch = async (searchQuery) => {
    {/* Function to edit fetch config for search request */}
    console.log('Search query is: ', searchQuery);
    setFetchConfig({ ...fetchConfig, search: searchQuery });
  };

  const handleFilterSubmit = async (filterConfig) => {
    {/* Function to edit fetch config when user add filters */}
    console.log('Filters is: ', filterConfig);
    setFetchConfig({ ...fetchConfig, 
      ...filterConfig
    });
  };

  return (
    <>
      <TopNavbar handleSearch={handleSearch} handleFilterSubmit={handleFilterSubmit}/>
      <Container fluid>
        <Row>
          <Col md={2} className=''>
          <SideBarMenu handleUploadSuccess={handleUploadSuccess} setFetchConfig={setFetchConfig} />
          </Col>
          <Col md={10}>
            {/* */}
            <div
              style={{
                marginLeft: fileDetailsVisible ? "-500px" : 0, // Negative margin when details opened
                transition: "margin-left 0.3s ease",
              }}
            >
              <FileContainer handleSelectedFile={handleSelectedFile} fileData={fileData} handleUploadSuccess={()=>handleUploadSuccess()}/>
              {/* Details of files if it has chosen  */}
              {fileDetailsVisible != false && (
                <Col md={3} >
                  {<FileDetailsCanvas file={selectedFile} />}
                </Col>
              )}
            </div>
          </Col>
          
        </Row>
      </Container>
    </>
  );}
          

export default App;
