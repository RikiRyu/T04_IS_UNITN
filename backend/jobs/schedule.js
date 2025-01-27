const cron = require('node-cron');
const fetchEvents = require('./fetchEvents');

// Schedule the job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Fetching and updating events...');
  await fetchEvents();
});
