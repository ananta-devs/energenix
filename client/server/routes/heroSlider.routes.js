const express = require('express');
const router = express.Router();
const { getHeroSliders } = require('../controllers/heroSlider.controller');

router.route('/').get(getHeroSliders);

module.exports = router;
