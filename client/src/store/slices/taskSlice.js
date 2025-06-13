import { createSlice } from '@reduxjs/toolkit';
import {
  fetchTasks,
  fetchTask,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
} from '../thunks/taskThunks';

// Export thunks for backward compatibility
export const getTasks = fetchTasks;
export const getTask = fetchTask;
export const createTask = createNewTask;
export const updateTask = updateExistingTask;
export const deleteTask = deleteExistingTask;

const initialState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  totalTasks: 0,
  currentPage: 1,
  totalPages: 1,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    reset: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.totalTasks = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch tasks';
      })
      // Get single task
      .addCase(fetchTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch task';
      })
      // Create task
      .addCase(createNewTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
        state.totalTasks += 1;
      })
      .addCase(createNewTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create task';
      })
      // Update task
      .addCase(updateExistingTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExistingTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?._id === action.payload._id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateExistingTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update task';
      })
      // Delete task
      .addCase(deleteExistingTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
        state.totalTasks -= 1;
        if (state.currentTask?._id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(deleteExistingTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete task';
      });
  },
});

export const { clearError, clearCurrentTask, reset } = taskSlice.actions;
export default taskSlice.reducer; 