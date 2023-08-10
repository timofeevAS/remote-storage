import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Nav, Navbar } from "react-bootstrap";
import UploadForm from "./UploadForm";

const SideBarMenu = ({ handleUploadSuccess }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleUploadClick = () => {
    setShowUploadForm(true);
  };

  const closeUploadForm = () => {
    setShowUploadForm(false);
  };

  return (
    <Nav defaultActiveKey="/home" className="flex-column">
      <Button
        variant="success"
        size="lg"
        style={{margin:"5px",width:"150px"}}
        onClick={handleUploadClick}
      >
        <FontAwesomeIcon icon={faDownload} className="DeleteButton" /> Upload
      </Button>
      {showUploadForm && <UploadForm onClose={closeUploadForm} handleUploadSuccess={handleUploadSuccess} />}
      
      <div className="mb-2" style={{margin:"5px", width: "200px", height: "30px"}}>
      <h6>Разделы, задачи хранятся тут</h6>
        <Button variant="outline-dark" size="sm" className="d-block mb-2" style={{border: "none",   width: "200px", height: "30px", textAlign: "left"}}><FontAwesomeIcon icon={faDownload} className="DeleteButton" /> IT-Department </Button>
        <Button variant="outline-dark" size="sm" className="d-block mb-2" style={{border: "none",width: "200px", height: "30px", textAlign: "left"}}><FontAwesomeIcon icon={faDownload} className="DeleteButton" /> Marketing</Button>
        <Button variant="outline-dark" size="sm" className="d-block mb-2" style={{border: "none",width: "200px", height: "30px",textAlign: "left"}}><FontAwesomeIcon icon={faDownload} className="DeleteButton" /> HR</Button>
        <Button variant="outline-dark" size="sm" className="d-block mb-2" style={{border: "none",width: "200px", height: "30px",textAlign: "left"}}><FontAwesomeIcon icon={faDownload} className="DeleteButton" /> News</Button>
        <Button variant="outline-dark" size="sm" className="d-block mb-2" style={{border: "none",width: "200px", height: "30px",textAlign: "left"}}><FontAwesomeIcon icon={faDownload} className="DeleteButton" /> Cats</Button>
        
        {/* Another departments */}
      </div>
    </Nav>
  );
};

export default SideBarMenu;


