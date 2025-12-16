// routes/shipmozoRoutes.js
const express = require('express');
const router = express.Router();
const { getShipmozoConfig } = require('../controllers/shipmozoController');
const { auth } = require('../middleware/auth');

// @route   GET api/shipmozo/config
// @desc    Get Shipmozo API configuration
// @access  Private
router.get('/config', auth, getShipmozoConfig);

module.exports = router;
