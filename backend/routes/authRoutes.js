const express = require('express');
const { register, login ,verifyEmail,verifyOtp} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.get('/mail-verification/:token', verifyEmail);

module.exports = router;
