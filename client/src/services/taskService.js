import api from './api';

const taskService = {
  getTasks: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status, priority, assignedTo, search } = params;
      const queryParams = new URLSearchParams();

      // Add pagination parameters
      queryParams.append('page', page);
      queryParams.append('limit', limit);

      // Add filters only if they have values
      if (status) queryParams.append('status', status);
      if (priority) queryParams.append('priority', priority);
      if (assignedTo) queryParams.append('assignedTo', assignedTo);
      if (search) queryParams.append('search', search);

      console.log('Fetching tasks with params:', Object.fromEntries(queryParams)); // Debug log

      const response = await api.get(`/tasks?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error in getTasks:', error);
      throw error;
    }
  },

  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const formData = new FormData();
    
    // Append task data
    Object.entries(taskData).forEach(([key, value]) => {
      if (key !== 'attachments') {
        formData.append(key, value);
      }
    });

    // Append attachments
    if (taskData.attachments) {
      taskData.attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }

    const response = await api.post('/tasks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateTask: async (id, taskData) => {
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
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  uploadDocument: async (taskId, file) => {
    const formData = new FormData();
    formData.append('document', file);

    const response = await api.post(`/tasks/${taskId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteDocument: async (taskId, docId) => {
    const response = await api.delete(`/tasks/${taskId}/documents/${docId}`);
    return response.data;
  }
};

export default taskService; 