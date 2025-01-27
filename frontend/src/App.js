// App.js
import React from 'react';
import MapComponent from './components/MapComponent';
import './styles/App.css';

const App = () => {
 return (
   <div className="app" style={{ height: '100vh' }}>
     <MapComponent />
   </div>
 );
};

export default App;