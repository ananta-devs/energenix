import api from './api';

export const dataService = {
  // Auth
  checkEmail: (email) => api.post('/auth/check-email', { email }),
  signIn: (email) => api.post('/auth/signin', { email }),
  signUp: (formData) => api.post('/auth/signup', formData),
  verifySignInOtp: (email, otp) => api.post('/auth/verify-signin-otp', { email, otp }),
  sendUpdateEmailOtp: (email) => api.post('/auth/send-update-email-otp', { email }),
  verifyUpdateEmailOtp: (email, otp) => api.post('/auth/verify-update-email-otp', { email, otp }),
  getMe: () => api.get('/auth/me'),
  updateMe: (userData) => api.put('/auth/me', userData),

  // Address
  addAddress: (addressForm) => api.post('/address/add', addressForm),
  getAddresses: () => api.get('/address'),
  updateAddress: (id, addressData) => api.put(`/address/${id}`, addressData),
  deleteAddress: (id) => api.delete(`/address/${id}`),
  setActiveAddress: (id) => api.patch(`/address/${id}/set-active`),

  // Pincode
  getPinCodeInfo: (pin) => api.get(`/pincode/${pin}`),

  // Contact
  sendContactMessage: (formData) => api.post('/contact', formData),

  // Coupons
  getAvailableCoupons: () => api.get('/coupons/available'),
  applyCoupon: (couponCode, totalAmount) => api.post('/coupons/apply', { couponCode, cartTotal: totalAmount }),

  // Payment
  createOrder: (amount) => api.post('/payment/create-order', { amount }),
  verifyPayment: (paymentData) => api.post('/payment/verify', paymentData),

  // Orders
  createClientOrder: (orderPayload) => api.post('/orders/create', orderPayload),
  getOrders: () => api.get('/orders'),
};
