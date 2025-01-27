import React, { useState } from 'react';
import { X, User, Settings, LogOut } from 'lucide-react';

const AccountManager = ({ onClose, isDarkMode }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      if (!currentPassword || !newPassword) {
        setError('Both passwords are required');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

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

      setMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const styles = {
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
    container: {
      backgroundColor: isDarkMode ? '#1f2937' : 'white',
      color: isDarkMode ? '#f3f4f6' : '#111827',
      padding: '2rem',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '400px',
      position: 'relative'
    },
    inputContainer: {
      position: 'relative',
      marginBottom: '1rem'
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      backgroundColor: isDarkMode ? '#374151' : 'white',
      color: isDarkMode ? '#f3f4f6' : '#111827',
      border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
      borderRadius: '4px'
    },
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
    logoutButton: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
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

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
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

        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Account Manager
        </h2>

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

        <form onSubmit={handleChangePassword}>
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

          <button type="submit" style={styles.button}>
            Change Password
          </button>
        </form>

        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccountManager;