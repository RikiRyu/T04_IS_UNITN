// Import necessary dependencies from React and Lucide icons
import React, { useState } from 'react';
import { X, User, Settings, LogOut } from 'lucide-react';

const AccountManager = ({ onClose, isDarkMode }) => {
  // State management for form inputs and visibility
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState('');  // Success messages
  const [error, setError] = useState('');      // Error messages

  /**
   * Handles password change submission
   * Validates inputs and makes API call to update password
   */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      // Validate form inputs
      if (!currentPassword || !newPassword) {
        setError('Both passwords are required');
        return;
      }

      // Check authentication status
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      // Make API call to change password
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      // Reset form and show success message
      setMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Handles user logout
   * Removes authentication token and refreshes page
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  // Styles object for component theming
  const styles = {
    // Overlay for modal background
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    // Main container styling
    container: {
      backgroundColor: isDarkMode ? '#1f2937' : 'white',
      color: isDarkMode ? '#f3f4f6' : '#111827',
      padding: '2rem',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '400px',
      position: 'relative'
    },
    // Input container for password fields
    inputContainer: {
      position: 'relative',
      marginBottom: '1rem'
    },
    // Input field styling
    input: {
      width: '100%',
      padding: '0.5rem',
      backgroundColor: isDarkMode ? '#374151' : 'white',
      color: isDarkMode ? '#f3f4f6' : '#111827',
      border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
      borderRadius: '4px'
    },
    // Primary button styling (Change Password)
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginBottom: '1rem'
    },
    // Logout button styling
    logoutButton: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    // Toggle password visibility button
    togglePassword: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: isDarkMode ? '#9ca3af' : '#6b7280'
    }
  };

  // Component render
  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* Close button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isDarkMode ? '#9ca3af' : '#6b7280'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Account Manager
        </h2>

        {/* Success message display */}
        {message && (
          <div style={{
            backgroundColor: isDarkMode ? '#022c22' : '#ecfdf5',
            color: isDarkMode ? '#34d399' : '#047857',
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {message}
          </div>
        )}

        {/* Error message display */}
        {error && (
          <div style={{
            backgroundColor: isDarkMode ? '#fee2e2' : '#fee2e2',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* Password change form */}
        <form onSubmit={handleChangePassword}>
          {/* Current password input */}
          <div style={styles.inputContainer}>
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              style={styles.togglePassword}
            >
              {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {/* New password input */}
          <div style={styles.inputContainer}>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={styles.togglePassword}
            >
              {showNewPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {/* Submit button */}
          <button type="submit" style={styles.button}>
            Change Password
          </button>
        </form>

        {/* Logout button */}
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccountManager;