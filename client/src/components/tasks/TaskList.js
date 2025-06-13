import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, deleteExistingTask } from '../../store/thunks/taskThunks';
import { fetchUsers } from '../../store/thunks/userThunks';
import Button from '../common/Button';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { DocumentIcon } from '@heroicons/react/24/outline';

const TaskList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks = [], isLoading, error, totalPages, currentPage } = useSelector((state) => state.tasks);
  const { currentUser, isAuthenticated } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);
  const isAdmin = currentUser?.role === 'admin';

  console.log('TaskList State:', { tasks, isLoading, error, totalPages, currentPage }); // Debug log

  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    assignedTo: '',
  });

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      dispatch(fetchUsers({ page: 1, limit: 100 }));
    }
  }, [dispatch, isAdmin, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Fetching tasks with filters:', filters); // Debug log
      const params = { page: currentPage, ...filters };
      if (!isAdmin) {
        params.assignedTo = currentUser?._id;
      } else if (filters.assignedTo) {
        params.assignedTo = filters.assignedTo;
      }
      dispatch(fetchTasks(params));
    }
  }, [dispatch, currentPage, filters, isAdmin, currentUser?._id, isAuthenticated]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      console.log('New filters:', newFilters); // Debug log
      return newFilters;
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = { page: newPage, ...filters };
      if (!isAdmin) {
        params.assignedTo = currentUser?._id;
      } else if (filters.assignedTo) {
        params.assignedTo = filters.assignedTo;
      }
      dispatch(fetchTasks(params));
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteExistingTask(taskId)).unwrap();
        // Refresh the task list after deletion
        const params = { page: currentPage, ...filters };
        if (!isAdmin) {
          params.assignedTo = currentUser?._id;
        } else if (filters.assignedTo) {
          params.assignedTo = filters.assignedTo;
        }
        dispatch(fetchTasks(params));
      } catch (error) {
        // Error is handled by the Redux state
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Tasks</h2>
          <Button onClick={() => navigate('/tasks/new')} variant="primary">
            New Task
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className={`grid grid-cols-1 gap-4 ${isAdmin ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              id="priority"
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {isAdmin && (
            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">Assigned To</label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={filters.assignedTo}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Users</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              name="search"
              id="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search tasks..."
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned By
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(tasks) && tasks.length > 0 ? (
                tasks.map((task) => {
                  const isAssignedToCurrentUser = task.assignedTo?._id === currentUser?._id;
                  const isCreatedByCurrentUser = task.createdBy?._id === currentUser?._id;
                  const canDelete = isCreatedByCurrentUser;

                  return (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500">{task.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.assignedTo?.name || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.assignedBy?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Menu as="div" className="relative inline-block text-left">
                          <div>
                            <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                              <EllipsisVerticalIcon className="w-5 h-5" aria-hidden="true" />
                            </Menu.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1">
                                {task.attachments && task.attachments.length > 0 && (
                                  <div className="px-4 py-2 border-b border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-700">Attachments</h3>
                                    <ul className="mt-2 space-y-1">
                                      {task.attachments.map((attachment, index) => (
                                        <li key={index}>
                                          <a
                                            href={attachment.path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                          >
                                            <DocumentIcon className="h-4 w-4 mr-2" />
                                            {attachment.originalName}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {(isAdmin || isAssignedToCurrentUser) && (
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => navigate(`/tasks/${task._id}/edit`)}
                                        className={`${
                                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        } flex w-full px-4 py-2 text-sm`}
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </Menu.Item>
                                )}
                                {canDelete && (
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => handleDeleteTask(task._id)}
                                        className={`${
                                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                        } flex w-full px-4 py-2 text-sm text-red-600`}
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </Menu.Item>
                                )}
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    {isLoading ? 'Loading tasks...' : 'No tasks found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList; 