// Sidebar.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Gem, 
  ShoppingCart, 
  Users, 
  Package, 
  BarChart3, 
  Mail, 
  Settings, 
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import logo from '../../assets/logo.svg';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'products', label: 'Products', icon: Gem, path: '/products' },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, path: '/orders' },
  { id: 'customers', label: 'Customers', icon: Users, path: '/customers' },
  { id: 'inventory', label: 'Inventory', icon: Package, path: '/inventory' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  { id: 'messages', label: 'Messages', icon: Mail, path: '/messages' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = () => {
  const { sidebarOpen, setSidebarOpen } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: sidebarOpen ? 256 : 0,
          opacity: sidebarOpen ? 1 : 0
        }}
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          overflow-hidden transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition overflow-hidden">
                    <img 
                      src={logo} 
                      alt="Energenix Logo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    Energenix
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                    ${active 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-r-2 border-primary-500' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
              <LogOut size={20} />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-medium"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;