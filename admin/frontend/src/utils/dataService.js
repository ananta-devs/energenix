// utils/dataService.js
const API_BASE = 'http://localhost:3001';

export const dataService = {
  async getProducts() {
    const response = await fetch(`${API_BASE}/products`);
    return await response.json();
  },

  async getOrders() {
    const response = await fetch(`${API_BASE}/orders`);
    return await response.json();
  },

  async getCustomers() {
    const response = await fetch(`${API_BASE}/customers`);
    return await response.json();
  },

  async getInventory() {
    const response = await fetch(`${API_BASE}/inventory`);
    return await response.json();
  },

  async getAnalytics() {
    const response = await fetch(`${API_BASE}/analytics`);
    return await response.json();
  },

  async getReports() {
    const response = await fetch(`${API_BASE}/reports`);
    return await response.json();
  }
};