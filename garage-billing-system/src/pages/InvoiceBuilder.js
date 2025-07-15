import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';



const InvoiceBuilder = () => {
  const [inventory, setInventory] = useState([]);
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerTRN, setCustomerTRN] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [invoiceNo, setInvoiceNo] = useState(Date.now());
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      const invSnap = await getDocs(collection(db, 'inventory'));
      const servSnap = await getDocs(collection(db, 'services'));
      const custSnap = await getDocs(collection(db, 'customers'));
      setInventory(invSnap.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'product' })));
      setServices(servSnap.docs.map(doc => ({ ...doc.data(), id: doc.id, type: 'service' })));
      setCustomers(custSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchData();
  }, []);

  const handleAddItem = (item, qty) => {
    const quantityNum = parseInt(qty);
    if (!quantityNum || quantityNum <= 0) return;

    const existing = invoiceItems.find(i => i.id === item.id && i.type === item.type);
    if (existing) {
      setInvoiceItems(prev =>
        prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantityNum } : i
        )
      );
    } else {
      setInvoiceItems(prev => [...prev, { ...item, quantity: quantityNum }]);
    }
  };

  const handleRemoveItem = (id) => {
    setInvoiceItems(prev => prev.filter(i => i.id !== id));
  };

  const calculateTotal = () => {
    return invoiceItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const VAT = 0.05;
  const subtotal = calculateTotal();
  const vatAmount = subtotal * VAT;
  const grandTotal = subtotal + vatAmount;

  const handleAddSelectedItem = () => {
    if (!selectedItemId || !quantity) return;

    const parts = selectedItemId.split('-');
    const type = parts[0];
    const id = parts[1];

    const list = type === 'product' ? inventory : services;
    const selected = list.find(i => i.id === id);

    handleAddItem(selected, quantity);
    setSelectedItemId('');
    setQuantity('');
  };

  const handleSaveInvoice = async (shouldPrint) => {
  if (invoiceItems.length === 0) return alert("Add items first!");
  if (!selectedCustomerId) return alert("Select a customer!");

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    
  const docRef = await addDoc(collection(db, 'invoices'), {
  invoiceNo,
  customerName: selectedCustomer ? selectedCustomer.name : '',
  customerTRN,
  paymentMethod, // ✅ added
  items: invoiceItems,
  subtotal,
  vatAmount,
  grandTotal,
  createdAt: new Date()
});

  alert("Invoice saved!");

  // Reset form
  setInvoiceItems([]);
  setSelectedCustomerId('');
  setCustomerTRN('');
  setInvoiceNo(Date.now());

  if (shouldPrint) {
    navigate(`/invoice/${docRef.id}/print`);
  }
};

  // Combine inventory and services for dropdown
  const combinedOptions = inventory.map(function(item) {
    return {
      value: 'product-' + item.id,
      label: '🛠️ ' + item.name + ' (AED ' + item.price + ')'
    };
  }).concat(services.map(function(service) {
    return {
      value: 'service-' + service.id,
      label: '⚙️ ' + service.name + ' (AED ' + service.price + ')'
    };
  }));

  return (
    <Container>
      <h2 className="mb-4">Create Invoice</h2>

      <Form className="mb-4">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Select Customer</Form.Label>
              <Select
                value={customers.find(c => c.id === selectedCustomerId) ? {
                  value: selectedCustomerId,
                  label: customers.find(c => c.id === selectedCustomerId).name
                } : null}
                onChange={(selected) => {
                setSelectedCustomerId(selected.value);
                const selectedCustomer = customers.find(c => c.id === selected.value);
                if (selectedCustomer) {
                    setCustomerTRN(selectedCustomer.trn);
                }
                }}
                options={customers.map(c => ({ value: c.id, label: c.name }))}
                placeholder="Select Customer..."
                isSearchable
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Customer TRN (optional)</Form.Label>
              <Form.Control
                value={customerTRN}
                onChange={(e) => setCustomerTRN(e.target.value)}
                placeholder="e.g. 100123456000003"
              />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Payment Method</Form.Label>
                    <Form.Select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="">-- Select Payment Method --</option>
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="Cheque">Cheque</option>
                    </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="align-items-end">
          <Col md={5}>
            <Form.Group>
              <Form.Label>Select Item or Service</Form.Label>
              <Select
                value={combinedOptions.find(opt => opt.value === selectedItemId) || null}
                onChange={(selected) => setSelectedItemId(selected.value)}
                options={combinedOptions}
                placeholder="Select Item or Service..."
                isSearchable
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Qty"
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Button className="w-100" variant="primary" onClick={handleAddSelectedItem}>
              Add
            </Button>
          </Col>
        </Row>
      </Form>

      <h4 className="mt-4">Invoice Items</h4>
      <Table bordered>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
              <td>{item.quantity * item.price}</td>
              <td>
                <Button size="sm" variant="danger" onClick={() => handleRemoveItem(item.id)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="mt-3">
        <p><strong>Subtotal:</strong> AED {subtotal.toFixed(2)}</p>
        <p><strong>VAT 5%:</strong> AED {vatAmount.toFixed(2)}</p>
        <p><strong>Grand Total:</strong> AED {grandTotal.toFixed(2)}</p>
      </div>
    
          
      <Button variant="success" className="me-2" onClick={() => handleSaveInvoice(false)}>
        Save Invoice
        </Button>
        <Button variant="primary" onClick={() => handleSaveInvoice(true)}>
        Save & Print Invoice
        </Button>
    </Container>
  );
};

export default InvoiceBuilder;  