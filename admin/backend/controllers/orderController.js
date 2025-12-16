const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 }); // Sort by creation date descending
  res.json(orders);
});

// @desc    Update an order
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    const { status, cancelled } = req.body;

    order.status = status !== undefined ? status : order.status;

    // We explicitly check for 'cancelled' status or the 'cancelled' flag.
    if (status === 'cancelled' || cancelled === true) {
      order.cancelled = true;
      order.cancelled_at = Date.now();
    } else if (cancelled === false) {
      order.cancelled = false;
      order.cancelled_at = null;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});


module.exports = {
  getOrders,
  updateOrder
};
