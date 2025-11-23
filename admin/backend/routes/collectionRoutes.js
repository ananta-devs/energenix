const express = require('express');
const router = express.Router();
const {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} = require('../controllers/collectionController');

// Assuming authentication middleware exists and is applied as needed
// const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCollections)
  .post(createCollection); // protect, admin middleware can be added here

router.route('/:id')
  .get(getCollectionById)
  .put(updateCollection)    // protect, admin middleware can be added here
  .delete(deleteCollection); // protect, admin middleware can be added here

module.exports = router;
