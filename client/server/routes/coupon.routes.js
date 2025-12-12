const express = require("express");
const router = express.Router();
const couponController = require("../controllers/coupon.controller");

// GET available coupons (public, active, valid dates)
router.get("/available", couponController.getAvailableCoupons);

// Apply a coupon to calculate discount
router.post("/apply", couponController.applyCoupon);

module.exports = router;
