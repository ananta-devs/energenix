require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = new Admin({
      adm_name: 'Admin User',
      adm_email: 'admin@example.com',
      adm_phone: '1234567890',
      password: hashedPassword,
      isSuper: true,
      status:'active'

    });

    await admin.save();
    console.log('Admin user created');
    mongoose.connection.close();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedAdmin();
