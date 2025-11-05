const axios = require('axios');

/**
 * Calculate walking distance from a location to the bus stop using Google Maps Distance Matrix API
 * @param {string} destination - Destination address or coordinates
 * @param {number} busStopLat - Bus stop latitude
 * @param {number} busStopLng - Bus stop longitude
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise<Object>} Distance and duration information
 */
async function calculateWalkingDistance(destination, busStopLat, busStopLng, apiKey) {
  const origin = `${busStopLat},${busStopLng}`;

  try {
    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';
    const params = {
      origins: origin,
      destinations: destination,
      mode: 'walking',
      units: 'metric',
      key: apiKey
    };

    const response = await axios.get(url, { params });
    const data = response.data;

    if (data.status !== 'OK') {
      console.warn(`⚠️  API Status: ${data.status} for destination: ${destination}`);
      return null;
    }

    const element = data.rows[0]?.elements[0];

    if (!element || element.status !== 'OK') {
      console.warn(`⚠️  No route found for: ${destination}`);
      return null;
    }

    return {
      distance: element.distance.value, // in meters
      distanceText: element.distance.text,
      duration: element.duration.value, // in seconds
      durationText: element.duration.text,
      destination: data.destination_addresses[0]
    };

  } catch (error) {
    console.error(`❌ Error calculating distance for ${destination}:`, error.message);
    return null;
  }
}

/**
 * Filter properties within walking distance
 * @param {Array} properties - Array of property objects
 * @param {number} busStopLat - Bus stop latitude
 * @param {number} busStopLng - Bus stop longitude
 * @param {number} maxDistance - Maximum walking distance in meters
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise<Array>} Filtered properties with distance info
 */
async function filterPropertiesByDistance(properties, busStopLat, busStopLng, maxDistance, apiKey) {
  console.log(`📏 Filtering ${properties.length} properties by walking distance (max ${maxDistance}m)...`);

  const propertiesWithDistance = [];

  for (const property of properties) {
    // Create a destination string from location
    const destination = property.location || property.title || '';

    if (!destination) {
      console.warn('⚠️  No location found for property, skipping');
      continue;
    }

    // Add "Sweden" to help Google Maps locate it
    const searchDestination = `${destination}, Sweden`;

    // Calculate distance
    const distanceInfo = await calculateWalkingDistance(
      searchDestination,
      busStopLat,
      busStopLng,
      apiKey
    );

    if (distanceInfo && distanceInfo.distance <= maxDistance) {
      propertiesWithDistance.push({
        ...property,
        walkingDistance: distanceInfo.distance,
        walkingDistanceText: distanceInfo.distanceText,
        walkingDuration: distanceInfo.duration,
        walkingDurationText: distanceInfo.durationText,
        resolvedAddress: distanceInfo.destination
      });

      console.log(`✅ ${property.title} - ${distanceInfo.distanceText} (${distanceInfo.durationText})`);
    } else if (distanceInfo) {
      console.log(`❌ ${property.title} - ${distanceInfo.distanceText} (too far)`);
    }

    // Add delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`🎯 Found ${propertiesWithDistance.length} properties within ${maxDistance}m`);

  return propertiesWithDistance;
}

module.exports = {
  calculateWalkingDistance,
  filterPropertiesByDistance
};
