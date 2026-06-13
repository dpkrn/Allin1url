const express = require('express')
const cors = require('cors')
const cookieParser=require('cookie-parser')
const path =require('path')
const dotenv = require('dotenv')
const helmet = require('helmet'); 
const cloudinary = require('cloudinary')
const crypto = require('crypto')
  const { domain, clientUrl } = require('./utils')
const authRoute=require('./routes/AuthRoute')
const linkRoute=require('./routes/LinkRoute')
const analyticsRoute=require('./routes/AnalyticsRoute')
const settingsRoute=require('./routes/SettingsRoute')
const searchRoute=require('./routes/SearchRoute')
const projectRoute=require('./routes/ProjectRoute')

const Link = require('./model/linkModel')
const Profile=require('./model/userProfile')
const User=require('./model/userModel')
const UserSettings=require('./model/userSettingsModel')
const profileRoute=require('./routes/ProfileRoute')
const { extractInfo } = require('./middleware/deviceInfo')
const { sendVisitEmail, sendProfileVisitEmail } = require('./lib/mail')
const { verifyTokenOptional } = require('./middleware/verifyToken')
const resolveUsername = require('./middleware/resolveUsername')
const requireApiSubdomain = require('./middleware/requireApiSubdomain')
const requireLinkHubSubdomain = require('./middleware/requireLinkHubSubdomain')
const { getUserLinkUrl, getTemplateScripts, getFaviconScript } = require('./utils')
const bcryptjs = require('bcryptjs')
const { time } = require('console')
const { saveAnalytics } = require('./controller/AnalyticsController')
const { logAdminVisit } = require('./controller/AdminController')
const adminRoute = require('./routes/AdminRoute')
const AdminVisit = require('./model/AdminVisit')
const LinkAnalytics = require('./model/linkAnalyticsModel')
const connectDB = require('./lib/db')


dotenv.config()

// Log environment variables for debugging
const tier = process.env.TIER || 'NOT SET (defaults to production)';
console.log('Environment check:');
console.log('  TIER:', tier);
console.log('  Mode:', process.env.TIER === 'dev' ? 'DEVELOPMENT' : 'PRODUCTION');
console.log('  PORT:', process.env.PORT || '8080 (default)');

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});



const app = express()
const port = process.env.PORT || 8080
const db_url=process.env.DATABASE_URL;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Make helper functions available to all EJS templates
// Ensure it always reads the current environment variable
app.locals.getUserLinkUrl = getUserLinkUrl;
app.locals.getTemplateScripts = getTemplateScripts;
app.locals.getFaviconScript = getFaviconScript;

// Allowed origins for CORS
const allowedOrigins = [
  'https://allin1url.in',
  'https://www.allin1url.in',
  'http://localhost:5173',
  'http://localhost:8080'
];

