// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    const redirectState = { from: location.pathname };
    if (location.pathname === '/checkout') {
      redirectState.action = 'checkout';
    }
    return <Navigate to="/login" state={redirectState} replace />;
  }
  
  return children;
};

export default ProtectedRoute;