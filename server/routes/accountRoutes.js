const express = require('express');
const router = express.Router();
const { getAccounts, createAccount, updateAccount, deleteAccount, transferFunds } = require('../controllers/accountController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.use(protect);

router.post('/transfer', transferFunds);
router.route('/').get(getAccounts).post(createAccount);
router.route('/:id').put(updateAccount).delete(deleteAccount);

module.exports = router;
