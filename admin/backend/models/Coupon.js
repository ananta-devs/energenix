const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  discount_type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Discount type is required'],
  },
  discount_value: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative'],
  },
  minimum_purchase: {
    type: Number,
    min: [0, 'Minimum purchase cannot be negative'],
    default: 0,
  },
  usage_limit: {
    type: Number,
    min: [0, 'Usage limit cannot be negative'],
    default: null, // null means unlimited
  },
  usage_count: {
    type: Number,
    default: 0,
  },
  per_user_limit: {
    type: Number,
    min: [0, 'Per user limit cannot be negative'],
    default: null, // null means unlimited per user
  },
  valid_from: {
    type: Date,
    required: [true, 'Valid from date is required'],
  },
  valid_until: {
    type: Date,
    required: [true, 'Valid until date is required'],
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    trim: true,
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
}, { timestamps: true });

// Pre-save hook to ensure valid_from is before valid_until
couponSchema.pre('save', function (next) {
  if (this.valid_from && this.valid_until && this.valid_from >= this.valid_until) {
    next(new Error('Valid from date must be before valid until date.'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Coupon', couponSchema);