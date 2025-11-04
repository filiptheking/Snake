require('dotenv').config();
const { scrapeObjektvision } = require('./src/scraper');
const { filterPropertiesByDistance } = require('./src/distance');

async function testSystem() {
  console.log('\n===========================================');
  console.log('🏡 TOMTSÖKARE - TEST (Utan email)');
  console.log('===========================================\n');

  try {
    // Test 1: Scrape properties
    console.log('📋 TEST 1: Scraping Objektvision.se...\n');
    const properties = await scrapeObjektvision();

    if (properties.length === 0) {
      console.log('⚠️  Inga tomter hittades på Objektvision.se');
      console.log('Detta kan betyda:');
      console.log('  - Objektvision har få eller inga tomter just nu');
      console.log('  - HTML-strukturen har ändrats (behöver justera scraper)');
      console.log('\nTestar Google Maps API istället...\n');
    } else {
      console.log(`✅ Hittade ${properties.length} tomter!\n`);
      properties.slice(0, 3).forEach((p, i) => {
        console.log(`${i + 1}. ${p.title}`);
        console.log(`   Plats: ${p.location || 'Ej angiven'}`);
        console.log(`   Källa: ${p.source}\n`);
      });
    }

    // Test 2: Google Maps API
    console.log('\n📋 TEST 2: Google Maps Distance Matrix API...\n');

    const testLocation = 'Märsta, Sweden';
    console.log(`Testar med: ${testLocation}`);

    const { calculateWalkingDistance } = require('./src/distance');
    const distanceInfo = await calculateWalkingDistance(
      testLocation,
      parseFloat(process.env.BUS_STOP_LAT),
      parseFloat(process.env.BUS_STOP_LNG),
      process.env.GOOGLE_MAPS_API_KEY
    );

    if (distanceInfo) {
      console.log('✅ Google Maps API fungerar!');
      console.log(`   Från: Fältvägen busshållplats (${process.env.BUS_STOP_LAT}, ${process.env.BUS_STOP_LNG})`);
      console.log(`   Till: ${distanceInfo.destination}`);
      console.log(`   Avstånd: ${distanceInfo.distanceText}`);
      console.log(`   Gångtid: ${distanceInfo.durationText}`);
    } else {
      console.log('❌ Google Maps API fungerade inte');
      console.log('Kontrollera:');
      console.log('  - API-nyckeln är korrekt');
      console.log('  - Distance Matrix API är aktiverad');
      console.log('  - Billing är aktiverat på Google Cloud');
    }

    // Test 3: Try with real properties if we have any
    if (properties.length > 0) {
      console.log('\n📋 TEST 3: Filtrera tomter inom 1000m...\n');

      const nearbyProperties = await filterPropertiesByDistance(
        properties.slice(0, 5), // Test only first 5 to save API calls
        parseFloat(process.env.BUS_STOP_LAT),
        parseFloat(process.env.BUS_STOP_LNG),
        parseInt(process.env.MAX_DISTANCE),
        process.env.GOOGLE_MAPS_API_KEY
      );

      if (nearbyProperties.length > 0) {
        console.log('\n🎉 TOMTER HITTADE INOM 1000m:');
        nearbyProperties.forEach((p, i) => {
          console.log(`\n${i + 1}. ${p.title}`);
          console.log(`   📍 ${p.location}`);
          console.log(`   🚶 ${p.walkingDistanceText} (${p.walkingDurationText})`);
          console.log(`   🔗 ${p.link}`);
        });
      } else {
        console.log('\n📭 Inga tomter inom 1000m just nu.');
      }
    }

    console.log('\n===========================================');
    console.log('✅ TEST KLART!');
    console.log('===========================================\n');
    console.log('📧 För att skicka email, lägg till i .env:');
    console.log('   EMAIL_USER=din.email@gmail.com');
    console.log('   EMAIL_PASS=xxxx xxxx xxxx xxxx');
    console.log('\nSedan kör: npm start -- --test\n');

  } catch (error) {
    console.error('\n❌ FEL:', error.message);
    console.error('Stack:', error.stack);
  }
}

testSystem();
