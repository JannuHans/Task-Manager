import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userService from '../../services/userService';

// Async thunks
export const getUsers = createAsyncThunk(
  'users/getUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await userService.getUsers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const createNewUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create user');
    }
  }
);

export const updateExistingUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(id, userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

export const deleteExistingUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  }
);

export const getUserById = createAsyncThunk(
  'users/getUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

const initialState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Users
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = Array.isArray(action.payload.data) ? action.payload.data : [];
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.users = [];
      })
      // Create User
      .addCase(createNewUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.users.push(action.payload);
        }
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update User
      .addCase(updateExistingUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExistingUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const index = state.users.findIndex(user => user._id === action.payload._id);
          if (index !== -1) {
            state.users[index] = action.payload;
          }
        }
      })
      .addCase(updateExistingUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteExistingUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExistingUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteExistingUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get User By ID
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.data;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer; 