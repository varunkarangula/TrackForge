const budgetService = require('../services/budgetService.js');

const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const budgets = await budgetService.getBudgets(req.user._id, parseInt(month), parseInt(year));
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBudget = async (req, res) => {
  try {
    const budget = await budgetService.createBudget(req.user._id, req.body);
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBudget = async (req, res) => {
  try {
    const budget = await budgetService.updateBudget(req.user._id, req.params.id, req.body);
    res.json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBudget = async (req, res) => {
  try {
    await budgetService.deleteBudget(req.user._id, req.params.id);
    res.json({ message: 'Budget removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget
};
