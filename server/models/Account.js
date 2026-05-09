const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['cash', 'bank', 'wallet', 'other'], default: 'bank' },
  balance: { type: Number, required: true, default: 0 },
  color: { type: String, default: '#4F7EF7' },
  createdAt: { type: Date, default: Date.now }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
