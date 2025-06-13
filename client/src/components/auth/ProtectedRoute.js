import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../../store/slices/authSlice';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ roles = [] }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentUser, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !currentUser) {
      dispatch(getCurrentUser());
    }
  }, [currentUser, dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0) {
    const hasRequiredRole = roles.includes(currentUser?.role);
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

ProtectedRoute.propTypes = {
  roles: PropTypes.array,
};

export default ProtectedRoute; 