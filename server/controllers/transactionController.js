const transactionService = require('../services/transactionService.js');

const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactions(req.user._id, req.query);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.createTransaction(req.user._id, req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.updateTransaction(req.user._id, req.params.id, req.body);
    res.json(transaction);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    await transactionService.deleteTransaction(req.user._id, req.params.id);
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getTransactionSummary = async (req, res) => {
  try {
    const summary = await transactionService.getTransactionSummary(req.user._id, req.query.month);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary
};
