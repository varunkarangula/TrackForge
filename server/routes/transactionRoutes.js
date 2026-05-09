const express = require('express');
const router = express.Router();
const { getTransactions, createTransaction, updateTransaction, deleteTransaction, getTransactionSummary } = require('../controllers/transactionController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.use(protect);

router.route('/summary').get(getTransactionSummary);
router.route('/').get(getTransactions).post(createTransaction);
router.route('/:id').put(updateTransaction).delete(deleteTransaction);

module.exports = router;
