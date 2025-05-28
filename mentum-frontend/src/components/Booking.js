import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookingCard from './BookingCard';
import '../styles/Booking.css';
import { useParams } from 'react-router-dom';

const Booking = () => {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);

  const token = localStorage.getItem('token');
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchMentor();
    loadSlots(mentorId);
    fetchMyBookings();
  }, []);

  const fetchMentor = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/mentors/${mentorId}`, authHeaders);
      setMentor(res.data);
    } catch (err) {
      console.error('Error fetching mentor:', err);
    }
  };

  const loadSlots = async (mentorId) => {
    try {
      const res = await axios.get(`http://localhost:5000/availability/mentor/${mentorId}`, authHeaders);
      setSlots(res.data);
    } catch (err) {
      console.error('Error loading slots:', err);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/bookings', authHeaders);
      setMyBookings(res.data);
    } catch (err) {
      console.error('Error fetching my bookings:', err);
    }
  };

  const handleBook = async (slot) => {
    try {
      const res = await axios.post('http://localhost:5000/bookings', { slotId: slot._id }, authHeaders);
      const newBooking = res.data;
      setMyBookings((prev) => [...prev, newBooking]);
      setSlots((prev) => prev.filter((s) => s._id !== slot._id));
      alert('Booking successful!');
      return true;
    } catch (err) {
      alert('Booking failed');
      return false;
    }
  };

  const handleCancel = async (bookingId, slot) => {
    try {
      await axios.delete(`http://localhost:5000/bookings/${bookingId}`, authHeaders);
      setMyBookings((prev) => prev.filter((b) => b._id !== bookingId));
      loadSlots(slot.mentor);
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  return (
    <div>
      <h2>Book a Slot</h2>
      {mentor && (
        <BookingCard
          mentor={mentor}
          slots={slots}
          onBook={handleBook}
          refreshSlots={() => loadSlots(mentorId)}
        />
      )}

      <h2>My Bookings</h2>
      {myBookings.map((booking) => (
        <div key={booking._id} className="booking-card booked">
          {booking.slot && (
            <>
              <p><strong>Mentor:</strong> {booking.slot.mentor?.name || 'Unknown'}</p>
              <p><strong>Slot:</strong> {new Date(booking.slot.date).toLocaleString()}</p>
              <button
                className="cancel-button"
                onClick={() => handleCancel(booking._id, booking.slot)}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Booking;
