const Category = require('../models/Category'); // Use the Category model which points to the 'collections' collection

// @desc    Get all hero sliders
// @route   GET /api/heroslider
// @access  Public
exports.getHeroSliders = async (req, res) => {
  try {
    // Fetch from Category model (which points to 'collections')
    // and filter for documents that have an image to display in the slider.
    const heroSliders = await Category.find({ 'image.url': { $exists: true, $ne: '' } });

    res.status(200).json({
      success: true,
      count: heroSliders.length,
      data: heroSliders,
    });
  } catch (error) {
    console.error("Error fetching hero sliders:", error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
