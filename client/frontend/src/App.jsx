import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import ShippingInfo from './pages/ShippingInfo';
import ReturnExchange from './pages/ReturnExchange';
import CookiePolicy from './pages/CookiePolicy.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Maintenance from './pages/Maintenance.jsx';
import { useProducts } from './context/ProductContext.jsx';

function App() {
  const { error } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to maintenance if there's a global error and we're not already there
  useEffect(() => {
    if (error && location.pathname !== "/maintenance") {
      navigate("/maintenance", { replace: true });
    }
  }, [error, location.pathname, navigate]);

  return (
    <>
      <ScrollToTop />
      <CartDrawer />
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/maintenance" element={<Maintenance />} />
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
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsOfService />} />
          <Route path="/shipping-information" element={<ShippingInfo />} />
          <Route path="/returns-exchanges" element={<ReturnExchange />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
      </Routes>

    </>
  );
}

export default App;
