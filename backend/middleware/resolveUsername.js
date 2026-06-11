const resolveUsername = async (req, res, next) => {
  const host = req.get('host');
  if (!host) {
    return res.status(400).json({ success: false, message: "Invalid host" });
  }

  // Extract subdomain (first part before the first dot)
  const hostParts = host.split('.');
  const subdomain = hostParts[0].toLowerCase();

  // Handle main domain cases - redirect to frontend
  if (subdomain === 'allin1url' || subdomain === 'www' || subdomain === '') {
    // This is the main domain, not a subdomain
    // Set a flag so routes know to redirect to frontend
    req.isMainDomain = true;
    req.params.username = null;
    return next();
  }

  // This is a subdomain - extract username
  req.isMainDomain = false;
  req.params.username = subdomain;
  console.log("Extracted username from subdomain:", subdomain);
  return next();
};

module.exports = resolveUsername;