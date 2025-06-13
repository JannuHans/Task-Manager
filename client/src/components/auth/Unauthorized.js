import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Access Denied
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          You don't have permission to access this page. Please contact your
          administrator if you believe this is a mistake.
        </p>
        <div className="space-y-4">
          <Link to="/dashboard">
            <Button variant="primary" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" className="w-full">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 