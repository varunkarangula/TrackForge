const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:       { type: String, required: true, trim: true },
  amount:     { type: Number, default: 0 },
  dayOfMonth: { type: Number, required: true, min: 1, max: 31 },
  icon:       { type: String, default: '📱' },
  color:      { type: String, default: '#8B5CF6' },
  isActive:   { type: Boolean, default: true },
  createdAt:  { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
