import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupInterceptors = (logout) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        logout();
        // Optionally, redirect to login page or show a message
        window.location.href = '/login'; 
      }
      return Promise.reject(error);
    }
  );
};

export default api;