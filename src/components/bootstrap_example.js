import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import the Bootstrap CSS
import { Button, Container, Row, Col } from 'react-bootstrap'; // Import required components from react-bootstrap

function Example() {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Hello, React Bootstrap!</h1>
          <p>This is a simple example of using Bootstrap in React.</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="primary">Primary Button</Button>
        </Col>
        <Col>
          <Button variant="secondary">Secondary Button</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Example;