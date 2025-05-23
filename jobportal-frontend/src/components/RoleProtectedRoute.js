import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user's roles include any allowedRoles
  const hasRole = user.roles?.some(role => allowedRoles.includes(role));
  if (!hasRole) {
    return <Navigate to="/dashboard" replace />; // Or a "Not Authorized" page
  }

  return children;
};

export default RoleProtectedRoute;