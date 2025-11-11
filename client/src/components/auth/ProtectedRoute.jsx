// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;