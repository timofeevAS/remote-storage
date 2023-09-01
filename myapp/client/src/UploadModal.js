import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const UploadModal = ({ show, onHide, onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    onUpload(file);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Upload File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="fileInput">
            <Form.Label>Select File</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpload}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadModal;