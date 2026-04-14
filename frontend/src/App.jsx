import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import BrowseVendors from './pages/BrowseVendors';
import VendorProfile from './pages/VendorProfile';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VendorDashboard from './pages/VendorDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import SavedVendors from './pages/SavedVendors';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './routes/ProtectedRoute';
import VendorRoute from './routes/VendorRoute';
import HotelOwnerRoute from './routes/HotelOwnerRoute';

// Scrolls to hash anchor after route changes
function HashScrollHandler() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else if (attempts < 10) {
          setTimeout(() => tryScroll(attempts + 1), 100);
        }
      };
      tryScroll();
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <HashScrollHandler />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} />
        <Routes>
          {/* Auth pages: no navbar/footer */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Dashboard: sidebar layout - Vendor Protected */}
          <Route path="/dashboard/*" element={
            <VendorRoute>
              <VendorDashboard />
            </VendorRoute>
          } />

          {/* Buyer Dashboard: included in main navbar layout */}
          <Route path="/buyer-dashboard/*" element={
            <HotelOwnerRoute>
               <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                 <Navbar />
                 <BuyerDashboard />
               </div>
            </HotelOwnerRoute>
          } />

          {/* Main pages */}
          <Route path="/*" element={
            <>
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/vendors" element={
                     <HotelOwnerRoute>
                       <BrowseVendors />
                     </HotelOwnerRoute>
                  } />
                  <Route path="/vendors/:id" element={
                     <HotelOwnerRoute>
                       <VendorProfile />
                     </HotelOwnerRoute>
                  } />
                  <Route path="/saved-vendors" element={
                     <HotelOwnerRoute>
                       <SavedVendors />
                     </HotelOwnerRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
