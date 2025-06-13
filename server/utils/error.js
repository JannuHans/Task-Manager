class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const createError = (statusCode, message) => {
  return new AppError(message, statusCode);
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        status: err.status,
        statusCode: err.statusCode,
        stack: err.stack
      }
    });
  } else {
    // Production mode
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        error: {
          message: err.message,
          status: err.status
        }
      });
    } else {
      // Programming or unknown errors
      console.error('ERROR 💥', err);
      res.status(500).json({
        success: false,
        error: {
          message: 'Something went wrong',
          status: 'error'
        }
      });
    }
  }
};

module.exports = {
  AppError,
  createError,
  errorHandler
}; 