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

// Material Design icon paths (viewBox 0 0 24 24) — scaled 0.67x = ~16px
const _ICON_USER = 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z';
const _ICON_EYE  = 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z';
const _ICON_LINK = 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.71-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z';

const buildSVG = ({ totalUsers, totalVisitors, totalLinks }) => {
  const u  = fmtNum(totalUsers);
  const v  = fmtNum(totalVisitors);
  const l  = fmtNum(totalLinks);
  const ts = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Each row: icon + label on left, bold value on right
  const mkRow = (iconPath, label, val, color, textY) =>
    `<g transform="translate(20,${textY - 14}) scale(0.67)"><path d="${iconPath}" fill="${color}"/></g>` +
    `<text x="46" y="${textY}" font-family="Segoe UI,Ubuntu,Arial,sans-serif" font-size="14" fill="#8b949e">${label}</text>` +
    `<text x="385" y="${textY}" font-family="Segoe UI,Ubuntu,Arial,sans-serif" font-size="14" font-weight="700" fill="${color}" text-anchor="end">${val}</text>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="170" viewBox="0 0 400 170" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ac" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#7c3aed"/>
      <stop offset="50%"  stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#34d399"/>
    </linearGradient>
  </defs>

  <rect width="400" height="170" rx="6" fill="#161b22"/>
  <rect width="400" height="170" rx="6" stroke="#30363d" stroke-width="0.5"/>
  <rect width="400" height="4"   rx="3" fill="url(#ac)"/>

  <text x="20" y="38" font-family="Segoe UI,Ubuntu,Arial,sans-serif" font-size="17" font-weight="700" fill="#e6edf3">AllIn1URL Platform Stats</text>
  <line x1="20" y1="52" x2="380" y2="52" stroke="#21262d" stroke-width="1"/>

  ${mkRow(_ICON_USER, 'Registered Users:', u, '#a78bfa', 80)}
  ${mkRow(_ICON_EYE,  'Total Visitors:',   v, '#38bdf8', 112)}
  ${mkRow(_ICON_LINK, 'Links Created:',    l, '#34d399', 144)}

  <text x="200" y="163" font-family="Segoe UI,Ubuntu,Arial,sans-serif" font-size="10" fill="#484f58" text-anchor="middle">allin1url.in &#183; ${ts}</text>
</svg>`;
};

const _SVG_ERROR = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="60" viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="60" rx="6" fill="#161b22" stroke="#30363d" stroke-width="0.5"/>
  <text x="200" y="36" font-family="Segoe UI,Arial,sans-serif" font-size="13" fill="#ef4444" text-anchor="middle">AllIn1URL Stats &#8212; temporarily unavailable</text>
</svg>`;

const _SVG_HEADERS = {
  'Content-Type': 'image/svg+xml',
  'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
  'Access-Control-Allow-Origin': '*',
};

// SVG card — embed in GitHub README: ![AllIn1URL Stats](https://api.allin1url.in/stats-card)
app.get('/stats-card', async (_req, res) => {
  try {
    const data = await fetchStatsCardData();
    res.set(_SVG_HEADERS);
    return res.send(buildSVG(data));
  } catch (err) {
    console.error('[stats-card] error:', err);
    res.set(_SVG_HEADERS);
    return res.status(200).send(_SVG_ERROR);
  }
});

// Interactive HTML widget (iframe embed or direct view)
app.get('/stats-card.html', async (_req, res) => {
  try {
    const data = await fetchStatsCardData();
    res.set('Access-Control-Allow-Origin', '*');
    return res.render('stats-card', data);
  } catch (err) {
    console.error('[stats-card.html] error:', err);   return res.status(500).send('Server error.');}
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