import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/home/HomePage.jsx';
import CategoryPage from './components/product/CategoryPage.jsx';
import ProductDetailPage from './components/product/ProductDetailPage.jsx';
import Checkout from './components/cart/CheckoutPage.jsx';
import OrderConfirmationPage from './components/common/OrderConfirmationPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import SignUpPage from './components/auth/SignUpPage.jsx';
import OtpVerificationPage from './components/auth/OtpVerificationPage.jsx';
import CartDrawer from './components/cart/CartDrawer.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toast } from './components/ui/Toast.jsx';
import { useAuth } from './context/AuthContext.jsx';
import PrivacyPolicy from './pages/Privacy.jsx';
import TermsOfService from './pages/Terms.jsx';
import CookiePolicy from './pages/Cookie.jsx';

function App() {
  const { toast, closeToast } = useAuth();

  return (
    <>
      <CartDrawer />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:identifier" element={<CategoryPage />} />
          <Route path="/product/:identifier" element={<ProductDetailPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookie" element={<CookiePolicy />} />
      </Routes>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
    </>
  );
}

export default App;
