import axios from 'axios';

const API_URL = 'http://localhost:8091/api/auth/';

const login = async (userData) => {
  const response = await axios.post(
    `${API_URL}login`,
    userData,
    { headers: { 'Content-Type': 'application/json' } }
  );
  // Map backend response to what your app expects
  return {
    token: response.data.token, // backend provides 'token'
    user: {
      username: response.data.username,
      roles: response.data.roles,
      type: response.data.type, // if you want to keep 'Bearer'
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