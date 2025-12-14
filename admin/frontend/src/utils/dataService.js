// utils/dataService.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

export const dataService = {

  async getCollections() {
    const response = await axios.get(`${API_BASE}/api/collections`);
    return response.data;
  },

  async getOrders() {
    const response = await axios.get(`${API_BASE}/api/orders`);
    return response.data;
  },

  async getCustomers() {
    const response = await axios.get(`${API_BASE}/api/users`);
    return response.data;
  },

  async getInventory() {
    const response = await axios.get(`${API_BASE}/api/inventory`);
    return response.data;
  },

  async getAnalytics() {
    const response = await axios.get(`${API_BASE}/api/analytics`);
    return response.data;
  },

  async getReports() {
    const response = await axios.get(`${API_BASE}/api/reports`);
    return response.data;
  },

  async createCollection(collectionData) {
    const response = await axios.post(`${API_BASE}/api/collections`, collectionData);
    return response.data;
  },

  async updateCollection(id, collectionData) {
    const response = await axios.put(`${API_BASE}/api/collections/${id}`, collectionData);
    return response.data;
  },

  async deleteCollection(id) {
    const response = await axios.delete(`${API_BASE}/api/collections/${id}`);
    return response.data;
  },

  async getProducts() {
    const response = await axios.get(`${API_BASE}/api/products`);
    return response.data;
  },

  async createProduct(productData) {
    const response = await axios.post(`${API_BASE}/api/products`, productData);
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await axios.put(`${API_BASE}/api/products/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await axios.delete(`${API_BASE}/api/products/${id}`);
    return response.data;
  },

  async updateInventory(id, inventoryData) {
    const response = await axios.put(`${API_BASE}/api/inventory/${id}`, inventoryData);
    return response.data;
  },

  // Coupon methods
  async getCoupons() {
    const response = await axios.get(`${API_BASE}/api/coupons`);
    return response.data;
  },

  async createCoupon(couponData) {
    const response = await axios.post(`${API_BASE}/api/coupons`, couponData);
    return response.data;
  },

  async updateCoupon(id, couponData) {
    const response = await axios.put(`${API_BASE}/api/coupons/${id}`, couponData);
    return response.data;
  },

  async deleteCoupon(id) {
    const response = await axios.delete(`${API_BASE}/api/coupons/${id}`);
    return response.data;
  },

  async deleteImage(public_id) {
    const response = await axios.delete(`${API_BASE}/api/upload`, {
      data: { public_id },
    });
    return response.data;
  },

  // Contact methods
  async getContacts() {
    const response = await axios.get(`${API_BASE}/api/contacts`);
    return response.data;
  },

  async deleteContact(id) {
    const response = await axios.delete(`${API_BASE}/api/contacts/${id}`);
    return response.data;
  },

  // Message reply method (assuming an endpoint exists for this)
  async replyToMessage(to, subject, content) {
    const response = await axios.post(`${API_BASE}/api/messages/reply`, {
      to,
      subject,
      content,
    });
    return response.data;
  },
};