const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { upload } = require('../utils/fileUpload');

// Apply authentication middleware to all routes
router.use(protect);

// Get all tasks
router.get('/', getTasks);

// Create new task
router.post('/', upload.array('attachments'), createTask);

// Get task by ID
router.get('/:id', getTaskById);

// Update task
router.put('/:id', upload.array('attachments'), updateTask);

// Delete task
router.delete('/:id', deleteTask);

module.exports = router; 