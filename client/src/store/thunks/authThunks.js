import { createAsyncThunk } from '@reduxjs/toolkit';
import { login, register, getCurrentUser } from '../../services/authService';
import { loginSuccess, loginFailure, logout } from '../slices/authSlice';

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = () => (dispatch) => {
  logout();
  dispatch(logout());
}; 