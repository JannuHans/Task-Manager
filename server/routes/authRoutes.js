const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { register, login, getMe, createAdmin, createFirstAdmin } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty().trim(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  validate,
  register
);

// @route   POST /api/auth/create-first-admin
// @desc    Create first admin user (no auth required)
// @access  Public
router.post(
  '/create-first-admin',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  validate,
  createFirstAdmin
);

// @route   POST /api/auth/create-admin
// @desc    Create admin user
// @access  Private/Admin
router.post(
  '/create-admin',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  validate,
  protect,
  authorize('admin'),
  createAdmin
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  validate,
  login
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe);

module.exports = router; 