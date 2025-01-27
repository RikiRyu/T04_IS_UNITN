import React, { useState, useEffect } from 'react';
import { X, List } from 'lucide-react';

// Use environment variable for API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SavedEvents = ({ isDarkMode, onClose, onEventUnsaved }) => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSavedEvents();
  }, []);

  const fetchSavedEvents = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/events/saved`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token'); // Clear invalid token
          setError('Session expired. Please login again.');
        } else {
          throw new Error('Failed to fetch saved events');
        }
        return;
      }

      const data = await response.json();
      setSavedEvents(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching saved events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (eventId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/events/save/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          setError('Session expired. Please login again.');
        } else {
          throw new Error('Failed to remove event');
        }
        return;
      }

      setSavedEvents(events => events.filter(event => event._id !== eventId));
      if (onEventUnsaved) {
        onEventUnsaved(eventId);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error removing event:', error);
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
      maxWidth: '600px',
      maxHeight: '80vh',
      overflow: 'auto',
      position: 'relative'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      margin: 0
    },
    eventCard: {
      padding: '1rem',
      marginBottom: '1rem',
      borderRadius: '8px',
      backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
      position: 'relative'
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            <List size={20} style={{ marginRight: '8px', display: 'inline' }} />
            Saved Events
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isDarkMode ? '#9ca3af' : '#6b7280'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <p>Loading saved events...</p>
        ) : savedEvents.length === 0 ? (
          <p>No saved events yet</p>
        ) : (
          savedEvents.map(event => (
            <div key={event._id} style={styles.eventCard}>
              <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>{event.title}</h3>
              <p style={{ margin: '0.5rem 0' }}>
                <span role="img" aria-label="calendar">📅</span>
                {' '}
                {new Date(event.date).toLocaleDateString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
})}
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                <span role="img" aria-label="location">📍</span>
                {' '}
                {event.venue}
              </p>
              <button
                onClick={() => handleUnsave(event._id)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                ❌
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedEvents;