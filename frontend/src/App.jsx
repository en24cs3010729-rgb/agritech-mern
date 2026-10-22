import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmManagement from './pages/FarmManagement';
import CropMonitoring from './pages/CropMonitoring';
import SoilAnalysis from './pages/SoilAnalysis';
import WeatherPest from './pages/WeatherPest';
import Marketplace from './pages/Marketplace';
import CartAndOrders from './pages/CartAndOrders';
import CommunityForum from './pages/CommunityForum';
import AdminDashboard from './pages/AdminDashboard';

import './App.css';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Farmer Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <FarmerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/farms"
                  element={
                    <ProtectedRoute>
                      <FarmManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crops"
                  element={
                    <ProtectedRoute>
                      <CropMonitoring />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/soil"
                  element={
                    <ProtectedRoute>
                      <SoilAnalysis />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartAndOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <CartAndOrders />
                    </ProtectedRoute>
                  }
                />

                {/* Open / Interactive Modules */}
                <Route path="/weather" element={<WeatherPest />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/forum" element={<CommunityForum />} />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}
