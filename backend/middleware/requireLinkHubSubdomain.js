const { clientUrl } = require('../utils');

/**
 * Link hub pages only run on user subdomains (e.g. dpkrn.allin1url.in).
 * api.allin1url.in is API-only; apex/www are frontend (DNS) with redirect fallback.
 */
const requireLinkHubSubdomain = (req, res, next) => {
  if (req.isApiSubdomain) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }

  if (req.isMainDomain || !req.params.username) {
    return res.redirect(307, `${clientUrl(process.env.TIER)}/`);
  }

  return next();
};

module.exports = requireLinkHubSubdomain;
