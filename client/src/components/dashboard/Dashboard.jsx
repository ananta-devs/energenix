import React, { useState, useEffect } from 'react';
import { User, ChevronDown, Edit, X, Info } from 'lucide-react';
import logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from 'axios';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('orders');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  
  const { user, logout, showToast } = useAuth();
  const navigate = useNavigate();
  
  // Profile edit state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  // Store original email for comparison
  const [originalEmail, setOriginalEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/auth/me', {
          headers: {
            'x-auth-token': token,
          },
        });
        setUserData(res.data);
        setFormData({
          fullName: res.data.fullName,
          email: res.data.email,
          phone: res.data.phone,
        });
        setOriginalEmail(res.data.email);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);
  
  // Address form state
  const [addressForm, setAddressForm] = useState({
    isDefault: false,
    country: 'India',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Andaman and Nicoba...',
    pinCode: '',
    phone: ''
  });

  const handleNavigation = (page) => {
    setCurrentPage(page);
    navigate(page);
  };

  const setPage = (page) => {    
    setCurrentPage(page);
    setDropdownOpen(false);
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      // Check if email has changed
      if (formData.email !== originalEmail) {
        // Check if email already exists
        try {
          await axios.post('/api/auth/check-email', { email: formData.email }, {
            headers: {
              'x-auth-token': token,
            },
          });
        } catch (err) {
          if (err.response && err.response.status === 400) {
            showToast(err.response.data.msg, 'error');
            return;
          }
        }

        // Show email verification modal instead of saving immediately
        await axios.post('/api/auth/send-update-email-otp', { email: formData.email }, {
          headers: {
            'x-auth-token': token,
          },
        });
        setShowEmailVerificationModal(true);
        return;
      }

      // If email hasn't changed, save profile normally
      const res = await axios.put('/api/auth/me', { fullName: formData.fullName, phone: formData.phone }, {
        headers: {
          'x-auth-token': token,
        },
      });
      setUserData(res.data);
      setShowEditProfileModal(false);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update profile.', 'error');
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/auth/verify-update-email-otp', { email: formData.email, otp: verificationCode }, {
        headers: {
          'x-auth-token': token,
        },
      });
      
      setUserData(res.data);
      setOriginalEmail(formData.email); // Update original email
      setShowEmailVerificationModal(false);
      setShowEditProfileModal(false);
      setVerificationCode(''); // Reset verification code
      showToast('Email verified and profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.response.data.msg || 'Failed to verify email.', 'error');
    }
  };

  const handleResendCode = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/auth/send-update-email-otp', { email: formData.email }, {
        headers: {
          'x-auth-token': token,
        },
      });
      showToast('Verification code sent!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to resend verification code.', 'error');
    }
  };

  const handleSaveAddress = () => {
    // Save address logic here
    setShowAddAddressModal(false);
    // Reset form
    setAddressForm({
      isDefault: false,
      country: 'India',
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      state: 'Andaman and Nicoba...',
      pinCode: '',
      phone: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
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
                <span className="text-sm font-semibold text-gray-800">Energenix</span>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'orders' && (
          <div>
            <h1 className="text-3xl font-semi-bold text-gray-900 mb-6">Orders</h1>
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

        {currentPage === 'profile' && userData && (
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">Profile</h1>
            
            {/* Name and Email Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Name</label>
                <p className="text-gray-900">{userData.fullName}</p>
                  </div>
                  <button 
                    onClick={() => setShowEditProfileModal(true)}
                    className="text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-600 block mb-2">Email</label>
                <p className="text-gray-900">{userData.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">Contact No</label>
                <p className="text-gray-900">{userData.phone}</p>
              </div>

            </div>

            {/* Addresses Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Addresses</h2>
                <button 
                  onClick={() => setShowAddAddressModal(true)}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                  + Add
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 flex items-start space-x-2">
                <Info className="w-5 h-5 text-gray-400"/>
                <p className="text-sm text-gray-600">No addresses added</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Edit profile</h2>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Contact No</label>
                  <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                      placeholder="Contact number"
                    />
                </div>
              </div>

              {/* <div className="grid grid-cols-2 gap-4"> */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                  />
                  <p className="text-xs text-gray-500 mt-1">This email is used for sign-in and order updates.</p>
                </div>
              {/* </div> */}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="px-6 py-2 text-gray-700 bg-red-500 rounded-md hover:text-gray-900 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Verification Modal */}
      {showEmailVerificationModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Verify email</h2>
              <p className="text-gray-600 mb-6">
                Enter the code sent to {formData.email}
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  6-digit code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleResendCode}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Resend code
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowEmailVerificationModal(false);
                      setVerificationCode('');
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerifyEmail}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add address</h2>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="defaultAddress" className="ml-2 text-sm text-gray-900">
                  This is my default address
                </label>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Country/region</label>
                <select
                  value={addressForm.country}
                  onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>India</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={addressForm.firstName}
                    onChange={(e) => setAddressForm({...addressForm, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={addressForm.lastName}
                    onChange={(e) => setAddressForm({...addressForm, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Address"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={addressForm.apartment}
                  onChange={(e) => setAddressForm({...addressForm, apartment: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Apartment, suite, etc (optional)"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <select
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option>Andaman and Nicoba...</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    value={addressForm.pinCode}
                    onChange={(e) => setAddressForm({...addressForm, pinCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="PIN code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone</label>
                <div className="flex">
                  <div className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                    <span className="text-2xl mr-1">🇮🇳</span>
                  </div>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+91"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 mt-auto">
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