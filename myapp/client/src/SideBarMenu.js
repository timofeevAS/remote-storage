import React from "react";
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import { Nav } from "react-bootstrap";
// import styled from "styled-components";


const SideBarMenu = () => {
  return (
    <Nav defaultActiveKey="/home" className="flex-column">
      <Button variant="success" size="lg" style={{margin:"5px",width:"150px"}}><FontAwesomeIcon icon={faDownload} className="DeleteButton" /> Upload</Button>{' '}
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