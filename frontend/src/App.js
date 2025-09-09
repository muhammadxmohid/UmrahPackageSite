import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Navbar from './components/Navbar';
import PackageList from './pages/PackageList';
import PackageDetails from './pages/PackageDetails';
import InquiryForm from './pages/InquiryForm';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Helmet>
        <title>Umrah & Hajj Packages</title>
        <meta name="description" content="Explore Umrah and Hajj travel packages, inquire and manage your bookings." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/packages" replace />} />
        <Route path="/packages" element={<PackageList />} />
        <Route path="/packages/:id" element={<PackageDetails />} />
        <Route path="/inquiry" element={<InquiryForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="*" element={<h2 className="p-8 text-center">404 - Page Not Found</h2>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