// CORS configuration with subdomain support
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    // Also allow null origin — browsers send this for localhost subdomain form POSTs
    if (!origin || origin === 'null') {
      return callback(null, true);
    }
    
    // Check if origin is in explicit allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow all subdomains of allin1url.in (for custom user domains)
    // Examples: https://dpkrn.allin1url.in, https://username.allin1url.in
    try {
      const url = new URL(origin);
      const hostname = url.hostname.toLowerCase();
      
      // Allow exact match for allin1url.in
      if (hostname === 'allin1url.in') {
        return callback(null, true);
      }
      
      // Allow all subdomains (*.allin1url.in)
      // Supports both single-level (dpkrn.allin1url.in) and multi-level (api.dpkrn.allin1url.in)
      if (hostname.endsWith('.allin1url.in')) {
        const subdomain = hostname.replace('.allin1url.in', '');
        // Subdomain should be non-empty (allows multi-level subdomains)
        if (subdomain && subdomain.length > 0) {
          return callback(null, true);
        }
      }
    } catch (e) {
      // Invalid URL format, reject
      console.warn('Invalid CORS origin format:', origin);
    }
    
    // Reject all other origins
    return callback(new Error(`CORS: Origin ${origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400 // 24 hours
}));

app.options('*', cors());

app.use(cookieParser());
app.use(express.json({limit:'100mb'}))
app.use(express.urlencoded({ extended: true, limit: '100mb' })) // For form submissions
// Configure helmet with iframe support for preview
app.use(helmet({
  frameguard: {
    action: 'sameorigin' // Allow iframes from same origin, but we'll override for preview
  }
}));

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://vercel.live", "https://*.vercel.app"],
    imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    connectSrc: ["'self'", "https://allin1url.in", "https://api.allin1url.in", "http://localhost:8080"],
    frameAncestors: ["'self'", "http://localhost:5173", "https://allin1url.in", "https://*.allin1url.in"],
    // Allow form submissions from any *.allin1url.in subdomain — needed for the password
    // prompt page which is served on user subdomains (e.g. dpkaws.allin1url.in)
    formAction: ["'self'", "https://allin1url.in", "https://*.allin1url.in", "http://localhost:8080"],
  }
}));

// Vercel serverless: mongoose uses bufferCommands=false, so every request must await connect
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    return res.status(503).json({ success: false, message: 'Database unavailable' });
  }
});

// API routes — only on api.allin1url.in in production (before link-hub catch-alls)
app.use('/auth', requireApiSubdomain, authRoute);
app.use('/source', requireApiSubdomain, linkRoute);
app.use('/profile', requireApiSubdomain, profileRoute);
app.use('/settings', requireApiSubdomain, settingsRoute);
app.use('/search', requireApiSubdomain, searchRoute);
app.use('/analytics', requireApiSubdomain, analyticsRoute);
app.use('/project', requireApiSubdomain, projectRoute);
app.use('/admin',   requireApiSubdomain, adminRoute);

// ─── Stats card helpers ───────────────────────────────────────────────────────
const fmtNum = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
};

const fetchStatsCardData = async () => {
  const [totalUsers, totalLinkhubVisits, totalLinkClicks, totalLinks] = await Promise.all([
    User.countDocuments({ deletedAt: null }),
    AdminVisit.countDocuments(),
    LinkAnalytics.countDocuments({ deletedAt: null, linkId: { $ne: null } }),
    Link.countDocuments({ deletedAt: null }),
  ]);
  return {
    totalUsers,
    totalVisitors: totalLinkhubVisits + totalLinkClicks,
    totalLinks,
  };
};

const buildSVG = ({ totalUsers, totalVisitors, totalLinks }) => {
  const u = fmtNum(totalUsers);
  const v = fmtNum(totalVisitors);
  const l = fmtNum(totalLinks);
  const ts = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return `<svg width="495" height="148" viewBox="0 0 495 148" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="495" y2="148" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
    <linearGradient id="gl" x1="0" y1="0" x2="495" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#7c3aed" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="clip"><rect width="495" height="148" rx="12"/></clipPath>
  </defs>

  <!-- Background -->
  <rect width="495" height="148" rx="12" fill="url(#bg)" stroke="#334155" stroke-width="1"/>
  <rect width="495" height="148" rx="12" fill="url(#gl)" clip-path="url(#clip)"/>

  <!-- Brand header -->
  <circle cx="24" cy="24" r="5" fill="#7c3aed"/>
  <text x="36" y="29" font-family="Segoe UI,Ubuntu,Arial,sans-serif" font-size="14" font-weight="700" fill="#e2e8f0">AllIn1URL</text>
  <text x="116" y="29" font-family="Segoe UI,Ubuntu,Arial,sans-serif" font-size="11" fill="#a78bfa">&#8211; Link in Bio Platform</text>

  <!-- Divider -->
  <line x1="16" y1="44" x2="479" y2="44" stroke="#1e293b" stroke-width="1"/>

  <!-- Stat: Users -->
  <text x="82" y="90" font-family="Segoe UI,Ubuntu,Arial,sans-serif" font-size="30" font-weight="800" fill="#a78bfa" text-anchor="middle">${u}</text>
  <text x="82" y="110" font-family="Segoe UI,Ubuntu,Arial,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Registered Users</text>

  <!-- Column divider -->
  <line x1="165" y1="56" x2="165" y2="120" stroke="#1e293b" stroke-width="1"/>

  <!-- Stat: Visitors -->
  <text x="247" y="90" font-family="Segoe UI,Ubuntu,Arial,sans-serif" font-size="30" font-weight="800" fill="#38bdf8" text-anchor="middle">${v}</text>
  <text x="247" y="110" font-family="Segoe UI,Ubuntu,Arial,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Total Visitors</text>

  <!-- Column divider -->
  <line x1="330" y1="56" x2="330" y2="120" stroke="#1e293b" stroke-width="1"/>

  <!-- Stat: Links -->
  <text x="413" y="90" font-family="Segoe UI,Ubuntu,Arial,sans-serif" font-size="30" font-weight="800" fill="#34d399" text-anchor="middle">${l}</text>
  <text x="413" y="110" font-family="Segoe UI,Ubuntu,Arial,sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Links Created</text>

  <!-- Footer -->
  <line x1="16" y1="124" x2="479" y2="124" stroke="#1e293b" stroke-width="1"/>
  <text x="247" y="140" font-family="Segoe UI,Ubuntu,Arial,sans-serif" font-size="10" fill="#475569" text-anchor="middle">allin1url.in &#183; updated ${ts}</text>
</svg>`;
};

// SVG card — embed in GitHub README with ![Stats](https://api.allin1url.in/stats-card)
app.get('/stats-card', async (_req, res) => {
  try {
    const data = await fetchStatsCardData();
    res.set({
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=1800',
    });
    return res.send(buildSVG(data));
  } catch (err) {
    console.error('[stats-card] error:', err);
    return res.status(500).send('Server error.');
  }
});

// Interactive HTML widget (iframe embed or direct view)
app.get('/stats-card.html', async (_req, res) => {
  try {
    const data = await fetchStatsCardData();
    return res.render('stats-card', data);
  } catch (err) {
    console.error('[stats-card.html] error:', err);
    return res.status(500).send('Server error.');
  }
});

app.get('/stats-card.json', async (_req, res) => {
  try {
    const [totalUsers, totalLinkhubVisits, totalLinkClicks, totalLinks] = await Promise.all([
      User.countDocuments({ deletedAt: null }),
      AdminVisit.countDocuments(),
      LinkAnalytics.countDocuments({ deletedAt: null, linkId: { $ne: null } }),
      Link.countDocuments({ deletedAt: null }),
    ]);
    return res.json({
      success: true,
      totalUsers,
      totalVisitors: totalLinkhubVisits + totalLinkClicks,
      totalLinks,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[stats-card.json] error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// robots.txt for each user subdomain
app.get('/robots.txt', resolveUsername, requireLinkHubSubdomain, (req, res) => {
  const username = req.params.username;
  res.set('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: https://${username}.allin1url.in/sitemap.xml\n`);
});

