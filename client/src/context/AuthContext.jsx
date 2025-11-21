import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../utils/api";
import { decodeToken, saveToken, getToken, clearToken } from "./authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeToken(token);

      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded.user);
        setIsAuthenticated(true);
      } else {
        clearToken();
      }
    }

    setLoading(false);
  }, []);

  const login = async (email) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("OTP sent to your email!", "success");
        return true;
      } else {
        showToast(data.message || "Failed to send OTP", "error");
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      showToast("Something went wrong", "error");
      return false;
    }
  };

  const setAuthToken = (token) => {
    saveToken(token);
    const decoded = decodeToken(token);
    setUser(decoded.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
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
