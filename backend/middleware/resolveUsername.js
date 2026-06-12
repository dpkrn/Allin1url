const resolveUsername = async (req, res, next) => {
  const host = req.get('host');
  if (!host) {
    return res.status(400).json({ success: false, message: "Invalid host" });
  }

  // Extract subdomain (first part before the first dot)
  const hostParts = host.split('.');
  const subdomain = hostParts[0].toLowerCase();

  // API subdomain hosts REST endpoints (api.allin1url.in/auth/...)
  if (subdomain === 'api') {
    req.isApiSubdomain = true;
    req.isMainDomain = false;
    req.params.username = null;
    return next();
  }

  // Handle main domain cases - redirect to frontend
  if (subdomain === 'allin1url' || subdomain === 'www' || subdomain === '') {
    req.isMainDomain = true;
    req.isApiSubdomain = false;
    req.params.username = null;
    return next();
  }

  // User subdomain - extract username
  req.isMainDomain = false;
  req.isApiSubdomain = false;
  req.params.username = subdomain;
  console.log("Extracted username from subdomain:", subdomain);
  return next();
};

module.exports = resolveUsername;