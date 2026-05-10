const Transaction = require('../models/Transaction.js');
const Account = require('../models/Account.js');
const mongoose = require('mongoose');

const getTransactions = async (userId, filters = {}) => {
  const query = { user: userId };
  if (filters.type && filters.type !== 'all') query.type = filters.type;
  if (filters.category && filters.category !== 'all') query.category = filters.category;
  if (filters.account && filters.account !== 'all') query.account = filters.account;
  if (filters.month) {
    const [year, month] = filters.month.split('-');
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    query.datetime = { $gte: startDate, $lte: endDate };
  }
  return await Transaction.find(query).populate('category').populate('account').sort({ datetime: -1 });
};

const createTransaction = async (userId, transactionData) => {
  const account = await Account.findOne({ _id: transactionData.account, user: userId });
  if (!account) throw new Error('Account not found');

  const transaction = new Transaction({
    user: userId,
    ...transactionData
  });

  await transaction.save();

  // Update account balance
  if (transaction.type === 'income') {
    account.balance += transaction.amount;
  } else {
    account.balance -= transaction.amount;
  }
  await account.save();

  return await transaction.populate(['category', 'account']);
};

const updateTransaction = async (userId, transactionId, transactionData) => {
  const oldTransaction = await Transaction.findOne({ _id: transactionId, user: userId });
  if (!oldTransaction) throw new Error('Transaction not found or not authorized');

  const oldAccount = await Account.findOne({ _id: oldTransaction.account, user: userId });
  if (!oldAccount) throw new Error('Original account not found');

  // Revert old transaction effect
  if (oldTransaction.type === 'income') {
    oldAccount.balance -= oldTransaction.amount;
  } else {
    oldAccount.balance += oldTransaction.amount;
  }
  await oldAccount.save();

  // Apply new transaction
  Object.assign(oldTransaction, transactionData);
  await oldTransaction.save();

  const newAccount = await Account.findOne({ _id: oldTransaction.account, user: userId });
  if (!newAccount) throw new Error('New account not found');

  if (oldTransaction.type === 'income') {
    newAccount.balance += oldTransaction.amount;
  } else {
    newAccount.balance -= oldTransaction.amount;
  }
  await newAccount.save();

  return await oldTransaction.populate(['category', 'account']);
};

const deleteTransaction = async (userId, transactionId) => {
  const transaction = await Transaction.findOne({ _id: transactionId, user: userId });
  if (!transaction) throw new Error('Transaction not found or not authorized');

  const account = await Account.findOne({ _id: transaction.account, user: userId });
  if (account) {
    if (transaction.type === 'income') {
      account.balance -= transaction.amount;
    } else {
      account.balance += transaction.amount;
    }
    await account.save();
  }

  await Transaction.deleteOne({ _id: transactionId });
  return transactionId;
};

const getTransactionSummary = async (userId, monthStr) => {
  let startOfMonth, endOfMonth;
  if (monthStr) {
    const [year, month] = monthStr.split('-');
    startOfMonth = new Date(year, parseInt(month) - 1, 1);
    endOfMonth = new Date(year, parseInt(month), 0, 23, 59, 59, 999);
  } else {
    startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);
  }

  const populatedAggregation = await Transaction.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), datetime: { $gte: startOfMonth, $lt: endOfMonth } } },
    { $group: {
      _id: { type: '$type', category: '$category' },
      total: { $sum: '$amount' }
    }},
    { $lookup: {
      from: 'categories',
      localField: '_id.category',
      foreignField: '_id',
      as: 'categoryInfo'
    }},
    { $unwind: '$categoryInfo' }
  ]);

  const expenseBreakdown = populatedAggregation
    .filter(item => item._id.type === 'expense')
    .map(item => ({ name: item.categoryInfo.name, color: item.categoryInfo.color, total: item.total }));

  const incomeBreakdown = populatedAggregation
    .filter(item => item._id.type === 'income')
    .map(item => ({ name: item.categoryInfo.name, color: item.categoryInfo.color, total: item.total }));

  const totalExpense = expenseBreakdown.reduce((sum, item) => sum + item.total, 0);
  const totalIncome = incomeBreakdown.reduce((sum, item) => sum + item.total, 0);

  // Bar chart data for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0,0,0,0);

  const trendAggregation = await Transaction.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), datetime: { $gte: sixMonthsAgo } } },
    { $group: {
      _id: { 
        year: { $year: '$datetime' }, 
        month: { $month: '$datetime' },
        type: '$type'
      },
      total: { $sum: '$amount' }
    }}
  ]);

  // Format trend data
  const trendMap = {};
  trendAggregation.forEach(item => {
    const key = `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`;
    if (!trendMap[key]) trendMap[key] = { name: key, income: 0, expense: 0 };
    trendMap[key][item._id.type] = item.total;
  });

  const trendData = Object.values(trendMap).sort((a, b) => a.name.localeCompare(b.name));

  return { 
    totalExpense, 
    totalIncome, 
    net: totalIncome - totalExpense, 
    expenseBreakdown, 
    incomeBreakdown,
    trendData
  };
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary
};
