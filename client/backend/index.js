const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('./middleware/mongoSanitize');
const xss = require('./middleware/xssSanitize');
const hpp = require('hpp');
const compression = require('compression');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contactRoutes');
const productRoutes = require('./routes/productRoutes');
const pincodeRoutes = require('./routes/pincode');
const paymentRoutes = require('./routes/paymentRoutes');
const shipmozoRoutes = require('./routes/shipmozo.routes');
const orderRoutes = require('./routes/order.routes.js');
const addressRoutes = require('./routes/address.js');
const couponRoutes = require('./routes/coupon.routes.js'); // Import coupon routes
const heroSliderRoutes = require('./routes/heroSlider.routes.js');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Connect Database
connectDB();

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter); // Apply to API routes

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // Ideally restrict this in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
};
app.use(cors(corsOptions));

// Body Parser with limit
app.use(express.json({ limit: '10kb' }));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize);

// Data Sanitization against XSS
app.use(xss);

// Prevent Parameter Pollution
app.use(hpp());

// Compression
app.use(compression());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/pincode', pincodeRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/shipmozo', shipmozoRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/coupons', couponRoutes); // Mount coupon routes
app.use('/api/heroslider', heroSliderRoutes);

// Error Handling Middleware (Must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
