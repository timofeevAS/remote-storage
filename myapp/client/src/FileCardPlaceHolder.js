import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import { Card } from 'react-bootstrap';
import Placeholder from 'react-bootstrap/Placeholder';


const FileCardPlaceHolder = () => {

    return (
        <div className="d-flex justify-content-around">
          <Card style={{
            width: '180px',
            height: '100px',
            borderRadius: '13px',
            backgroundColor: "#f8f8fa",
            marginBottom: '30px',
            userSelect: "auto",
            transition: "background-color 0.3s",
          }}>
            <Card.Body>
              <Placeholder as={Card.Title} animation="glow" className="d-flex flex-column align-items-center justify-content-center" style={{position:"relative",top:"1.5em"}}>
                <Placeholder md={10} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow" style={{position:"relative",bottom:"2.2em"}} >
                <Placeholder md={3} bg="secondary"/>
              </Placeholder>
    
            </Card.Body>
          </Card>
        </div>
      );
}

export default FileCardPlaceHolder; 
