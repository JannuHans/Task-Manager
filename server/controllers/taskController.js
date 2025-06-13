const Task = require('../models/Task');
const User = require('../models/User');
const { deleteFile } = require('../utils/fileUpload');
const path = require('path');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    console.log('Get tasks request query:', req.query); // Debug log
    console.log('Get tasks request user:', req.user); // Debug log

    const { page = 1, limit = 10, status, priority, assignedTo, search } = req.query;
    const query = {};

    // Log each filter being applied
    if (status) {
      query.status = status;
      console.log('Applying status filter:', status);
    }
    if (priority) {
      query.priority = priority;
      console.log('Applying priority filter:', priority);
    }
    if (assignedTo) {
      query.assignedTo = assignedTo;
      console.log('Applying assignedTo filter:', assignedTo);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
      console.log('Applying search filter:', search);
    }

    console.log('Final query:', query); // Debug log

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    console.log('Found tasks:', tasks.length); // Debug log
    console.log('Total tasks:', total); // Debug log

    res.json({
      success: true,
      data: {
        tasks,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Error in getTasks:', error); // Debug log
    res.status(500).json({
      success: false,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if user has access to the task
    if (
      req.user.role !== 'admin' &&
      task.assignedTo._id.toString() !== req.user.id &&
      task.createdBy._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task',
      });
    }

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const files = req.files;

    // Validate required fields
    if (!title || !description || !status || !priority || !dueDate || !assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, status, priority, dueDate, and assignedTo'
      });
    }

    // Validate file types if files are provided
    if (files && files.length > 0) {
      const invalidFiles = files.filter(file => !file.mimetype.includes('pdf'));
      if (invalidFiles.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Only PDF files are allowed. Please upload PDF files only.'
        });
      }
    }

    // Process uploaded files
    const attachments = files ? files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: `/uploads/${file.filename}`
    })) : [];

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      assignedBy: req.user.id,
      createdBy: req.user.id,
      attachments
    });

    // Populate user details
    await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'assignedBy', select: 'name email' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating task'
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    const files = req.files;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has permission to update
    if (task.createdBy.toString() !== req.user.id && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    // Handle new file uploads if provided
    if (files && files.length > 0) {
      // Process new files
      const newAttachments = files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: `/uploads/${file.filename}`
      }));

      task.attachments = [...task.attachments, ...newAttachments];
    }

    // Update task fields
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;

    await task.save();

    // Populate user details
    await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'assignedBy', select: 'name email' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Only task creator can delete
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the task creator can delete this task'
      });
    }

    // Delete attachments
    task.attachments.forEach(attachment => {
      deleteFile(attachment.filename);
    });

    await task.remove();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload document
// @route   POST /api/tasks/:id/documents
// @access  Private
exports.uploadDocument = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if user has permission to upload
    if (
      req.user.role !== 'admin' &&
      task.assignedTo.toString() !== req.user.id &&
      task.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to upload documents for this task',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Check if file is PDF
    if (req.file.mimetype !== 'application/pdf') {
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed',
      });
    }

    // Add document to task
    task.addDocument({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
    });

    await task.save();

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete document
// @route   DELETE /api/tasks/:id/documents/:docId
// @access  Private
exports.deleteDocument = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if user has permission to delete
    if (
      req.user.role !== 'admin' &&
      task.assignedTo.toString() !== req.user.id &&
      task.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete documents for this task',
      });
    }

    const document = task.documents.id(req.params.docId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Delete file from storage
    try {
      await fs.unlink(document.path);
    } catch (error) {
      console.error(`Error deleting file ${document.path}:`, error);
    }

    // Remove document from task
    document.remove();
    await task.save();

    res.json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 