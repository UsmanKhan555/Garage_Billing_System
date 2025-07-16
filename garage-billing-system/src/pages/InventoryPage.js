import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { updateDoc } from 'firebase/firestore';



const InventoryPage = () => {
  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ id: '', name: '', price: '', stock: '' });


  const inventoryRef = collection(db, 'inventory');

  // Fetch items from Firestore
  const fetchItems = async () => {
    const data = await getDocs(inventoryRef);
    setItems(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) return alert("Fill all fields");
    await addDoc(inventoryRef, {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      type: 'product',
    });
    setShowAddModal(false);
    setFormData({ name: '', price: '', stock: '' });
    fetchItems();
  };

  const handleDelete = async (id, name) => {
  const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
  if (!confirmDelete) return;

  await deleteDoc(doc(db, 'inventory', id));
  fetchItems();
};


  const openEditModal = (item) => {
  setEditData({
    id: item.id,
    name: item.name,
    price: item.price,
    stock: item.stock
  });
  setShowEditModal(true);
};

const handleUpdateItem = async (e) => {
  e.preventDefault();
  const itemRef = doc(db, 'inventory', editData.id);
  await updateDoc(itemRef, {
    name: editData.name,
    price: parseFloat(editData.price),
    stock: parseInt(editData.stock)
  });
  setShowEditModal(false);
  fetchItems();
};

  return (
    <Container>
      <h2 className="mb-4">Manage Inventory</h2>
      <Button variant="primary" className="mb-4" onClick={() => setShowAddModal(true)}>
        Add New Item
      </Button>

      <Row>
        {items.map(item => (
          <Col md={4} key={item.id} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>Price: AED {item.price}</Card.Text>
                <Card.Text>Stock: {item.stock}</Card.Text>
                <Button variant="danger" size="sm" onClick={() => handleDelete(item.id, item.name)}>
                  Delete
                </Button>
                <Button variant="warning" size="sm" className="ms-2" onClick={() => openEditModal(item)}>
                  Edit
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Inventory Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddItem}>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
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
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" variant="success">Add Item</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Inventory Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateItem}>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
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
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={editData.stock}
                onChange={e => setEditData({ ...editData, stock: e.target.value })}
              />
            </Form.Group>
            <Button type="submit" variant="success">Update Item</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default InventoryPage;