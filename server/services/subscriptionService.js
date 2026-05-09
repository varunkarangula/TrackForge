const Subscription = require('../models/Subscription.js');

const getSubscriptions = async (userId) =>
  Subscription.find({ user: userId }).sort({ dayOfMonth: 1 });

const createSubscription = async (userId, data) =>
  Subscription.create({ user: userId, ...data });

const updateSubscription = async (userId, id, data) => {
  const sub = await Subscription.findOneAndUpdate({ _id: id, user: userId }, data, { new: true });
  if (!sub) throw new Error('Subscription not found');
  return sub;
};

const deleteSubscription = async (userId, id) => {
  const sub = await Subscription.findOneAndDelete({ _id: id, user: userId });
  if (!sub) throw new Error('Subscription not found');
};

module.exports = { getSubscriptions, createSubscription, updateSubscription, deleteSubscription };
