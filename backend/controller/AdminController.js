const AdminVisit   = require('../model/AdminVisit');
const Link         = require('../model/linkModel');
const User         = require('../model/userModel');
const LinkAnalytics = require('../model/linkAnalyticsModel');

/* ─────────────────────────────────────────
   Internal helper — call fire-and-forget
   from index.js whenever a linkhub page loads
───────────────────────────────────────── */
const logAdminVisit = async ({ username, req }) => {
  try {
    const p = req.analyticsPayload || {};
    await AdminVisit.create({
      username,
      ip:       p.location?.ipAddress    || null,
      country:  p.location?.country      || null,
      city:     p.location?.city         || null,
      device: {
        type:  p.device?.type            || 'unknown',
        brand: p.device?.brand           || null,
        model: p.device?.model           || null,
      },
      os: {
        name:    p.os?.name              || null,
        version: p.os?.version           || null,
      },
      browser: {
        name:    p.browser?.name         || null,
        version: p.browser?.version      || null,
      },
      referrer:  p.referrer              || 'direct',
      userAgent: p.userAgent             || null,
    });
  } catch (err) {
    console.error('[AdminVisit] log error:', err.message);
  }
};

/* ─────────────────────────────────────────
   Shared date helpers
───────────────────────────────────────── */
const startOf = (unit) => {
  const d = new Date();
  if (unit === 'day') {
    d.setHours(0, 0, 0, 0);
  } else if (unit === 'week') {
    d.setDate(d.getDate() - 6);
    d.setHours(0, 0, 0, 0);
  } else if (unit === 'month') {
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
  }
  return d;
};

/* ─────────────────────────────────────────
   GET /admin/stats
   Platform-wide aggregate stats
───────────────────────────────────────── */
const getStats = async (req, res) => {
  try {
    const [today, week] = [startOf('day'), startOf('week')];

    const [
      totalUsers,
      newUsersToday,
      newUsersWeek,

      totalLinks,
      publicLinks,
      privateLinks,
      protectedLinks,   // unlisted = password-protected

      totalVisits,
      visitsToday,
      visitsWeek,

      totalLinkClicks,
      clicksToday,
    ] = await Promise.all([
      User.countDocuments({ deletedAt: null }),
      User.countDocuments({ deletedAt: null, createdAt: { $gte: today } }),
      User.countDocuments({ deletedAt: null, createdAt: { $gte: week } }),

      Link.countDocuments({ deletedAt: null }),
      Link.countDocuments({ visibility: 'public',   deletedAt: null }),
      Link.countDocuments({ visibility: 'private',  deletedAt: null }),
      Link.countDocuments({ visibility: 'unlisted', deletedAt: null }),

      AdminVisit.countDocuments(),
      AdminVisit.countDocuments({ createdAt: { $gte: today } }),
      AdminVisit.countDocuments({ createdAt: { $gte: week } }),

      LinkAnalytics.countDocuments({ deletedAt: null, linkId: { $ne: null } }),
      LinkAnalytics.countDocuments({ deletedAt: null, linkId: { $ne: null }, clickDate: { $gte: today } }),
    ]);

    return res.json({
      success: true,
      stats: {
        users: {
          total:    totalUsers,
          today:    newUsersToday,
          thisWeek: newUsersWeek,
        },
        links: {
          total:     totalLinks,
          public:    publicLinks,
          private:   privateLinks,
          protected: protectedLinks,
        },
        linkhubVisits: {
          total:    totalVisits,
          today:    visitsToday,
          thisWeek: visitsWeek,
        },
        linkClicks: {
          total: totalLinkClicks,
          today: clicksToday,
        },
      },
    });
  } catch (err) {
    console.error('[Admin] getStats error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/* ─────────────────────────────────────────
   GET /admin/visitors
   Paginated linkhub visitor log
   Query: ?page=1&limit=50&username=dpkrn&country=IN&from=2025-01-01&to=2025-12-31
───────────────────────────────────────── */
const getVisitors = async (req, res) => {
  try {
    const page    = Math.max(1, parseInt(req.query.page)  || 1);
    const limit   = Math.min(200, parseInt(req.query.limit) || 50);
    const skip    = (page - 1) * limit;

    const filter = {};
    if (req.query.username) filter.username = req.query.username;
    if (req.query.country)  filter.country  = req.query.country.toUpperCase();
    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to)   filter.createdAt.$lte = new Date(req.query.to);
    }

    const [visitors, total] = await Promise.all([
      AdminVisit.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      AdminVisit.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      visitors,
    });
  } catch (err) {
    console.error('[Admin] getVisitors error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/* ─────────────────────────────────────────
   GET /admin/users
   Paginated registered user list
   Query: ?page=1&limit=50&search=deepak
───────────────────────────────────────── */
const getUsers = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(200, parseInt(req.query.limit) || 50);
    const skip  = (page - 1) * limit;

    const filter = { deletedAt: null };
    if (req.query.search) {
      const re = new RegExp(req.query.search, 'i');
      filter.$or = [{ username: re }, { name: re }, { email: re }];
    }

    const [users, total] = await Promise.all([
      User.find(filter, { password: 0 }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    console.error('[Admin] getUsers error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/* ─────────────────────────────────────────
   GET /admin/links
   Paginated link list with filters
   Query: ?page=1&limit=50&visibility=public&username=dpkrn
───────────────────────────────────────── */
const getLinks = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(200, parseInt(req.query.limit) || 50);
    const skip  = (page - 1) * limit;

    const filter = { deletedAt: null };
    if (req.query.visibility) {
      const allowed = ['public', 'private', 'unlisted'];
      if (allowed.includes(req.query.visibility)) filter.visibility = req.query.visibility;
    }
    if (req.query.username) filter.username = req.query.username;

    const [links, total] = await Promise.all([
      Link.find(filter, { password: 0 }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Link.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      links,
    });
  } catch (err) {
    console.error('[Admin] getLinks error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/* ─────────────────────────────────────────
   GET /admin/visitors/breakdown
   Country + device breakdown for a quick overview
───────────────────────────────────────── */
const getVisitorBreakdown = async (req, res) => {
  try {
    const [byCountry, byDevice, byBrowser, topProfiles] = await Promise.all([
      AdminVisit.aggregate([
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]),
      AdminVisit.aggregate([
        { $group: { _id: '$device.type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AdminVisit.aggregate([
        { $group: { _id: '$browser.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      AdminVisit.aggregate([
        { $group: { _id: '$username', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    return res.json({
      success: true,
      breakdown: {
        byCountry:   byCountry.map(r => ({ country: r._id, visits: r.count })),
        byDevice:    byDevice.map(r  => ({ device:  r._id, visits: r.count })),
        byBrowser:   byBrowser.map(r => ({ browser: r._id, visits: r.count })),
        topProfiles: topProfiles.map(r => ({ username: r._id, visits: r.count })),
      },
    });
  } catch (err) {
    console.error('[Admin] getVisitorBreakdown error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  logAdminVisit,
  getStats,
  getVisitors,
  getVisitorBreakdown,
  getUsers,
  getLinks,
};
