const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const { auth } = require("../middleware/auth");

// GET ALL ORDERS for logged in user
router.get("/", auth, orderController.getOrders);

// CREATE ORDER
router.post("/create", orderController.createOrder);

// STAGE ORDER
router.post("/stage", orderController.stageOrder);

// FINALIZE ORDER
router.post("/finalize", orderController.finalizeOrder);

// RAZORPAY WEBHOOK
router.post("/webhook", orderController.handleRazorpayWebhook);

// TRACK ORDER (real-time)
router.get("/track", orderController.trackOrder);

// CANCEL ORDER
router.post("/cancel", orderController.cancelOrder);

module.exports = router;
