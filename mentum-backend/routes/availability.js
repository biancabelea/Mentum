const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const slots = await Availability.find({ mentor: req.user.id });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
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

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Availability.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    res.json({ message: 'Slot deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete slot' });
  }
});

router.get('/mentor/:mentorId', async (req, res) => {
  try {
    const slots = await Availability.find({
      mentor: req.params.mentorId,
      isBooked: false,
    });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  const slots = await Availability.find({ mentor: req.user.id });
  res.json(slots);
});

module.exports = router;
