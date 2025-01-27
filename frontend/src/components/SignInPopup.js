import React, { useState } from 'react';
import { X } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SignInPopup = ({ onClose, isDarkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    if (!validations.length) return "Password must be at least 8 characters";
    if (!validations.uppercase) return "Password must contain an uppercase letter";
    if (!validations.lowercase) return "Password must contain a lowercase letter";
    if (!validations.number) return "Password must contain a number";
    if (!validations.special) return "Password must contain a special character";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (!isLogin) {
        // Registration validation
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
          throw new Error(passwordError);
        }

        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
      }

      const endpoint = isLogin ? 'login' : 'register';
      const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('token', data.token);
      setMessage(isLogin ? 'Login successful!' : 'Registration successful!');
      
      // Close popup after successful login/registration
      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh to update UI with logged-in state
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
    input: {
      width: '100%',
      padding: '0.5rem',
      marginBottom: '1rem',
      borderRadius: '4px',
      border: `1px solid ${isDarkMode ? '#4b5563' : '#d1d5db'}`,
      backgroundColor: isDarkMode ? '#374151' : 'white',
      color: isDarkMode ? '#f3f4f6' : '#111827'
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <button onClick={onClose} style={{
          position: 'absolute',
          right: '1rem',
          top: '1rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: isDarkMode ? '#9ca3af' : '#6b7280'
        }}>
          <X size={20} />
        </button>

        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
          {isLogin ? 'Log In' : 'Sign Up'}
        </h2>

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

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={styles.input}
            required
          />

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={styles.input}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isDarkMode ? '#9ca3af' : '#6b7280'
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              style={styles.input}
              required
            />
          )}

          <button
            type="submit"
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center', color: isDarkMode ? '#d1d5db' : '#6b7280' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setMessage('');
              setFormData({
                email: '',
                password: '',
                confirmPassword: ''
              });
            }}
            style={{
              color: '#3b82f6',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>

        {!isLogin && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
            borderRadius: '4px',
            color: isDarkMode ? '#d1d5db' : '#374151'
          }}>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Password Requirements:</p>
            <ul style={{ paddingLeft: '1.25rem' }}>
              <li>At least 8 characters</li>
              <li>One uppercase letter (A-Z)</li>
              <li>One lowercase letter (a-z)</li>
              <li>One number (0-9)</li>
              <li>One special character (!@#$%^&*)</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInPopup;