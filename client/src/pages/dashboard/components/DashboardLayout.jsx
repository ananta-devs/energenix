import React, { useState } from 'react';
import { User, ChevronDown } from 'lucide-react';
import logo from '../../../assets/logo.svg';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';

const DashboardLayout = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 cursor-pointer">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition overflow-hidden">
                  <img 
                    src={logo} 
                    alt="Energenix Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-semibold text-gray-800">EnergeniX</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              <Link
                to="/category/all"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium cursor-pointer"
              >
                Shop
              </Link>
              <Link
                to="/dashboard/orders"
                className="text-gray-700 hover:text-gray-900 text-sm font-medium cursor-pointer"
              >
                Orders
              </Link>
            </nav>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700">{user?.fullName}</span>
                    </div>
                  </div>
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-6 text-sm">
            <Link to="#" className="text-gray-600 hover:text-gray-900 underline">
              Refund policy
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900 underline">
              Shipping
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900 underline">
              Privacy policy
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900 underline">
              Terms of service
            </Link>
            <Link to="#" className="text-gray-600 hover:text-gray-900 underline">
              Contact information
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;