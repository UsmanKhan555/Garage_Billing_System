import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Container, Button } from 'react-bootstrap';
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

  const handlePrint = () => {
    const printContents = document.querySelector('.printable-invoice').innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const handleExportPDF = () => {
    const element = document.querySelector('.printable-invoice');
    const opt = {
      margin: 0.3,
      filename: `Invoice_${invoice.invoiceNo}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'A4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  if (!invoice) return <p>Loading...</p>;

  return (
    <Container className="mt-4">
      <div className="printable-invoice p-4 border rounded" style={{ minHeight: '1000px', position: 'relative' }}>
        <h2 className="text-center mb-3"><strong> Billing System</strong></h2>
        <p className="text-center mb-1">TRN: 123456789</p>
        <p className="text-center mb-1">Phone 1: +971 50 123 4567 | Phone 2: +971 52 765 4321</p>
        <hr />
        <h4 className="text-center mb-4"><strong>TAX INVOICE</strong></h4>

        <div>
          <p><strong>Invoice No:</strong> {invoice.invoiceNo}</p>
          <p><strong>Customer Name:</strong> {invoice.customerName}</p>
          <p><strong>Customer TRN:</strong> {invoice.customerTRN}</p>
          <p><strong>Payment Method:</strong> {invoice.paymentMethod}</p>
        </div>

        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Item/Service</th>
              <th>Quantity</th>
              <th>Price (AED)</th>
              <th>Total (AED)</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border p-2">
          <p><strong>Subtotal:</strong> AED {invoice.subtotal.toFixed(2)}</p>
          <p><strong>VAT:</strong> AED {invoice.vatAmount.toFixed(2)}</p>
          <p><strong>Grand Total:</strong> AED {invoice.grandTotal.toFixed(2)}</p>
        </div>

        {/* Signature Section */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '0',
          width: '100%',
          padding: '0 40px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <div>
            <p><em>Garage Representative Sign:</em></p>
            <div style={{ borderBottom: '1px solid #000', width: '200px', marginTop: '20px' }}></div>
          </div>
          <div>
            <p><em>Customer Receiver Sign:</em></p>
            <div style={{ borderBottom: '1px solid #000', width: '200px', marginTop: '20px' }}></div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <Button variant="primary" onClick={handlePrint} className="me-2">
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
