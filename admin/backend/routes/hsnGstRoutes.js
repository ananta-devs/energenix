const express = require('express');
const router = express.Router();
const {
  getHsnGstItems,
  createHsnGstItem,
  updateHsnGstItem,
  deleteHsnGstItem,
} = require('../controllers/hsnGstController');
const { auth } = require('../middleware/auth');

router.route('/').get(auth, getHsnGstItems).post(auth, createHsnGstItem);
router
  .route('/:id')
  .put(auth, updateHsnGstItem)
  .delete(auth, deleteHsnGstItem);

module.exports = router;
