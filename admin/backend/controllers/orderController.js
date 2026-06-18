const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const TempOrder = require('../models/TempOrder');
const shipmozoService = require('../services/shipmozo.service');
const emailService = require('../services/email.service');

/**
 * processOrderFinalization
 * Handles converting a TempOrder to a permanent Order and pushing to Shipmozo.
 * 
 * @param {Object} tempOrder - The TempOrder document
 * @returns {Object} result - { success, orderId, shipmozoResponse }
 */
const processOrderFinalization = async (tempOrder) => {
  // Idempotency: Check if the order_id already exists in the Order collection
  const existingOrder = await Order.findOne({ order_id: tempOrder.order_id });
  if (existingOrder) {
    throw new Error(`Order with ID ${tempOrder.order_id} already exists.`);
  }

  // 1. Create and Save the local Order record (Source of Truth)
  const newOrder = new Order({
    order_id: tempOrder.order_id,
    customer: tempOrder.customer,
    items: tempOrder.items,
    payment_type: tempOrder.payment_type,
    prepaid_amount: tempOrder.prepaid_amount || 0,
    cod_amount: tempOrder.cod_amount || 0,
    weight_grams: tempOrder.weight_grams,
    length_cm: tempOrder.length_cm,
    width_cm: tempOrder.width_cm,
    height_cm: tempOrder.height_cm,
    order_date: tempOrder.order_date || new Date().toISOString().split('T')[0],
    order_type: tempOrder.order_type || 'NON ESSENTIALS',
    status: 'CREATED',
    cancelled: false
  });

  const createdOrder = await newOrder.save();

  // 2. Resolve Warehouse
  let warehouseId = tempOrder.warehouse_id;
  try {
    const warehouse = await shipmozoService.getWarehouse();
    warehouseId = warehouse.id;
  } catch (err) {
    console.error("Warehouse resolution error:", err.message);
  }

  // Determine the price to use based on payment mode
  const priceToUse = createdOrder.payment_type === 'COD' ? createdOrder.cod_amount : createdOrder.prepaid_amount;

  // 3. Map Payload for Shipmozo
  const shipmozoPayload = {
    order_id: createdOrder.order_id,
    order_date: createdOrder.order_date,
    consignee_name: createdOrder.customer.name,
    consignee_phone: Number(createdOrder.customer.phone),
    consignee_address_line_one: createdOrder.customer.address_line_one,
    consignee_pin_code: Number(createdOrder.customer.pincode),
    consignee_city: createdOrder.customer.city,
    consignee_state: createdOrder.customer.state,
    payment_type: createdOrder.payment_type === 'COD' ? 'COD' : 'PREPAID',
    cod_amount: createdOrder.payment_type === 'COD' ? createdOrder.cod_amount : 0,
    weight: createdOrder.weight_grams,
    length: createdOrder.length_cm,
    width: createdOrder.width_cm,
    height: createdOrder.height_cm,
    warehouse_id: warehouseId,
    product_detail: createdOrder.items.map(item => ({
      name: item.name,
      sku_number: item.sku_number,
      quantity: Number(item.quantity),
      unit_price: Number(priceToUse), // Use prepaid_amount or cod_amount as requested
      discount: item.discount || "0",
      hsn: item.hsn || "",
      product_category: item.product_category || "General"
    }))
  };

  // 4. API Call to Shipmozo
  let shipmozoSuccess = false;
  try {
    const response = await shipmozoService.pushOrder(shipmozoPayload);
    
    // Log the full response
    createdOrder.shipmozo_create_response = {
      result: response.result,
      message: response.message,
      data: {
        order_id: response.data?.order_id,
        refrence_id: response.data?.reference_id || response.data?.refrence_id,
        error: response.data?.error || (response.result === "0" ? response.message : null)
      }
    };

    if (response.result === "1") {
      shipmozoSuccess = true;
      createdOrder.status = 'PLACED';
      if (response.data?.awb_number) {
        createdOrder.awb_number = response.data.awb_number;
      }
    }
  } catch (error) {
    console.error("Shipmozo API Error:", error.message);
    createdOrder.shipmozo_create_response = {
      result: "0",
      message: error.message,
      data: { error: error.message }
    };
  }

  // Save the updated Order with Shipmozo response
  await createdOrder.save();

  // Send Order Confirmation Email
  try {
    await emailService.sendOrderConfirmation(createdOrder);
  } catch (emailError) {
    console.error("[OrderController] Failed to send order confirmation email:", emailError.message);
  }

  // 5. Cleanup TempOrder only if push was successful
  if (shipmozoSuccess) {
    tempOrder.finalized = true;
    tempOrder.finalOrderId = createdOrder.order_id;
    tempOrder.status = 'FINALIZED';
    await tempOrder.save();
  }

  return {
    success: shipmozoSuccess,
    orderId: createdOrder.order_id,
    order: createdOrder
  };
};

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

const updateAwbNumber = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    const { awb_number } = req.body;
    order.awb_number = awb_number;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        const { status } = req.body;
        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});


module.exports = {
  getOrders,
  updateOrder,
  updateAwbNumber,
  updateOrderStatus,
  processOrderFinalization
};
