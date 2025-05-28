const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

availabilitySchema.index({ mentor: 1, date: 1 });

module.exports = mongoose.model('Availability', availabilitySchema);
