const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware.js');
const { getSubscriptions, createSubscription, updateSubscription, deleteSubscription } = require('../controllers/subscriptionController.js');

router.route('/').get(protect, getSubscriptions).post(protect, createSubscription);
router.route('/:id').put(protect, updateSubscription).delete(protect, deleteSubscription);

module.exports = router;
