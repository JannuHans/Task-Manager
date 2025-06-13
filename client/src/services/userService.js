import api from './api';

// Get all users
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get('/users', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new user
export const createUser = async (userData) => {
  try {
    // Check if this is the first admin creation
    const isFirstAdmin = userData.role === 'admin' && !localStorage.getItem('token');
    const endpoint = isFirstAdmin ? '/auth/create-first-admin' : '/auth/register';
    
    console.log('Creating user with data:', userData);
    console.log('Using endpoint:', endpoint);
    
    const response = await api.post(endpoint, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Update a user
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a user
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 