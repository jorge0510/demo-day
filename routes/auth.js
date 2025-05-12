const express = require('express');
const passport = require('passport');
const authController = require('../controllers/auth');

const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login (use passport middleware)
router.post('/login', passport.authenticate('local'), authController.login);

// Logout
router.get('/logout', authController.logout);

module.exports = router;