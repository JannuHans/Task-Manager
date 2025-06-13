import React from 'react';
import { useSelector } from 'react-redux';
import { hasPermission } from '../../utils/permissions';

const withPermission = (WrappedComponent, requiredPermission) => {
  return (props) => {
    const { currentUser } = useSelector((state) => state.auth);
    const hasRequiredPermission = hasPermission(currentUser?.role, requiredPermission);

    if (!hasRequiredPermission) {
      return (
        <div className="text-center p-4">
          <p className="text-red-600">You don't have permission to access this page.</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withPermission; 