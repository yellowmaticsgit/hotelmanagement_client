import api from './api';

// Create contact message
export const createContact = async (contactData) => {
  const response = await api.post('/contacts', contactData);
  return response.data;
};

// Get all contacts (admin)
export const getAllContacts = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/contacts?${params}`);
  return response.data;
};

// Get single contact (admin)
export const getContact = async (id) => {
  const response = await api.get(`/contacts/${id}`);
  return response.data;
};

// Update contact (admin)
export const updateContact = async (id, contactData) => {
  const response = await api.put(`/contacts/${id}`, contactData);
  return response.data;
};

// Delete contact (admin)
export const deleteContact = async (id) => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};