// sitemap.xml for each user subdomain
app.get('/sitemap.xml', resolveUsername, requireLinkHubSubdomain, (req, res) => {
  const username = req.params.username;
  const today = new Date().toISOString().split('T')[0];
  res.set('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://${username}.allin1url.in/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
});

// Root route - user subdomain link hub (e.g. dpkrn.allin1url.in/)
app.get('/', resolveUsername, requireLinkHubSubdomain, extractInfo, async (req, res) => {
  const username = req.params.username;

  // Use the same logic as /:username route
  const tree = await Link.find({
    username: username,
    visibility: 'public',
    deletedAt: null
  });
  const dp = await Profile.findOne({ username });
  const info = await User.findOne({ username }, { email: 1, name: 1, _id:1, username:1 });

  if (!info) {
    return res.render('not_exists');
  }

  const { email, name } = info;
  const deviceDetails = req.details || {};

  // Get visitor information if they're logged in
  let visitorUsername = null;
  let visitorName = null;
  if (req.userId) {
    try {
      const visitor = await User.findById(req.userId, { username: 1, name: 1 });
      if (visitor && visitor.username !== username) {
        visitorUsername = visitor.username;
        visitorName = visitor.name;
      }
    } catch (err) {
      console.error(`Error fetching visitor info:`, err);
    }
  }

  let profileSettings = null;
  try {
    const settings = await UserSettings.getUserSettings(username);
    if (settings) {
      profileSettings = settings.linkhub;
      if (settings.shouldEmailOnLinkHubView()) {
        sendProfileVisitEmail(email, username, name, deviceDetails, visitorUsername, visitorName)
          .catch(err => console.error(`Failed to send LinkHub visit email to ${username}:`, err));
      }
    }
  } catch (err) {
    console.error(`Error checking notification settings for ${username}:`, err);
  }

  saveAnalytics({
    linkId: null,
    userId: info._id,
    username: info.username,
    req
  }).catch(err => {
    console.error('Analytics error:', err);
  });

  logAdminVisit({ username: info.username, req });

  if (tree && dp){
    let template = 'default';
    const previewTemplate = req.query.template;
    if (previewTemplate) {
      template = previewTemplate;
    } else {
      try {
        const settings = await UserSettings.getUserSettings(username);
        if (settings && settings.template) template = settings.template;
      } catch (err) {
        console.log('Error fetching template settings, using default:', err.message);
      }
    }

    const templateName = `templates/linktree-${template}`;
    console.log("templateName", templateName);
    const ctx = { username, tree, dp, linkhubSettings: profileSettings, userEmail: info?.email || '' };
    try {
      return res.render(templateName, ctx);
    } catch (renderErr) {
      console.log(`Template ${templateName} not found, using default:`, renderErr.message);
      return res.render('templates/linktree-default', ctx);
    }
  }

  return res.render('not_exists', { linkHub: '' });
});



// Helper function to encode username and source (base64)
const encodeData = (data) => {
  return Buffer.from(data).toString('base64');
};

// Helper function to decode username and source
const decodeData = (encodedData) => {
  try {
    return Buffer.from(encodedData, 'base64').toString('utf8');
  } catch (error) {
    return null;
  }
};





// Handle password submission for private links
app.post('/link/verify-password', extractInfo, async (req, res) => {
  const { hashedUsername, hashedSource, password } = req.body;

  const renderError = (msg) => res.render('password_prompt', {
    hashedUsername,
    hashedSource,
    error: msg,
  });

  try {
    const username = decodeData(hashedUsername);
    const source   = decodeData(hashedSource);

    if (!username || !source) {
      return renderError('Invalid link. Please go back and try again.');
    }

    const doc = await Link.findOne({ username, source, deletedAt: null });

    if (!doc) {
      return renderError('Link not found.');
    }

    if (!doc.password || !(await bcryptjs.compare(password, doc.password))) {
      return renderError('Incorrect password. Please try again.');
    }

    const { clicked, notSeen } = doc;
    let destination = doc.destination;

    console.log(`[verify-password] Redirecting ${username}/${source} → ${destination}`);

    if (!destination) {
      return renderError('Link destination is missing. Please contact the link owner.');
    }

    // Ensure destination has a protocol so Express doesn't treat it as a relative path
    if (!/^https?:\/\//i.test(destination)) {
      destination = 'https://' + destination;
    }

    // Fire-and-forget: update click count + send notification
    Link.updateOne({ username, source }, { $set: { clicked: clicked + 1, notSeen: notSeen + 1 } })
      .catch(err => console.error('Click update error:', err));

    UserSettings.getUserSettings(username).then(settings => {
      if (settings && settings.shouldEmailOnClick()) {
        User.findOne({ username }, { email: 1, name: 1 }).then(info => {
          if (info) {
            sendVisitEmail(info.email, username, info.name, req.details || {}, source)
              .catch(err => console.error(`Failed to send visit email to ${username}:`, err));
          }
        }).catch(() => {});
      }
    }).catch(() => {});

    return res.redirect(302, destination);
  } catch (err) {
    console.error('verify-password error:', err);
    return renderError('Something went wrong. Please try again.');
  }
});

// Subdomain route handler: dpkrn.allin1url.in/github
// This route handles subdomain-based source access
// Note: API routes (defined with app.use above) will match first, so this won't interfere
app.get('/:source', resolveUsername, requireLinkHubSubdomain, extractInfo, async (req, res) => {
  const username = req.params.username;
  const source = req.params.source;
  // Generate linkHub in subdomain format for subdomain requests
  const linkHub = `Available link: ${req.protocol}://${username}.${domain(tier)}`;

  const link = await Link.findOne({
    username,
    source,
    deletedAt: null
  });

  const info = await User.findOne({ username }, { email: 1, name: 1, _id:1,username:1 });
  if (!info) { 
    return res.render('not_exists', {
      linkHub: ""
    });
  }
  const { email, name } = info;

  if (!link) {
    return res.render('not_exists', {
      linkHub: linkHub
    });
  }

  // Check link visibility
  if (!link.isAccessible()) {
    const hashedUsername = encodeData(username);
    const hashedSource = encodeData(source);
    return res.render('password_prompt', {
      hashedUsername: hashedUsername,
      hashedSource: hashedSource,
      linkId: link.linkId
    });
  }
  
  const { destination, clicked, notSeen } = link;
  await Link.updateOne({ username, source }, { $set: { clicked: clicked + 1, notSeen: notSeen + 1 } });

  
  const deviceDetails = req.details;
  
  saveAnalytics({
    linkId: link._id,
    userId: info._id,
    username: info.username,
    req
  }).catch(err => {
    console.error('Analytics error:', err);
  });


  // Check if email notification is enabled for link clicks
  try {
    const settings = await UserSettings.getUserSettings(username);
    if (settings && settings.shouldEmailOnClick()) {
      sendVisitEmail(email, username, name, deviceDetails, source).catch(err => {
        console.error(`Failed to send visit email to ${username}:`, err);
      });
    }
  } catch (err) {
    console.error(`Error checking notification settings for ${username}:`, err);
  }

  return res.redirect(307, destination);
});

// Legacy path handler (dev localhost): localhost:8080/username/source
app.get('/:username/:source', resolveUsername, extractInfo, async (req, res) => {
  if (req.isApiSubdomain) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  if (!req.isMainDomain) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }

  const {username,source}=req.params;
  const linkHub=`Available link: ${req.protocol}://${req.get('host')}/${username}`

  const doc=await Link.findOne({
    username,
    source,
    deletedAt: null
  })

  const info=await User.findOne({username},{email:1,name:1})
  if(!info){
    return res.render('not_exists',{
      linkHub:""
    })
  }
  const {email,name}=info
  
  if(!doc) {
    return res.render('not_exists',{
      linkHub:linkHub
    })
  }

  // Check link visibility
  // private links should render password prompt page directly
  if(!doc.isAccessible()) {
    console.log("not accessible")
    // Encode username and source before sending to EJS
    const hashedUsername = encodeData(username);
    const hashedSource = encodeData(source);
    return res.render('password_prompt', { 
      hashedUsername:hashedUsername, 
      hashedSource:hashedSource,
      linkId:doc.linkId 
    });
  }

  // unlisted links are accessible via direct URL (password protection can be added later)
  // public links are accessible
  const {destination,clicked,notSeen}=doc
  await Link.updateOne({username,source},{$set:{clicked:clicked+1,notSeen:notSeen+1}})

  const deviceDetails=req.details
  
  // Check if email notification is enabled for link clicks
  try {
    const settings = await UserSettings.getUserSettings(username);
    if (settings && settings.shouldEmailOnClick()) {
      sendVisitEmail(email,username,name,deviceDetails,source).catch(err => {
        console.error(`Failed to send visit email to ${username}:`, err);
      });
    }
  } catch (err) {
    console.error(`Error checking notification settings for ${username}:`, err);
    // Don't send email if there's an error checking settings
  }
  
  return res.redirect(307,destination)
})

