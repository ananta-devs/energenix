const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Assuming authentication middleware exists and is applied as needed
// const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(createProduct); // protect, admin middleware can be added here

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)    // protect, admin middleware can be added here
  .delete(deleteProduct); // protect, admin middleware can be added here

module.exports = router;
