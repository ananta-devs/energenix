
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check for token expiry
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ fullName: decoded.user.fullName, email: decoded.user.email, phone: decoded.user.phone }); // Assuming fullName, email and phone are in the token
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        const decoded = jwtDecode(data.token);
        setUser({ fullName: decoded.user.fullName, email: decoded.user.email, phone: decoded.user.phone });
        setIsAuthenticated(true);
        showToast('Login successful!', 'success');
      } else {
        showToast(data.message || 'Login failed', 'error');
      }
    } catch (error) {
      console.error("Login API error:", error);
      showToast('An error occurred during login', 'error');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, showToast, toast, closeToast }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
