const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/authMiddleware');

// Create a booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { mentorId, date, duration } = req.body;
    const menteeId = req.user._id;

    // Check for overlapping bookings for this mentor
    const start = new Date(date);
    const end = new Date(start.getTime() + (duration || 30) * 60000);

    const conflict = await Booking.findOne({
      mentor: mentorId,
      date: { $gte: start, $lt: end },
      status: { $ne: 'cancelled' },
    });

    if (conflict) {
      return res.status(409).json({ message: 'This slot is already booked.' });
    }

    const booking = await Booking.create({
      mentor: mentorId,
      mentee: menteeId,
      date: start,
      duration,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Booking creation failed.' });
  }
});

// Get current user's bookings (as mentee or mentor)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({
      $or: [{ mentor: userId }, { mentee: userId }],
    })
      .populate('mentor', 'name')
      .populate('mentee', 'name')
      .sort({ date: 1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings.' });
  }
});

// Cancel a booking by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Allow cancel if you're involved
    if (
      booking.mentee.toString() !== req.user._id &&
      booking.mentor.toString() !== req.user._id
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel booking.' });
  }
});

module.exports = router;
