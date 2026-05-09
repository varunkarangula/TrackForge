const taskService = require('../services/taskService.js');

const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.user._id);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.user._id, req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(req.user._id, req.params.id, req.body);
    res.json(task);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.user._id, req.params.id);
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const toggleTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await taskService.toggleTaskStatus(req.user._id, req.params.id, status);
    res.json(task);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
};
