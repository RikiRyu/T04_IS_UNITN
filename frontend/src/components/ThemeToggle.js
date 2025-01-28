import React from 'react';

/**
 * ThemeToggle Component
 * Provides a button to switch between light and dark themes
 */
const ThemeToggle = ({ isDarkMode, setIsDarkMode }) => {
 return (
   <button 
     // Toggle theme on click
     onClick={() => setIsDarkMode(!isDarkMode)}
     style={{
       padding: '8px 16px',         // Horizontal and vertical padding
       borderRadius: '4px',         // Rounded corners
       // Dynamic background color based on theme
       backgroundColor: isDarkMode ? '#4a4a4a' : '#007bff',
       color: 'white',             // Text color
       border: 'none',             // Remove default button border
       cursor: 'pointer',          // Show pointer cursor on hover
       transition: 'background-color 0.3s', // Smooth color transition
       marginLeft: '10px'          // Space from left elements
     }}
   >
     {/* Show sun emoji for light mode, moon emoji for dark mode */}
     {isDarkMode ? '☀️ Light' : '🌙 Dark'}
   </button>
 );
};

export default ThemeToggle;