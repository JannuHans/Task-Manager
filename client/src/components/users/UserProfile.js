import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateExistingUser, deleteExistingUser } from '../../store/slices/userSlice';
import { logout } from '../../store/slices/authSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import { PERMISSIONS, canManageUser } from '../../utils/permissions';
import withPermission from '../common/withPermission';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const { isLoading, error } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email,
      }));
    }
  }, [currentUser]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required to set new password';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.newPassword) {
        userData.currentPassword = formData.currentPassword;
        userData.newPassword = formData.newPassword;
      }

      await dispatch(updateExistingUser({ id: currentUser._id, userData })).unwrap();
      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      // Error is handled by the Redux state
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await dispatch(deleteExistingUser(currentUser._id)).unwrap();
        dispatch(logout());
        navigate('/login');
      } catch (error) {
        // Error is handled by the Redux state
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={formErrors.name}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={formErrors.email}
          required
        />

        <div className="border-t pt-6">
          <h2 className="text-lg font-medium mb-4">Change Password</h2>
          <div className="space-y-4">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              error={formErrors.currentPassword}
            />

            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              error={formErrors.newPassword}
            />

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            type="button"
            variant="danger"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default withPermission(UserProfile, PERMISSIONS.VIEW_OWN_PROFILE); 