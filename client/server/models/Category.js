const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    product_category: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    hsn_number: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, collection: 'collections' }
);

module.exports = mongoose.model('Category', CategorySchema);
