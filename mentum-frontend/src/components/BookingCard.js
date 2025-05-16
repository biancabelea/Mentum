import React from 'react';
import '../styles/BookingCard.css';

const BookingCard = ({ mentor, onBook }) => {
  return (
    <div className="booking-card">
      <h4>{mentor.name}</h4>
      {mentor.availability && mentor.availability.length > 0 ? (
        mentor.availability.map((slot) => (
          <button
            key={slot}
            onClick={() => onBook(slot)}
          >
            {slot}
          </button>
        ))
      ) : (
        <p>No available slots</p>
      )}
    </div>
  );
};

export default BookingCard;
