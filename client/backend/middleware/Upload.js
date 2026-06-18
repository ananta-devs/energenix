// middleware/upload.js
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const CloudinaryStorage = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'user-profile-pics',
  allowedFormats: ['jpg', 'jpeg', 'png'],
  filename: (req, file, cb) => {
    cb(null, 'user-profile-pic-' + Date.now());
  },
});

const fileFilter = (req, file, cb) => {
  const ext = file.mimetype.split('/')[1];
  if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
    cb(new Error('Only images are allowed'), false);
    return;
  }
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });