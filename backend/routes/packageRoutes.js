const express = require('express');
const Package = require('../models/Package');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get package by id
router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new package (admin only)
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description, price, durationDays, itinerary, images } = req.body;
    if (!title || !description || !price || !durationDays || !Array.isArray(itinerary) || itinerary.length === 0) {
      return res.status(400).json({ message: 'Invalid input data' });
    }
    const pkg = new Package({ title, description, price, durationDays, itinerary, images });
    await pkg.save();
    res.status(201).json(pkg);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update package (admin only)
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });

    const { title, description, price, durationDays, itinerary, images } = req.body;

    if (title !== undefined) pkg.title = title;
    if (description !== undefined) pkg.description = description;
    if (price !== undefined) pkg.price = price;
    if (durationDays !== undefined) pkg.durationDays = durationDays;
    if (itinerary !== undefined) {
      if (!Array.isArray(itinerary) || itinerary.length === 0)
        return res.status(400).json({ message: 'Invalid itinerary' });
      pkg.itinerary = itinerary;
    }
    if (images !== undefined) pkg.images = images;

    await pkg.save();
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete package (admin only)
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ message: 'Package not found' });
    await pkg.remove();
    res.json({ message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
