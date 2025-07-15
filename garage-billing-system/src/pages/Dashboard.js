import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <h2 className="mb-4">Garage Dashboard</h2>
      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Create Invoice</Card.Title>
              <Card.Text>Create and print a new customer invoice.</Card.Text>
              <Button variant="primary" onClick={() => navigate('/invoice')}>Go</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
            <Card className="shadow-sm">
                <Card.Body>
                <Card.Title>Manage</Card.Title>
                <Card.Text>View, add, or edit your parts stock or services.</Card.Text>
                <Button variant="secondary" onClick={() => navigate('/manage')}>Go</Button>
                </Card.Body>
            </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Past Invoices</Card.Title>
              <Card.Text>Search and view previous bills.</Card.Text>
              <Button variant="success" onClick={() => navigate('/history')}>Go</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Reports</Card.Title>
              <Card.Text>Daily and Monthly sales reports.</Card.Text>
              <Button variant="info" onClick={() => navigate('/reports')}>Go</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Manage Customers</Card.Title>
              <Card.Text>Add or remove customers for billing.</Card.Text>
              <Button variant="secondary" onClick={() => navigate('/customers')}>
                Go
              </Button>
            </Card.Body>
          </Card>
      </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
