import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService'; // Using existing authService


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
    const data = await authService.login(credentials); // authService.login returns { token, user }
    if (data && data.token && data.user) {
      localStorage.setItem('token', data.token); // Key used by existing api.js
      localStorage.setItem('userData', JSON.stringify(data.user));
      setUser(data.user);
      return data.user; // Return user data on successful login
    }
   
    throw new Error("Login failed: Invalid response from auth service.");
  };

  const register = async (userData) => { 
   
    const response = await authService.register(userData);
   
    return response; 
  };

  const logout = () => {
    localStorage.removeItem('token'); // Key used by existing api.js
    localStorage.removeItem('userData');
    setUser(null);
   
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