import api from './api';

// Get all rooms
export const getRooms = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/rooms?${params}`);
  return response.data;
};

// Get featured rooms
export const getFeaturedRooms = async () => {
  const response = await api.get('/rooms/featured');
  return response.data;
};

// Get single room
export const getRoom = async (id) => {
  const response = await api.get(`/rooms/${id}`);
  return response.data;
};

// Create room (admin)
export const createRoom = async (roomData) => {
  const response = await api.post('/rooms', roomData);
  return response.data;
};

// Update room (admin)
export const updateRoom = async (id, roomData) => {
  const response = await api.put(`/rooms/${id}`, roomData);
  return response.data;
};

// Delete room (admin)
export const deleteRoom = async (id) => {
  const response = await api.delete(`/rooms/${id}`);
  return response.data;
};
