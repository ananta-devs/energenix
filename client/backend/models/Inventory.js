const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      unique: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    total_stock: {
      type: Number,
      required: true,
      default: 0,
    },
    current_stock: {
      type: Number,
      required: true,
      default: 0,
    },
    sold_stock: {
      type: Number,
      default: 0,
    },
    last_restocked: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', InventorySchema);
