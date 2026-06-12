
const UAParser = require('ua-parser-js');
const geoip = require('geoip-lite');
//enhance this
const extractInfo = (req, res, next) => {

    const host = req.get('host') || '';

  /* ----------------------------------
     1. IP ADDRESS (proxy-safe)
  ---------------------------------- */
  const ip =
    req.headers['cf-connecting-ip'] ||
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket.remoteAddress ||
    null;

  /* ----------------------------------
     2. GEO LOCATION
  ---------------------------------- */
  const geo = ip ? geoip.lookup(ip) : null;

  /* ----------------------------------
     3. USER AGENT PARSING
  ---------------------------------- */
  const uaString = req.headers['user-agent'] || null;
  const parser = new UAParser(uaString || '');
  const ua = parser.getResult();

  /* ----------------------------------
     4. DEVICE TYPE NORMALIZATION
  ---------------------------------- */
  let deviceType = 'desktop'; // Default to desktop
  if (ua.device && ua.device.type) {
    if (ua.device.type === 'mobile') deviceType = 'mobile';
    else if (ua.device.type === 'tablet') deviceType = 'tablet';
    else deviceType = 'desktop';
  }

  /* ----------------------------------
     5. REFERRER (fix: use lowercase 'referer')
     Note: Social media platforms like LinkedIn don't send referrer due to privacy policies
  ---------------------------------- */
  let referrer = req.get('referer') || req.headers.referer || req.get('Referrer') || 'direct';

  // Additional referrer detection for social media
  const origin = req.headers.origin;
  const requestHost = req.get('host') || '';

  // If referrer is 'direct' but we have an origin, use that
  if (referrer === 'direct' && origin) {
    referrer = origin;
  }

  // Log for debugging (remove in production)
  if (referrer === 'direct') {
    console.log('Direct access - Headers:', {
      referer: req.headers.referer,
      origin: origin,
      host: requestHost,
      userAgent: req.headers['user-agent']?.substring(0, 50)
    });
  }

  /* ----------------------------------
     6. TIME
  ---------------------------------- */
  const now = new Date();

  let timezone = 'UTC';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch (_) {}

  /* ----------------------------------
     7. NEW PAYLOAD (future-proof)
  ---------------------------------- */
  req.analyticsPayload = {
    username: req.params?.username || null,
    clickDate: now,

    clickedTime: {
      iso: now.toISOString(),
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().split(' ')[0],
      datetime: `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`,
      unixTimestamp: now.getTime(),
      timezone,
      timezoneOffset: now.getTimezoneOffset()
    },

    location: {
      country: geo?.country || null,
      city: geo?.city || null,
      region: geo?.region || null,
      ipAddress: ip
    },

    device: {
      type: deviceType,
      brand: ua.device?.vendor || null,
      model: ua.device?.model || null
    },

    os: {
      name: ua.os?.name || null,
      version: ua.os?.version || null
    },

    browser: {
      name: ua.browser?.name || null,
      version: ua.browser?.version || null
    },

    referrer,
    userAgent: uaString
  };

  /* ----------------------------------
     8. BACKWARD COMPATIBILITY (OLD req.details)
  ---------------------------------- */
  req.details = {
    ip: ip,
    city: geo?.city || 'Unknown',
    country: geo?.country || 'Unknown',

    // Old system used single browser string
    browser: ua.browser?.name
      ? `${ua.browser.name}${ua.browser.version ? ' ' + ua.browser.version : ''}`.trim()
      : 'Unknown',

    // Old system stored only time (HH:MM)
    time: now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  if (
    host.includes('localhost') ||
    host.startsWith('127.0.0.1') ||
    host.startsWith('::1')
  ) {
    req.skipAnalytics = true;
    return next();
  }

  return next();
};

module.exports = {
    extractInfo
}
