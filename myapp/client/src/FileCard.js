import React, {useState} from "react";
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

function FileCard({ file, handleMenuClick, openMenu, handleMenuItemClick }) {
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  
  const handleContextMenu = (event) => {
    event.preventDefault();

    // Получаем координаты клика относительно окна браузера
    const posX = event.pageX;
    const posY = event.pageY;

    // Получаем координаты карточки FileCard относительно окна браузера
    const cardRect = event.currentTarget.getBoundingClientRect();
    const cardX = cardRect.left;
    const cardY = cardRect.top;

    // Вычисляем относительные координаты клика относительно карточки FileCard
    const relativeX = posX - cardX;
    const relativeY = posY - cardY;

    // Устанавливаем позицию контекстного меню
    setContextMenuPosition({ x: relativeX-150, y: relativeY-18 });

    // Вызываем обработчик клика по меню
    handleMenuClick(file.id);
  };


  return (
    
    <Card onContextMenu={handleContextMenu} style={{ width: '180px', height: '100px', borderRadius: '13px', backgroundColor: '#f8f8fa', marginBottom: '30px' }}>
      <Card.Body className="d-flex flex-column align-items-center justify-content-center">
        <Card.Title style={{ fontSize: '25px', position: 'relative', top: '15px' }}>
          {file.name}
        </Card.Title>
        <Card.Link href="#" download target="_blank" rel="noreferrer" style={{ position: 'relative', top: '12px' }}>
          <FontAwesomeIcon icon={faDownload} className="DownloadIcon" size="lg"/>
        </Card.Link>
      </Card.Body>
      <Card.Link href="#" style={{ position: 'absolute', top: '13px', right: '15px' }}>
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

export default FileCard;
