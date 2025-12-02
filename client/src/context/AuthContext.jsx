import React, { createContext, useContext, useState, useEffect } from "react";
import { decodeToken, saveToken, getToken, clearToken } from "./authService";
import api, { setupInterceptors } from "../utils/api"; // Import api and setupInterceptors

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Function to set default Authorization header for Axios
  const setAuthHeader = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

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
  }, []);

  const login = async (email) => {
    try {
      // Use Axios for the login request (OTP sending)
      const res = await api.post("/auth/signin", { email });

      if (res.status === 200) { // Axios uses status, not res.ok
        showToast("OTP sent to your email!", "success");
        return true;
      } else {
        showToast(res.data.message || "Failed to send OTP", "error");
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      // Axios errors have a response object with data and status
      const message = err.response?.data?.message || err.message || "Something went wrong";
      showToast(message, "error");
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

  const logout = () => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
    setAuthHeader(null); // Clear Axios header on logout
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const closeToast = () => setToast(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        showToast,
        toast,
        closeToast,
        setAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
