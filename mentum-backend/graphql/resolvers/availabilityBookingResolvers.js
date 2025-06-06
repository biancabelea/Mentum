// /graphql/availabilityBookingResolvers.js
const Availability = require('../../models/Availability');
const Booking = require('../../models/Booking');
const User = require('../../models/User');
const { GraphQLDateTime } = require('graphql-iso-date');

const resolvers = {
  DateTime: GraphQLDateTime,

  Query: {
    myAvailability: async (_, __, { user }) => {
      if (!user) throw new Error('Unauthorized');
      return Availability.find({ mentor: user._id });
    },

    mentorAvailability: async (_, { mentorId }) => {
      return Availability.find({ mentor: mentorId, isBooked: false });
    },

    myBookings: async (_, __, { user }) => {
      if (!user) throw new Error('Unauthorized');
      const bookings = await Booking.find({ mentee: user._id })
        .populate('slot')
        .populate('mentor')
        .populate('mentee');
      return bookings.filter(b => b.slot && b.mentor);
    },
  },

  Mutation: {
    addAvailability: async (_, { input }, { user }) => {
      if (!user || user.userRole !== 'Mentor') throw new Error('Unauthorized');
      const { date, duration } = input;
      const slot = new Availability({
        mentor: user._id,
        date: new Date(date),
        duration,
        isBooked: false,
      });
      await slot.save();
      return slot;
    },

    deleteAvailability: async (_, { id }, { user }) => {
      if (!user || user.userRole !== 'Mentor') throw new Error('Unauthorized');
      const slot = await Availability.findById(id);
      if (!slot) return false;
      if (slot.mentor.toString() !== user._id.toString()) throw new Error('Forbidden');
      await Availability.findByIdAndDelete(id);
      return true;
    },

    bookSlot: async (_, { input }, { user }) => {
      if (!user || user.userRole !== 'Student') throw new Error('Unauthorized');
      const { slotId } = input;
      const slot = await Availability.findById(slotId);
      if (!slot || slot.isBooked) throw new Error('Slot unavailable');

      const booking = await Booking.create({
        mentor: slot.mentor,
        mentee: user._id,
        slot: slot._id,
        date: slot.date,
        duration: slot.duration,
      });

      await Availability.findByIdAndUpdate(slotId, { isBooked: true });

      return Booking.findById(booking._id)
        .populate('slot')
        .populate('mentor')
        .populate('mentee');
    },

    cancelBooking: async (_, { id }, { user }) => {
      if (!user || user.userRole !== 'Student') throw new Error('Unauthorized');
      const booking = await Booking.findById(id);
      if (!booking) return false;
      if (booking.mentee.toString() !== user._id.toString()) throw new Error('Forbidden');

      await Booking.findByIdAndDelete(id);
      await Availability.findByIdAndUpdate(booking.slot, { isBooked: false });
      return true;
    },
  },
};

module.exports = resolvers;
