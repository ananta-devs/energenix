/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { decodeToken, saveToken, getToken, clearToken } from "./authService";
import api, { setupInterceptors } from "../utils/api";
import { dataService } from "../utils/dataService";
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to set default Authorization header for Axios
  const setAuthHeader = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
    setAuthHeader(null); // Clear Axios header on logout
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeToken(token);

      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded.user);
        setIsAuthenticated(true);
        setAuthHeader(token); // Set Axios header on initial load
      } else {
        clearToken();
        setAuthHeader(null); // Clear Axios header
      }
    }

    setLoading(false);
    setupInterceptors(logout); // Setup interceptors after logout is defined
  }, [logout]);

  const login = async (email) => {
    try {
      // Use dataService for the login request (OTP sending)
      const res = await dataService.signIn(email);

      if (res.status === 200) { // Axios uses status, not res.ok
        showToast("OTP sent to your email!", "success");
        return true;
      } else {
        showToast(res.data.message || "Failed to send OTP", "error");
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const setAuthToken = (token) => {
    saveToken(token);
    const decoded = decodeToken(token);
    setUser(decoded.user);
    setIsAuthenticated(true);
    setAuthHeader(token); // Set Axios header when token is updated
  };


  const showToast = (message, type = "info") => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "info":
      default:
        toast(message);
        break;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        showToast,
        setAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);