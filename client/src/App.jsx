import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { api } from './services/api';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EmergencyBanner from './components/EmergencyBanner';
import BloodCompatibilityModal from './components/BloodCompatibilityModal';
import EligibilityModal from './components/EligibilityModal';

import Home from './pages/Home';
import FindDonors from './pages/FindDonors';
import BloodRequests from './pages/BloodRequests';
import CreateRequest from './pages/CreateRequest';
import BloodInventory from './pages/BloodInventory';
import DonationCamps from './pages/DonationCamps';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [compatibilityModalOpen, setCompatibilityModalOpen] = useState(false);
  const [eligibilityModalOpen, setEligibilityModalOpen] = useState(false);
  const [activeEmergencyRequests, setActiveEmergencyRequests] = useState([]);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const res = await api.getRequests({ urgency: 'Emergency', status: 'Pending' });
        if (res.success && res.requests) {
          setActiveEmergencyRequests(res.requests);
        }
      } catch (e) {
        // Silently continue
      }
    };
    fetchEmergencies();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-rose-500 selection:text-white">
          {/* Emergency Alert Ribbon */}
          <EmergencyBanner requests={activeEmergencyRequests} />

          {/* Navigation Bar */}
          <Navbar
            onOpenCompatibility={() => setCompatibilityModalOpen(true)}
            onOpenEligibility={() => setEligibilityModalOpen(true)}
          />

          {/* Main Content View */}
          <main className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    onOpenCompatibility={() => setCompatibilityModalOpen(true)}
                    onOpenEligibility={() => setEligibilityModalOpen(true)}
                  />
                }
              />
              <Route
                path="/donors"
                element={
                  <FindDonors
                    onOpenCompatibility={() => setCompatibilityModalOpen(true)}
                  />
                }
              />
              <Route path="/requests" element={<BloodRequests />} />
              <Route path="/request-blood" element={<CreateRequest />} />
              <Route
                path="/inventory"
                element={
                  <BloodInventory
                    onOpenCompatibility={() => setCompatibilityModalOpen(true)}
                  />
                }
              />
              <Route path="/camps" element={<DonationCamps />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Global Helper Modals */}
          <BloodCompatibilityModal
            isOpen={compatibilityModalOpen}
            onClose={() => setCompatibilityModalOpen(false)}
          />

          <EligibilityModal
            isOpen={eligibilityModalOpen}
            onClose={() => setEligibilityModalOpen(false)}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}
