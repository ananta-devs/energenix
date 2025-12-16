const express = require('express');
const router = express.Router();
const { getOrders, updateOrder, updateAwbNumber, updateOrderStatus } = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

router.route('/').get(getOrders);
router.route('/:id').put(updateOrder);
router.route('/:id/update-awb').put(auth, updateAwbNumber);
router.route('/:id/update-status').put(auth, updateOrderStatus);

module.exports = router;
