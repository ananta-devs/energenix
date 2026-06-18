const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku_number: { type: String, default: "NA" },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true },
  discount: { type: String, default: "" },
  hsn: { type: String, default: "" },
  product_category: { type: String, default: "Other" },
  pack_type: {
    type: String,
    enum: ["Pack of 1", "Pack of 2", "Pack of 4 (Family Discount)"],
    default: "Pack of 1"
  },
  image_urls: { type: [String], default: [] }
}, { _id: false });

const TempOrderSchema = new mongoose.Schema({
  tempOrderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.Mixed, default: null }, // ObjectId or String (email) if guest
  
  // Cart & Pricing Snapshot
  order_id: { type: String, required: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    alternate_phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address_line_one: { type: String, required: true },
    address_line_two: { type: String, default: "" },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true }
  },
  items: [OrderItemSchema],
  payment_type: {
    type: String,
    enum: ["PREPAID", "COD"],
    required: true
  },
  cod_amount: { type: Number, default: 0 },
  prepaid_amount: { type: Number, default: 0 },
  weight_grams: { type: Number, required: true },
  length_cm: { type: Number, default: 10 },
  width_cm: { type: Number, default: 10 },
  height_cm: { type: Number, default: 10 },
  dimensions: { type: Array, default: [] },
  type_of_package: { type: String, default: "" },
  applied_coupon: { type: Object, default: null },
  order_date: { type: String }, 
  order_type: { type: String, default: "" },

  // Razorpay Fields
  razorpay_order_id: { type: String, default: null },
  razorpay_payment_id: { type: String, default: null },
  razorpay_signature: { type: String, default: null },

  // Status & Flags
  status: {
    type: String,
    enum: ["PENDING_PAYMENT", "PAYMENT_SUCCESS", "FINALIZED", "FAILED"],
    default: "PENDING_PAYMENT"
  },
  finalized: { type: Boolean, default: false },

  // Error logging
  failure_details: { type: Object, default: {} },
  shipmozo_error: { type: Object, default: {} },

}, { timestamps: true });

// Enforce unique razorpay_order_id (sparse because COD might not have one initially or at all if handled differently, but strictly PREPAID must be unique)
TempOrderSchema.index({ razorpay_order_id: 1 }, { unique: true, sparse: true });

// Strict TTL: Only expire PENDING_PAYMENT docs after 7 days
TempOrderSchema.index({ createdAt: 1 }, { 
  expireAfterSeconds: 604800, // 7 days
  partialFilterExpression: { status: "PENDING_PAYMENT" } 
});

module.exports = mongoose.model("TempOrder", TempOrderSchema);