
const express = require('express');
const router = express.Router();
const { signup, signin, verifyOtp, forgotPassword, resetPassword } = require('../controllers/auth');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
