import React, { useState } from 'react';
import { User, ChevronDown, Edit } from 'lucide-react';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('orders');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userEmail = 'suvadipdutta738@gmail.com';

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setDropdownOpen(false);
  };

  const handleSignOut = () => {
    alert('Signing out...');
    setDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">SIGNIFICANT</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              <button
                onClick={() => handleNavigation('shop')}
                className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              >
                Shop
              </button>
              <button
                onClick={() => handleNavigation('orders')}
                className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              >
                Orders
              </button>
            </nav>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
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
                      <span className="text-sm text-gray-700">{userEmail}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavigation('profile')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => handleNavigation('settings')}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Settings
                  </button>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'orders' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Orders</h1>
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No orders yet
              </h2>
              <p className="text-gray-600">
                Go to store to place an order.
              </p>
            </div>
          </div>
        )}

        {currentPage === 'profile' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
            
            {/* Name and Email Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <button className="text-gray-600 hover:text-gray-900">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Email</label>
                <p className="text-gray-900">{userEmail}</p>
              </div>
            </div>

            {/* Addresses Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Addresses</h2>
                <button className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  + Add
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-2">
                <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 text-gray-400">ⓘ</div>
                </div>
                <p className="text-sm text-gray-600">No addresses added</p>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'shop' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Shop</h1>
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-600">Shop page content goes here</p>
            </div>
          </div>
        )}

        {currentPage === 'settings' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-600">Settings page content goes here</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-gray-900 underline">
              Refund policy
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 underline">
              Shipping
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 underline">
              Privacy policy
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 underline">
              Terms of service
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 underline">
              Contact information
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;