/**
 * SubscriptionForm Component
 * A form component for user subscription with email and password
 */
import React, { useState } from 'react';

const SubscriptionForm = ({ onSubscribe, isDarkMode }) => {
  // State management for form inputs
  const [email, setEmail] = useState('');     // Email input state
  const [password, setPassword] = useState(''); // Password input state

  /**
   * Handles form submission
   * Prevents default form behavior and calls onSubscribe callback
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubscribe({ email, password });
  };

  return (
    // Main form container with theme-aware styling
    <form
      onSubmit={handleSubmit}
      style={{
        padding: '20px',
        // Theme-aware border color
        border: isDarkMode ? '1px solid #444444' : '1px solid #ddd',
        // Theme-aware background
        backgroundColor: isDarkMode ? '#333333' : '#ffffff',
        // Theme-aware text color
        color: isDarkMode ? '#ffffff' : '#000000',
        borderRadius: '10px',
        maxWidth: '400px',
        margin: '20px auto', // Center form horizontally
      }}
    >
      {/* Form title */}
      <h3>Subscribe</h3>

      {/* Email input container */}
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

      {/* Password input container */}
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

      {/* Submit button with theme-aware styling */}
      <button
        type="submit"
        style={{
          padding: '10px 15px',
          // Theme-aware button color
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