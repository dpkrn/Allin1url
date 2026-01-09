const express = require('express')
const cors = require('cors')
const cookieParser=require('cookie-parser')
const path =require('path')
const mongoose=require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet'); 
const cloudinary = require('cloudinary')
const crypto = require('crypto')

const authRoute=require('./routes/AuthRoute')
const linkRoute=require('./routes/LinkRoute')
const analyticsRoute=require('./routes/AnalyticsRoute')

const Link = require('./model/linkModel')
const Profile=require('./model/userProfile')
const User=require('./model/userModel')
const UserSettings=require('./model/userSettingsModel')
const profileRoute=require('./routes/ProfileRoute')
const { extractInfo } = require('./middleware/deviceInfo')
const { sendVisitEmail, sendProfileVisitEmail } = require('./lib/mail')
const { verifyTokenOptional } = require('./middleware/verifyToken')
const resolveUsername = require('./middleware/resolveUsername')
const { getUserLinkUrl } = require('./utils')
const bcryptjs = require('bcryptjs')
const { time } = require('console')
const { saveAnalytics } = require('./controller/AnalyticsController')


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

// Make helper function available to all EJS templates
// Ensure it always reads the current environment variable
app.locals.getUserLinkUrl = getUserLinkUrl;

// Allowed origins for CORS
const allowedOrigins = [
  'https://clickly.cv',
  'https://www.clickly.cv',
  'https://linkbriger.vercel.app', 
  'http://localhost:5173',
  'http://localhost:8080'
];

// CORS configuration with subdomain support
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in explicit allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow all subdomains of clickly.cv (for custom user domains)
    // Examples: https://dpkrn.clickly.cv, https://username.clickly.cv
    try {
      const url = new URL(origin);
      const hostname = url.hostname.toLowerCase();
      
      // Allow exact match for clickly.cv
      if (hostname === 'clickly.cv') {
        return callback(null, true);
      }
      
      // Allow all subdomains (*.clickly.cv)
      // Supports both single-level (dpkrn.clickly.cv) and multi-level (api.dpkrn.clickly.cv)
      if (hostname.endsWith('.clickly.cv')) {
        const subdomain = hostname.replace('.clickly.cv', '');
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
    scriptSrc: ["'self'", "'unsafe-inline'", "https://vercel.live", "https://*.vercel.app"],  // Allow inline scripts for EJS templates
    imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],  // Add your image host if needed
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],  // Allow Google Fonts stylesheets
    fontSrc: ["'self'", "https://fonts.gstatic.com"],  // Allow Google Fonts actual font files
    connectSrc: ["'self'", "https://clickly.cv","https://clickly.cv/*", "http://localhost:8080"],  // Add your API backend here
    frameAncestors: ["'self'", "http://localhost:5173", "https://clickly.cv", "https://linkbriger.vercel.app"],  // Allow iframes from these origins
    // Add more directives as needed
  }
}));



// Root route - handle main domain redirect and subdomain routing
app.get('/', resolveUsername, extractInfo, async (req, res) => {

  // If it's the main domain (clickly.cv or www.clickly.cv), redirect to frontend
  if (req.isMainDomain || !req.params.username) {
    console.log("Main domain detected, redirecting to frontend");
    return res.redirect(307, "https://clickly.cv/app/");
  }

  // If it's a subdomain, treat it as username route (show linkhub)
  const username = req.params.username;
  
  // Use the same logic as /:username route
  const tree = await Link.find({
    username: username,
    visibility: 'public',
    deletedAt: null
  });
  const dp = await Profile.findOne({ username }, { image: 1, bio: 1 });
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

  // Check if email notification is enabled for LinkHub views
  try {
    const settings = await UserSettings.getUserSettings(username);
    if (settings && settings.shouldEmailOnLinkHubView()) {
      sendProfileVisitEmail(
        email,
        username,
        name,
        deviceDetails,
        visitorUsername,
        visitorName
      ).catch(err => {
        console.error(`Failed to send LinkHub visit email to ${username}:`, err);
      });
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

  if (tree && dp){
    // Get user settings to determine template
    let template = 'default';
    const previewTemplate = req.query.template;
    if (previewTemplate) {
      template = previewTemplate;
    } else {
      try {
        const settings = await UserSettings.getUserSettings(username);
        if (settings && settings.template) {
          template = settings.template;
        }
      } catch (err) {
        console.log('Error fetching template settings, using default:', err.message);
      }
    }

    const templateName = `templates/linktree-${template}`;
    console.log("templateName", templateName);
    try {
      return res.render(templateName, {
        username: username,
        tree: tree,
        dp: dp
      });
    } catch (renderErr) {
      console.log(`Template ${templateName} not found, using default:`, renderErr.message);
      return res.render('templates/linktree-default', {
        username: username,
        tree: tree,
        dp: dp
      });
    }
  }

  return res.render('not_exists', { linkHub: '' });
});

app.use('/auth',authRoute)
app.use('/source',linkRoute)
app.use('/profile',profileRoute)
app.use('/settings',require('./routes/SettingsRoute'))
app.use('/search',require('./routes/SearchRoute'))
app.use('/analytics',analyticsRoute)
app.use('/project',require('./routes/ProjectRoute'))

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

  const username = decodeData(hashedUsername);
  const source = decodeData(hashedSource);
  console.log(password)

  const doc = await Link.findOne({
    username,
    source,
    deletedAt: null
  });

  if (!doc) {
    return res.status(404).json({ success: false });
  }

  //  const bcryptjs = require('bcryptjs');
    if (!doc.password || !(await bcryptjs.compare(password, doc.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid password"
    });
  }
  //   // Password correct, redirect directly to destination
    const {destination,clicked,notSeen}=doc
    await Link.updateOne({username,source},{$set:{clicked:clicked+1,notSeen:notSeen+1}})
    
    const info=await User.findOne({username},{email:1,name:1})
    if(info) {
      const {email,name}=info
      const deviceDetails=req.details || {}
      // Send email asynchronously, don't wait for it
      sendVisitEmail(email,username,name,deviceDetails,source).catch(err => {
        console.error(`Failed to send visit to ${username}:`, err);
      });
    }


  return res.json({
    success: true,
    destination: destination
  });
});

