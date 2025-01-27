const axios = require('axios');         // HTTP client for making API requests
const Event = require('../models/Event'); // Import Event model for database operations

/**
 * Maps Italian event types to English categories
 * @param {string} name - The Italian event type name
 * @returns {string} - The mapped English category or empty string
 */
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

/**
 * Cleans HTML content from text and normalizes spacing
 * @param {string} text - The text to clean
 * @returns {string} - Cleaned and normalized text
 */
const cleanDescription = (text) => {
  if (!text) return 'No description available';
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking space
    .replace(/\s+/g, ' ')    // Normalize spaces
    .trim();
};

/**
 * Main function to fetch and process events from Trento's API
 * Handles pagination and updates the database with new events
 */
const fetchEvents = async () => {
  try {
    // Get API URL from environment variables or use default
    const eventsUrl = process.env.TRENTO_API_URL || 'https://www.comune.trento.it/api/opendata/v2/content/search?classes=event';
    let currentPageUrl = eventsUrl;
    const currentDate = new Date();
    
    // Clean up old events
    await Event.deleteMany({ date: { $lt: currentDate } });

    // Process all pages of results
    while (currentPageUrl) {
      const response = await axios.get(currentPageUrl);
      const { searchHits, nextPageQuery } = response.data;

      // Validate response structure
      if (!Array.isArray(searchHits)) {
        throw new Error('Expected "searchHits" to be an array.');
      }

      // Process each event in the current page
      for (const hit of searchHits) {
        const metadata = hit.metadata || {};
        const data = hit.data?.['ita-IT'] || {};
        const eventDate = new Date(data.from_time || metadata.published);

        // Skip invalid or past events
        if (isNaN(eventDate) || eventDate < currentDate) continue;

        // Process event type information
        const eventTypeObj = Array.isArray(data.tipo_evento) && data.tipo_evento[0];
        const eventTypeName = eventTypeObj?.name?.['ita-IT'] || 'No type';
        const category = getEventType(eventTypeName);

        // Upsert event in database (update if exists, insert if new)
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
      currentPageUrl = nextPageQuery; // Move to next page if available
    }
    console.log('Events updated successfully');
  } catch (error) {
    console.error('Error in fetchEvents:', error.message);
  }
};

module.exports = fetchEvents;