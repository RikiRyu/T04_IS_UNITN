import React from 'react';

const ThemeToggle = ({ isDarkMode, setIsDarkMode }) => {
 return (
   <button 
     onClick={() => setIsDarkMode(!isDarkMode)}
     style={{
       padding: '8px 16px',
       borderRadius: '4px',
       backgroundColor: isDarkMode ? '#4a4a4a' : '#007bff',
       color: 'white',
       border: 'none',
       cursor: 'pointer',
       transition: 'background-color 0.3s',
       marginLeft: '10px'
     }}
   >
     {isDarkMode ? '☀️ Light' : '🌙 Dark'}
   </button>
 );
};

export default ThemeToggle;