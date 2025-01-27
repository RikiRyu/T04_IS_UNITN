const cron = require('node-cron');      // Library for scheduling tasks
const fetchEvents = require('./fetchEvents');

// Schedule event fetching to run daily at midnight
// Cron format: Minute Hour Day Month DayOfWeek
// '0 0 * * *' = At 00:00 (midnight) every day
cron.schedule('0 0 * * *', async () => {
  console.log('Fetching and updating events...');
  await fetchEvents();
});