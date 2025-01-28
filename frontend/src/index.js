// Core React imports
import React from 'react';
import ReactDOM from 'react-dom';
// Global styles
import './styles/App.css';
// Main App component
import App from './App';

// Render the App component inside StrictMode for additional development checks
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);