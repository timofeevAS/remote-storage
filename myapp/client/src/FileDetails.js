import React from "react";
import { Navbar} from 'react-bootstrap';


const FileDetails = ({ file }) => {
    return (
      <div className="border p-3" 
      style= {{
        backgroundColor:"#f8f8f9",
        position: "fixed",
        top: "60px",
        right:"0",
        height: "100%",
        width: "300px",
        backgroundColor: "#f8f8f8",
        overflowY: "auto",
        transition: "transform 0.3s ease",
        zIndex: "1000"
        }}>
        <Navbar expand="lg" style= {{backgroundColor:"#f8f8f9", outlineColor:"black"}}>
          <Navbar.Brand>File Details</Navbar.Brand>
        </Navbar>
        <div style= {{backgroundColor:"#f8f8f9"}}>
          <h2>Name: {file.name}</h2>
          <p>Extension: {file.extension}</p>
          <p>Id: {file.id}</p>
          <p>Size: {file.size}</p>
          <h6>Любая инфо о файле, мб сюда пихнуть возможность его редачить</h6>
        </div>
      </div>
    );
  };

export default FileDetails;