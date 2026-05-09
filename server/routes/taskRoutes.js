const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask, toggleTaskStatus } = require('../controllers/taskController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.use(protect); // All task routes are protected

router.route('/').get(getTasks).post(createTask);
router.route('/:id').put(updateTask).delete(deleteTask);
router.route('/:id/status').patch(toggleTaskStatus);

module.exports = router;
