
const express = require('express');
const router = express.Router();
const { signup, signin, verifyOtp, forgotPassword, resetPassword, getMe, updateMe, sendUpdateEmailOtp, verifyUpdateEmailOtp, checkEmail } = require('../controllers/auth');
const { auth } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);
router.post('/send-update-email-otp', auth, sendUpdateEmailOtp);
router.post('/verify-update-email-otp', auth, verifyUpdateEmailOtp);
router.post('/check-email', auth, checkEmail);

module.exports = router;
