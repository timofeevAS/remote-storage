import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const FileUploadForm = () => {

  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();

    if (fileName.trim() === '') {
      formData.append('name', selectedFile.name);
    } else {
      formData.append('name', fileName);
    }

    formData.append('file', selectedFile);

    // Отправка запроса на сервер
    fetch('http://localhost:8000/users/files/', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('File uploaded:', data);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

return (
    <Container style={{ maxWidth: '20%' }}>
      <Form className="d-flex flex-column bd-highlight mb-3">
        <Form.Group controlId="formFileName">
          <Form.Label>Название файла</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите название файла"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formFileType">
          <Form.Label>Тип файла</Form.Label>
          <Form.Select as="select">
            <option>Публичный файл</option>
            <option>Скрытый файл</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="formFileUpload">
          <Form.Label>Выберите файл для загрузки</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>

        <Button variant="primary" type="submit" onClick={handleFormSubmit}>
          Загрузить
        </Button>
      </Form>
    </Container>
  );
};

export default FileUploadForm;