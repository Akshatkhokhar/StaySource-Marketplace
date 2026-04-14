const express = require('express');
const { body } = require('express-validator');
const { register, login, logout, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validate.middleware');

const router = express.Router();

const registerValidation = [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('role')
    .isIn(['vendor', 'hotel_owner'])
    .withMessage('Role must be vendor or hotel_owner'),
  validateRequest
];

const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required'),
  validateRequest
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// Google OAuth
const passport = require('passport');
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(501).json({ 
      success: false, 
      message: 'Google OAuth is not configured on this server.' 
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login`, session: false }),
  (req, res) => {
    // Successfully authenticated, generate token and redirect to frontend
    const authService = require('../services/auth.service');
    const token = authService.signToken(req.user._id);
    const userJson = JSON.stringify({
      _id: req.user._id,
      full_name: req.user.full_name,
      email: req.user.email,
      role: req.user.role
    });
    
    // Redirect with token and user data
    res.redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${token}&user=${encodeURIComponent(userJson)}`);
  }
);

module.exports = router;
