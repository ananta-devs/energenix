const asyncHandler = require('express-async-handler');
const Collection = require('../models/Collection');
const cloudinary = require('../config/cloudinary');

// @desc    Get all collections
// @route   GET /api/collections
// @access  Public
const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({});
  res.json(collections.map(collection => ({
    ...collection.toObject(),
    image_url: collection.image ? collection.image.url : null,
  })));
});

// @desc    Get single collection by ID
// @route   GET /api/collections/:id
// @access  Public
const getCollectionById = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);

  if (collection) {
    res.json({
      ...collection.toObject(),
      image_url: collection.image ? collection.image.url : null,
    });
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
  
  let image_data = {};

  if (req.files && req.files.image) {
    const file = req.files.image;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'collections',
    });
    image_data = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  const collection = new Collection({
    hsn_number,
    product_category,
    image: image_data,
  });

  const createdCollection = await collection.save();
  res.status(201).json({
    ...createdCollection.toObject(),
    image_url: createdCollection.image ? createdCollection.image.url : null,
  });
});

// @desc    Update a collection
// @route   PUT /api/collections/:id
// @access  Private/Admin
const updateCollection = asyncHandler(async (req, res) => {
  const { hsn_number, product_category, removeImage } = req.body;

  const collection = await Collection.findById(req.params.id);

  if (collection) {
    collection.hsn_number = hsn_number || collection.hsn_number;
    collection.product_category = product_category || collection.product_category;

    // Check if there is a new image to upload
    if (req.files && req.files.image) {
      // If there's an old image, delete it from Cloudinary
      if (collection.image && collection.image.public_id) {
        await cloudinary.uploader.destroy(collection.image.public_id);
      }

      // Upload the new image
      const file = req.files.image;
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'collections',
      });
      collection.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } else if (removeImage === 'true') {
      // If removeImage is flagged, delete from Cloudinary and database
      if (collection.image && collection.image.public_id) {
        await cloudinary.uploader.destroy(collection.image.public_id);
      }
      collection.image = { url: '', public_id: '' };
    }

    const updatedCollection = await collection.save();
    res.json({
      ...updatedCollection.toObject(),
      image_url: updatedCollection.image ? updatedCollection.image.url : null,
    });
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
    // If there's an image, delete it from Cloudinary
    if (collection.image && collection.image.public_id) {
      await cloudinary.uploader.destroy(collection.image.public_id);
    }
    
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
