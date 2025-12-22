
const express = require('express');
const router = express.Router();
const { signup, signin, verifyOtp, verifySigninOtp, getMe, updateMe, sendUpdateEmailOtp, verifyUpdateEmailOtp, checkEmail, resendOtp } = require('../controllers/auth');
const { auth } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/resend-otp', resendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/verify-signin-otp', verifySigninOtp);
router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);
router.post('/send-update-email-otp', auth, sendUpdateEmailOtp);
router.post('/verify-update-email-otp', auth, verifyUpdateEmailOtp);
router.post('/check-email', checkEmail);

module.exports = router;
