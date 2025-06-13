import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Get user from localStorage for auth header
const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

const user = getStoredUser();
const token = user?.token;

// Get all users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page = 1, limit = 10, role, search }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...(role && { role }),
        ...(search && { search }),
      });

      const response = await api.get(`/users?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error);
    }
  }
);

// Get single user
export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error);
    }
  }
);

// Update user
export const updateExistingUser = createAsyncThunk(
  'users/updateExistingUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error);
    }
  }
);

// Delete user
export const deleteExistingUser = createAsyncThunk(
  'users/deleteExistingUser',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error);
    }
  }
); 