const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
  {
    p_id: {
      type: String,
      required: true,
      unique: true,
    },
    p_name: {
      type: String,
      required: true,
    },
    p_subtitle: {
      type: String,
    },
    p_category: {
      type: String,
      required: true,
    },
    p_price: {
      type: Number,
      required: true,
    },
    discount_price: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    image_urls: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', ProductSchema);
