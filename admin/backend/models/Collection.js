const mongoose = require('mongoose');

const CollectionSchema = mongoose.Schema(
  {
    hsn_number: {
      type: String,
      required: true,
    },
    product_category: {
      type: String,
      required: true,
    },
    image: {
      url: String,
      public_id: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Collection', CollectionSchema);
