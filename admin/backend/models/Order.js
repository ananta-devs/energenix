const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  name: String,
  sku_number: String,
  quantity: Number,
  unit_price: Number,
  discount: String,
  hsn: String,
  product_category: String,
  pack_type: String,
});

const CustomerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  address_line_one: String,
  address_line_two: String,
  pincode: String,
  city: String,
  state: String,
  alternate_phone: String,
});

const ShipmozoResponseSchema = new mongoose.Schema({
  result: String,
  message: String,
  data: {
    Info: String,
    order_id: String,
    refrence_id: String,
    error: String,
  },
});

const TrackingEventSchema = new mongoose.Schema({
  status: String,
  location: String,
  date: String,
  remark: String,
});

const OrderSchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true, unique: true },
    awb_number: String,
    status: String,
    order_date: String,
    order_type: String,
    customer: CustomerSchema,
    items: [OrderItemSchema],
    payment_type: String,
    cod_amount: Number,
    weight_grams: Number,
    length_cm: Number,
    width_cm: Number,
    height_cm: Number,
    warehouse_id: String,
    shipmozo_create_response: ShipmozoResponseSchema,
    last_tracking_event: TrackingEventSchema,
    cancelled: Boolean,
    cancelled_at: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', OrderSchema);
