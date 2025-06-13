import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import taskService from '../../services/taskService';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('Fetching tasks with params:', params); // Debug log
      const response = await taskService.getTasks(params);
      console.log('Tasks API response:', response); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error in fetchTasks:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTask = createAsyncThunk(
  'tasks/fetchTask',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createNewTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      console.log('Creating task with data:', taskData); // Debug log

      // Validate required fields
      const requiredFields = ['title', 'description', 'status', 'priority', 'dueDate', 'assignedTo'];
      const missingFields = requiredFields.filter(field => !taskData.get(field));
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate file types if attachments are provided
      const attachments = taskData.getAll('attachments');
      if (attachments && attachments.length > 0) {
        const invalidFiles = attachments.filter(file => {
          return file && file.type && !file.type.includes('pdf');
        });
        if (invalidFiles.length > 0) {
          throw new Error('Only PDF files are allowed');
        }
      }

      const response = await api.post('/tasks', taskData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Task creation response:', response.data); // Debug log

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create task');
      }

      return response.data.data;
    } catch (error) {
      console.error('Error creating task:', error); // Debug log
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to create task'
      );
    }
  }
);

export const updateExistingTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Append task data
      Object.entries(taskData).forEach(([key, value]) => {
        if (key !== 'attachments') {
          formData.append(key, value);
        }
      });

      // Append new attachments
      if (taskData.attachments) {
        taskData.attachments.forEach(file => {
          formData.append('attachments', file);
        });
      }

      const response = await api.put(`/tasks/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteExistingTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const uploadTaskDocument = createAsyncThunk(
  'tasks/uploadDocument',
  async ({ taskId, file }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/tasks/${taskId}/documents`, file);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteTaskDocument = createAsyncThunk(
  'tasks/deleteDocument',
  async ({ taskId, docId }, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${taskId}/documents/${docId}`);
      return { taskId, docId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
); 