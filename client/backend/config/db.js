
const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Fix for querySrv ECONNREFUSED error on some systems
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    process.exit(1);
  }
};

module.exports = connectDB;
