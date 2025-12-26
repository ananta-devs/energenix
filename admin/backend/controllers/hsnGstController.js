const HsnGst = require('../models/HsnGst');

// @desc    Get all HSN/GST items
// @route   GET /api/hsn-gst
// @access  Private/Admin
const getHsnGstItems = async (req, res) => {
  try {
    const items = await HsnGst.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new HSN/GST item
// @route   POST /api/hsn-gst
// @access  Private/Admin
const createHsnGstItem = async (req, res) => {
  try {
    const { hsn_number, gst_percentage } = req.body;

    const itemExists = await HsnGst.findOne({ hsn_number });

    if (itemExists) {
      return res.status(400).json({ message: 'HSN number already exists' });
    }

    const item = await HsnGst.create({
      hsn_number,
      gst_percentage,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update HSN/GST item
// @route   PUT /api/hsn-gst/:id
// @access  Private/Admin
const updateHsnGstItem = async (req, res) => {
  try {
    const { hsn_number, gst_percentage } = req.body;
    const item = await HsnGst.findById(req.params.id);

    if (item) {
      // Check if trying to update HSN to one that already exists (excluding itself)
      if (hsn_number !== item.hsn_number) {
          const duplicate = await HsnGst.findOne({ hsn_number });
          if (duplicate) {
              return res.status(400).json({ message: 'HSN number already exists' });
          }
      }

      item.hsn_number = hsn_number || item.hsn_number;
      item.gst_percentage = gst_percentage || item.gst_percentage;

      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete HSN/GST item
// @route   DELETE /api/hsn-gst/:id
// @access  Private/Admin
const deleteHsnGstItem = async (req, res) => {
  try {
    const item = await HsnGst.findById(req.params.id);

    if (item) {
      await item.deleteOne();
      res.json({ message: 'Item removed' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHsnGstItems,
  createHsnGstItem,
  updateHsnGstItem,
  deleteHsnGstItem,
};
