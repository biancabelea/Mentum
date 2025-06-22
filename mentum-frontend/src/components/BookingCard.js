import React from 'react';
import '../styles/BookingCard.css';

const BookingCard = ({ mentor, slots, onBook, refreshSlots }) => {
  const handleClick = async (slot) => {
    const success = await onBook(slot);
    if (success) {
      refreshSlots(mentor._id);
    }
  };
  
  return (
    <div className="booking-card">
      <h4>{mentor.name}</h4>
      {slots && slots.length > 0 ? (
        slots.map((slot) => (
          <button
            key={slot._id}
            onClick={() => handleClick(slot)}
          >
            {new Date(slot.date).toLocaleString()} ({slot.duration} min)
          </button>
        ))
      ) : (
        <p>No available slots</p>
      )}
    </div>
  );
};

export default BookingCard;

