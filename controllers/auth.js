const User = require('../models/User');
const passport = require('passport');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    
    req.login(newUser, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Login failed after registration' });
      }

      res.redirect('/'); 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = (req, res) => {
  res.redirect('/');
};

exports.logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
};