const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createError } = require('../utils/error');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Create first admin user (no auth required)
// @route   POST /api/auth/create-first-admin
// @access  Public
exports.createFirstAdmin = async (req, res, next) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log('Missing required fields:', { 
        name: name || 'missing', 
        email: email || 'missing', 
        password: password ? 'present' : 'missing' 
      });
      return next(createError(400, 'Name, email and password are required'));
    }

    // Check if any admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin already exists:', adminExists.email);
      return next(createError(400, 'An admin user already exists'));
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists with email:', email);
      return next(createError(400, 'User already exists'));
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
    });

    console.log('First admin created successfully:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        token
      }
    });
  } catch (error) {
    console.error('Error creating first admin:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.log('Validation errors:', validationErrors);
      return next(createError(400, validationErrors.join(', ')));
    }
    next(error);
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    console.log('Registration request body:', req.body);
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(createError(400, 'User already exists'));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    // Return success without token
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please log in.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

// @desc    Create admin user (protected route)
// @route   POST /api/auth/create-admin
// @access  Private/Admin
exports.createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(createError(400, 'User already exists'));
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(401, 'Invalid email or password'));
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(createError(401, 'Invalid email or password'));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(createError(401, 'Account is deactivated'));
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
}; 