import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import { useStore } from './store/useStore';

function App() {
  const { darkMode, currentPage } = useStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <div className="p-4 sm:p-6">Products Management - Coming Soon</div>;
      case 'orders':
        return <div className="p-4 sm:p-6">Orders Management - Coming Soon</div>;
      case 'customers':
        return <div className="p-4 sm:p-6">Customers Management - Coming Soon</div>;
      case 'inventory':
        return <div className="p-4 sm:p-6">Inventory Tracking - Coming Soon</div>;
      case 'reports':
        return <div className="p-4 sm:p-6">Reports & Analytics - Coming Soon</div>;
      case 'ads':
        return <div className="p-4 sm:p-6">Advertisements - Coming Soon</div>;
      case 'settings':
        return <div className="p-4 sm:p-6">Settings - Coming Soon</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 w-0">
        <Navbar />
        
        <main className="flex-1 overflow-auto p-2 sm:p-4 lg:p-6 min-w-0">
          {renderPage()}
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
  );
}

export default App;