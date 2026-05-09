const svc = require('../services/eventService.js');

const getEvents = async (req, res) => {
  try { res.json(await svc.getEvents(req.user._id)); }
  catch (e) { res.status(500).json({ message: e.message }); }
};

const createEvent = async (req, res) => {
  try { res.status(201).json(await svc.createEvent(req.user._id, req.body)); }
  catch (e) { res.status(400).json({ message: e.message }); }
};

const updateEvent = async (req, res) => {
  try { res.json(await svc.updateEvent(req.user._id, req.params.id, req.body)); }
  catch (e) { res.status(404).json({ message: e.message }); }
};

const deleteEvent = async (req, res) => {
  try { await svc.deleteEvent(req.user._id, req.params.id); res.json({ message: 'Deleted' }); }
  catch (e) { res.status(404).json({ message: e.message }); }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
