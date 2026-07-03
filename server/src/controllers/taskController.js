const Task = require('../models/Task');

// Helper to build sort object
const buildSort = (sortBy, order) => {
  const sortOrder = order === 'asc' ? 1 : -1;
  const sortMap = {
    createdAt: { createdAt: sortOrder },
    dueDate: { dueDate: sortOrder },
    title: { title: sortOrder },
    priority: { priority: sortOrder },
    updatedAt: { updatedAt: sortOrder },
  };
  return sortMap[sortBy] || { createdAt: -1 };
};

// @desc    Get all tasks for the authenticated user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', order = 'desc', tags } = req.query;

    const filter = { user: req.user.id };

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (tags) filter.tags = { $in: tags.split(',') };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(filter).sort(buildSort(sortBy, order));

    const userFilter = { user: req.user.id };
    const stats = {
      total: await Task.countDocuments(userFilter),
      todo: await Task.countDocuments({ ...userFilter, status: 'todo' }),
      inProgress: await Task.countDocuments({ ...userFilter, status: 'in-progress' }),
      done: await Task.countDocuments({ ...userFilter, status: 'done' }),
    };

    res.status(200).json({
      success: true,
      count: tasks.length,
      stats,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task (must belong to user)
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) {
      const err = new Error('Task not found');
      err.statusCode = 404;
      return next(err);
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;

    if (!title || !title.trim()) {
      const err = new Error('Task title is required');
      err.statusCode = 400;
      return next(err);
    }

    const task = await Task.create({
      user: req.user.id,
      title: title.trim(),
      description: description?.trim() || '',
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: Array.isArray(tags) ? tags.map((t) => t.trim()).filter(Boolean) : [],
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task (must belong to user)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, tags } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (status !== undefined) updates.status = status;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate || null;
    if (tags !== undefined)
      updates.tags = Array.isArray(tags) ? tags.map((t) => t.trim()).filter(Boolean) : [];

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      const err = new Error('Task not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task (must belong to user)
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      const err = new Error('Task not found');
      err.statusCode = 404;
      return next(err);
    }
    res.status(200).json({ success: true, message: 'Task deleted successfully', data: task });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
