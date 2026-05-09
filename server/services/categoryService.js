const Category = require('../models/Category.js');
const Transaction = require('../models/Transaction.js');

const getCategories = async (userId) => {
  return await Category.find({ user: userId }).sort({ createdAt: 1 });
};

const createCategory = async (userId, categoryData) => {
  const category = new Category({
    user: userId,
    ...categoryData,
    isDefault: false
  });
  return await category.save();
};

const updateCategory = async (userId, categoryId, categoryData) => {
  const category = await Category.findOne({ _id: categoryId, user: userId });
  if (!category) throw new Error('Category not found or not authorized');
  if (category.isDefault) throw new Error('Cannot edit default categories');

  Object.assign(category, categoryData);
  return await category.save();
};

const deleteCategory = async (userId, categoryId) => {
  const category = await Category.findOne({ _id: categoryId, user: userId });
  if (!category) throw new Error('Category not found or not authorized');
  if (category.isDefault) throw new Error('Cannot delete default categories');

  const transactions = await Transaction.countDocuments({ category: categoryId });
  if (transactions > 0) {
    throw new Error('Cannot delete category: it is used in existing transactions');
  }

  await Category.deleteOne({ _id: categoryId });
  return categoryId;
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
