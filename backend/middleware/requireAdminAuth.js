/**
 * HTTP Basic Auth guard for admin routes.
 * Set ADMIN_USERNAME and ADMIN_PASSWORD in your .env file.
 */
const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="AllIn1URL Admin"');
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  let user, pass;
  try {
    const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
    const colon = decoded.indexOf(':');
    user = decoded.slice(0, colon);
    pass = decoded.slice(colon + 1);
  } catch {
    return res.status(400).json({ success: false, message: 'Malformed Authorization header.' });
  }

  if (
    user === process.env.ADMIN_USERNAME &&
    pass === process.env.ADMIN_PASSWORD
  ) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="AllIn1URL Admin"');
  return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
};

module.exports = requireAdminAuth;
