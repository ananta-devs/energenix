const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const upload = require('../middleware/reviewUpload');
// Optional: If you want to require authentication for reviews, import auth middleware
// const { protect } = require('../middleware/auth');

router.get('/product/:productId', reviewController.getProductReviews);
router.post('/', upload.array('images', 5), reviewController.createReview);
router.post('/:reviewId/helpful', reviewController.markHelpful);

module.exports = router;
