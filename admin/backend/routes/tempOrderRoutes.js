const express = require('express');
const router = express.Router();
const { getTempOrders, finalizeTempOrder, checkPayment, createOrderFromTemp } = require('../controllers/tempOrderController');
const { auth } = require('../middleware/auth'); // Assuming you have auth middleware

router.get('/', auth, getTempOrders);
router.post('/:id/finalize', auth, finalizeTempOrder);
router.post('/check-payment', auth, checkPayment);
router.post('/create-order-from-temp', auth, createOrderFromTemp);

module.exports = router;
