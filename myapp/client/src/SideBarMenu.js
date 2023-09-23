import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Nav } from "react-bootstrap";
import UploadForm from "./UploadForm";

const SideBarMenu = ({ handleUploadSuccess, handleDepartment }) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [activeDepartment, setActiveDepartment] = useState('All');
  const allDep = {name:'All'};

  useEffect(() => {
    // Fetch departments when the component mounts
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/users/files/departments");
      const data = await response.json();
      const departmentsWithAll = [{ name: 'All' },...data];
      setDepartments(departmentsWithAll);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleUploadClick = () => {
    setShowUploadForm(!showUploadForm);
  };

  const closeUploadForm = () => {
    setShowUploadForm(false);
  };

  const handleDepartmentChange = (selectedDepartment) => {
    {/* Handle to control selected department, if it double selected -> disable it */}
    console.log(selectedDepartment);
    if(selectedDepartment.name==='All'){
      setActiveDepartment('All');
      handleDepartment(null);
      return;
    }
    
    if(activeDepartment === selectedDepartment.name){
      setActiveDepartment('All');
      handleDepartment(null);
    }
    else{
      setActiveDepartment(selectedDepartment.name);
      handleDepartment(selectedDepartment.name);
    } 
  }
  
  const cureentDepId = () => {
    for (const dep of departments){
      if (dep.name==activeDepartment){
        return dep
      }
    }
    return {name:'All'}
  }

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
      {showUploadForm && 
      <UploadForm 
        onClose={closeUploadForm} 
        handleUploadSuccess={handleUploadSuccess} 
        dep={cureentDepId()}
      />}
      
      
      <h6>Разделы, задачи хранятся тут</h6>
        {departments.map((department, index) => (
          <Button
            key={index}
            variant={activeDepartment === department.name ? "primary" : "outline-dark"}
            size="sm"
            className="d-block mb-2"
            style={{border: "none",   width: "200px", height: "30px", textAlign: "left"}}
            onClick={() => handleDepartmentChange(department)}
          >
            <FontAwesomeIcon icon={faDownload}/>
            {department.name.toUpperCase()}
            
          </Button>
        ))}
        
        {/* Another departments */}
     
    </Nav>
  );
};

export default SideBarMenu;


