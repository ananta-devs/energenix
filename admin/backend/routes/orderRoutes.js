const express = require('express');
const router = express.Router();
const { getOrders, updateOrder } = require('../controllers/orderController');

router.route('/').get(getOrders);
router.route('/:id').put(updateOrder);

module.exports = router;
