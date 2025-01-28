import React from 'react';

const EventDetails = ({ event }) => {
  // Return placeholder message if no event is selected
  if (!event) {
    return <p>Please select an event to see the details.</p>;
  }

  // Destructure event properties for easier access
  const { title, description, date, venue, email, phone } = event;

  return (
    // Main container with basic styling
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      {/* Event title */}
      <h3>{title}</h3>

      {/* Description with fallback text if not provided */}
      <p>
        <strong>Description:</strong> {description || 'No description available.'}
      </p>

      {/* Format date to local string representation */}
      <p>
        <strong>Date:</strong> {new Date(date).toLocaleDateString()}
      </p>

      {/* Location with fallback text if not provided */}
      <p>
        <strong>Location:</strong> {venue || 'Location not provided.'}
      </p>

      {/* Conditionally render email if provided */}
      {email && (
        <p>
          <strong>Email:</strong>{' '}
          <a href={`mailto:${email}`}>{email}</a>
        </p>
      )}

      {/* Conditionally render phone if provided */}
      {phone && (
        <p>
          <strong>Phone:</strong>{' '}
          <a href={`tel:${phone}`}>{phone}</a>
        </p>
      )}
    </div>
  );
};

export default EventDetails;