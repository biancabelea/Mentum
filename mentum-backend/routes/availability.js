// routes/availability.js
const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');
const authMiddleware = require('../middleware/authMiddleware');

// GET mentor's availability
router.get('/', authMiddleware, async (req, res) => {
  try {
    const slots = await Availability.find({ mentor: req.user.id });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create availability slot
router.post('/', authMiddleware, async (req, res) => {
  console.log('POST availability request:', req.body);
console.log('Authenticated user:', req.user);

  try {
    const { date, duration } = req.body;
    const slot = new Availability({
      mentor: req.user.id,
      date,
      duration,
      isBooked: false,
    });
    await slot.save();
    res.status(201).json(slot);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// DELETE availability slot
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('DELETE slot called:', req.params.id);

    const deleted = await Availability.findByIdAndDelete(req.params.id);
    if (!deleted) {
      console.log('Slot not found or already deleted.');
      return res.status(404).json({ message: 'Slot not found' });
    }

    console.log('Slot deleted successfully');
    res.json({ message: 'Slot deleted' });
  } catch (err) {
    console.error('Delete slot error:', err);
    res.status(500).json({ message: 'Failed to delete slot' });
  }
});


// Public: Get availability for a specific mentor
router.get('/mentor/:mentorId', async (req, res) => {
  try {
    const slots = await Availability.find({
      mentor: req.params.mentorId,
      isBooked: false, // Optional: only show available ones
    });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  console.log('GET /availability/me called');
  console.log('User:', req.user);
  const slots = await Availability.find({ mentor: req.user.id });
  res.json(slots);
});

module.exports = router;
