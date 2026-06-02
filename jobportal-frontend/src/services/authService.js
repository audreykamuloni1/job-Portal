import api from './api';

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
 
  // Directly use response.data.roles as it's already an array of strings
  return {
    token: response.data.token, 
    user: {
      username: response.data.username,
      roles: response.data.roles, // Use roles directly from the response
    }
  };
};

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

const authService = {
  login,
  register,
  getCurrentUser,
};

export default authService;