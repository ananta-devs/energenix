const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  getAdmins,
  addAdmin,
  updateAdminStatus,
  deleteAdmin,
  changePassword,
} = require('../controllers/adminController');
const { auth, isSuperAdmin } = require('../middleware/auth');

router.post('/login', loginAdmin);
router.get('/', auth, getAdmins);
router.post('/', [auth, isSuperAdmin], addAdmin);
router.put('/:id/status', [auth, isSuperAdmin], updateAdminStatus);
router.delete('/:id', [auth, isSuperAdmin], deleteAdmin);
router.post('/change-password', auth, changePassword);

module.exports = router;
