const accountService = require('../services/accountService.js');

const getAccounts = async (req, res) => {
  try {
    const accounts = await accountService.getAccounts(req.user._id);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAccount = async (req, res) => {
  try {
    const account = await accountService.createAccount(req.user._id, req.body);
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAccount = async (req, res) => {
  try {
    const account = await accountService.updateAccount(req.user._id, req.params.id, req.body);
    res.json(account);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await accountService.deleteAccount(req.user._id, req.params.id);
    res.json({ message: 'Account removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const transferFunds = async (req, res) => {
  try {
    const result = await accountService.transferFunds(req.user._id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  transferFunds
};
