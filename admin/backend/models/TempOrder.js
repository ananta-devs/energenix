const mongoose = require('mongoose');

const TempOrderSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  tempOrderId: { type: String },
  userId: { type: String }, // Storing email or user ID
  customer: {
    name: String,
    email: String,
    phone: String,
    address_line_one: String,
    address_line_two: String,
    pincode: String,
    city: String,
    state: String
  },
  items: [{
    name: String,
    sku_number: String,
    quantity: Number,
    unit_price: Number,
    discount: String,
    hsn: String,
    product_category: String,
    pack_type: String,
    image_urls: [String]
  }],
  applied_coupon: {
    _id: String,
    code: String
  },
  amount: { type: Number }, // To match frontend 'amount' expectations, often pre-calculated or same as prepaid_amount/cod_amount
  prepaid_amount: Number,
  cod_amount: Number,
  payment_type: String,
  order_date: String,
  order_type: String,
  type_of_package: String,
  
  // Physical specs
  weight_grams: Number,
  length_cm: Number,
  width_cm: Number,
  height_cm: Number,
  dimensions: Array,

  // Payment & Status
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,
  status: { 
    type: String, 
    default: 'PENDING_PAYMENT',
    enum: ['PENDING_PAYMENT', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'FINALIZED', 'FAILED'] 
  },
  
  // Finalization logic
  finalized: { type: Boolean, default: false },
  finalOrderId: { type: String }, // ID of the permanent order if created
  failure_details: Object,
  shipmozo_error: Object

}, { timestamps: true });

module.exports = mongoose.model('TempOrder', TempOrderSchema);
