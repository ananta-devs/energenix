import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../utils/api.js';

// Import components
import DashboardHeader from './components/DashboardHeader.jsx';
import OrdersContent from './components/OrdersContent.jsx';
import Profile from './components/Profile.jsx';
import EditProfileModal from './components/EditProfileModal.jsx';
import EmailVerificationModal from './components/EmailVerificationModal.jsx';
import AddAddressModal from './components/AddAddressModal.jsx';
import EditAddressModal from './components/EditAddressModal.jsx'; // New import
import DeleteConfirmationModal from './components/DeleteConfirmationModal.jsx'; // New import
import DashboardFooter from './components/DashboardFooter.jsx';

const Dashboard = () => {
    const [currentPage, setCurrentPage] = useState('orders');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [showEditAddressModal, setShowEditAddressModal] = useState(false); // New state
    const [showDeleteModal, setShowDeleteModal] = useState(false); // New state
    const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // New state for edit loading
    const [isDeleting, setIsDeleting] = useState(false); // New state for delete loading
    
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

    // Address form state
    const [addressForm, setAddressForm] = useState({
        isActive: false,
        fullName: "",
        phone: "",
        altPhone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pinCode: "",
    });

    // Store address to edit/delete
    const [currentAddressId, setCurrentAddressId] = useState(null);
    const [addressToDelete, setAddressToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [userRes, ordersRes, addressRes] = await Promise.all([
                    api.get('/auth/me'),
                    api.get('/orders'),
                    api.get('/address')
                ]);
                
                setUserData(userRes.data);
                setFormData({
                    fullName: userRes.data.fullName,
                    email: userRes.data.email,
                    phone: userRes.data.phone,
                });
                setOriginalEmail(userRes.data.email);
                setOrders(ordersRes.data.orders);
                setAddresses(addressRes.data.addresses);
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
                showToast("Invalid pincode", "error");
                cityRef.current?.focus();
                return;
            }

            setAddressForm(prev => ({ ...prev, city, state }));
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
            if (formData.email !== originalEmail) {
                try {
                    await api.post('/auth/check-email', { email: formData.email });
                } catch (err) {
                    if (err.response && err.response.status === 400) {
                        showToast(err.response.data.msg, 'error');
                        return;
                    }
                }

                await api.post('/auth/send-update-email-otp', { email: formData.email });
                setShowEmailVerificationModal(true);
                return;
            }

            const res = await api.put('/auth/me', { fullName: formData.fullName, phone: formData.phone });
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
            const res = await api.post('/auth/verify-update-email-otp', { email: formData.email, otp: verificationCode });
            
            setUserData(res.data);
            setOriginalEmail(formData.email);
            setShowEmailVerificationModal(false);
            setShowEditProfileModal(false);
            setVerificationCode('');
            showToast('Email verified and profile updated successfully!', 'success');
        } catch (err) {
            console.error(err);
            showToast(err.response.data.msg || 'Failed to verify email.', 'error');
        }
    };

    const handleResendCode = async () => {
        try {
            await api.post('/auth/send-update-email-otp', { email: formData.email });
            showToast('Verification code sent!', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to resend verification code.', 'error');
        }
    };

    const fetchAddresses = async () => {
        try {
            const res = await api.get('/address');
            setAddresses(res.data.addresses);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveAddress = async () => {
        try {
            await api.post('/address/add', addressForm);
            showToast('Address saved successfully!', 'success');
            setShowAddAddressModal(false);
            resetAddressForm();
            fetchAddresses();
        } catch (err) {
            console.error(err);
            showToast('Failed to save address.', 'error');
        }
    };

    // Edit Address Handler
    const handleEditAddress = (address) => {
        setAddressForm({
            isActive: address.isActive || false,
            fullName: address.fullName || "",
            phone: address.phone || "",
            altPhone: address.altPhone || "",
            addressLine1: address.addressLine1 || "",
            addressLine2: address.addressLine2 || "",
            city: address.city || "",
            state: address.state || "",
            pinCode: address.pinCode || "",
        });
        setCurrentAddressId(address._id);
        setShowEditAddressModal(true);
    };

    // Update Address Handler
    const handleUpdateAddress = async () => {
        if (!currentAddressId) return;
        
        setIsEditing(true);
        try {
            await api.put(`/address/${currentAddressId}`, addressForm);
            showToast('Address updated successfully!', 'success');
            setShowEditAddressModal(false);
            resetAddressForm();
            fetchAddresses();
        } catch (err) {
            console.error(err);
            showToast('Failed to update address.', 'error');
        } finally {
            setIsEditing(false);
            setCurrentAddressId(null);
        }
    };

    // Delete Address Handler
    const handleDeleteAddress = (address) => {
        setAddressToDelete(address);
        setShowDeleteModal(true);
    };

    // Confirm Delete Address Handler
    const handleConfirmDelete = async () => {
        if (!addressToDelete?._id) return;
        
        setIsDeleting(true);
        try {
            await api.delete(`/address/${addressToDelete._id}`);
            showToast('Address deleted successfully!', 'success');
            setShowDeleteModal(false);
            fetchAddresses();
        } catch (err) {
            console.error(err);
            showToast('Failed to delete address.', 'error');
        } finally {
            setIsDeleting(false);
            setAddressToDelete(null);
        }
    };

    const handleSetActiveAddress = async (addressId) => {
        try {
            const res = await api.patch(`/address/${addressId}/set-active`);
            setAddresses(res.data.addresses);
            showToast("Address set as active!", "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to set active address.", "error");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Reset address form
    const resetAddressForm = () => {
        setAddressForm({
            isActive: false,
            fullName: "",
            phone: "",
            altPhone: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            pinCode: "",
        });
    };

    // Fetch city/state from backend
    const fetchCityState = async (pin) => {
        try {
            const res = await api.get(`/pincode/${pin}`);
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
                        addresses={addresses}
                        handleEditAddress={handleEditAddress}
                        handleDeleteAddress={handleDeleteAddress}
                        handleSetActiveAddress={handleSetActiveAddress}
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

            {/* New Edit Address Modal */}
            <EditAddressModal
                showEditAddressModal={showEditAddressModal}
                setShowEditAddressModal={setShowEditAddressModal}
                addressForm={addressForm}
                setAddressForm={setAddressForm}
                handlePinChange={handlePinChange}
                cityRef={cityRef}
                stateRef={stateRef}
                pinRef={pinRef}
                handleUpdateAddress={handleUpdateAddress}
                isEditing={isEditing}
            />

            {/* New Delete Confirmation Modal */}
            <DeleteConfirmationModal
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                addressToDelete={addressToDelete}
                handleDeleteAddress={handleConfirmDelete}
                isDeleting={isDeleting}
            />

            <DashboardFooter />
        </div>
    );
};

export default Dashboard;