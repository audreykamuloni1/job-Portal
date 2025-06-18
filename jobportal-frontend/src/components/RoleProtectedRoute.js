import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { useLoading } from '../contexts/LoadingContext'; 

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { isLoading: isGlobalLoading, showLoading, hideLoading } = useLoading();
  const location = useLocation();

  React.useEffect(() => {
    if (authLoading) {
      showLoading('Verifying access...');
    } else {
      hideLoading();
    }
    return () => {
      if (authLoading) hideLoading();
    };
  }, [authLoading, showLoading, hideLoading]);

  if (authLoading || isGlobalLoading) {
    return null; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

 
  const userRoles = user?.roles || [];
  const hasRequiredRole = allowedRoles?.some(role => userRoles.includes(role));

  if (!hasRequiredRole) {
   
    
    return <Navigate to="/unauthorized" state={{ from: location }} replace />; 
  }

  return <Outlet />; 
  
};

export default RoleProtectedRoute;