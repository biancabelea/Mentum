import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BookingCard from './BookingCard';
import '../styles/Booking.css';

const Booking = () => {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchMentor = async () => {
      const { data } = await axios.get(`http://localhost:5000/mentors/${mentorId}`);
      setMentor(data);
    };

    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(data);
    };

    fetchMentor();
    fetchBookings();
  }, [mentorId]);

  const handleBooking = async (mentorId, slot) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/bookings',
        { mentorId, date: slot, duration: 30 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Booking successful');
    } catch (error) {
      alert('Booking failed');
    }
  };

  const handleCancel = async (bookingId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Booking cancelled');
      setBookings(bookings.filter(b => b._id !== bookingId));
    } catch (error) {
      alert('Failed to cancel booking');
    }
  };

  return (
    <div className="booking-page">
      <h2 className="booking-heading">Book a Slot</h2>
      {mentor && (
        <BookingCard
          mentor={mentor}
          onBook={(slot) => handleBooking(mentor._id, slot)}
        />
      )}

      <h2 className="booking-heading">My Bookings</h2>
      <div className="booking-list">
        {bookings.map((booking) => (
          <div key={booking._id} className="booking-item">
            <p>
              <strong>Mentor:</strong> {booking.mentor.name}<br />
              <strong>Slot:</strong> {new Date(booking.date).toLocaleString()}
            </p>
            <button className="cancel-button" onClick={() => handleCancel(booking._id)}>Cancel</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Booking;
