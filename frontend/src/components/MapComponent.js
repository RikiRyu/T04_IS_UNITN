// Import necessary dependencies and components
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import FilterBar from './FilterBar';
import ThemeToggle from './ThemeToggle';
import SignInPopup from './SignInPopup';
import AccountManager from './AccountManager';
import SavedEvents from './SavedEvents';
import { User, List } from 'lucide-react';

// Configure Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
   iconUrl: require('leaflet/dist/images/marker-icon.png'),
   shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Map controller component for handling map view updates
function MapController({ selectedEvent }) {
   const map = useMap();
   useEffect(() => {
       if (selectedEvent) {
           map.setView([selectedEvent.coordinates.lat, selectedEvent.coordinates.lng], 15);
       }
   }, [selectedEvent, map]);
   return null;
}

const MapComponent = () => {
    // State management for various features
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showSignIn, setShowSignIn] = useState(false);
    const [showAccount, setShowAccount] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [savedEvents, setSavedEvents] = useState([]);
    const [filters, setFilters] = useState({
        searchTerm: '',
        date: '',
        category: ''
    });

  // Refs for map and markers
  const mapRef = useRef(null);
  const markerRefs = useRef({});

 // Fetch all events using environment variable
 useEffect(() => {
    const fetchEvents = async () => {
        try {
            // Use API_BASE_URL for environment-specific configuration
            const response = await fetch(`${API_BASE_URL}/api/events`);
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };
    fetchEvents();
}, []);

  //Fetch saved events for logged-in users
  useEffect(() => {
    const fetchSavedEvents = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Use API_BASE_URL for the request
        const response = await fetch(`${API_BASE_URL}/api/events/saved`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setSavedEvents(data.map(event => event._id));
        }
      } catch (error) {
        console.error('Error fetching saved events:', error);
      }
    };

    fetchSavedEvents();
  }, [localStorage.getItem('token')]);

  // Handle saving and unsaving events
  const handleSaveEvent = async (eventId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      if (savedEvents.includes(eventId)) {
        // Use API_BASE_URL for the request
        const response = await fetch(`${API_BASE_URL}/api/events/save/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          setSavedEvents(savedEvents.filter(id => id !== eventId));
        }
      } else {
        // Use API_BASE_URL for the request
        const response = await fetch(`${API_BASE_URL}/api/events/save/${eventId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          setSavedEvents([...savedEvents, eventId]);
        }
      }
    } catch (error) {
      console.error('Error saving/unsaving event:', error);
    }
  };

   // Filter events based on search term, date, and category
   const filteredEvents = events.filter(event => {
       const matchesSearch = !filters.searchTerm || 
           event.title?.toLowerCase().includes(filters.searchTerm.toLowerCase());
       const matchesDate = !filters.date || 
           new Date(event.date).toLocaleDateString() === new Date(filters.date).toLocaleDateString();
       const matchesCategory = !filters.category || 
           event.originalType?.toLowerCase() === filters.category.toLowerCase();
       return matchesSearch && matchesDate && matchesCategory;
   });

   const handleEventClick = (event) => {
    setSelectedEvent(event);
    const marker = markerRefs.current[event.apiId];
    if (marker && mapRef.current) {
        mapRef.current.setView([event.coordinates.lat, event.coordinates.lng], 15);
        marker.openPopup();
    }
};

   return (
       <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`} 
            style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: isDarkMode ? '#111827' : '#f3f4f6',
                overflow: 'hidden'
            }}>
           <div className="header" style={{
               padding: '12px 24px',
               backgroundColor: isDarkMode ? '#1f2937' : 'white',
               borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
               display: 'flex',
               alignItems: 'center',
               gap: '24px',
               boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
           }}>
               <h1 style={{
                   fontSize: '1.5rem',
                   fontWeight: '600',
                   color: isDarkMode ? '#f3f4f6' : '#111827',
                   letterSpacing: '0.025em',
                   minWidth: '200px'
               }}>
                   <span style={{ color: '#3B82F6' }}>Trento</span> Events
               </h1>

               <div style={{flex: 1}}>
                   <FilterBar filters={filters} setFilters={setFilters} />
               </div>

               <div style={{
                   display: 'flex',
                   alignItems: 'center',
                   gap: '12px'
               }}>
                   {localStorage.getItem('token') ? (
                     <>
                       <button
                         className="px-4 py-2 rounded-lg"
                         style={{
                           backgroundColor: isDarkMode ? '#374151' : 'white',
                           color: isDarkMode ? '#f3f4f6' : '#111827',
                           border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                           padding: '8px 16px',
                           height: '38px',
                           display: 'flex',
                           alignItems: 'center',
                           gap: '8px'
                         }}
                         onClick={() => setShowSaved(true)}
                       >
                         <List size={16} />
                         Saved Events
                       </button>
                       <button
                         className="px-4 py-2 rounded-lg"
                         style={{
                           backgroundColor: isDarkMode ? '#374151' : 'white',
                           color: isDarkMode ? '#f3f4f6' : '#111827',
                           border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                           padding: '8px 16px',
                           height: '38px',
                           display: 'flex',
                           alignItems: 'center',
                           gap: '8px'
                         }}
                         onClick={() => setShowAccount(true)}
                       >
                         <User size={16} />
                         Account
                       </button>
                     </>
                   ) : (
                     <button
                       className="px-4 py-2 rounded-lg"
                       style={{
                         backgroundColor: isDarkMode ? '#374151' : 'white',
                         color: isDarkMode ? '#f3f4f6' : '#111827',
                         border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
                         padding: '8px 16px',
                         height: '38px',
                         display: 'flex',
                         alignItems: 'center',
                         gap: '8px'
                       }}
                       onClick={() => setShowSignIn(true)}
                     >
                       <User size={16} />
                       Sign In
                     </button>
                   )}
                   <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
               </div>
           </div>

           <div style={{
               display: 'flex',
               flex: 1,
               height: 'calc(100vh - 64px)',
               gap: '16px',
               padding: '16px',
               overflow: 'hidden'
           }}>
               <div style={{
                   width: '75%',
                   position: 'relative',
                   borderRadius: '12px',
                   overflow: 'hidden',
                   boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
               }}>
                   <MapContainer 
                       center={[46.07, 11.12]} 
                       zoom={13} 
                       style={{height: '100%', width: '100%'}}
                       scrollWheelZoom={true}
                       ref={mapRef}
                   >
                       <MapController selectedEvent={selectedEvent} />
                       <TileLayer
                           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                           attribution="&copy; OpenStreetMap contributors"
                       />
                       {filteredEvents.map((event) => (
                           <Marker
                               key={event.apiId}
                               position={[event.coordinates.lat, event.coordinates.lng]}
                               ref={(ref) => {markerRefs.current[event.apiId] = ref}}
                               eventHandlers={{
                                   click: () => handleEventClick(event)
                               }}
                           >
                               <Popup>
                                   <div style={{
                                       padding: '16px',
                                       borderRadius: '8px',
                                       backgroundColor: 'white',
                                       boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                   }}>
                                       <h3 style={{
                                           fontSize: '1.1rem',
                                           fontWeight: '600',
                                           marginBottom: '8px',
                                           color: '#111827'
                                       }}>
                                           {event.title}
                                       </h3>
                                       <p style={{
                                           fontSize: '0.9rem',
                                           marginBottom: '12px',
                                           lineHeight: '1.5',
                                           color: '#4B5563'
                                       }}>
                                           {event.description.replace(/<[^>]*>/g, '')}
                                       </p>
                                       <div style={{
                                           fontSize: '0.875rem',
                                           color: '#6B7280',
                                           display: 'flex',
                                           flexDirection: 'column',
                                           gap: '6px'
                                       }}>
                                           <p style={{margin: 0, display: 'flex', alignItems: 'center', gap: '6px'}}>
                                               <span>🏷️</span>
                                               {event.originalType || event.category || 'No type specified'}
                                           </p>
                                           <p style={{margin: 0, display: 'flex', alignItems: 'center', gap: '6px'}}>
                                               <span>📅</span>
                                               {new Date(event.date).toLocaleDateString('it-IT', {
                                                   day: '2-digit',
                                                   month: '2-digit',
                                                   year: 'numeric'
                                               })}
                                           </p>
                                           <p style={{margin: 0, display: 'flex', alignItems: 'center', gap: '6px'}}>
                                               <span>📍</span>
                                               {event.venue}
                                           </p>
                                       </div>
                                   </div>
                               </Popup>
                           </Marker>
                       ))}
                   </MapContainer>
               </div>

               <div style={{
                   width: '25%',
                   backgroundColor: isDarkMode ? '#1f2937' : 'white',
                   borderRadius: '12px',
                   boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                   display: 'flex',
                   flexDirection: 'column',
                   overflow: 'hidden'
               }}>
                   <div style={{
                       padding: '16px',
                       borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                       backgroundColor: isDarkMode ? '#1f2937' : 'white',
                       position: 'sticky',
                       top: 0,
                       zIndex: 1,
                       display: 'flex',
                       alignItems: 'center',
                       gap: '8px'
                   }}>
                       <h2 style={{
                           fontSize: '1.1rem',
                           fontWeight: 600,
                           margin: 0,
                           color: isDarkMode ? '#f3f4f6' : '#111827'
                       }}>
                           Available Events
                       </h2>
                   </div>

                   <div style={{
                       flex: 1,
                       overflowY: 'auto',
                       padding: '16px',
                       display: 'flex',
                       flexDirection: 'column',
                       gap: '12px'
                   }}>
                       {filteredEvents.map(event => (
                           <div 
                               key={event._id}
                               style={{
                                   padding: '16px',
                                   borderRadius: '8px',
                                   backgroundColor: isDarkMode 
                                       ? (selectedEvent?._id === event._id ? '#374151' : '#1f2937') 
                                       : (selectedEvent?._id === event._id ? '#f3f4f6' : 'white'),
                                   border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                                   cursor: 'pointer',
                                   transition: 'all 0.2s ease',
                                   boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                   position: 'relative'
                               }}
                           >
                               <div onClick={() => handleEventClick(event)}>
                                   <h3 style={{
                                       margin: '0 0 8px 0',
                                       fontSize: '1rem',
                                       fontWeight: 600,
                                       color: isDarkMode ? '#f3f4f6' : '#111827'
                                   }}>
                                       {event.title}
                                   </h3>
                                   
                                   <div style={{
                                       display: 'flex',
                                       alignItems: 'center',
                                       gap: '12px',
                                       marginBottom: '8px',
                                       fontSize: '0.875rem',
                                       color: isDarkMode ? '#9CA3AF' : '#6B7280'
                                   }}>
                                       <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                           <span>📅</span>
                                           {new Date(event.date).toLocaleDateString('it-IT', {
                                               day: '2-digit',
                                               month: '2-digit',
                                               year: 'numeric'
                                           })}
                                       </span>
                                       <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                                           <span>🏷️</span>
                                           {event.originalType || event.category || 'No type'}
                                       </span>
                                   </div>
                                   
                                   <p style={{
                                       fontSize: '0.875rem',
                                       lineHeight: '1.5',
                                       marginBottom: '8px',
                                       color: isDarkMode ? '#D1D5DB' : '#4B5563'
                                   }}>
                                       {event.description.replace(/<[^>]*>/g, '')}
                                   </p>
                                   
                                   <div style={{
                                       fontSize: '0.875rem',
                                       color: isDarkMode ? '#9CA3AF' : '#6B7280',
                                       display: 'flex',
                                       alignItems: 'center',
                                       gap: '4px'
                                   }}>
                                       <span>📍</span>
                                       {event.venue}
                                   </div>
                               </div>
                               
                               {localStorage.getItem('token') && (
                                   <button
                                       onClick={() => handleSaveEvent(event._id)}
                                       style={{
                                           position: 'absolute',
                                           top: '8px',
                                           right: '8px',
                                           background: 'none',
                                           border: 'none',
                                           cursor: 'pointer',
                                           fontSize: '1.5rem'
                                       }}
                                   >
                                       {savedEvents.includes(event._id) ? '❤️' : '🤍'}
                                   </button>
                               )}
                           </div>
                       ))}
                   </div>
               </div>
           </div>
           {showSignIn && <SignInPopup onClose={() => setShowSignIn(false)} isDarkMode={isDarkMode} />}
           {showAccount && <AccountManager onClose={() => setShowAccount(false)} isDarkMode={isDarkMode} />}
           {showSaved && <SavedEvents 
  onClose={() => setShowSaved(false)} 
  isDarkMode={isDarkMode} 
  onEventUnsaved={(eventId) => setSavedEvents(current => current.filter(id => id !== eventId))}
/>}
       </div>
   );
};

export default MapComponent;