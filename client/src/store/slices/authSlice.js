import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import api from '../../services/api'; // Import the shared api instance

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      console.log('Login response in slice:', response); // Debug log
      
      // The response structure is { data: { token: "...", user: { ... } } }
      const { token, user } = response;
      
      if (token) {
        localStorage.setItem('token', token);
        api.setAuthToken(token);
      }
      
      return { token, user }; // Return both token and user data
    } catch (error) {
      console.error('Login error in slice:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Get current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user data');
    }
  }
);

// Create first admin
export const createFirstAdmin = createAsyncThunk(
  'auth/createFirstAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await authService.createFirstAdmin({
        ...adminData,
        role: 'admin',
        isActive: true
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        api.setAuthToken(response.data.token); // Set the token in the api instance
      }
      return response.data;
    } catch (error) {
      console.error('Error creating first admin:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to create admin');
    }
  }
);

// Create admin
export const createAdmin = createAsyncThunk(
  'auth/createAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await authService.createAdmin(adminData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create admin');
    }
  }
);

const initialState = {
  currentUser: null,
  isLoading: false,
  error: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      api.setAuthToken(null); // Clear the token from the api instance
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Create first admin
      .addCase(createFirstAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFirstAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(createFirstAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create admin
      .addCase(createAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 