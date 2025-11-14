const asyncHandler = require('express-async-handler');
const Inventory = require('../models/Inventory');
const Product = require('../models/Product'); // Import Product model to check existence

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Public
const getInventoryItems = asyncHandler(async (req, res) => {
  const inventoryItems = await Inventory.find({}).populate('product_id', 'p_name p_category'); // Populate product details
  res.json(inventoryItems);
});

// @desc    Get single inventory item by ID
// @route   GET /api/inventory/:id
// @access  Public
const getInventoryItemById = asyncHandler(async (req, res) => {
  const inventoryItem = await Inventory.findById(req.params.id).populate('product_id', 'p_name p_category');

  if (inventoryItem) {
    res.json(inventoryItem);
  } else {
    res.status(404);
    throw new Error('Inventory item not found');
  }
});

// @desc    Update an inventory item
// @route   PUT /api/inventory/:id
// @access  Private/Admin
const updateInventoryItem = asyncHandler(async (req, res) => {
  const { total_stock, current_stock, sold_stock, last_restocked } = req.body;

  const inventoryItem = await Inventory.findById(req.params.id);

  if (inventoryItem) {
    inventoryItem.total_stock = total_stock !== undefined ? total_stock : inventoryItem.total_stock;
    inventoryItem.current_stock = current_stock !== undefined ? current_stock : inventoryItem.current_stock;
    inventoryItem.sold_stock = sold_stock !== undefined ? sold_stock : inventoryItem.sold_stock;
    inventoryItem.last_restocked = last_restocked || inventoryItem.last_restocked;

    const updatedInventoryItem = await inventoryItem.save();
    const populatedInventoryItem = await Inventory.findById(updatedInventoryItem._id).populate('product_id', 'p_name p_category');
    res.json(populatedInventoryItem);
  } else {
    res.status(404);
    throw new Error('Inventory item not found');
  }
});

module.exports = {
  getInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
};
