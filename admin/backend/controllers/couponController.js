const Coupon = require('../models/Coupon');
const asyncHandler = require('express-async-handler');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  res.status(200).json(coupons);
});

// @desc    Get single coupon by ID
// @route   GET /api/coupons/:id
// @access  Private/Admin
const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    res.status(200).json(coupon);
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    discount_type,
    discount_value,
    minimum_purchase,
    usage_limit,
    per_user_limit,
    valid_from,
    valid_until,
    is_active,
    description,
    visibility,
  } = req.body;

  const couponExists = await Coupon.findOne({ code });

  if (couponExists) {
    res.status(400);
    throw new Error('Coupon with this code already exists');
  }

  const coupon = await Coupon.create({
    code,
    discount_type,
    discount_value,
    minimum_purchase,
    usage_limit,
    per_user_limit,
    valid_from,
    valid_until,
    is_active,
    description,
    visibility,
  });

  if (coupon) {
    res.status(201).json(coupon);
  } else {
    res.status(400);
    throw new Error('Invalid coupon data');
  }
});

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    discount_type,
    discount_value,
    minimum_purchase,
    usage_limit,
    per_user_limit,
    valid_from,
    valid_until,
    is_active,
    description,
    visibility,
  } = req.body;

  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    // Check if code is being changed and if new code already exists
    if (code && code !== coupon.code) {
      const couponExists = await Coupon.findOne({ code });
      if (couponExists && couponExists._id.toString() !== req.params.id) {
        res.status(400);
        throw new Error('Coupon with this code already exists');
      }
    }

    coupon.code = code || coupon.code;
    coupon.discount_type = discount_type || coupon.discount_type;
    coupon.discount_value = discount_value || coupon.discount_value;
    coupon.minimum_purchase = minimum_purchase !== undefined ? minimum_purchase : coupon.minimum_purchase;
    coupon.usage_limit = usage_limit !== undefined ? usage_limit : coupon.usage_limit;
    coupon.per_user_limit = per_user_limit !== undefined ? per_user_limit : coupon.per_user_limit;
    coupon.valid_from = valid_from || coupon.valid_from;
    coupon.valid_until = valid_until || coupon.valid_until;
    coupon.is_active = is_active !== undefined ? is_active : coupon.is_active;
    coupon.description = description !== undefined ? description : coupon.description;
    coupon.visibility = visibility || coupon.visibility;

    const updatedCoupon = await coupon.save();
    res.status(200).json(updatedCoupon);
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    await Coupon.deleteOne({ _id: coupon._id });
    res.status(200).json({ message: 'Coupon removed' });
  } else {
    res.status(404);
    throw new Error('Coupon not found');
  }
});

module.exports = {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};