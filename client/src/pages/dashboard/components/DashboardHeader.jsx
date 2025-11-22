import React from 'react';
import { User, ChevronDown } from 'lucide-react';
import logo from '../../../assets/logo.svg';

const DashboardHeader = ({ userData, dropdownOpen, setDropdownOpen, handleNavigation, setPage, handleSignOut }) => {
  return (
    <header className="sticky top-0 left-0 right-0 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigation('/')}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition overflow-hidden">
                <img 
                  src={logo} 
                  alt="Energenix Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-semibold text-gray-800">EnergeniX</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <button
              onClick={() => handleNavigation('/category/all')}
              className="text-gray-700 hover:text-gray-900 text-sm font-medium cursor-pointer"
            >
              Shop
            </button>
            <button
              onClick={() => setPage('orders')}
              className="text-gray-700 hover:text-gray-900 text-sm font-medium cursor-pointer"
            >
              Orders
            </button>
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
                    <span className="text-sm text-gray-700">{userData?.fullName}</span>
                  </div>
                </div>
                <button
                  onClick={() => setPage('profile')}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Profile
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
  );
};

export default DashboardHeader;