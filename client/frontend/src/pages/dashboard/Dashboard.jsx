import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { dataService } from '../../utils/dataService.js';

// Import components
import DashboardHeader from './components/DashboardHeader.jsx';
import OrdersContent from './components/OrdersContent.jsx';
import Profile from './components/Profile.jsx';
import EditProfileModal from './components/EditProfileModal.jsx';
import EmailVerificationModal from './components/EmailVerificationModal.jsx';
import DashboardFooter from './components/DashboardFooter.jsx';

const Dashboard = () => {
    const [currentPage, setCurrentPage] = useState('orders');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
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
        const fetchData = async () => {
            setLoading(true);
            try {
                const [userRes, ordersRes] = await Promise.all([
                    dataService.getMe(),
                    dataService.getOrders()
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
                    await dataService.checkEmail(formData.email);
                } catch (err) {
                    if (err.response && err.response.status === 400) {
                        showToast(err.response.data.msg, 'error');
                        return;
                    }
                }

                await dataService.sendUpdateEmailOtp(formData.email);
                setShowEmailVerificationModal(true);
                return;
            }

            const res = await dataService.updateMe({ fullName: formData.fullName, phone: formData.phone });
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
            const res = await dataService.verifyUpdateEmailOtp(formData.email, verificationCode);
            
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
            await dataService.sendUpdateEmailOtp(formData.email);
            showToast('Verification code sent!', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to resend verification code.', 'error');
        }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            // Find the order to get its order_id (not _id)
            const order = orders.find(o => o._id === orderId);
            if (!order) throw new Error("Order not found");

            await dataService.cancelOrder(order.order_id);
            
            // Update local state
            setOrders(prevOrders => 
                prevOrders.map(o => 
                    o._id === orderId ? { ...o, status: 'reqForCancel' } : o
                )
            );
            
            showToast('Order cancelled successfully', 'success');
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.error || 'Failed to cancel order', 'error');
            throw err; // Re-throw to handle in the modal
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-10 lg:pb-0">
                {currentPage === 'orders' && (
                    <OrdersContent 
                        orders={orders} 
                        loading={loading} 
                        onCancel={handleCancelOrder} 
                    />
                )}
                {currentPage === 'profile' && userData && (
                    <Profile
                        userData={userData}
                        setShowEditProfileModal={setShowEditProfileModal}
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

            <DashboardFooter />
        </div>
    );
};

export default Dashboard;