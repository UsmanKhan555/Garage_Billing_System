import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Najmat Alsahra Garage
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/manage">Inventory</Nav.Link>
            <Nav.Link as={Link} to="/services">Services</Nav.Link>
            <Nav.Link as={Link} to="/customers">Customers</Nav.Link>
            <Nav.Link as={Link} to="/past-invoices">Past Invoices</Nav.Link>
            <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
