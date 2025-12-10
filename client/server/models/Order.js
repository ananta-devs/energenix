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
  }
}, { _id: false });


const OrderSchema = new mongoose.Schema({
  // Your order ID (your system)
  order_id: { type: String, required: true, unique: true },

  // Shipmozo AWB number (received after push-order)
  awb_number: { type: String, default: "" },

  // Shipmozo order status
  status: {
    type: String,
    default: "CREATED" // PENDING, MANIFESTED, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, etc.
  },

  // Core Shipment metadata
  order_date: { type: String }, // YYYY-MM-DD
  order_type: { type: String, default: "" },

  // Consignee Details
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

  // Products
  items: [OrderItemSchema],

  // Payment & mode
  payment_type: {
    type: String,
    enum: ["PREPAID", "COD"],
    required: true
  },

  cod_amount: { type: Number, default: 0 },

  // Dimensions
  weight_grams: { type: Number, required: true }, // stored in grams (Shipmozo format)
  length_cm: { type: Number, default: 10 },
  width_cm: { type: Number, default: 10 },
  height_cm: { type: Number, default: 10 },

  // Shipmozo warehouse
  warehouse_id: { type: String, required: true },

  // Entire Shipmozo responses for debugging
  shipmozo_create_response: { type: Object, default: {} },
  shipmozo_tracking_response: { type: Object, default: {} },

  // Last known tracking event
  last_tracking_event: {
    status: { type: String, default: "" },
    location: { type: String, default: "" },
    date: { type: String, default: "" },
    remark: { type: String, default: "" }
  },

  // Cancellation info
  cancelled: { type: Boolean, default: false },
  cancelled_at: { type: Date, default: null },

}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
