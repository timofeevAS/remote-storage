import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import React, {useState, useEffect} from 'react';
import ContextMenu from "./ContextMenu";
import truncateText from './helpers/truncateText';

function FolderLine({ folder, handleMenuClick, openMenu, handleMenuItemClick, handleCardClick, isSelected, handleClickFolder, setFolderHistory}) {
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
      if (clickCount === 2) {
        // If double click call handler
        console.log('double clicked');
        handleClickFolder(folder);
        setFolderHistory((prevHistory) => [...prevHistory, folder]);
        setClickCount(0); // reset if double click
      }
    }, [clickCount, folder, handleClickFolder]);
  
    
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
      handleMenuClick(folder.id);
    };
  
    /*
    useEffect(() => {
      console.log("Mounted!");
    }, [])
    console.log('render');
    */
    
    const handleClick = () => {
      handleCardClick(folder);
      console.log(folder.id);
      // Increment counter when clicked
      setClickCount((prevCount) => prevCount + 1);
  
      // Timer to reset counter
      setTimeout(() => {
        setClickCount(0);
      }, 300);
    };
  
const apiUrl = 'http://127.0.0.1:8000'
return (
  <Card onContextMenu={handleContextMenu} onClick={handleClick} style=
  {{ 
    width: '125px', 
    height: '30px', 
    borderRadius: '13px', 
    backgroundColor: isSelected ? "gold" : "lightyellow", 
    marginBottom: '30px',
    userSelect: "auto",
    transition: "background-color 0.3s",
    }}>
    <Card.Body className="d-flex flex-column align-items-center justify-content-center">
      <Card.Title style={{ fontSize: '15px', position: 'absolute',left:"10px",top:"5px" }}>
        {truncateText(folder.name,11)}
      </Card.Title>
    </Card.Body>
    <Card.Link href='#' style={{ position: 'absolute', top: '13px', right: '15px' }}>
      <div style={{ position: "relative", display: "inline-block" }}>
          {folder.id-1 === folder.id && 
            <ContextMenu 
              handleMenuItemClick={handleMenuItemClick} 
              position={contextMenuPosition} 
        />}
        <div onClick={() => handleMenuClick(folder.id)}>
          
        </div>
      </div>
    </Card.Link>
    
  </Card>
);
}

export default FolderLine;