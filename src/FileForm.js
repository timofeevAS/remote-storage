import React from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const FileUploadForm = () => {
  return (
    <Container style={{ maxWidth: '20%' }}>
      <Form className="d-flex flex-column bd-highlight mb-3">
        <Form.Group controlId="formFileName">
          <Form.Label>Название файла</Form.Label>
          <Form.Control type="text" placeholder="Введите название файла" />
        </Form.Group>

        <Form.Group controlId="formFileType">
          <Form.Label>Тип файла</Form.Label>
          <Form.Control as="select">
            <option>Публичный файл</option>
            <option>Скрытый файл</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formFileUpload">
          <Form.Label>Выберите файл для загрузки</Form.Label>
          <Form.Control type="file" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Загрузить
        </Button>
      </Form>
    </Container>
  );
};

export default FileUploadForm;