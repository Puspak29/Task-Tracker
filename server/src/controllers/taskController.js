const Task = require('../models/Task');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');

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

// Helper to compute task stats for a user
const getTaskStats = async (userId) => {
  const userFilter = { user: userId };
  const [total, todo, inProgress, done] = await Promise.all([
    Task.countDocuments(userFilter),
    Task.countDocuments({ ...userFilter, status: 'todo' }),
    Task.countDocuments({ ...userFilter, status: 'in-progress' }),
    Task.countDocuments({ ...userFilter, status: 'done' }),
  ]);
  return { total, todo, inProgress, done };
};

// @desc    Get all tasks for the authenticated user
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
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
  const stats = await getTaskStats(req.user.id);

  sendSuccess(res, 200, { count: tasks.length, stats, data: tasks });
});

// @desc    Get single task (must belong to user)
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  sendSuccess(res, 200, { data: task });
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, tags } = req.body;

  if (!title || !title.trim()) {
    throw new AppError('Task title is required', 400);
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

  sendSuccess(res, 201, { data: task });
});

// @desc    Update task (must belong to user)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
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
    throw new AppError('Task not found', 404);
  }

  sendSuccess(res, 200, { data: updatedTask });
});

// @desc    Delete task (must belong to user)
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!task) {
    throw new AppError('Task not found', 404);
  }
  sendSuccess(res, 200, { message: 'Task deleted successfully', data: task });
});

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
