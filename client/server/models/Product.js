const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    p_name: {
      type: String,
      required: true,
      trim: true,
    },
    p_subtitle: {
      type: String,
      trim: true,
    },
    p_category: {
      type: String,
      required: true,
      trim: true,
    },
    p_price: {
      type: Number,
      required: true,
    },
    discount_price: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    image_urls: [
      {
        type: String,
      },
    ],
    bestseller:{
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
