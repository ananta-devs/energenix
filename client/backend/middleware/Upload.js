// middleware/upload.js
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config(process.env.CLOUDINARY_URL);

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user-profile-pics',
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => 'user-profile-pic-' + Date.now(),
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