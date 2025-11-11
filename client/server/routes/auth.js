
const express = require('express');
const router = express.Router();
const { signup, signin, verifyOtp, forgotPassword, resetPassword, getMe, updateMe } = require('../controllers/auth');
const { auth } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);

module.exports = router;
