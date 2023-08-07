import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
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

  function FileLine({ file, handleMenuClick, openMenu, handleMenuItemClick }) {
    return (
        <Card style={{ width: '125px', height: '30px', borderRadius: '13px', backgroundColor: '#f8f8fa',marginBottom:'30px' }}>
        <Card.Body className="d-flex flex-column align-items-center justify-content-center">
          <Card.Title style={{ fontSize: '15px', position: 'absolute',left:"10px",top:"5px"}}>
            {file.name}
          </Card.Title>
        </Card.Body>
        <Card.Link href="#" style={{ position: 'absolute',right:"10px",top:"2px" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <div onClick={() => handleMenuClick(file.id)}>
            <FontAwesomeIcon icon={faInfoCircle} className="infoButton" size="md" />
          </div>
          {openMenu === file.id && <ContextMenu handleMenuItemClick={handleMenuItemClick} />}
        </div>
        </Card.Link>
      </Card>
      );
}

export default FileLine;