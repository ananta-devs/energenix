const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage } = require('../controllers/uploadController');

router.post('/', uploadImage);
router.delete('/', deleteImage);

module.exports = router;
