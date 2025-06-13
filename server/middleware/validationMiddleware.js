const { validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  console.log('Validating request body:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Validation schemas
const authValidation = {
  register: [
    {
      field: 'name',
      rules: [
        { type: 'notEmpty', message: 'Name is required' },
        { type: 'isLength', options: { min: 2, max: 50 }, message: 'Name must be between 2 and 50 characters' }
      ]
    },
    {
      field: 'email',
      rules: [
        { type: 'notEmpty', message: 'Email is required' },
        { type: 'isEmail', message: 'Please enter a valid email' }
      ]
    },
    {
      field: 'password',
      rules: [
        { type: 'notEmpty', message: 'Password is required' },
        { type: 'isLength', options: { min: 6 }, message: 'Password must be at least 6 characters long' }
      ]
    }
  ],
  login: [
    {
      field: 'email',
      rules: [
        { type: 'notEmpty', message: 'Email is required' },
        { type: 'isEmail', message: 'Please enter a valid email' }
      ]
    },
    {
      field: 'password',
      rules: [
        { type: 'notEmpty', message: 'Password is required' }
      ]
    }
  ]
};

const taskValidation = {
  create: [
    {
      field: 'title',
      rules: [
        { type: 'notEmpty', message: 'Title is required' },
        { type: 'isLength', options: { min: 3, max: 100 }, message: 'Title must be between 3 and 100 characters' }
      ]
    },
    {
      field: 'description',
      rules: [
        { type: 'notEmpty', message: 'Description is required' },
        { type: 'isLength', options: { min: 10 }, message: 'Description must be at least 10 characters long' }
      ]
    },
    {
      field: 'status',
      rules: [
        { type: 'isIn', options: { values: ['pending', 'in-progress', 'completed'] }, message: 'Invalid status' }
      ]
    },
    {
      field: 'priority',
      rules: [
        { type: 'isIn', options: { values: ['low', 'medium', 'high'] }, message: 'Invalid priority' }
      ]
    },
    {
      field: 'dueDate',
      rules: [
        { type: 'notEmpty', message: 'Due date is required' },
        { type: 'isDate', message: 'Invalid date format' }
      ]
    },
    {
      field: 'assignedTo',
      rules: [
        { type: 'notEmpty', message: 'Assigned user is required' },
        { type: 'isMongoId', message: 'Invalid user ID' }
      ]
    }
  ],
  update: [
    {
      field: 'title',
      rules: [
        { type: 'optional' },
        { type: 'isLength', options: { min: 3, max: 100 }, message: 'Title must be between 3 and 100 characters' }
      ]
    },
    {
      field: 'description',
      rules: [
        { type: 'optional' },
        { type: 'isLength', options: { min: 10 }, message: 'Description must be at least 10 characters long' }
      ]
    },
    {
      field: 'status',
      rules: [
        { type: 'optional' },
        { type: 'isIn', options: { values: ['pending', 'in-progress', 'completed'] }, message: 'Invalid status' }
      ]
    },
    {
      field: 'priority',
      rules: [
        { type: 'optional' },
        { type: 'isIn', options: { values: ['low', 'medium', 'high'] }, message: 'Invalid priority' }
      ]
    },
    {
      field: 'dueDate',
      rules: [
        { type: 'optional' },
        { type: 'isDate', message: 'Invalid date format' }
      ]
    },
    {
      field: 'assignedTo',
      rules: [
        { type: 'optional' },
        { type: 'isMongoId', message: 'Invalid user ID' }
      ]
    }
  ]
};

module.exports = {
  validate,
  authValidation,
  taskValidation
}; 