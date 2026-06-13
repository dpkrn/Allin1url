/**
 * Production: REST API is only served on api.allin1url.in
 * User subdomains (dpkrn.allin1url.in) are link hubs only.
 * Dev: allow API on localhost without subdomain split.
 */
const requireApiSubdomain = (req, res, next) => {
  if (process.env.TIER === 'dev') {
    return next();
  }

  const host = (req.get('host') || '').split(':')[0].toLowerCase();

  // Accept api.allin1url.in (exact) or any host whose first label is 'api'
  if (host === 'api.allin1url.in' || host.split('.')[0] === 'api') {
    return next();
  }

  return res.status(404).json({ success: false, message: 'Not found' });
};

module.exports = requireApiSubdomain;
