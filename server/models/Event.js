const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true, trim: true },
  description: { type: String },
  date:        { type: Date, required: true },
  startTime:   { type: String, required: true }, // "14:00"
  endTime:     { type: String, required: true },  // "16:00"
  location:    { type: String },
  color:       { type: String, default: '#F59E0B' },
  createdAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', eventSchema);
