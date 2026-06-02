import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Adjust path as necessary
import { useLoading } from '../contexts/LoadingContext'; // Assuming LoadingContext is used for auth loading

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isLoading: isGlobalLoading, showLoading, hideLoading } = useLoading(); // Context for global loading indicator
  const location = useLocation();

  // This effect handles showing/hiding global loader based on authLoading
  React.useEffect(() => {
    if (authLoading) {
      showLoading('Authenticating...');
    } else {
      hideLoading();
    }
    // Ensure hideLoading is called on unmount if authLoading was true
    return () => {
      if (authLoading) hideLoading();
    };
  }, [authLoading, showLoading, hideLoading]);


  if (authLoading || isGlobalLoading) {
   
    return null; // Or <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}><CircularProgress /></div>
  }

  if (!isAuthenticated) {
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />; // Render children or Outlet for nested routes
};

export default ProtectedRoute;
