const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createError } = require('../utils/error');

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(createError(401, 'Not authorized to access this route'));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(createError(401, 'User not found'));
      }

      if (!user.isActive) {
        return next(createError(401, 'Account is deactivated'));
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return next(createError(401, 'Invalid token'));
      }
      if (error.name === 'TokenExpiredError') {
        return next(createError(401, 'Token expired'));
      }
      return next(createError(401, 'Not authorized to access this route'));
    }
  } catch (error) {
    next(error);
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(createError(403, `User role ${req.user.role} is not authorized to access this route`));
    }
    next();
  };
}; 