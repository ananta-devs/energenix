const mongoose = require('mongoose');

const HsnGstSchema = mongoose.Schema(
  {
    hsn_number: {
      type: String,
      required: true,
      unique: true,
    },
    gst_percentage: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HsnGst', HsnGstSchema);
