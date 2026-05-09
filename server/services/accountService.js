const Account = require('../models/Account.js');
const Transaction = require('../models/Transaction.js');
const Category = require('../models/Category.js');

const getAccounts = async (userId) => {
  return await Account.find({ user: userId }).sort({ createdAt: 1 });
};

const createAccount = async (userId, accountData) => {
  const account = new Account({
    user: userId,
    ...accountData
  });
  return await account.save();
};

const updateAccount = async (userId, accountId, accountData) => {
  const account = await Account.findOne({ _id: accountId, user: userId });
  if (!account) throw new Error('Account not found or not authorized');

  Object.assign(account, accountData);
  return await account.save();
};

const deleteAccount = async (userId, accountId) => {
  const account = await Account.findOne({ _id: accountId, user: userId });
  if (!account) throw new Error('Account not found or not authorized');

  const transactions = await Transaction.countDocuments({ account: accountId });
  if (transactions > 0) {
    throw new Error('Cannot delete account: it has existing transactions');
  }

  await Account.deleteOne({ _id: accountId });
  return accountId;
};

const transferFunds = async (userId, transferData) => {
  const { fromAccountId, toAccountId, amount, description, datetime } = transferData;
  if (amount <= 0) throw new Error('Amount must be greater than zero');
  if (fromAccountId === toAccountId) throw new Error('Source and destination accounts must be different');

  const fromAccount = await Account.findOne({ _id: fromAccountId, user: userId });
  const toAccount = await Account.findOne({ _id: toAccountId, user: userId });

  if (!fromAccount || !toAccount) {
    throw new Error('One or both accounts not found');
  }

  const transferCategory = await Category.findOne({ user: userId, name: 'Transfer' });
  if (!transferCategory) {
    throw new Error('Transfer category not found');
  }

  // Create transactions
  const expenseTx = new Transaction({
    user: userId,
    type: 'expense',
    amount,
    category: transferCategory._id,
    account: fromAccountId,
    description: description || 'Transfer Out',
    datetime: datetime || Date.now()
  });

  const incomeTx = new Transaction({
    user: userId,
    type: 'income',
    amount,
    category: transferCategory._id,
    account: toAccountId,
    description: description || 'Transfer In',
    datetime: datetime || Date.now()
  });

  await expenseTx.save();
  await incomeTx.save();

  // Update balances
  fromAccount.balance -= amount;
  toAccount.balance += amount;

  await fromAccount.save();
  await toAccount.save();

  return { message: 'Transfer successful' };
};

module.exports = {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  transferFunds
};
