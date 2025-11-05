const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes Objektvision.se for available plots (tomter) and residential properties
 * @returns {Promise<Array>} Array of property objects
 */
async function scrapeObjektvision() {
  console.log('🔍 Scraping Objektvision.se for lediga tomter...');

  const properties = [];

  try {
    // URLs to scrape - both residential plots and properties
    const urls = [
      'https://objektvision.se/tomter,_bostadsfastigheter',
      'https://objektvision.se/mark'
    ];

    for (const url of urls) {
      console.log(`📄 Fetching: ${url}`);

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'sv-SE,sv;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0'
        },
        timeout: 15000,
        maxRedirects: 5
      });

      const $ = cheerio.load(response.data);

      // Parse each property listing
      // Note: This selector might need adjustment based on Objektvision's actual HTML structure
      $('.object-item, .listing-item, article, .property-card').each((index, element) => {
        try {
          const $el = $(element);

          // Extract property details
          const title = $el.find('h2, h3, .title, .object-title').first().text().trim();
          const location = $el.find('.location, .address, .place').first().text().trim();
          const price = $el.find('.price, .pris').first().text().trim();
          const link = $el.find('a').first().attr('href');
          const description = $el.find('.description, .desc, p').first().text().trim();

          // Only add if we have at least a title
          if (title) {
            properties.push({
              title,
              location,
              price,
              link: link ? (link.startsWith('http') ? link : `https://objektvision.se${link}`) : url,
              description,
              source: 'Objektvision.se'
            });
          }
        } catch (err) {
          console.warn('⚠️  Error parsing property item:', err.message);
        }
      });
    }

    console.log(`✅ Found ${properties.length} properties on Objektvision.se`);
    return properties;

  } catch (error) {
    console.error('❌ Error scraping Objektvision:', error.message);
    return [];
  }
}

/**
 * Extracts location/address from property data
 * @param {Object} property - Property object
 * @returns {string} Location string
 */
function extractLocation(property) {
  // Try to extract a meaningful location from title or location field
  const locationText = property.location || property.title || '';

  // Look for Swedish city/place names
  const match = locationText.match(/\b([A-ZÅÄÖ][a-zåäö]+(?:\s+[A-ZÅÄÖ][a-zåäö]+)*)\b/);

  return match ? match[0] : locationText;
}

module.exports = {
  scrapeObjektvision,
  extractLocation
};
