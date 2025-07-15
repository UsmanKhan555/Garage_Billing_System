import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Container, Table, Button, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PastInvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const data = await getDocs(collection(db, 'invoices'));
    const sorted = data.docs
      .map(doc => ({ ...doc.data(), id: doc.id }))
      .sort((a, b) => b.invoiceNo - a.invoiceNo);
    setInvoices(sorted);
  };

  const handleDelete = async (id, invoiceNo) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete Invoice #${invoiceNo}?`);
    if (!confirmDelete) return;
    await deleteDoc(doc(db, 'invoices', id));
    alert('Invoice deleted!');
    fetchInvoices();
  };

  const handleExportCSV = () => {
  if (invoices.length === 0) {
    alert('No invoices to export.');
    return;
  }

  const header = Object.keys(invoices[0]).join(',');
  const rows = invoices.map((inv) =>
    Object.values(inv)
      .map((val) => {
        if (typeof val === 'object') {
          if (val.seconds) {
            return new Date(val.seconds * 1000).toLocaleString();
          }
          return JSON.stringify(val);
        }
        return val;
      })
      .join(',')
  );

  const csvContent = [header, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'invoices.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  const filteredInvoices = invoices.filter((inv) => {
    const dateStr = new Date(inv.createdAt.seconds * 1000).toLocaleDateString();
    return (
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNo.toString().includes(search) ||
      dateStr.includes(search)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Past Invoices</h2>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by customer, invoice no, or date..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </Col>
        <Col md={3}>
          <Button variant="success" onClick={handleExportCSV}>
            Export All as CSV
          </Button>
        </Col>
      </Row>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Invoice No</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Payment</th>
            <th>Grand Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentInvoices.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No invoices found.</td>
            </tr>
          ) : (
            currentInvoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.invoiceNo}</td>
                <td>{inv.customerName}</td>
                <td>{new Date(inv.createdAt.seconds * 1000).toLocaleDateString()}</td>
                <td>{inv.paymentMethod}</td>
                <td>AED {inv.grandTotal.toFixed(2)}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/invoice/${inv.id}/print`}
                    size="sm"
                    variant="info"
                    className="me-2 mb-1"
                  >
                    View & Print
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(inv.id, inv.invoiceNo)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        {[...Array(Math.ceil(filteredInvoices.length / itemsPerPage)).keys()].map((num) => (
          <Button
            key={num}
            variant={num + 1 === currentPage ? 'primary' : 'outline-primary'}
            size="sm"
            className="me-1"
            onClick={() => setCurrentPage(num + 1)}
          >
            {num + 1}
          </Button>
        ))}
      </div>
    </Container>
  );
};

export default PastInvoicesPage;