app.get('/:username', resolveUsername, extractInfo, verifyTokenOptional, async (req, res) => {
  if (req.isApiSubdomain) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  if (!req.isMainDomain) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }

  // Allow iframe embedding for preview (allow from frontend origins)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  const frontendOrigins = "http://localhost:5173 https://allin1url.in https://www.allin1url.in 'self'";
  res.setHeader('Content-Security-Policy', `frame-ancestors ${frontendOrigins}`);

  const username=req.params.username
  // Only show public links in linkhub - unlisted and private links should not appear
  const tree=await Link.find({
    username: username,
    visibility: 'public',
    deletedAt: null
  })
  const dp=await Profile.findOne({username});

  const info=await User.findOne({username},{email:1,name:1})
  if(!info){
    return res.render('not_exists')
  }
  const {email,name}=info
  const deviceDetails=req.details

  let visitorUsername = null;
  let visitorName = null;
  if (req.userId) {
    try {
      const visitor = await User.findById(req.userId, { username: 1, name: 1 });
      if (visitor && visitor.username !== username) {
        visitorUsername = visitor.username;
        visitorName = visitor.name;
      }
    } catch (err) {
      console.error(`Error fetching visitor info:`, err);
    }
  }

  let profileSettings = null;
  try {
    const settings = await UserSettings.getUserSettings(username);
    if (settings) {
      profileSettings = settings.linkhub;
      if (settings.shouldEmailOnLinkHubView()) {
        sendProfileVisitEmail(email, username, name, deviceDetails, visitorUsername, visitorName)
          .catch(err => console.error(`Failed to send LinkHub visit email to ${username}:`, err));
      }
    }
  } catch (err) {
    console.error(`Error checking notification settings for ${username}:`, err);
  }

  if(tree&&dp){
    let template = 'default';
    const previewTemplate = req.query.template;
    if (previewTemplate) {
      template = previewTemplate;
    } else {
      try {
        const settings = await UserSettings.getUserSettings(username);
        if (settings && settings.template) template = settings.template;
      } catch (err) {
        console.log('Error fetching template settings, using default:', err.message);
      }
    }

    const templateName = `templates/linktree-${template}`;
    console.log("templateName",templateName)
    const ctx = { username, tree, dp, linkhubSettings: profileSettings, userEmail: info?.email || '' };
    try {
      return res.render(templateName, ctx);
    } catch (renderErr) {
      console.log(`Template ${templateName} not found, using default:`, renderErr.message);
      return res.render('templates/linktree-default', ctx);
    }
  }

  return res.render('not_exists', { linkHub: '' })
})




connectDB()
  .then(() => console.log('db connected'))
  .catch((err) => console.log('db connection error:', err));

if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Example app http://localhost:${process.env.PORT || port}`)
  });
}

module.exports = app;