// Main App component that serves as the root of the application
import React from 'react';
// Import the main MapComponent that contains the core functionality
import MapComponent from './components/MapComponent';
// Import global styles
import './styles/App.css';

// App component that wraps the MapComponent
// Uses full viewport height to ensure the map fills the screen
const App = () => {
 return (
   <div className="app" style={{ height: '100vh' }}>
     <MapComponent />
   </div>
 );
};

export default App;