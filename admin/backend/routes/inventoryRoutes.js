const express = require('express');
const router = express.Router();
const {
  getInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
} = require('../controllers/inventoryController');

// Assuming authentication middleware exists and is applied as needed
// const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getInventoryItems);

router.route('/:id')
  .get(getInventoryItemById)
  .put(updateInventoryItem); // protect, admin middleware can be added here

module.exports = router;
