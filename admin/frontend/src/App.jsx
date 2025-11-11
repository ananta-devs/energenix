import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import ProductsData from './components/DataDisplay/ProductsData';
import OrdersData from './components/DataDisplay/OrdersData';
import CustomersData from './components/DataDisplay/CustomersData';
import InventoryData from './components/DataDisplay/InventoryData';
import ReportsData from './components/DataDisplay/ReportsData';
import Settings from './pages/Settings';
import Messages from './pages/Messages';
import { useStore } from './store/useStore';

function App() {
  const { darkMode } = useStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 w-0">
          <Navbar />
          
          <main className="flex-1 overflow-auto p-2 sm:p-4 lg:p-6 min-w-0">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<ProductsData />} />
              <Route path="/orders" element={<OrdersData />} />
              <Route path="/customers" element={<CustomersData />} />
              <Route path="/inventory" element={<InventoryData />} />
              <Route path="/reports" element={<ReportsData />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
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
    </Router>
  );
}

export default App;