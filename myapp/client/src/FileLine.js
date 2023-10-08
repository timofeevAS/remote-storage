import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import React, {useState} from 'react';
import ContextMenu from "./ContextMenu";
import truncateText from './helpers/truncateText';
import FileLinePlaceHolder from './FileLinePlaceHolder';

function FileLine({ file, handleMenuClick, openMenu, handleMenuItemClick, handleCardClick, isSelected }) {
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  
  if(!file){
    return (
      <FileLinePlaceHolder />
    );
  }

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


const handleClick = () => {
  handleCardClick(file);
  console.log(file.id);
};
const apiUrl = 'http://127.0.0.1:8000'
return (
  <Card onContextMenu={handleContextMenu} onClick={handleClick} style=
  {{ 
    width: '125px', 
    height: '30px', 
    borderRadius: '13px', 
    backgroundColor: isSelected ? "lightblue" : "#f8f8fa", 
    marginBottom: '30px',
    userSelect: "auto",
    transition: "background-color 0.3s",
    }}>
    <Card.Body className="d-flex flex-column align-items-center justify-content-center">
      <Card.Title style={{ fontSize: '15px', position: 'absolute',left:"10px",top:"5px" }}>
        {truncateText(file.name,11)}
      </Card.Title>
      <Card.Link href={apiUrl+file.url} download target="_blank" rel="noreferrer" style={{ position: 'absolute',right:"10px",top:"2px" }}>
        <FontAwesomeIcon icon={faDownload} className="DownloadIcon" size="xs"/>
      </Card.Link>
    </Card.Body>
    <Card.Link href='#' style={{ position: 'absolute', top: '13px', right: '15px' }}>
      <div style={{ position: "relative", display: "inline-block" }}>
          {file.id-1 === file.id && 
            <ContextMenu 
              handleMenuItemClick={handleMenuItemClick} 
              position={contextMenuPosition} 
        />}
        <div onClick={() => handleMenuClick(file.id)}>
          
        </div>
      </div>
    </Card.Link>
    
  </Card>
);
}

export default FileLine;