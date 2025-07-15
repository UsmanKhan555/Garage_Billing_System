import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Container, Card, Row, Col } from 'react-bootstrap';

const ReportsPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [dailyReport, setDailyReport] = useState({ total: 0, vat: 0, count: 0 });
  const [monthlyReport, setMonthlyReport] = useState({ total: 0, vat: 0, count: 0 });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const data = await getDocs(collection(db, 'invoices'));
    const allInvoices = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    const today = new Date();
    const todayDate = today.toLocaleDateString();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let dailyTotal = 0, dailyVAT = 0, dailyCount = 0;
    let monthlyTotal = 0, monthlyVAT = 0, monthlyCount = 0;

    allInvoices.forEach((inv) => {
      const invDate = new Date(inv.createdAt.seconds * 1000);
      const invDateString = invDate.toLocaleDateString();

      // Daily
      if (invDateString === todayDate) {
        dailyTotal += inv.grandTotal;
        dailyVAT += inv.vatAmount;
        dailyCount += 1;
      }

      // Monthly
      if (invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear) {
        monthlyTotal += inv.grandTotal;
        monthlyVAT += inv.vatAmount;
        monthlyCount += 1;
      }
    });

    setInvoices(allInvoices);
    setDailyReport({ total: dailyTotal, vat: dailyVAT, count: dailyCount });
    setMonthlyReport({ total: monthlyTotal, vat: monthlyVAT, count: monthlyCount });
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Sales Reports</h2>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Daily Report (Today)</Card.Title>
              <p><strong>Invoices:</strong> {dailyReport.count}</p>
              <p><strong>Total Sales:</strong> AED {dailyReport.total.toFixed(2)}</p>
              <p><strong>Total VAT:</strong> AED {dailyReport.vat.toFixed(2)}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Monthly Report (This Month)</Card.Title>
              <p><strong>Invoices:</strong> {monthlyReport.count}</p>
              <p><strong>Total Sales:</strong> AED {monthlyReport.total.toFixed(2)}</p>
              <p><strong>Total VAT:</strong> AED {monthlyReport.vat.toFixed(2)}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportsPage;
