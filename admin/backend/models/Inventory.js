const mongoose = require('mongoose');

const InventorySchema = mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Reference to the Product model
      required: true,
      unique: true, // Each product should have only one inventory entry
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
      required: true,
      default: 0,
    },
    last_restocked: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Inventory', InventorySchema);
