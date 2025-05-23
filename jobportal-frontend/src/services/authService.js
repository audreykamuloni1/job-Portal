import axios from 'axios';

const API_URL = 'http://localhost:8091/api/auth/';

const login = async (userData) => {
  const response = await axios.post(
    `${API_URL}login`,
    userData,
    { headers: { 'Content-Type': 'application/json' } }
  );
 
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
  const response = await axios.post(`${API_URL}register`, userData, {
    headers: { 'Content-Type': 'application/json' }
  });
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