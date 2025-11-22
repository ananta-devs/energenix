import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import axios from 'axios';
import { dummyOrders } from './data/orders';

// Import new components
import DashboardHeader from './components/DashboardHeader.jsx';
import OrdersContent from './components/OrdersContent.jsx';
import Profile from './components/Profile.jsx';
import EditProfileModal from './components/EditProfileModal.jsx';
import EmailVerificationModal from './components/EmailVerificationModal.jsx';
import AddAddressModal from './components/AddAddressModal.jsx';
import DashboardFooter from './components/DashboardFooter.jsx';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('orders');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [orders, setOrders] = useState([]);
  
  const { user, logout, showToast } = useAuth();
  const navigate = useNavigate();
  
  // Refs for auto-focus
  const pinRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);

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
        
        // Load dummy orders
        setOrders(dummyOrders);
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
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
  });

  // PIN debounce handler
  let pinTimeout;

  const handlePinChange = (pin) => {
    setAddressForm(prev => ({ ...prev, pinCode: pin }));

    if (pinTimeout) clearTimeout(pinTimeout);

    if (pin.length !== 6) {
      setAddressForm(prev => ({ ...prev, city: "", state: "" }));
      return;
    }

    pinTimeout = setTimeout(async () => {
      const { city, state } = await fetchCityState(pin);

      if (!city) {
        // invalid pincode message
        showToast("Invalid pincode", "error");
        cityRef.current?.focus();
        return;
      }

      setAddressForm(prev => ({ ...prev, city, state }));

      // autofocus next field
      cityRef.current?.focus();
    }, 500);
  };

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

  // Fetch city/state from backend
  const fetchCityState = async (pin) => {
    try {
      const res = await axios.get(`/api/pincode/${pin}`);
      return {
        city: res.data.city || "",
        state: res.data.state || ""
      };
    } catch (err) {
      console.error("Invalid PIN:", err);
      return { city: "", state: "" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader
        userData={userData}
        dropdownOpen={dropdownOpen}
        setDropdownOpen={setDropdownOpen}
        handleNavigation={handleNavigation}
        setPage={setPage}
        handleSignOut={handleSignOut}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'orders' && <OrdersContent orders={orders} />}
        {currentPage === 'profile' && userData && (
          <Profile
            userData={userData}
            setShowEditProfileModal={setShowEditProfileModal}
            setShowAddAddressModal={setShowAddAddressModal}
          />
        )}
      </main>

      <EditProfileModal
        showEditProfileModal={showEditProfileModal}
        setShowEditProfileModal={setShowEditProfileModal}
        formData={formData}
        handleChange={handleChange}
        handleSaveProfile={handleSaveProfile}
      />

      <EmailVerificationModal
        showEmailVerificationModal={showEmailVerificationModal}
        setShowEmailVerificationModal={setShowEmailVerificationModal}
        formData={formData}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        handleVerifyEmail={handleVerifyEmail}
        handleResendCode={handleResendCode}
      />

      <AddAddressModal
        showAddAddressModal={showAddAddressModal}
        setShowAddAddressModal={setShowAddAddressModal}
        addressForm={addressForm}
        setAddressForm={setAddressForm}
        handlePinChange={handlePinChange}
        cityRef={cityRef}
        stateRef={stateRef}
        pinRef={pinRef}
        handleSaveAddress={handleSaveAddress}
      />

      <DashboardFooter />
    </div>
  );
};

export default Dashboard;