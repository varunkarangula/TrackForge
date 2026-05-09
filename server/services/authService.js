const User = require('../models/User.js');
const Category = require('../models/Category.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const seedDefaultCategories = async (userId) => {
  const defaultCategories = [
    { user: userId, name: 'Food', type: 'expense', icon: '🍔', color: '#EF4444', isDefault: true },
    { user: userId, name: 'Grocery', type: 'expense', icon: '🛒', color: '#22C55E', isDefault: true },
    { user: userId, name: 'Rent', type: 'expense', icon: '🏠', color: '#6366F1', isDefault: true },
    { user: userId, name: 'Transport', type: 'expense', icon: '🚗', color: '#F59E0B', isDefault: true },
    { user: userId, name: 'Shopping', type: 'expense', icon: '🛍️', color: '#EC4899', isDefault: true },
    { user: userId, name: 'Subscription', type: 'expense', icon: '📱', color: '#8B5CF6', isDefault: true },
    { user: userId, name: 'Health', type: 'expense', icon: '🏥', color: '#10B981', isDefault: true },
    { user: userId, name: 'Entertainment', type: 'expense', icon: '🎬', color: '#A855F7', isDefault: true },
    { user: userId, name: 'Maintenance', type: 'expense', icon: '🔧', color: '#78716C', isDefault: true },
    { user: userId, name: 'Bills', type: 'expense', icon: '📄', color: '#0EA5E9', isDefault: true },
    { user: userId, name: 'Education', type: 'expense', icon: '📚', color: '#F97316', isDefault: true },
    { user: userId, name: 'Salary', type: 'income', icon: '💰', color: '#22C55E', isDefault: true },
    { user: userId, name: 'Freelance', type: 'income', icon: '💻', color: '#3B82F6', isDefault: true },
    { user: userId, name: 'Investment', type: 'income', icon: '📈', color: '#8B5CF6', isDefault: true },
    { user: userId, name: 'Gift', type: 'income', icon: '🎁', color: '#F43F5E', isDefault: true },
    { user: userId, name: 'Others', type: 'both', icon: '✨', color: '#6B7280', isDefault: true },
    { user: userId, name: 'Transfer', type: 'both', icon: '🔄', color: '#9CA3AF', isDefault: true },
  ];
  await Category.insertMany(defaultCategories);
};

const registerUser = async (name, email, password) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    await seedDefaultCategories(user._id);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    };
  } else {
    throw new Error('Invalid user data');
  }
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    };
  } else {
    throw new Error('Invalid credentials');
  }
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (user) {
    return user;
  } else {
    throw new Error('User not found');
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
