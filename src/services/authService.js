import api from './api';

// Register user
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Login admin
export const loginAdmin = async (credentials) => {
  const response = await api.post('/auth/admin/login', credentials);
  return response.data;
};

// Logout
export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// Get profile
export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};
