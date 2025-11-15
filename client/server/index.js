
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contactRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api', contactRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
