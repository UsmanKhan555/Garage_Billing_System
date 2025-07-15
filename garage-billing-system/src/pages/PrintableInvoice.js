import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Container, Table, Button } from 'react-bootstrap';
import html2pdf from 'html2pdf.js';


const PrintableInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      const docRef = doc(db, 'invoices', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setInvoice(docSnap.data());
      } else {
        alert('Invoice not found!');
      }
    };
    fetchInvoice();
  }, [id]);

  useEffect(() => {
    if (invoice) {
      document.title = `Invoice #${invoice.invoiceNo}`;
    }
    return () => {
      document.title = 'Your Garage Name';
    };
  }, [invoice]);

  const handlePrint = () => {
    window.print();
  };
  const handleExportPDF = () => {
    const element = document.querySelector('.print-container');
    const opt = {
        margin:       0.3,
        filename:     `Invoice_${invoice.invoiceNo}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'A4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
};


  if (!invoice) return <p>Loading invoice...</p>;

  const date = invoice.createdAt?.seconds
    ? new Date(invoice.createdAt.seconds * 1000).toLocaleDateString()
    : '';

  return (
    <Container
      className="p-4 print-container"
      style={{
        maxWidth: '800px',
        border: '2px solid #333',
        borderRadius: '8px',
        padding: '30px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* Company Header */}
      <div className="text-center mb-2">
        <h2 style={{ marginBottom: '5px', textTransform: 'uppercase', fontWeight: 'bold' }}>
          Najmat Alsahra Garage L.L.C.
        </h2>
        <hr style={{ borderTop: '2px solid #333', width: '100px', margin: '5px auto' }} />
        <p style={{ margin: 0 }}>TRN: 100325395000603</p>
        <p style={{ margin: 0 }}>Mob: +971 50 6786826 | +971 55 104 6233</p>
        <hr style={{ borderTop: '1px solid #333', width: '100%', margin: '10px 0' }} />
        <h4 style={{ fontWeight: 'bold', textDecoration: 'underline', letterSpacing: '1px' }}>TAX INVOICE</h4>
      </div>

      {/* Invoice Info */}
      <div className="d-flex justify-content-between mb-3">
        <div>
          <p><strong>Customer Name:</strong> {invoice.customerName}</p>
          <p><strong>Customer TRN:</strong> {invoice.customerTRN}</p>
          <p><strong>Payment Method:</strong> {invoice.paymentMethod}</p>
        </div>
        <div>
          <p><strong>Invoice No:</strong> {invoice.invoiceNo}</p>
          <p><strong>Date:</strong> {date}</p>
        </div>
      </div>

      {/* Items Table */}
      <Table bordered size="sm" className="mt-3">
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>AED {item.price.toFixed(2)}</td>
              <td>AED {(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Totals Box */}
      <div
        className="mt-3 p-3"
        style={{
          border: '1px solid #333',
          borderRadius: '4px',
          maxWidth: '300px',
          marginLeft: 'auto'
        }}
      >
        <p><strong>Subtotal:</strong> AED {invoice.subtotal.toFixed(2)}</p>
        <p><strong>VAT 5%:</strong> AED {invoice.vatAmount.toFixed(2)}</p>
        <p><strong>Grand Total:</strong> AED {invoice.grandTotal.toFixed(2)}</p>
      </div>

      {/* Signature */}
      <div className="mt-5">
        <p><em>Receiver’s Signature ________________________</em></p>
      </div>

      {/* Print Button */}
      <div className="text-center mt-4 d-print-none">
            <Button variant="primary" className="me-2" onClick={handlePrint}>
                Print Invoice
            </Button>
            <Button variant="success" onClick={handleExportPDF}>
                Export as PDF
            </Button>
    </div>
    </Container>
  );
};

export default PrintableInvoice;
