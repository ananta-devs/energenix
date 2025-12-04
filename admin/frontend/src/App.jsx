import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import ProductsData from './pages/ProductsData';
import CollectionData from './pages/CollectionData';
import CouponData from './pages/CouponsData';
import OrdersData from './pages/OrdersData';
import CustomersData from './pages/CustomersData';
import InventoryData from './pages/InventoryData';
import ReportsData from './pages/ReportsData';
import Settings from './pages/Settings';
import Messages from './pages/Messages';
import { useStore } from './store/useStore';
import AdminSignIn from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const { darkMode } = useStore();
  const location = useLocation();
  const showLayout = location.pathname !== '/login';

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {showLayout && <Sidebar />}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 w-0">
        {showLayout && <Navbar />}
        
        <main className={location.pathname === '/login' ? "flex-1 overflow-auto min-w-0" : "flex-1 overflow-auto p-2 sm:p-4 lg:p-6 min-w-0"}>
          <Routes>
            <Route path="/login" element={<AdminSignIn/>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<ProductsData />} />
              <Route path="/coupons" element={<CouponData />} />
              <Route path="/collections" element={<CollectionData />} />
              <Route path="/orders" element={<OrdersData />} />
              <Route path="/customers" element={<CustomersData />} />
              <Route path="/inventory" element={<InventoryData />} />
              <Route path="/reports" element={<ReportsData />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? '#374151' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
