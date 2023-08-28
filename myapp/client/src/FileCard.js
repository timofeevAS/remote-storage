import React, {useState, useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import { Card } from 'react-bootstrap';
import ContextMenu from "./ContextMenu";

function getColorByExtension(extension) {
  switch (extension) {
    case 'txt':
      return 'green';
    case 'pdf':
      return 'red';
    case 'jpg':
      return 'orange';
    case 'docx':
      return 'blue';
    default:
      return 'black';
  }
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.substring(0, maxLength) + "...";
  }
}


function FileCard({ file, handleMenuClick, openMenu, handleMenuItemClick, handleCardClick, isSelected }) {
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  
  const handleContextMenu = (event) => {
    event.preventDefault();

    // Get coords in page
    const posX = event.pageX;
    const posY = event.pageY;

    // Get coord FileCard
    const cardRect = event.currentTarget.getBoundingClientRect();
    const cardX = cardRect.left;
    const cardY = cardRect.top;

    // Calculate real coords
    const relativeX = posX - cardX;
    const relativeY = posY - cardY;

    // Set pos with offset
     setContextMenuPosition({ x: relativeX-150, y: relativeY-18 });
    // setContextMenuPosition({ x: relativeX, y: relativeY });
    // handleMenuClick
    handleMenuClick(file.id);
  };


  useEffect(() => {
    console.log("Mounted!");
  }, [])
  console.log('render');

  const handleClick = () => {
    handleCardClick(file);
    console.log(file.id);
  };

  const apiUrl = 'http://127.0.0.1:8000'
  return (
    
    <Card onContextMenu={handleContextMenu} onClick={handleClick} style=
    {{ 
      width: '180px', 
      height: '100px', 
      borderRadius: '13px', 
      backgroundColor: isSelected ? "lightblue" : "#f8f8fa", 
      marginBottom: '30px',
      userSelect: "auto"
     }}>
      <Card.Body className="d-flex flex-column align-items-center justify-content-center">
        <Card.Title style={{ fontSize: '20px', position: 'relative', top: '15px' }}>
          {truncateText(file.name,12)}
        </Card.Title>
        <Card.Link href={apiUrl+file.url} download target="_blank" rel="noreferrer" style={{ position: 'relative', top: '12px' }}>
          <FontAwesomeIcon icon={faDownload} className="DownloadIcon" size="lg"/>
        </Card.Link>
      </Card.Body>
      <Card.Link href='#' style={{ position: 'absolute', top: '13px', right: '15px' }}>
        <div style={{ position: "relative", display: "inline-block" }}>
            {openMenu === file.id && 
              <ContextMenu 
                handleMenuItemClick={handleMenuItemClick} 
                position={contextMenuPosition} 
          />}
          <div onClick={() => handleMenuClick(file.id)}>
            <FontAwesomeIcon icon={faInfoCircle} className="infoButton" size="xs" />
          </div>
        </div>
      </Card.Link>
      <Card.Text style={{ fontSize: '20px', position: 'absolute', top: '10px', left: '15px', fontWeight: 'bold', color: getColorByExtension(file.extension) }}>
        {file.extension.toUpperCase()}
      </Card.Text>
      
    </Card>
  );
}

export default React.memo(FileCard); 
