import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import OwnerDashboard from './pages/owner/Dashboard';
import OwnerRegister from './pages/owner/Register';
import OwnerRooms from './pages/owner/Rooms';
import OwnerStatistics from './pages/owner/Statistics';
import CustomerBrowse from './pages/customer/Browse';
import CustomerPgDetails from './pages/customer/PgDetails';
import CustomerBookings from './pages/customer/Bookings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          
          {/* Owner Routes */}
          <Route path="owner/register" element={<OwnerRegister />} />
          <Route path="owner/dashboard" element={<OwnerDashboard />} />
          <Route path="owner/rooms" element={<OwnerRooms />} />
          <Route path="owner/statistics" element={<OwnerStatistics />} />
          
          {/* Customer Routes */}
          <Route path="customer/browse" element={<CustomerBrowse />} />
          <Route path="customer/pg/:id" element={<CustomerPgDetails />} />
          <Route path="customer/bookings" element={<CustomerBookings />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
