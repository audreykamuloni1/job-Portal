import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService'; // Using existing authService
// Assuming api.js exports the Axios instance as API, used for non-auth requests by other services
// import API from '../services/api'; 

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // For initial auth state check

  const initializeAuth = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token'); // Key used by existing api.js
    const storedUserData = localStorage.getItem('userData');

    if (token && storedUserData) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        setUser(parsedUser);
        // Optionally, here you could add a call to API.get('/auth/profile') or similar
        // to verify the token and refresh user data, if api.js was successfully modified.
        // For now, trust localStorage if token exists.
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (credentials) => { // credentials: { email, password }
    // This will call the login from the *existing* authService.js
    const data = await authService.login(credentials); 
    if (data && data.token && data.user) {
      localStorage.setItem('token', data.token); 
      localStorage.setItem('userData', JSON.stringify(data.user));
      setUser(data.user);
      return data.user; 
    }
    // If authService.login throws error, it will propagate. 
    // If it returns without token/user, throw error here.
    throw new Error("Login failed: Invalid response from auth service.");
  };

  const register = async (userData) => { // userData: { username, email, password, userType }
    // This will call the register from the *existing* authService.js
    // Existing authService.register returns response.data (e.g., a message or user object)
    const response = await authService.register(userData);
    // Depending on backend, registration might or might not automatically log in the user.
    // If it does, response should include token and user, then call login or set user directly.
    return response; // Return the response for the page to handle (e.g., show message, redirect)
  };

  const logout = () => {
    localStorage.removeItem('token'); // Key used by existing api.js
    localStorage.removeItem('userData');
    setUser(null);
    // No API call in existing authService for logout, so just local cleanup.
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}