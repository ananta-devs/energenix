const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order.controller");
const { auth } = require("../middleware/auth");

// GET ALL ORDERS for logged in user
router.get("/", auth, orderController.getOrders);

// CREATE ORDER
router.post("/create", orderController.createOrder);

// TRACK ORDER (real-time)
router.get("/track", orderController.trackOrder);

// CANCEL ORDER
router.post("/cancel", orderController.cancelOrder);

module.exports = router;
