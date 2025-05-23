import React, { useEffect, useState } from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Track authentication status

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    // You could optionally make an API call to verify the token's validity
    // Example: check if token is valid by making a backend request
    const verifyToken = async () => {
      try {
        const response = await fetch('http://localhost:8091/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Token expired or invalid');
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, proceed with route
  return <Route {...rest} element={Element} />;
};

export default PrivateRoute;