// Subdomain route handler: dpkrn.clickly.cv/github
// This route handles subdomain-based source access
// Note: API routes (defined with app.use above) will match first, so this won't interfere
app.get('/:source', resolveUsername, extractInfo, async (req, res) => {
  // Only process if username was extracted from subdomain (not main domain)
  
  if (req.isMainDomain || !req.params.username) {
    // This is main domain, let it fall through to other routes
    return res.redirect(307, "https://clickly.cv/app/");
  }


  const username = req.params.username;
  const source = req.params.source;
  // Generate linkHub in subdomain format for subdomain requests
  const linkHub = `Available link: ${req.protocol}://${username}.clickly.cv`;

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

// Main domain route handler: clickly.cv/username/source
app.get('/:username/:source', extractInfo, async (req, res) => {
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

app.get('/:username', extractInfo, verifyTokenOptional, async (req, res) => {
  // Allow iframe embedding for preview (allow from frontend origins)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  const frontendOrigins = "http://localhost:5173 https://clickly.cv https://linkbriger.vercel.app 'self'";
  res.setHeader('Content-Security-Policy', `frame-ancestors ${frontendOrigins}`);
  
  console.log("backend profile search start")
  const username=req.params.username
  // Only show public links in linkhub - unlisted and private links should not appear
  const tree=await Link.find({
    username: username,
    visibility: 'public',
    deletedAt: null
  })
  const dp=await Profile.findOne({username},{image:1,bio:1});

  const info=await User.findOne({username},{email:1,name:1})
  if(!info){
    return res.render('not_exists')
  }
  const {email,name}=info
  const deviceDetails=req.details
  
  // Get visitor information if they're logged in
  let visitorUsername = null;
  let visitorName = null;
  if (req.userId) {
    try {
      const visitor = await User.findById(req.userId, { username: 1, name: 1 });
      if (visitor && visitor.username !== username) {
        // Only track if visitor is different from profile owner
        visitorUsername = visitor.username;
        visitorName = visitor.name;
      }
    } catch (err) {
      console.error(`Error fetching visitor info:`, err);
    }
  }
  
  // Check if email notification is enabled for LinkHub views
  try {
    const settings = await UserSettings.getUserSettings(username);
    if (settings && settings.shouldEmailOnLinkHubView()) {
      sendProfileVisitEmail(
        email,
        username,
        name,
        deviceDetails,
        visitorUsername,
        visitorName
      ).catch(err => {
        console.error(`Failed to send LinkHub visit email to ${username}:`, err);
      });
    }
  } catch (err) {
    console.error(`Error checking notification settings for ${username}:`, err);
    // Don't send email if there's an error checking settings
  }

  if(tree&&dp){
    // Get user settings to determine template
    let template = 'default'; // Default template
    
    // Check if template query parameter is provided (for preview)
    const previewTemplate = req.query.template;
    if (previewTemplate) {
      template = previewTemplate;
    } else {
      // Otherwise, use user's saved template from settings
      try {
        const settings = await UserSettings.getUserSettings(username);
        if (settings && settings.template) {
          template = settings.template;
        }
      } catch (err) {
        console.log('Error fetching template settings, using default:', err.message);
      }
    }
    
    // Construct template name (templates/linktree-{template})
    const templateName = `templates/linktree-${template}`;
    console.log("templateName",templateName)
    // Render template, fallback to default if template doesn't exist
    try {
      return res.render(templateName,{ 
        username:username,
        tree:tree,
        dp:dp 
      });
    } catch (renderErr) {
      // If template doesn't exist, fallback to default
      console.log(`Template ${templateName} not found, using default:`, renderErr.message);
      return res.render('templates/linktree-default',{ 
        username:username,
        tree:tree,
        dp:dp 
      });
    }
  }
  
  return res.render('not_exists', { linkHub: '' })
})




mongoose.connect(db_url).then(()=>{
    console.log('db connected')
}).catch(err=>console.log(err))


app.listen(port, () => {
  console.log(`Example app http://localhost:${process.env.PORT}`)
})