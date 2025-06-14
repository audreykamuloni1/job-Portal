import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { useLoading } from '../contexts/LoadingContext'; 

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isLoading: isGlobalLoading, showLoading, hideLoading } = useLoading(); 
  const location = useLocation();

  
  React.useEffect(() => {
    if (authLoading) {
      showLoading('Authenticating...');
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

  return children ? children : <Outlet />; 
};

export default ProtectedRoute;
