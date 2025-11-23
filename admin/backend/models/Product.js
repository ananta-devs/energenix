const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
  {
    p_name: {
      type: String,
      required: true,
    },
    p_subtitle: {
      type: String,
    },
    p_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
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
    trending: {
      type: Boolean,
      default: false,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', ProductSchema);
