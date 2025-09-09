const express = require('express');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Example admin route: Get all users (only admin)
router.get('/users', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
