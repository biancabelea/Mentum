import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Register.css';

const MentorAvailability = () => {
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(30);
  const token = localStorage.getItem('token');

  useEffect(() => {
    loadMyAvailability();
  }, []);

  const loadMyAvailability = async () => {
    try {
      const res = await axios.get('http://localhost:5000/availability/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSlots(res.data);
    } catch (err) {
      console.error('Error loading availability:', err);
    }
  };

  const handleAddSlot = async () => {
    if (!date) return alert('Please select a date and time.');
    try {
      const res = await axios.post(
        'http://localhost:5000/availability',
        {
          date: new Date(date),
          duration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSlots([...slots, res.data]);
      setDate('');
    } catch (err) {
      alert('Failed to add slot');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!slotId) return alert('Invalid slot ID');
    try {
      await axios.delete(`http://localhost:5000/availability/${slotId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSlots((prevSlots) => prevSlots.filter((s) => s._id !== slotId));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete slot');
    }
  };

  return (
    <div className="body-register">
      <div className="registration-form">
        <div className="title">My Availability</div>

        <label>Date & Time:</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Duration:</label>
        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={60}>60 minutes</option>
        </select>

        <button onClick={handleAddSlot}>Add Slot</button>

        <div className="title" style={{ marginTop: '30px' }}>Current Slots</div>
        {slots.length === 0 ? (
  <div className="booking-card no-slots">No slots yet.</div>
) : (
  slots.map((slot) => (
    <div
      key={slot._id}
      className={`booking-card ${slot.isBooked ? 'booked' : 'available'}`}
    >
      <p>
        <strong>
          Slot:{' '}
          {new Date(slot.date).toLocaleString(undefined, {
            dateStyle: 'short',
            timeStyle: 'short',
          })}{' '}
          ({slot.duration} min)
        </strong>
      </p>
      <p>Status: {slot.isBooked ? 'Booked' : 'Available'}</p>
      {!slot.isBooked && (
        <button
          className="cancel-button"
          onClick={() => handleDeleteSlot(slot._id)}
        >
          Delete
        </button>
      )}
    </div>
  ))
)}

      </div>
    </div>
  );
};

export default MentorAvailability;
