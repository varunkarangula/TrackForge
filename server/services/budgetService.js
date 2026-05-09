const Budget = require('../models/Budget.js');
const Transaction = require('../models/Transaction.js');
const mongoose = require('mongoose');

const getBudgets = async (userId, month, year) => {
  const currentMonth = month || (new Date().getMonth() + 1);
  const currentYear = year || new Date().getFullYear();

  const budgets = await Budget.find({ 
    user: userId, 
    month: currentMonth, 
    year: currentYear 
  }).populate('category');

  // Compute spent amount on the fly
  const startDate = new Date(currentYear, currentMonth - 1, 1);
  const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);

  const spentAggregation = await Transaction.aggregate([
    { 
      $match: { 
        user: new mongoose.Types.ObjectId(userId), 
        type: 'expense',
        datetime: { $gte: startDate, $lte: endDate } 
      } 
    },
    { 
      $group: { 
        _id: '$category', 
        spent: { $sum: '$amount' } 
      } 
    }
  ]);

  const spentMap = {};
  spentAggregation.forEach(item => {
    spentMap[item._id.toString()] = item.spent;
  });

  return budgets.map(budget => {
    const budgetObj = budget.toObject();
    budgetObj.spent = spentMap[budget.category._id.toString()] || 0;
    return budgetObj;
  });
};

const createBudget = async (userId, budgetData) => {
  const { category, limitAmount, month, year } = budgetData;

  const existingBudget = await Budget.findOne({ user: userId, category, month, year });
  if (existingBudget) {
    throw new Error('Budget already exists for this category and month');
  }

  const budget = new Budget({
    user: userId,
    ...budgetData
  });
  return await budget.save();
};

const updateBudget = async (userId, budgetId, budgetData) => {
  const budget = await Budget.findOne({ _id: budgetId, user: userId });
  if (!budget) throw new Error('Budget not found or not authorized');

  budget.limitAmount = budgetData.limitAmount;
  return await budget.save();
};

const deleteBudget = async (userId, budgetId) => {
  const budget = await Budget.findOne({ _id: budgetId, user: userId });
  if (!budget) throw new Error('Budget not found or not authorized');

  await Budget.deleteOne({ _id: budgetId });
  return budgetId;
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget
};
