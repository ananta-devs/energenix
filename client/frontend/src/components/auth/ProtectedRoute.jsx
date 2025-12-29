// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import FullPageLoader from '../ui/FullPageLoader.jsx';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <FullPageLoader />;
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