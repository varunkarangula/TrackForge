const svc = require('../services/subscriptionService.js');

const getSubscriptions = async (req, res) => {
  try { res.json(await svc.getSubscriptions(req.user._id)); }
  catch (e) { res.status(500).json({ message: e.message }); }
};

const createSubscription = async (req, res) => {
  try { res.status(201).json(await svc.createSubscription(req.user._id, req.body)); }
  catch (e) { res.status(400).json({ message: e.message }); }
};

const updateSubscription = async (req, res) => {
  try { res.json(await svc.updateSubscription(req.user._id, req.params.id, req.body)); }
  catch (e) { res.status(404).json({ message: e.message }); }
};

const deleteSubscription = async (req, res) => {
  try { await svc.deleteSubscription(req.user._id, req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(404).json({ message: e.message }); }
};

module.exports = { getSubscriptions, createSubscription, updateSubscription, deleteSubscription };
