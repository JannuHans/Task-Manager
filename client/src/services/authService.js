import api from './api';

// Register user
const register = async (userData) => {
  const response = await api.post('/auth/register', {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'user'
  });
  return response.data;
};

// Login user
const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    console.log('Login response:', response.data); // Debug log
    
    // The response structure is { data: { token: "...", user: { ... } } }
    const { data } = response.data;
    
    if (data?.token) {
      localStorage.setItem('token', data.token);
      api.setAuthToken(data.token);
      // Also store user data
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data; // Return just the data object
  } catch (error) {
    console.error('Login error:', error.response?.data || error);
    throw error.response?.data || error;
  }
};

// Get current user
const getCurrentUser = async () => {
  try {
    // Ensure token is set if it exists in localStorage on app load
    const token = localStorage.getItem('token');
    if (token) {
      api.setAuthToken(token);
    } else {
      throw new Error('No token found');
    }

    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    // Clear invalid token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    api.setAuthToken(null);
    throw error;
  }
};

// Create first admin
const createFirstAdmin = async (adminData) => {
  try {
    const response = await api.post('/auth/create-first-admin', {
      name: adminData.name,
      email: adminData.email,
      password: adminData.password
    });
    const { data: userData } = response.data;
    const { token } = userData;
    if (token) {
      localStorage.setItem('token', token);
      api.setAuthToken(token); // Set token directly in Axios defaults
    }
    return userData;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create admin (protected route)
const createAdmin = async (adminData) => {
  const response = await api.post('/auth/create-admin', adminData);
  return response.data;
};

const authService = {
  register,
  login,
  getCurrentUser,
  createFirstAdmin,
  createAdmin,
  logout: () => {
    localStorage.removeItem('token');
    api.setAuthToken(null); // Clear the token from Axios defaults
  }
};

export default authService; 