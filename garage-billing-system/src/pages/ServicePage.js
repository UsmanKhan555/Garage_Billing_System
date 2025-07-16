import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';

const ServicePage = () => {
  const [services, setServices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [editData, setEditData] = useState({ id: '', name: '', price: '' });

  const servicesRef = collection(db, 'services');

  const fetchServices = async () => {
    const data = await getDocs(servicesRef);
    setServices(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchServices();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return alert("Fill all fields");
    await addDoc(servicesRef, {
      name: formData.name,
      price: parseFloat(formData.price),
      type: 'service',
      createdAt: new Date()
    });
    setShowAddModal(false);
    setFormData({ name: '', price: '' });
    fetchServices();
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
    if (!confirmDelete) return;
    await deleteDoc(doc(db, 'services', id));
    fetchServices();
  };

  const openEditModal = (item) => {
    setEditData({
      id: item.id,
      name: item.name,
      price: item.price
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const itemRef = doc(db, 'services', editData.id);
    await updateDoc(itemRef, {
      name: editData.name,
      price: parseFloat(editData.price)
    });
    setShowEditModal(false);
    fetchServices();
  };

  return (
    <Container>
      <h2 className="mb-4">Manage Services</h2>
      <Button variant="primary" className="mb-4" onClick={() => setShowAddModal(true)}>
        Add New Service
      </Button>

      <Row>
        {services.map(service => (
          <Col md={4} key={service.id} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{service.name}</Card.Title>
                <Card.Text>Price: AED {service.price}</Card.Text>
                <Button variant="danger" size="sm" onClick={() => handleDelete(service.id, service.name)}>
                  Delete
                </Button>
                <Button variant="warning" size="sm" className="ms-2" onClick={() => openEditModal(service)}>
                  Edit
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdd}>
            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price (AED)</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" variant="success">Add Service</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                type="text"
                value={editData.name}
                onChange={e => setEditData({ ...editData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price (AED)</Form.Label>
              <Form.Control
                type="number"
                value={editData.price}
                onChange={e => setEditData({ ...editData, price: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" variant="success">Update Service</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ServicePage;
