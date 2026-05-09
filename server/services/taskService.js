const Task = require('../models/Task.js');

const getTasks = async (userId) => {
  return await Task.find({ user: userId }).sort({ createdAt: -1 });
};

const createTask = async (userId, taskData) => {
  const task = new Task({
    user: userId,
    ...taskData
  });
  return await task.save();
};

const updateTask = async (userId, taskId, taskData) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) throw new Error('Task not found or not authorized');

  const updatedTask = await Task.findByIdAndUpdate(taskId, taskData, { new: true });
  return updatedTask;
};

const deleteTask = async (userId, taskId) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) throw new Error('Task not found or not authorized');

  await Task.deleteOne({ _id: taskId });
  return taskId;
};

const toggleTaskStatus = async (userId, taskId, status) => {
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) throw new Error('Task not found or not authorized');

  task.status = status;
  return await task.save();
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
};
