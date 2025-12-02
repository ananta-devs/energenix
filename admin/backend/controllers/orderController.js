const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 }); // Sort by creation date descending
  res.json(orders);
});

module.exports = {
  getOrders
};
