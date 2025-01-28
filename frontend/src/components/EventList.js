/**
 * EventList Component
 * Renders a scrollable list of events with basic event information
 * Utilizes Tailwind CSS for styling
 */

const EventList = ({ events }) => {
  return (
    // Container div with full height, padding, and vertical scroll
    <div className="h-full p-4 overflow-y-auto">
      {/* Map through events array to create individual event cards */}
      {events.map((event) => (
        // Event card with unique key, margin, padding, border, and hover effect
        <div 
          key={event.apiId} 
          className="mb-4 p-4 border rounded shadow hover:shadow-lg"
        >
          {/* Event title with bold font and large text */}
          <h3 className="font-bold text-lg">
            {event.title}
          </h3>

          {/* Event date in small text and gray color */}
          <p className="text-sm text-gray-600 mb-2">
            {new Date(event.date).toLocaleDateString()}
          </p>

          {/* Event description in small text */}
          <p className="text-sm mb-2">
            {event.description}
          </p>

          {/* Event location in small text with bold label */}
          <p className="text-sm">
            <strong>Location:</strong> {event.venue}
          </p>
        </div>
      ))}
    </div>
  );
};

export default EventList;