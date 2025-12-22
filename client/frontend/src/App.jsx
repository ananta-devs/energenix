import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/home/HomePage.jsx';
import CategoryPage from './components/product/CategoryPage.jsx';
import ProductDetailPage from './components/product/ProductDetailPage.jsx';
import Checkout from './components/cart/CheckoutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LoginPage from './components/auth/Login.jsx';
import CartDrawer from './components/cart/CartDrawer.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import PrivacyPolicy from './pages/Privacy.jsx';
import TermsOfService from './pages/Terms.jsx';

function App() {
  return (
    <>
      <ScrollToTop />
      <CartDrawer />
      <Toaster />

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
        <Route path="/signup" element={<LoginPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
      </Routes>

    </>
  );
}

export default App;
