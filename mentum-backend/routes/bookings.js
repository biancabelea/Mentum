const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Availability = require('../models/Availability');
const authMiddleware = require('../middleware/authMiddleware');

// GET all bookings for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ mentee: req.user._id })
      .populate('slot')
      .populate('mentor');

    const validBookings = bookings.filter(b => b.slot && b.mentor);
    res.json(validBookings);
  } catch (error) {
    console.error('💥 Booking fetch failed:', error);
    res.status(500).json({ message: 'Failed to fetch bookings.' });
  }
});

// Book a slot
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { slotId } = req.body;
    const menteeId = req.user._id;

    const availability = await Availability.findById(slotId);
    if (!availability || availability.isBooked) {
      return res.status(400).json({ message: 'Slot is not available' });
    }

    const start = new Date(availability.date);

    const booking = await Booking.create({
      mentor: availability.mentor,
      mentee: menteeId,
      slot: availability._id,
      date: start,
      duration: availability.duration,
    });

    await Availability.findByIdAndUpdate(slotId, { isBooked: true });

    // ✅ Populate mentor & mentee for proper frontend display
    const populatedBooking = await Booking.findById(booking._id)
      .populate({
        path: 'slot',
        populate: {
          path: 'mentor',
          model: 'User',
          select: 'name',
        },
      });

    res.status(201).json(populatedBooking);
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Failed to book slot' });
  }
});

// Cancel a booking
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.mentee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    await Availability.findByIdAndUpdate(booking.slot, { isBooked: false });

    res.json({ message: 'Booking canceled' });
  } catch (err) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ message: 'Failed to cancel booking' });
  }
});

module.exports = router;
