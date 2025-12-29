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

const paymentRoutes = require('./routes/paymentRoutes');
const shipmozoRoutes = require('./routes/shipmozo.routes');
const orderRoutes = require('./routes/order.routes.js');
const couponRoutes = require('./routes/coupon.routes.js');
const heroSliderRoutes = require('./routes/heroSlider.routes.js');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

/* ================= RENDER FIX ================= */
app.set('trust proxy', 1);

/* ================= DB ================= */
connectDB();

/* ================= SECURITY ================= */
app.use(helmet());

/* ================= RATE LIMIT ================= */
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', limiter);

/* ================= CORS (FIXED) ================= */
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',')
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow Render health checks, Postman, server-to-server
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error('❌ CORS blocked:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

/* ================= BODY PARSER ================= */
app.use(express.json({ limit: '10kb' }));

/* ================= SANITIZATION ================= */
app.use(mongoSanitize);
app.use(xss);
app.use(hpp());

/* ================= PERFORMANCE ================= */
app.use(compression());

/* ================= ROUTES ================= */
app.use('/api/auth', authRoutes);
app.use('/api', contactRoutes);
app.use('/api/products', productRoutes);

app.use('/api/payment', paymentRoutes);
app.use('/api/shipmozo', shipmozoRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/heroslider', heroSliderRoutes);

/* ================= ERROR HANDLER ================= */
app.use(errorHandler);

/* ================= SERVER ================= */
const PORT = process.env.PORT;
app.listen(PORT);
