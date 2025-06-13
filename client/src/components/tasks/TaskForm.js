import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createNewTask,
  updateExistingTask,
  fetchTask,
} from '../../store/thunks/taskThunks';
import { fetchUsers } from '../../store/thunks/userThunks';
import Input from '../common/Input';
import Button from '../common/Button';
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

const TaskForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { loading, error } = useSelector((state) => state.tasks);
  const { users } = useSelector((state) => state.users);
  const { currentUser } = useSelector((state) => state.auth);
  const isAdmin = currentUser?.role === 'admin';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    assignedTo: isAdmin ? '' : (currentUser?._id || ''),
  });

  const [formErrors, setFormErrors] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [attachmentErrors, setAttachmentErrors] = useState('');

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchUsers({ page: 1, limit: 100 }));
    }
    if (isEditMode) {
      dispatch(fetchTask(id)).then((action) => {
        if (action.payload) {
          setFormData({
            title: action.payload.title,
            description: action.payload.description,
            status: action.payload.status,
            priority: action.payload.priority,
            dueDate: new Date(action.payload.dueDate).toISOString().split('T')[0],
            assignedTo: action.payload.assignedTo?._id || '',
          });
        }
      });
    }
  }, [dispatch, id, isEditMode, isAdmin]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.dueDate) {
      errors.dueDate = 'Due date is required';
    }
    if (!formData.assignedTo) {
      errors.assignedTo = 'Please assign the task to someone';
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter(file => file && file.type && file.type.includes('application/pdf'));
    
    if (pdfFiles.length !== files.length) {
      setAttachmentErrors('Only PDF files are allowed');
      return;
    }

    setAttachments(pdfFiles);
    setAttachmentErrors('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('priority', formData.priority);
    formDataToSend.append('dueDate', formData.dueDate);
    formDataToSend.append('assignedTo', formData.assignedTo);
    
    // Only append attachments if they exist
    if (attachments && attachments.length > 0) {
      attachments.forEach(file => {
        if (file) {
          formDataToSend.append('attachments', file);
        }
      });
    }

    try {
      if (isEditMode) {
        await dispatch(updateExistingTask({ id, taskData: formDataToSend })).unwrap();
      } else {
        await dispatch(createNewTask(formDataToSend)).unwrap();
      }
      navigate('/tasks');
    } catch (error) {
      console.error('Task submission error:', error);
      if (error.message.includes('attachments')) {
        setAttachmentErrors(error.message);
      } else {
        setFormErrors({ submit: error.message });
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Edit Task' : 'Create New Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={formErrors.title}
            required
            placeholder="Enter task title"
            disabled={!isAdmin && isEditMode}
          />

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                formErrors.description ? 'border-red-300' : ''
              }`}
              placeholder="Enter task description"
              disabled={!isAdmin && isEditMode}
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                disabled={!isAdmin && isEditMode && formData.assignedTo !== currentUser?._id}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                disabled={!isAdmin && isEditMode}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Input
              label="Due Date"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              error={formErrors.dueDate}
              required
              disabled={!isAdmin && isEditMode}
            />

            <div>
              <label
                htmlFor="assignedTo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Assign To
                <span className="text-red-500 ml-1">*</span>
              </label>
              {isAdmin ? (
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    formErrors.assignedTo ? 'border-red-300' : ''
                  }`}
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="assignedTo"
                  name="assignedTo"
                  value={currentUser?.name || ''}
                  className={`block w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${
                    formErrors.assignedTo ? 'border-red-300' : ''
                  }`}
                  disabled
                />
              )}
              {formErrors.assignedTo && (
                <p className="mt-1 text-sm text-red-600">{formErrors.assignedTo}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attachments (PDF files only, minimum 3 required)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="attachments"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="attachments"
                      name="attachments"
                      type="file"
                      multiple
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF files only, up to 5MB each</p>
              </div>
            </div>
            {attachmentErrors && (
              <p className="mt-2 text-sm text-red-600">{attachmentErrors}</p>
            )}
            {attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Selected files:</h4>
                <ul className="mt-2 divide-y divide-gray-200">
                  {attachments.map((file, index) => (
                    <li key={index} className="py-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <DocumentIcon className="h-5 w-5 text-gray-400" />
                        <span className="ml-2 text-sm text-gray-500">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAttachments(attachments.filter((_, i) => i !== index));
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm">
              <p>{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/tasks')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
            >
              {isEditMode ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm; 