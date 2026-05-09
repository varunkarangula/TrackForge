const Event = require('../models/Event.js');

const getEvents = async (userId) =>
  Event.find({ user: userId }).sort({ date: 1, startTime: 1 });

const createEvent = async (userId, data) =>
  Event.create({ user: userId, ...data });

const updateEvent = async (userId, id, data) => {
  const event = await Event.findOneAndUpdate({ _id: id, user: userId }, data, { new: true });
  if (!event) throw new Error('Event not found');
  return event;
};

const deleteEvent = async (userId, id) => {
  const event = await Event.findOneAndDelete({ _id: id, user: userId });
  if (!event) throw new Error('Event not found');
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
