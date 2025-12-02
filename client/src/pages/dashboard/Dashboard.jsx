import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api.js'; // Import api instance

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
  const [loading, setLoading] = useState(true);
  
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
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, ordersRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/orders')
        ]);
        
        setUserData(userRes.data);
        setFormData({
          fullName: userRes.data.fullName,
          email: userRes.data.email,
          phone: userRes.data.phone,
        });
        setOriginalEmail(userRes.data.email);
        setOrders(ordersRes.data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
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
      // Check if email has changed
      if (formData.email !== originalEmail) {
        // Check if email already exists
        try {
          await api.post('/auth/check-email', { email: formData.email }); // Use api.post
        } catch (err) {
          if (err.response && err.response.status === 400) {
            showToast(err.response.data.msg, 'error');
            return;
          }
        }

        // Show email verification modal instead of saving immediately
        await api.post('/auth/send-update-email-otp', { email: formData.email }); // Use api.post
        setShowEmailVerificationModal(true);
        return;
      }

      // If email hasn't changed, save profile normally
      const res = await api.put('/auth/me', { fullName: formData.fullName, phone: formData.phone }); // Use api.put
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
      const res = await api.post('/auth/verify-update-email-otp', { email: formData.email, otp: verificationCode }); // Use api.post
      
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
      await api.post('/auth/send-update-email-otp', { email: formData.email }); // Use api.post
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
      const res = await api.get(`/pincode/${pin}`); // Use api.get
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
        {currentPage === 'orders' && <OrdersContent orders={orders} loading={loading} />}
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