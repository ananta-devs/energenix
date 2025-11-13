const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adm_name: {
    type: String,
    required: true,
  },
  adm_email: {
    type: String,
    required: true,
    unique: true,
  },
  adm_phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  is2fa: {
    type: Boolean,
    default: false,
  },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
