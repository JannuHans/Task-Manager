import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchTask,
  deleteExistingTask,
  uploadTaskDocument,
  deleteTaskDocument,
} from '../../store/thunks/taskThunks';
import Button from '../common/Button';

const TaskDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentTask: task, loading, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    dispatch(fetchTask(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      await dispatch(deleteExistingTask(id));
      navigate('/tasks');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadingDoc(true);
      await dispatch(uploadTaskDocument({ taskId: id, file }));
      setUploadingDoc(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      await dispatch(deleteTaskDocument({ taskId: id, docId }));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <p>Error loading task: {error}</p>
        <Button
          variant="primary"
          onClick={() => dispatch(fetchTask(id))}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center text-gray-600">
        <p>Task not found</p>
        <Button
          variant="primary"
          onClick={() => navigate('/tasks')}
          className="mt-4"
        >
          Back to Tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
              <div className="mt-2 flex items-center space-x-4">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status.replace('_', ' ')}
                </span>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
                <span className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => navigate(`/tasks/${id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="prose max-w-none">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <p className="mt-2 text-gray-600">{task.description}</p>
          </div>

          {/* Assigned To */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Assigned To</h3>
            <div className="mt-2 flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                {task.assignedTo?.avatar ? (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={task.assignedTo.avatar}
                    alt={task.assignedTo.name}
                  />
                ) : (
                  <span className="text-gray-500 font-medium">
                    {task.assignedTo?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="ml-3 text-gray-900">{task.assignedTo?.name}</span>
            </div>
          </div>

          {/* Documents */}
          <div className="mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Documents</h3>
              <div>
                <label
                  htmlFor="document-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                >
                  <input
                    id="document-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploadingDoc}
                  />
                  {uploadingDoc ? 'Uploading...' : 'Upload Document'}
                </label>
              </div>
            </div>
            {task.documents && task.documents.length > 0 ? (
              <ul className="mt-4 divide-y divide-gray-200">
                {task.documents.map((doc) => (
                  <li key={doc._id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2 text-sm text-gray-900">{doc.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => handleDeleteDocument(doc._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500">No documents attached</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails; 