import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import HomePage from './components/home/HomePage.jsx';
import CategoryPage from './components/product/CategoryPage.jsx';
import ProductDetailPage from './components/product/ProductDetailPage.jsx';
import CheckoutPage from './components/cart/CheckoutPage.jsx';
import OrderConfirmationPage from './components/common/OrderConfirmationPage.jsx';
import AboutPage from './components/common/AboutPage.jsx';
import ContactPage from './components/common/ContactPage.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import CartDrawer from './components/cart/CartDrawer.jsx';
import MainLayout from './components/layout/MainLayout.jsx';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CartDrawer />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;