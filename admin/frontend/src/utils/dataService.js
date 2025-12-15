// utils/dataService.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export const dataService = {
  async login(credentials) {
    const response = await api.post('/api/admins/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  async getAdmins() {
    const response = await api.get('/api/admins');
    return response.data;
  },

  async addAdmin(adminData) {
    const response = await api.post('/api/admins', adminData);
    return response.data;
  },

  async updateAdminStatus(id, status) {
    const response = await api.put(`/api/admins/${id}/status`, { status });
    return response.data;
  },

  async deleteAdmin(id) {
    const response = await api.delete(`/api/admins/${id}`);
    return response.data;
  },

  async changePassword(passwordData) {
    const response = await api.post('/api/admins/change-password', passwordData);
    return response.data;
  },

  async getCollections() {
    const response = await api.get(`/api/collections`);
    return response.data;
  },

  async getOrders() {
    const response = await api.get(`/api/orders`);
    return response.data;
  },

  async getCustomers() {
    const response = await api.get(`/api/users`);
    return response.data;
  },

  async getInventory() {
    const response = await api.get(`/api/inventory`);
    return response.data;
  },

  async getAnalytics() {
    const response = await api.get(`/api/analytics`);
    return response.data;
  },

  async getReports() {
    const response = await api.get(`/api/reports`);
    return response.data;
  },

  async createCollection(collectionData) {
    const response = await api.post(`/api/collections`, collectionData);
    return response.data;
  },

  async updateCollection(id, collectionData) {
    const response = await api.put(`/api/collections/${id}`, collectionData);
    return response.data;
  },

  async deleteCollection(id) {
    const response = await api.delete(`/api/collections/${id}`);
    return response.data;
  },

  async getProducts() {
    const response = await api.get(`/api/products`);
    return response.data;
  },

  async createProduct(productData) {
    const response = await api.post(`/api/products`, productData);
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await api.put(`/api/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/api/products/${id}`);
    return response.data;
  },

  async updateInventory(id, inventoryData) {
    const response = await api.put(`/api/inventory/${id}`, inventoryData);
    return response.data;
  },

  // Coupon methods
  async getCoupons() {
    const response = await api.get(`/api/coupons`);
    return response.data;
  },

  async createCoupon(couponData) {
    const response = await api.post(`/api/coupons`, couponData);
    return response.data;
  },

  async updateCoupon(id, couponData) {
    const response = await api.put(`/api/coupons/${id}`, couponData);
    return response.data;
  },

  async deleteCoupon(id) {
    const response = await api.delete(`/api/coupons/${id}`);
    return response.data;
  },

  async deleteImage(public_id) {
    const response = await api.delete(`/api/upload`, {
      data: { public_id },
    });
    return response.data;
  },

  // Contact methods
  async getContacts() {
    const response = await api.get(`/api/contacts`);
    return response.data;
  },

  async deleteContact(id) {
    const response = await api.delete(`/api/contacts/${id}`);
    return response.data;
  },

  // Message reply method (assuming an endpoint exists for this)
  async replyToMessage(to, subject, content) {
    const response = await api.post(`/api/messages/reply`, {
      to,
      subject,
      content,
    });
    return response.data;
  },
};