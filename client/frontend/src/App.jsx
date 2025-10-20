import React, { createContext, useContext, useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import HomePage from './components/HomePage.jsx';
import CategoryPage from './components/CategoryPage.jsx';
import ProductDetailPage from './components/ProductDetailPage.jsx';
import CheckoutPage from './components/CheckoutPage.jsx';
import OrderConfirmationPage from './components/OrderConfirmationPage.jsx';
import AboutPage from './components/AboutPage.jsx';
import ContactPage from './components/ContactPage.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import { CartProvider } from './context/CartContext.jsx';

// ============================================================================
// CONTEXT & STATE MANAGEMENT
// ============================================================================

const AppContext = createContext();

function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        searchQuery,
        setSearchQuery,
        mobileMenuOpen,
        setMobileMenuOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

// ============================================================================
// MAIN APP
// ============================================================================

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

export default App;
