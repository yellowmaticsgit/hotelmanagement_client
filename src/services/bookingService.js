import api from './api';

// Create booking
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

// Get user bookings
export const getUserBookings = async (userId) => {
  const response = await api.get(`/bookings/user/${userId}`);
  return response.data;
};

// Get all bookings (admin)
export const getAllBookings = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/bookings/admin/all?${params}`);
  return response.data;
};

// Get single booking
export const getBooking = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

// Update booking
export const updateBooking = async (id, bookingData) => {
  const response = await api.put(`/bookings/${id}`, bookingData);
  return response.data;
};

// Update booking status (admin)
export const updateBookingStatus = async (id, status) => {
  const response = await api.put(`/bookings/admin/${id}/status`, { status });
  return response.data;
};

// Cancel booking
export const cancelBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

// Get dashboard stats (admin)
export const getDashboardStats = async () => {
  const response = await api.get('/bookings/admin/dashboard/stats');
  return response.data;
};
