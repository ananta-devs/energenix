const multer = require('multer');
const CloudinaryStorage = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'product-reviews',
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  filename: (req, file, cb) => {
    cb(null, `review-${Date.now()}-${file.originalname.split('.')[0]}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
