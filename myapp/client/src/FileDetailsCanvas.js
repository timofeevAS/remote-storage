import React, { useState,useEffect } from 'react';
import { Button, Offcanvas,Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil,faCheck,faDownload } from '@fortawesome/free-solid-svg-icons';



const FileDetailsCanvas = ({ file, setSelectedFile,setFileDetailsVisible, setInfoButtonState, handleUploadSuccess }) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(file ? file.name : "");
  
  useEffect(() => {
    {/* Function for async request for get name*/}
    const fetchFileName = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/files/${file.id}/`, {
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
      // Вызовем функцию для получения имени только если файл существует
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
    const updatedFile = { name: editedName + '.' + file.extension };
    const response = await fetch(`http://127.0.0.1:8000/users/files/${file.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFile),
    });

    if (response.status === 200) {
      const responseData = await response.json();
      setEditedName(splitByLastDot(responseData.name));
      file.name=splitByLastDot(responseData.name);
      setSelectedFile({...file, name: editedName});
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
          <Offcanvas.Title>Информация о файле</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div style={{ backgroundColor: "#f8f8f9" }}>
            {file === null || file === -1 ? (
              <p>Выберите файл нажав на него</p>
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
                </h2>
                <p>Extension: {file.extension}</p>
		            <p>Id: {file.id}</p>
                <p>Size: {formatBytes(file.size)}</p>
                <p>Task: {file.task != null ? file.task.name : "None"}</p>
                <p>Owner: {capitalizeFirstLetter(file.owner.username)}</p>
                <p>Date upload: {toLocalTime(file.created_at)}</p>
                <h6>Любая инфо о файле, мб сюда пихнуть возможность его редачить</h6>
                {/* Остальной контент */}
                {editMode ? (
                  <Button variant="ligth" onClick={handleSave} style={{position:'relative', left:'320px',bottom:'330px'}}>
                    <FontAwesomeIcon icon={faCheck} size="sm" />
                  </Button>
                ) : (
                  <Button variant="ligth" onClick={handleEdit} style={{position:'relative', left:'320px',bottom:'290px'}}>
                    <FontAwesomeIcon icon={faPencil} size="sm" />
                  </Button>
                )}
                <Button variant="ligth" href={apiUrl+file.url} download target="_blank" rel="noreferrer" style={{position:'relative', left:'200px',bottom:'290px'}}>
                  <FontAwesomeIcon icon={faDownload} size="sm" />
                </Button>
              </>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      
    </div>
  );
}

export default FileDetailsCanvas;