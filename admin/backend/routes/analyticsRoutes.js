const express = require('express');
const router = express.Router();
const { getAnalytics, getReports, getTopSellingProducts, getRecentActivity } = require('../controllers/analyticsController');

router.get('/analytics', getAnalytics);
router.get('/reports', getReports);
router.get('/analytics/topselling', getTopSellingProducts);
router.get('/analytics/recentactivity', getRecentActivity);

module.exports = router;