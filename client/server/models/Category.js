const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

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
    title: {
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    image: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true, collection: 'collections' }
);

CategorySchema.pre('save', function (next) {
  if (this.isModified('product_category')) {
    this.slug = slugify(this.product_category);
  }
  next();
});

module.exports = mongoose.model('Category', CategorySchema);
