import React, { useState,useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";

function CreateFolder({ parentFolderId, onCreate }) {
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage,setResponseMessage] = useState("");

  const handleCloseModal = () => {
    setShowModal(false);
    setFolderName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/users/folders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: folderName,
          parent: parentFolderId,
        }),
      });
  
      if (response.status === 201) {
        const newFolder = await response.json();
        onCreate(newFolder);
        handleCloseModal();
      } else {
        // Обработка ошибки с выводом ответа сервера
        const responseText = await response.text();
        console.error(`Failed to create folder. Server response: ${responseText}`);
        setResponseMessage(responseText);
      }
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  
    setIsLoading(false);
  };
  
  useEffect(() => {
    if (responseMessage) {
      alert(responseMessage);
      setResponseMessage("");
    }
  }, [responseMessage]);

  return (
    <>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Создать папку
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Создать папку</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="folderName">
              <Form.Label>Имя папки</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите имя папки"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Создание..." : "Создать"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateFolder;