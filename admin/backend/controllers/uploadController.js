const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400);
    throw new Error('No files were uploaded.');
  }

  const { p_id } = req.body; // Expect p_id (which is product's _id) in the request body
  if (!p_id) {
    res.status(400);
    throw new Error('Product ID (p_id) is required for image upload.');
  }

  const files = Array.isArray(req.files.image) ? req.files.image : [req.files.image];
  const uploadedImageUrls = [];

  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: `products/${p_id}`, // Upload to products/p_id folder
    });
    uploadedImageUrls.push(result.secure_url);
  }

  res.status(200).json({
    message: 'Images uploaded successfully',
    imageUrls: uploadedImageUrls,
  });
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload
// @access  Private/Admin
const deleteImage = asyncHandler(async (req, res) => {
  const { public_id } = req.body; // Expect public_id in the request body

  if (!public_id) {
    res.status(400);
    throw new Error('Public ID is required for image deletion.');
  }

  await cloudinary.uploader.destroy(public_id);

  res.status(200).json({ message: 'Image deleted successfully' });
});

module.exports = {
  uploadImage,
  deleteImage,
};
