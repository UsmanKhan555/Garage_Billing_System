import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import ManagePage from './pages/ManagePage';
import ServicePage from './pages/ServicePage';
import InvoiceBuilder from './pages/InvoiceBuilder';
import CustomerPage from './pages/CustomerPage';
import PrintableInvoice from './pages/PrintableInvoice';
import PastInvoicesPage from './pages/PastInvoicesPage';
import ReportsPage from './pages/ReportsPage';
import AppNavbar from './components/Navbar';


function App() {
  return (
    <Router>
      <div className="container mt-4">
      <AppNavbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoice" element={<InvoiceBuilder />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/customers" element={<CustomerPage />} />
          <Route path="/invoice/:id/print" element={<PrintableInvoice />} />
          <Route path="/past-invoices" element={<PastInvoicesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
