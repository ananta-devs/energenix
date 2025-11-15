import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/home/HomePage.jsx';
import CategoryPage from './components/product/CategoryPage.jsx';
import ProductDetailPage from './components/product/ProductDetailPage.jsx';
import CheckoutPage from './components/cart/CheckoutPage.jsx';
import OrderConfirmationPage from './components/common/OrderConfirmationPage.jsx';
import ContactPage from './components/common/ContactPage.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import CartDrawer from './components/cart/CartDrawer.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import DashboardPage from './components/dashboard/DashboardPage.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toast } from './components/ui/Toast.jsx';
import { useAuth } from './context/AuthContext.jsx';
import PrivacyPolicy from './components/common/Privacy.jsx';
import TermsOfService from './components/common/Terms.jsx';
import CookiePolicy from './components/common/Cookie.jsx';

function App() {
  const { toast, closeToast } = useAuth();

  return (
    <>
      <CartDrawer />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/login" element={<LoginPage />} />
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
