import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [newName, setNewName] = useState('');
  const [newTRN, setNewTRN] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ id: '', name: '', trn: '' });

  const customersRef = collection(db, 'customers');

  const fetchCustomers = async () => {
    const data = await getDocs(customersRef);
    setCustomers(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName || !newTRN) return alert("Enter name and TRN");
    await addDoc(customersRef, { name: newName, trn: newTRN });
    setNewName('');
    setNewTRN('');
    fetchCustomers();
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Delete customer "${name}"?`);
    if (!confirmDelete) return;
    await deleteDoc(doc(db, 'customers', id));
    fetchCustomers();
  };

  const openEditModal = (customer) => {
    setEditData({ id: customer.id, name: customer.name, trn: customer.trn });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const customerRef = doc(db, 'customers', editData.id);
    await updateDoc(customerRef, {
      name: editData.name,
      trn: editData.trn
    });
    setShowEditModal(false);
    fetchCustomers();
  };

  return (
    <Container>
      <h2 className="mb-4">Manage Customers</h2>

      <Form className="mb-3" onSubmit={handleAdd}>
        <Row>
          <Col md={4}>
            <Form.Control
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Customer name"
            />
          </Col>
          <Col md={4}>
            <Form.Control
              value={newTRN}
              onChange={(e) => setNewTRN(e.target.value)}
              placeholder="Customer TRN"
            />
          </Col>
          <Col md={4}>
            <Button type="submit" variant="primary" className="w-100">
              Add Customer
            </Button>
          </Col>
        </Row>
      </Form>

      <Row>
        {customers.map(c => (
          <Col md={4} key={c.id} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{c.name}</Card.Title>
                <Card.Text>TRN: {c.trn}</Card.Text>
                <Button size="sm" variant="warning" className="me-2" onClick={() => openEditModal(c)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(c.id, c.name)}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Customer TRN</Form.Label>
              <Form.Control
                type="text"
                value={editData.trn}
                onChange={(e) => setEditData({ ...editData, trn: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" variant="success">
              Update Customer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CustomerPage;
