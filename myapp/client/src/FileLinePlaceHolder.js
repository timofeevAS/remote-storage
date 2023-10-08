import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import React, {useState} from 'react';
import ContextMenu from "./ContextMenu";
import truncateText from './helpers/truncateText';
import { Placeholder } from 'react-bootstrap';

function FileLinePlaceHolder({ file, handleMenuClick, openMenu, handleMenuItemClick, handleCardClick, isSelected }) {

return (
    <div className="d-flex justify-content-around">
      <Card style={{
        width: '125px', 
    height: '30px', 
    borderRadius: '13px', 
    backgroundColor:"#f8f8fa", 
    marginBottom: '30px',
    userSelect: "auto",
    transition: "background-color 0.3s",
      }}>
        <Card.Body>
          <Placeholder as={Card.Title} animation="glow" className="d-flex flex-column align-items-center justify-content-center" style={{position:"absolute",bottom:"0.13em",width: '4em', height: '0.2em', }}>
            <Placeholder md={11} />
          </Placeholder>
          

        </Card.Body>
      </Card>
    </div>
  );
}

export default FileLinePlaceHolder;