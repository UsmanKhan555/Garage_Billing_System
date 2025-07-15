import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import HistoryPage from './pages/HistoryPage';
import ManagePage from './pages/ManagePage';
import ServicePage from './pages/ServicePage';
import InvoiceBuilder from './pages/InvoiceBuilder';
import CustomerPage from './pages/CustomerPage';
import PrintableInvoice from './pages/PrintableInvoice';



function App() {
  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoice" element={<InvoiceBuilder />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/invoice/:id/print" element={<PrintableInvoice />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
