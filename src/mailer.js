const nodemailer = require('nodemailer');

/**
 * Send email with property results
 * @param {Array} properties - Array of properties within walking distance
 * @param {string} recipientEmail - Email address to send to
 * @param {Object} emailConfig - Email configuration (user, pass)
 * @param {number} maxDistance - Maximum walking distance in meters
 * @returns {Promise<boolean>} Success status
 */
async function sendEmail(properties, recipientEmail, emailConfig, maxDistance = 1000) {
  console.log(`📧 Preparing email to ${recipientEmail}...`);

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
      }
    });

    // Generate email content
    const subject = properties.length > 0
      ? `🏡 ${properties.length} Ledig${properties.length > 1 ? 'a' : ''} Tomt${properties.length > 1 ? 'er' : ''} nära Fältvägen Busshållplats!`
      : '📭 Inga nya lediga tomter idag nära Fältvägen';

    const htmlContent = generateEmailHTML(properties, maxDistance);
    const textContent = generateEmailText(properties, maxDistance);

    // Send email
    const info = await transporter.sendMail({
      from: `"Tomtsökare 🏡" <${emailConfig.user}>`,
      to: recipientEmail,
      subject: subject,
      text: textContent,
      html: htmlContent
    });

    console.log('✅ Email sent successfully! Message ID:', info.messageId);
    return true;

  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return false;
  }
}

/**
 * Generate HTML email content
 * @param {Array} properties - Properties to display
 * @param {number} maxDistance - Maximum walking distance in meters
 * @returns {string} HTML string
 */
function generateEmailHTML(properties, maxDistance = 1000) {
  const currentDate = new Date().toLocaleDateString('sv-SE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (properties.length === 0) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
          .content { background: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 10px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏡 Tomtsökare</h1>
            <p>Daglig sökning - ${currentDate}</p>
          </div>
          <div class="content">
            <p>Ingen ledig tomt hittades idag inom ${maxDistance}m gångavstånd från <strong>Fältvägens busshållplats</strong> i Märsta/Arlanda.</p>
            <p>Systemet kommer fortsätta söka dagligen kl 20:00 och meddela dig när något hittas! 🔍</p>
          </div>
          <div class="footer">
            <p>Automatisk sökning via Objektvision.se</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  const propertyCards = properties.map(prop => `
    <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h3 style="margin-top: 0; color: #667eea;">${prop.title}</h3>
      <p><strong>📍 Plats:</strong> ${prop.location || 'Ej angiven'}</p>
      <p><strong>🚶 Gångavstånd:</strong> ${prop.walkingDistanceText} (${prop.walkingDurationText})</p>
      ${prop.price ? `<p><strong>💰 Pris:</strong> ${prop.price}</p>` : ''}
      ${prop.description ? `<p><strong>📝 Beskrivning:</strong> ${prop.description}</p>` : ''}
      <p><strong>🔗 Länk:</strong> <a href="${prop.link}" style="color: #667eea;">Se annons på ${prop.source}</a></p>
      <p style="color: #666; font-size: 12px;">Adress: ${prop.resolvedAddress}</p>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
        .content { margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏡 Nya Lediga Tomter Hittade!</h1>
          <p>${currentDate}</p>
          <p style="font-size: 18px; margin-top: 10px;">
            ${properties.length} tomt${properties.length > 1 ? 'er' : ''} inom ${maxDistance}m från Fältvägens busshållplats
          </p>
        </div>
        <div class="content">
          ${propertyCards}
        </div>
        <div class="footer">
          <p>Automatisk daglig sökning via Objektvision.se och Google Maps API</p>
          <p>📍 Fältvägens busshållplats, Märsta/Arlanda</p>
          <p>🚶 Max gångavstånd: ${maxDistance} meter</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text email content
 * @param {Array} properties - Properties to display
 * @param {number} maxDistance - Maximum walking distance in meters
 * @returns {string} Plain text string
 */
function generateEmailText(properties, maxDistance = 1000) {
  const currentDate = new Date().toLocaleDateString('sv-SE');

  if (properties.length === 0) {
    return `
TOMTSÖKARE - ${currentDate}

Ingen ledig tomt hittades idag inom ${maxDistance}m gångavstånd från Fältvägens busshållplats i Märsta/Arlanda.

Systemet kommer fortsätta söka dagligen kl 20:00 och meddela dig när något hittas!

---
Automatisk sökning via Objektvision.se
    `;
  }

  const propertyList = properties.map((prop, index) => `
${index + 1}. ${prop.title}
   Plats: ${prop.location || 'Ej angiven'}
   Gångavstånd: ${prop.walkingDistanceText} (${prop.walkingDurationText})
   ${prop.price ? `Pris: ${prop.price}` : ''}
   Länk: ${prop.link}
   Adress: ${prop.resolvedAddress}
   ${prop.description ? `Beskrivning: ${prop.description}` : ''}
  `).join('\n---\n');

  return `
TOMTSÖKARE - ${currentDate}

🎉 ${properties.length} LEDIG${properties.length > 1 ? 'A' : ''} TOMT${properties.length > 1 ? 'ER' : ''} HITTADE!

Inom ${maxDistance}m gångavstånd från Fältvägens busshållplats, Märsta/Arlanda:

${propertyList}

---
Automatisk daglig sökning via Objektvision.se och Google Maps API
Fältvägens busshållplats, Märsta/Arlanda
Max gångavstånd: ${maxDistance} meter
  `;
}

module.exports = {
  sendEmail
};
