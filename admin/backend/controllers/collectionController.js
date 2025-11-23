const asyncHandler = require('express-async-handler');
const Collection = require('../models/Collection');

// @desc    Get all collections
// @route   GET /api/collections
// @access  Public
const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({});
  res.json(collections);
});

// @desc    Get single collection by ID
// @route   GET /api/collections/:id
// @access  Public
const getCollectionById = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);

  if (collection) {
    res.json(collection);
  } else {
    res.status(404);
    throw new Error('Collection not found');
  }
});

// @desc    Create a collection
// @route   POST /api/collections
// @access  Private/Admin
const createCollection = asyncHandler(async (req, res) => {
  const { hsn_number, product_category } = req.body;

  const collection = new Collection({
    hsn_number,
    product_category,
  });

  const createdCollection = await collection.save();
  res.status(201).json(createdCollection);
});

// @desc    Update a collection
// @route   PUT /api/collections/:id
// @access  Private/Admin
const updateCollection = asyncHandler(async (req, res) => {
  const { hsn_number, product_category } = req.body;

  const collection = await Collection.findById(req.params.id);

  if (collection) {
    collection.hsn_number = hsn_number;
    collection.product_category = product_category;

    const updatedCollection = await collection.save();
    res.json(updatedCollection);
  } else {
    res.status(404);
    throw new Error('Collection not found');
  }
});

// @desc    Delete a collection
// @route   DELETE /api/collections/:id
// @access  Private/Admin
const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);

  if (collection) {
    await collection.deleteOne();
    res.json({ message: 'Collection removed' });
  } else {
    res.status(404);
    throw new Error('Collection not found');
  }
});

module.exports = {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
};
