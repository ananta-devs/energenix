const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory'); // Import Inventory model
const cloudinary = require('../config/cloudinary'); // Import cloudinary

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { p_name, p_subtitle, p_category, p_price, discount_price, description, image_urls } = req.body;

  // Generate a unique p_id (e.g., using a timestamp)
  const p_id = `prod_${Date.now()}`; // Simple unique ID generation

  const product = new Product({
    p_id, // Assign the generated p_id
    p_name,
    p_subtitle,
    p_category,
    p_price,
    discount_price,
    description,
    image_urls,
  });

  const createdProduct = await product.save();

  // Create a corresponding inventory entry
  const inventory = new Inventory({
    product_id: createdProduct._id,
    product_name: createdProduct.p_name,
    total_stock: 0,
    current_stock: 0,
    sold_stock: 0,
    last_restocked: Date.now(),
  });
  await inventory.save();

  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { p_name, p_subtitle, p_category, p_price, discount_price, description, image_urls } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.p_name = p_name || product.p_name;
    product.p_subtitle = p_subtitle || product.p_subtitle;
    product.p_category = p_category || product.p_category;
    product.p_price = p_price || product.p_price;
    product.discount_price = discount_price || product.discount_price;
    product.description = description || product.description;
    product.image_urls = image_urls || product.image_urls;

    const updatedProduct = await product.save();

    // Update product name in corresponding inventory entry
    await Inventory.findOneAndUpdate(
      { product_id: updatedProduct._id },
      { product_name: updatedProduct.p_name },
      { new: true }
    );

    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Delete images from Cloudinary
    for (const imageUrl of product.image_urls) {
      const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public_id from URL
      await cloudinary.uploader.destroy(`products/${publicId}`); // Assuming folder structure
    }

    await product.deleteOne();
    await Inventory.deleteOne({ product_id: product._id }); // Delete corresponding inventory
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
