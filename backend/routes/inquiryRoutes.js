const express = require('express');
const Inquiry = require('../models/Inquiry');
const Package = require('../models/Package');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Create new inquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, packageId } = req.body;

    if (!name || !email || !phone || !message || !packageId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(400).json({ message: 'Invalid package selected' });
    }

    const inquiry = new Inquiry({ name, email, phone, message, packageId });
    await inquiry.save();

    res.status(201).json({ message: 'Inquiry submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all inquiries (admin only)
router.get('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('packageId', 'title')
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete inquiry (admin only)
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    await inquiry.remove();
    res.json({ message: 'Inquiry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
