import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';

// Layout
import Layout from './components/layout/Layout';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import FirstAdminCreation from './components/auth/FirstAdminCreation';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminCreation from './components/admin/AdminCreation';
import UserList from './components/users/UserList';
import UserForm from './components/users/UserForm';

// User Components
import Dashboard from './components/dashboard/Dashboard';
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/TaskForm';
import UserProfile from './components/users/UserProfile';

const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

function App() {
  const dispatch = useDispatch();
  const { currentUser, isLoading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Attempt to get current user from token in localStorage on app load
    const token = localStorage.getItem('token');
    if (token && !currentUser) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, currentUser]);

  // You might want to show a global loading spinner here while auth state is being determined
  if (authLoading) {
    return <div>Loading Application...</div>; 
  }

  return (
    <Router {...router}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-first-admin" element={<FirstAdminCreation />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute roles={['admin']} />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserList />} />
              <Route path="users/new" element={<UserForm />} />
              <Route path="users/:id" element={<UserForm />} />
              <Route path="tasks" element={<TaskList />} />
              <Route path="tasks/new" element={<TaskForm />} />
              <Route path="tasks/:id/edit" element={<TaskForm />} />
              <Route path="create-admin" element={<AdminCreation />} />
            </Route>

            {/* User Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/new" element={<TaskForm />} />
            <Route path="/tasks/:id/edit" element={<TaskForm />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Route>

        {/* Redirect root to appropriate dashboard */}
        <Route path="/" element={
          currentUser?.role === 'admin' ? 
            <Navigate to="/admin/dashboard" replace /> : 
            <Navigate to="/dashboard" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App; 