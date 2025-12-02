const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contactRoutes');
const productRoutes = require('./routes/productRoutes');
const pincodeRoutes = require('./routes/pincode');
const paymentRoutes = require('./routes/paymentRoutes');
const shipmozoRoutes = require('./routes/shipmozo.routes');
const orderRoutes = require('./routes/order.routes.js');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/pincode', pincodeRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/shipmozo', shipmozoRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
