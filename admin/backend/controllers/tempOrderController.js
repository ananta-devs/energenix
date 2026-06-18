const asyncHandler = require('express-async-handler');
const TempOrder = require('../models/TempOrder');
const Order = require('../models/Order');
const Razorpay = require('razorpay');
const shipmozoService = require('../services/shipmozo.service');
const { processOrderFinalization } = require('./orderController');

let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } else {
    console.warn("Razorpay keys missing in .env. Payment verification will fail.");
  }
} catch (err) {
  console.error("Razorpay init error:", err.message);
}

// @desc    Get all temporary orders with pagination and filtering
// @route   GET /api/admin/temp-orders
// @access  Private/Admin
const getTempOrders = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    status, 
    payment_method, 
    startDate, 
    endDate, 
    search 
  } = req.query;

  const query = {};

  // Status Filter
  if (status) {
    query.status = status;
  }

  // Payment Method Filter
  if (payment_method) {
    query.payment_type = { $regex: payment_method, $options: 'i' }; // Case-insensitive
  }

  // Date Range Filter
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      // Set end date to end of the day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  // Search Filter
  if (search) {
    query.$or = [
      { _id: search }, // If valid ObjectId, handled automatically? No, mongoose might throw if invalid.
      { tempOrderId: { $regex: search, $options: 'i' } },
      { razorpay_order_id: { $regex: search, $options: 'i' } },
      { razorpay_payment_id: { $regex: search, $options: 'i' } },
      { userId: { $regex: search, $options: 'i' } }
    ];
    
    // Check if search is a valid ObjectId before adding it to the query to avoid CastError
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(search)) {
         query.$or.push({ _id: search });
    }
  }

  const count = await TempOrder.countDocuments(query);
  const orders = await TempOrder.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  // Map to match frontend expectations if necessary, or send raw
  // Frontend expects: _id, userId, userEmail, amount, payment_method, status, razorpay_order_id, ...
  const formattedOrders = orders.map(order => ({
    ...order.toObject(),
    userEmail: order.customer?.email || order.userId, // Fallback
    amount: order.prepaid_amount || order.cod_amount || 0, // Ensure amount is visible
    payment_method: order.payment_type
  }));

  res.json({
    orders: formattedOrders,
    page: Number(page),
    pages: Math.ceil(count / limit),
    total: count
  });
});

// @desc    Finalize a temporary order (create permanent order)
// @route   POST /api/admin/temp-orders/:id/finalize
// @access  Private/Admin
const finalizeTempOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const mongoose = require('mongoose');
  
  let tempOrder;
  if (mongoose.Types.ObjectId.isValid(id)) {
    tempOrder = await TempOrder.findById(id);
  } else {
    tempOrder = await TempOrder.findOne({ tempOrderId: id });
  }

  if (!tempOrder) {
    res.status(404);
    throw new Error('Temporary order not found');
  }

  if (tempOrder.finalized) {
    res.status(400);
    throw new Error('Order is already finalized');
  }

  const result = await processOrderFinalization(tempOrder);

  res.status(201).json({
    message: result.success ? 'Order finalized and pushed to Shipmozo' : 'Order finalized locally but Shipmozo push failed',
    orderId: result.orderId,
    order: result.order,
    shipmozoSuccess: result.success
  });
});

// @desc    Check payment status with Razorpay
// @route   POST /api/admin/temp-orders/check-payment
// @access  Private/Admin
const checkPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id } = req.body;

  if (!razorpay) {
    res.status(500);
    throw new Error('Razorpay not initialized (keys missing)');
  }

  if (!razorpay_order_id) {
    res.status(400);
    throw new Error('Razorpay Order ID is required');
  }

  try {
    // Fetch order from Razorpay to get payments
    // Note: Razorpay API to fetch payments for an order: /orders/:id/payments
    const payments = await razorpay.orders.fetchPayments(razorpay_order_id);
    
    // Check if any payment is captured
    const capturedPayment = payments && payments.items ? payments.items.find(p => p.status === 'captured') : null;

    if (capturedPayment) {
      // Update the TempOrder in database
      const tempOrder = await TempOrder.findOne({ razorpay_order_id });
      if (tempOrder) {
        tempOrder.status = 'PAYMENT_SUCCESS';
        tempOrder.razorpay_payment_id = capturedPayment.id;
        await tempOrder.save();
      }

      res.json({
        paid: true,
        razorpay_payment_id: capturedPayment.id
      });
    } else {
      // Update the TempOrder in database to PAYMENT_FAILED
      const tempOrder = await TempOrder.findOne({ razorpay_order_id });
      if (tempOrder) {
        tempOrder.status = 'PAYMENT_FAILED';
        await tempOrder.save();
      }

      res.json({
        paid: false,
        message: 'No captured payment found for this order'
      });
    }
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500);
    throw new Error('Failed to verify payment with Razorpay');
  }
});

// @desc    Create order from temp order (Manual)
// @route   POST /api/admin/temp-orders/create-order-from-temp
// @access  Private/Admin
const createOrderFromTemp = asyncHandler(async (req, res) => {
  const { tempOrderId } = req.body;
  const mongoose = require('mongoose');

  // Build query to avoid CastError if tempOrderId is a UUID string and not an ObjectId
  const query = { tempOrderId: tempOrderId };
  if (mongoose.Types.ObjectId.isValid(tempOrderId)) {
    query.$or = [
      { _id: tempOrderId },
      { tempOrderId: tempOrderId }
    ];
    delete query.tempOrderId; // Use $or instead
  }

  // Find by _id or tempOrderId string
  const tempOrder = await TempOrder.findOne(query);

  if (!tempOrder) {
    res.status(404);
    throw new Error('Temporary order not found');
  }

  if (tempOrder.finalized) {
    res.status(400);
    throw new Error('Order is already finalized');
  }

  const result = await processOrderFinalization(tempOrder);

  res.status(201).json({
    message: result.success ? 'Order created and pushed to Shipmozo successfully' : 'Order created locally but Shipmozo push failed',
    orderId: result.orderId,
    shipmozoSuccess: result.success
  });
});

module.exports = {
  getTempOrders,
  finalizeTempOrder,
  checkPayment,
  createOrderFromTemp
};
