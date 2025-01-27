import React from 'react';

const EventDetails = ({ event }) => {
  if (!event) {
    return <p>Please select an event to see the details.</p>;
  }

  const { title, description, date, venue, email, phone } = event;

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h3>{title}</h3>
      <p><strong>Description:</strong> {description || 'No description available.'}</p>
      <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {venue || 'Location not provided.'}</p>
      {email && (
        <p>
          <strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a>
        </p>
      )}
      {phone && (
        <p>
          <strong>Phone:</strong> <a href={`tel:${phone}`}>{phone}</a>
        </p>
      )}
    </div>
  );
};

export default EventDetails;
