const EventList = ({ events }) => {
  return (
    <div className="h-full p-4 overflow-y-auto">
      {events.map((event) => (
        <div key={event.apiId} className="mb-4 p-4 border rounded shadow hover:shadow-lg">
          <h3 className="font-bold text-lg">{event.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{new Date(event.date).toLocaleDateString()}</p>
          <p className="text-sm mb-2">{event.description}</p>
          <p className="text-sm"><strong>Location:</strong> {event.venue}</p>
        </div>
      ))}
    </div>
  );
};

export default EventList;