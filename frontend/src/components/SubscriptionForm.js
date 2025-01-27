// SubscriptionForm.js

import React, { useState } from 'react';

const SubscriptionForm = ({ onSubscribe, isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubscribe({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: '20px',
        border: isDarkMode ? '1px solid #444444' : '1px solid #ddd',
        backgroundColor: isDarkMode ? '#333333' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        borderRadius: '10px',
        maxWidth: '400px',
        margin: '20px auto',
      }}
    >
      <h3>Subscribe</h3>
      <div style={{ marginBottom: '15px' }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            marginTop: '5px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            marginTop: '5px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>
      <button
        type="submit"
        style={{
          padding: '10px 15px',
          backgroundColor: isDarkMode ? '#bb86fc' : '#007bff',
          color: '#ffffff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Subscribe
      </button>
    </form>
  );
};

export default SubscriptionForm;
