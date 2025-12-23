const mongoose = require('mongoose');

const HsnGstSchema = new mongoose.Schema(
  {
    hsn_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gst_percentage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, collection: 'hsngsts' }
);

module.exports = mongoose.model('HsnGst', HsnGstSchema);
