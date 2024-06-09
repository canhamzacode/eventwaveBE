const express = require('express');
const router = express.Router();
const {
  loginController,
  signupController,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordController
} = require('../controller/auth.controller');
const verifyToken = require('../middleware/verifyToken');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

router.post('/login', loginController);
router.post('/signup', signupController);
router.get('/verify-email', verifyToken, verifyEmailController);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', verifyToken, resetPasswordController);
router.get('/verify-token', verifyToken, verifyEmailController);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = jwt.sign(req.user.toJSON(), process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
});

module.exports = router;
