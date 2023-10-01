import React, { useState,useEffect } from 'react';
import { Button, Offcanvas,Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil,faCheck,faDownload } from '@fortawesome/free-solid-svg-icons';



const FileDetailsCanvas = ({ file, setSelectedFile,setFileDetailsVisible, setInfoButtonState, handleUploadSuccess }) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(file ? file.name : "");
  const [fileMode, setFileMode] = useState(false);
  console.log(file);
  
  useEffect( () => {
    if(file && file.extension) {
      setFileMode(true);
    }
    else{
      setFileMode(false);
    }
  },[file])

  useEffect(() => {
    {/* Function for async request for get name*/}
    
    const fetchFileName = async () => {
      var fetchURL = "";
      if(file && file.extension){
        fetchURL = `http://127.0.0.1:8000/users/files/${file.id}/`
      }
      else {
        fetchURL = `http://127.0.0.1:8000/users/folders/${file.id}/`
      }
      try {
        const response = await fetch(fetchURL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          const responseData = await response.json();
          setEditedName((responseData.name));
        }
      } catch (error) {
        console.error("Error fetching file name:", error);
      }
    };


    
    if (file !== null && file !== -1) {
      // Call function if file not null
      fetchFileName();
    }
  }, [file]);


  const splitByLastDot = (text) => {
    var index = text.lastIndexOf('.');
    return text.slice(0, index);
  }

  const handleClose = () => {
    setShowOffcanvas(false);
    setInfoButtonState(false);
    setFileDetailsVisible(false);
    setSelectedFile(-1);
  }
  const handleShow = () => setShowOffcanvas(true);
  const handleEdit = () => setEditMode(true);

  const handleSave = async () => {
    // PUT FETCH 
    var fetchURL = "";
    var updatedFile = "";
    if(file && file.extension){
      updatedFile = { name: editedName + '.' + file.extension };
      fetchURL = `http://127.0.0.1:8000/users/files/${file.id}/`
    }
    else {
      updatedFile = { name: editedName};
      fetchURL = `http://127.0.0.1:8000/users/folders/${file.id}/`
    }
    
    const response = await fetch(fetchURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFile),
    });

    if (response.status === 200) {
      const responseData = await response.json();
      if(file && file.extension){
        setEditedName(splitByLastDot(responseData.name));
        file.name=splitByLastDot(responseData.name);
        setSelectedFile({...file, name: editedName});
      }
      else{
        setEditedName(responseData.name);
        file.name=responseData.name;
        setSelectedFile({...file, name: editedName});
      }
      
    }
    setEditMode(false);
    setInfoButtonState(true);
    //handleUploadSuccess()
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

  const capitalizeFirstLetter= (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const toLocalTime = (time) => {
    const utcDate = new Date(time);
    // Convert to localTime
    const localDate = utcDate.toLocaleString();
    return localDate;
  }


  
  useEffect(() => {
    if (file !== -1) {
      setShowOffcanvas(true);
    }
  }, [file]);

  const apiUrl='http://127.0.0.1:8000'

  return (
    <div>
      <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end" scroll={true} backdrop={false}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Информация о {file.extension ? "файле" : "папке"}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          
            {file === null || file === -1 ? (
              <p>Выберите файл\папку нажав на него</p>
            ) : (
              <>
                <h2>
                  Name:
                  {editMode ? (
                    <Form.Control
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                  ) : (
                    editedName 
                  )}
                  {/* Buttons for download and name editing */}
                  {editMode ? (
                    <Button variant="ligth" onClick={handleSave} style={{position:'relative', left:'5px',bottom:'0px'}}>
                      <FontAwesomeIcon icon={faCheck} size="sm" />
                    </Button>
                    ) : (
                    <Button variant="ligth" onClick={handleEdit} style={{position:'relative', left:'5px',bottom:'0px'}}>
                      <FontAwesomeIcon icon={faPencil} size="sm" />
                    </Button>
                  )}
                  {file && file.extension && 
                  <Button variant="ligth" href={apiUrl+file.url} download target="_blank" rel="noreferrer" style={{position:'relative', left:'200px',bottom:'290px'}}>
                    <FontAwesomeIcon icon={faDownload} size="sm" />
                  </Button>}
                </h2>
                {file !== null && file.extension && (
                  <>
                    <p>Extension: {file.extension}</p>
                    <p>Id: {file.id}</p>
                    <p>Size: {formatBytes(file.size)}</p>
                    <p>Task: {file.task != null ? file.task.name : "None"}</p>
                    
                  </>
                )}
                {/* General data for file and folder */}
                {file !== null && 
                  <>
                  <p>Owner: {capitalizeFirstLetter(file.owner.username)}</p>
                  <p>Date upload: {toLocalTime(file.created_at)}</p>
                  <h6>Любая инфо о файле, мб сюда пихнуть возможность его редачить</h6>
                  </>
                }
                
                
              </>
            )}
          
        </Offcanvas.Body>
      </Offcanvas>
      
    </div>
  );
}

export default FileDetailsCanvas;