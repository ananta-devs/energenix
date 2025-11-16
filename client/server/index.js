const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contactRoutes');
const productRoutes = require('./routes/productRoutes');
const pincodeRoutes = require('./routes/pincode'); // ← ADD THIS

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
app.use('/api/pincode', pincodeRoutes);  // ← IMPORTANT

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
