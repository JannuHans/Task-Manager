const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must be assigned to a user'],
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must have an assigner'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must have a creator'],
    },
    attachments: [{
      filename: {
        type: String,
        required: true
      },
      originalName: {
        type: String,
        required: true
      },
      path: {
        type: String,
        required: true
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ assignedBy: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ dueDate: 1 });

// Virtual for checking if task is overdue
taskSchema.virtual('isOverdue').get(function () {
  return this.dueDate < new Date() && this.status !== 'completed';
});

// Method to check if task can have more documents
taskSchema.methods.canAddDocument = function () {
  return true; // Allow unlimited documents
};

// Method to add document
taskSchema.methods.addDocument = function (document) {
  this.documents.push(document);
};

module.exports = mongoose.model('Task', taskSchema); 