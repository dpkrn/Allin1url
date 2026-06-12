const resolveUsername = async (req, res, next) => {
  const hostHeader = req.get('host');
  if (!hostHeader) {
    return res.status(400).json({ success: false, message: "Invalid host" });
  }

  const hostname = hostHeader.split(':')[0].toLowerCase();
  const hostParts = hostname.split('.');
  const subdomain = hostParts[0];

  req.isApiSubdomain = false;
  req.isMainDomain = false;
  req.params.username = null;

  // DNS: *.allin1url.in → backend. api.* = REST API only; other labels = link hub username.
  if (subdomain === 'api') {
    req.isApiSubdomain = true;
    return next();
  }

  // Fallback if apex/www ever hit backend (they should be A → frontend only)
  if (
    subdomain === 'allin1url' ||
    subdomain === 'www' ||
    hostname === 'allin1url.in' ||
    hostname === 'www.allin1url.in'
  ) {
    req.isMainDomain = true;
    return next();
  }

  // Dev: plain localhost uses path-based /:username routes, not subdomain
  if (
    process.env.TIER === 'dev' &&
    (hostname === 'localhost' || hostname === '127.0.0.1')
  ) {
    req.isMainDomain = true;
    return next();
  }

  // User link hub subdomain (e.g. dpkrn.allin1url.in)
  req.params.username = subdomain;
  return next();
};

module.exports = resolveUsername;