const express = require("express");
const router = express.Router();
const couponController = require("../controllers/coupon.controller");
const { optionalAuth } = require("../middleware/auth");

// GET available coupons (public, active, valid dates)
router.get("/available", optionalAuth, couponController.getAvailableCoupons);

// Apply a coupon to calculate discount
router.post("/apply", couponController.applyCoupon);

module.exports = router;
