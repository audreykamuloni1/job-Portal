import axios from 'axios';

const API_URL = 'http://localhost:8091/api/auth/';
export const login = async (credentials) => {
const login = async (userData) => {
  const response = await axios.post(`${API_URL}login`, userData);
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};
};

export const register = async (credentials) => {
const register = async (userData) => {
  const response = await axios.post(`${API_URL}register`, userData);
  return response.data;
};
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  login,
  register,
  getCurrentUser
};

export default authService;
