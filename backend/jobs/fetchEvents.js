const axios = require('axios');
const Event = require('../models/Event');

// Map event types from API to categories
function getEventType(name) {
  if (!name) return '';
  const typeMap = {
    'cultura': 'cultural',
    'sport': 'sport',
    'musica': 'music',
    'enogastronomia': 'food',
    'arte e mostre': 'art',
    'feste, mercati e fiere': 'events',
  };
  
  const lowerName = name.toLowerCase();
  return typeMap[lowerName] || '';
}

// Clean description to remove HTML and unnecessary characters
const cleanDescription = (text) => {
  if (!text) return 'No description available';
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking space
    .replace(/\s+/g, ' ')    // Normalize spaces
    .trim();
};

const fetchEvents = async () => {
  try {
    const eventsUrl = process.env.TRENTO_API_URL || 'https://www.comune.trento.it/api/opendata/v2/content/search?classes=event';    let currentPageUrl = eventsUrl;
    const currentDate = new Date();
    
    // Delete past events from the database
    await Event.deleteMany({ date: { $lt: currentDate } });

    while (currentPageUrl) {
      const response = await axios.get(currentPageUrl);
      const { searchHits, nextPageQuery } = response.data;

      if (!Array.isArray(searchHits)) {
        throw new Error('Expected "searchHits" to be an array.');
      }

      for (const hit of searchHits) {
        const metadata = hit.metadata || {};
        const data = hit.data?.['ita-IT'] || {};
        const eventDate = new Date(data.from_time || metadata.published);

        // Skip events with invalid or past dates
        if (isNaN(eventDate) || eventDate < currentDate) continue;

        // Extract event type information
        const eventTypeObj = Array.isArray(data.tipo_evento) && data.tipo_evento[0];
        const eventTypeName = eventTypeObj?.name?.['ita-IT'] || 'No type';
        const category = getEventType(eventTypeName);

        // Save or update the event in the database
        await Event.findOneAndUpdate(
          { apiId: metadata.id },
          {
            apiId: metadata.id,
            title: data.titolo || 'Untitled Event',
            description: cleanDescription(data.abstract),
            date: eventDate,
            coordinates: {
              lat: data.gps?.latitude || 0,
              lng: data.gps?.longitude || 0,
            },
            venue: data.luogo_svolgimento || 'Unknown location',
            category: category,
            originalType: eventTypeName,
          },
          { upsert: true }
        );
      }

      console.log(`Processed ${searchHits.length} events.`);
      currentPageUrl = nextPageQuery; // Move to the next page if available
    }
    console.log('Events updated successfully');
  } catch (error) {
    console.error('Error in fetchEvents:', error.message);
  }
};

module.exports = fetchEvents;
