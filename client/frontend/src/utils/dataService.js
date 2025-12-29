import api from './api';

export const dataService = {
  // Products
  validateStock: (items) => api.post('/products/validate-stock', { items }),

  // Auth
  checkEmail: (email) => api.post('/auth/check-email', { email }),
  signIn: (email) => api.post('/auth/signin', { email }),
  signUp: (formData) => api.post('/auth/signup', formData),
  resendOtp: (email, type) => api.post('/auth/resend-otp', { email, type }),
  verifyOtp: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  verifySignInOtp: (email, otp) => api.post('/auth/verify-signin-otp', { email, otp }),
  sendUpdateEmailOtp: (email) => api.post('/auth/send-update-email-otp', { email }),
  verifyUpdateEmailOtp: (email, otp) => api.post('/auth/verify-update-email-otp', { email, otp }),
  getMe: () => api.get('/auth/me'),
  updateMe: (userData) => api.put('/auth/me', userData),

      // Pincode
  
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
  cancelOrder: (order_id) => api.post('/orders/cancel', { order_id }),
};
