const Link = require('../model/linkModel');
const Profile = require('../model/userProfile');
const User = require('../model/userModel');
const UserSettings = require('../model/userSettingsModel');
const { sendLinkClickEmail, sendLinkHubVisitEmail } = require('../lib/mail');
const { decodeData, encodeData } = require('../utils');
const bcryptjs = require('bcryptjs');

// Handle password submission for private links
const verifyPassword = async (req, res) => {
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

  if (!doc.password || !(await bcryptjs.compare(password, doc.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid password"
    });
  }
  
  // Password correct, redirect directly to destination
  const {destination,clicked,notSeen}=doc
  await Link.updateOne({username,source},{$set:{clicked:clicked+1,notSeen:notSeen+1}})
  
  const info=await User.findOne({username},{email:1,name:1})
  if(info) {
    const {email,name}=info
    const deviceDetails=req.details || {}
    // Send link click email notification if enabled
    try {
      const settings = await UserSettings.getUserSettings(username);
      if (settings && settings.shouldEmailOnClick()) {
        // Send email asynchronously, don't wait for it
        sendLinkClickEmail(email,username,name,deviceDetails,source).catch(err => {
          console.error(`Failed to send link click email to ${username}:`, err);
        });
      }
    } catch (err) {
      console.error(`Error checking notification settings for ${username}:`, err);
    }
  }

  return res.json({
    success: true,
    destination: destination
  });
};

// Handle link access by username and source
const getLinkByUsernameAndSource = async (req, res) => {
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
      sendLinkClickEmail(email,username,name,deviceDetails,source).catch(err => {
        console.error(`Failed to send link click email to ${username}:`, err);
      });
    }
  } catch (err) {
    console.error(`Error checking notification settings for ${username}:`, err);
    // Don't send email if there's an error checking settings
  }
  
  return res.redirect(307,destination)
};

// Handle profile page by username
const getProfileByUsername = async (req, res) => {
  // Allow iframe embedding for preview (allow from frontend origins)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  const frontendOrigins = "http://localhost:5173 https://allin1url.in https://linkbriger.vercel.app 'self'";
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
  
  // Get visitor information if they're logged in - ALWAYS capture username when available
  let visitorUsername = null;
  let visitorName = null;
  let isOwner = false;
  
  if (req.userId) {
    try {
      const visitor = await User.findById(req.userId, { username: 1, name: 1 });
      if (visitor) {
        // Always capture visitor info if they're logged in
        visitorUsername = visitor.username;
        visitorName = visitor.name;
        // Check if visitor is the profile owner
        isOwner = visitor.username === username;
      }
    } catch (err) {
      console.error(`Error fetching visitor info:`, err);
    }
  }
  
  // Log visitor info for debugging
  if (visitorUsername) {
    console.log(`LinkHub visit by logged-in user: @${visitorUsername} viewing @${username} (isOwner: ${isOwner})`);
  } else {
    console.log(`LinkHub visit by anonymous user viewing @${username}`);
  }
  
  // Send LinkHub visit email notification ONLY if:
  // 1. Visitor is NOT the profile owner (prevent self-visit emails)
  // 2. Email notifications are enabled
  // 3. Visitor username is captured (logged-in user) or anonymous visit
  if (!isOwner) {
    try {
      const settings = await UserSettings.getUserSettings(username);
      if (settings && settings.shouldEmailOnLinkHubView()) {
        // Only send email if visitor is different from profile owner
        if (visitorUsername && visitorUsername !== username) {
          console.log(`Sending LinkHub visit email to @${username} - visited by @${visitorUsername}`);
          sendLinkHubVisitEmail(
            email,
            username,
            name,
            deviceDetails,
            visitorUsername,
            visitorName
          ).catch(err => {
            console.error(`Failed to send LinkHub visit email to ${username}:`, err);
          });
        } else if (!visitorUsername) {
          // Anonymous visitor - still send email but without username
          console.log(`Sending LinkHub visit email to @${username} - visited by anonymous user`);
          sendLinkHubVisitEmail(
            email,
            username,
            name,
            deviceDetails,
            null,
            null
          ).catch(err => {
            console.error(`Failed to send LinkHub visit email to ${username}:`, err);
          });
        } else {
          console.log(`Skipping email: Visitor @${visitorUsername} is the profile owner @${username}`);
        }
      }
    } catch (err) {
      console.error(`Error checking notification settings for ${username}:`, err);
      // Don't send email if there's an error checking settings
    }
  } else {
    console.log(`Skipping email: Profile owner @${username} is viewing their own LinkHub`);
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
};

module.exports = {
  verifyPassword,
  getLinkByUsernameAndSource,
  getProfileByUsername
};
