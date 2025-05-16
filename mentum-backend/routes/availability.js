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
    const slot = await Availability.findOne({ _id: req.params.id, mentor: req.user.id });
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.isBooked) return res.status(400).json({ message: 'Cannot delete booked slot' });
    await slot.deleteOne();
    res.json({ message: 'Slot deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
