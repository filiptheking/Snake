require('dotenv').config();
const cron = require('node-cron');
const { scrapeObjektvision } = require('./scraper');
const { filterPropertiesByDistance } = require('./distance');
const { sendEmail } = require('./mailer');

// Hardcoded location settings for Fältvägen busshållplats, Märsta/Arlanda
const LOCATION = {
  busStopLat: 59.6196,
  busStopLng: 17.8555,
  maxDistance: 5000, // meters
  name: 'Fältvägens busshållplats, Märsta/Arlanda'
};

// Configuration from environment variables
const config = {
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  recipientEmail: process.env.RECIPIENT_EMAIL,
  runHour: parseInt(process.env.RUN_HOUR || 20),
  runMinute: parseInt(process.env.RUN_MINUTE || 0)
};

/**
 * Main function to search for properties and send email
 */
async function searchAndNotify() {
  console.log('\n===========================================');
  console.log('🏡 TOMTSÖKARE - Starting Daily Search');
  console.log('===========================================');
  console.log(`📅 Time: ${new Date().toLocaleString('sv-SE')}`);
  console.log(`📍 Location: ${LOCATION.name}`);
  console.log(`🚶 Max distance: ${LOCATION.maxDistance}m walking\n`);

  try {
    // Step 1: Scrape properties from Objektvision
    const properties = await scrapeObjektvision();

    if (properties.length === 0) {
      console.log('⚠️  No properties found to check');
      await sendEmail([], config.recipientEmail, {
        user: config.emailUser,
        pass: config.emailPass
      }, LOCATION.maxDistance);
      return;
    }

    // Step 2: Filter by walking distance
    const nearbyProperties = await filterPropertiesByDistance(
      properties,
      LOCATION.busStopLat,
      LOCATION.busStopLng,
      LOCATION.maxDistance,
      config.googleMapsApiKey
    );

    // Step 3: Send email with results
    await sendEmail(nearbyProperties, config.recipientEmail, {
      user: config.emailUser,
      pass: config.emailPass
    }, LOCATION.maxDistance);

    console.log('\n===========================================');
    console.log('✅ Search completed successfully!');
    console.log(`📊 Results: ${nearbyProperties.length} properties found within ${LOCATION.maxDistance}m`);
    console.log('===========================================\n');

  } catch (error) {
    console.error('\n❌ Error during search:', error);
    console.error('Stack trace:', error.stack);
  }
}

/**
 * Validate configuration
 */
function validateConfig() {
  const required = [
    'googleMapsApiKey',
    'emailUser',
    'emailPass',
    'recipientEmail'
  ];

  const missing = required.filter(key => !config[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n📝 Please create a .env file based on .env.example');
    process.exit(1);
  }

  console.log('✅ Configuration validated');
  console.log(`📍 Search location: ${LOCATION.name}`);
  console.log(`📏 Max walking distance: ${LOCATION.maxDistance}m`);
}

/**
 * Main entry point
 */
async function main() {
  console.log('🚀 Tomtsökare starting...\n');

  // Validate configuration
  validateConfig();

  // Check if running in test mode or scheduled mode
  const isTestMode = process.argv.includes('--test') || process.argv.includes('--now');

  if (isTestMode) {
    console.log('🧪 Running in TEST mode (immediate execution)\n');
    await searchAndNotify();
    console.log('✅ Test completed. Exiting...');
    process.exit(0);
  } else {
    console.log('⏰ Running in SCHEDULED mode');
    console.log(`📅 Scheduled to run daily at ${config.runHour}:${String(config.runMinute).padStart(2, '0')}\n`);

    // Schedule the job (cron format: minute hour * * *)
    const cronExpression = `${config.runMinute} ${config.runHour} * * *`;
    console.log(`📋 Cron expression: ${cronExpression}`);

    cron.schedule(cronExpression, () => {
      searchAndNotify();
    });

    console.log('✅ Scheduler started. Press Ctrl+C to stop.\n');
  }
}

// Run the application
if (require.main === module) {
  main();
}

module.exports = { searchAndNotify, validateConfig };
