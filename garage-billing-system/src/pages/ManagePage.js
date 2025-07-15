import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const ManagePage = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <h2 className="mb-4">Manage Inventory & Services</h2>
      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Manage Inventory</Card.Title>
              <Card.Text>View, add, or update spare parts in stock.</Card.Text>
              <Button variant="primary" onClick={() => navigate('/inventory')}>Go</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Manage Services</Card.Title>
              <Card.Text>Update or create garage labor services.</Card.Text>
              <Button variant="primary" onClick={() => navigate('/services')}>Go</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ManagePage;
