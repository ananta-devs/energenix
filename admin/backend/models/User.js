const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  total_orders: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
