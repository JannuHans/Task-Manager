const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updateUserRole
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Admin only routes
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.put('/:id/toggle-status', toggleUserStatus);
router.put('/:id/role', updateUserRole);

module.exports = router; 