const Profile = require("../model/userProfile");
const User = require("../model/userModel");
const cloudinary = require('cloudinary')
const { sendProfileVisitEmail } = require("../lib/mail");
const geoip = require('geoip-lite');
const useragent = require('useragent');

const updateProfile = async (req, res) => {
    let { username, name, location, bio, passion } = req.body;
    console.log(name, location, bio, passion);
  
    // Ensure fields are set to empty strings if undefined
    if (!name) name = "";
    if (!bio) bio = ""; 
    if (!passion) passion = ""; 
    if (!location) location = ""; 
  
    try {
      // Update the profile and fetch the updated document
      const updatedProfile = await Profile.findOneAndUpdate(
        { username }, // Filter by username
        { $set: { name, bio, passion, location } }, // Fields to update
        { new: true } // Return the updated document
      );
  
      if (updatedProfile) {
        return res.status(201).json({
          success: true,
          msg: "Profile updated successfully!",
          info: updatedProfile, // Return the updated profile
        });
      } else {
        return res.status(404).json({
          success: false,
          msg: "User not found!",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        msg: "Server internal error!",
      });
    }
  };

  const getProfile=async(req,res)=>{
    const {username}=req.body
    console.log(username)
    try{
        const userinfo=await Profile.findOne({username});
        if(userinfo){
            return res.status(200).json({success:true,msg:"user found !",userinfo});
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false,msg:"Server Internal Error"})
    }
  }

  const updateProfilePic=async(req,res)=>{
    let { image,username } = req.body;
   if(!image) return res.status(400).json({success:false,msg:"Image uploading failed ! try again."})


   try{
    console.log("uploading image")
    const result=await cloudinary.v2.uploader.upload(image,{folder:"linkbrige-Profile"})
    console.log("uploaded image")
    const imgUrl=result.secure_url || "/images/panda.png";
    console.log(imgUrl)
    try {
      
      const updatedProfile = await Profile.findOneAndUpdate(
        { username }, // Filter by username
        { $set: { image:imgUrl } }, // Fields to update
        { new: true } // Return the updated document
      );
  
      if (updatedProfile) {
        return res.status(201).json({
          success: true,
          msg: "Profile picture updated successfully!",
          resImage: imgUrl, // Return the updated profile
        });
      } else {
        return res.status(404).json({
          success: false,
          msg: "User not found!",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        msg: "Server internal error!",
      });
    }
   }catch(err){
    console.log(err)
        return res.status(500).json({success:false,msg:"image uploading failed! try again"})
   }
  }

const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.userId; // Optional: userId from verifyTokenOptional middleware (can be null for public access)

        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Username is required"
            });
        }

        // No authentication required - public profiles can be viewed by anyone
        // userId will be null for unauthenticated users, or set if user is logged in

        // Get user
        const user = await User.findOne({ username, deletedAt: null });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get user settings
        const UserSettings = require("../model/userSettingsModel");
        const settings = await UserSettings.getUserSettings(username, user);

        // Check if profile is public and viewable
        // Allow access if user is viewing their own profile (for preview) - owners can preview even if private
        // But all content will still respect permissions from settings
        const isOwner = userId && user._id.toString() === userId.toString();
        if (!isOwner && (!settings.profile.isPublic || !settings.profile.allowProfileView)) {
            return res.status(403).json({
                success: false,
                message: "Profile is private"
            });
        }

        // Extract device information for profile visit notification
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const geo = geoip.lookup(ip) || { city: "Unknown", country: "Unknown" };
        const agent = useragent.parse(req.headers['user-agent']);
        const browser = agent.toAgent();
        const visitTime = new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' });
        
        const deviceDetails = {
            ip: ip,
            city: geo.city || "Unknown",
            country: geo.country || "Unknown",
            browser: browser,
            time: visitTime,
        };

        // Get visitor information if they're logged in
        let visitorUsername = null;
        let visitorName = null;
        if (userId && !isOwner) {
            try {
                const visitor = await User.findById(userId, { username: 1, name: 1 });
                if (visitor) {
                    visitorUsername = visitor.username;
                    visitorName = visitor.name;
                }
            } catch (err) {
                console.error(`Error fetching visitor info:`, err);
            }
        }

        // Send profile visit email notification if enabled
        if (!isOwner) {
            try {
                if (settings && settings.shouldEmailOnProfileView()) {
                    sendProfileVisitEmail(
                        user.email,
                        username,
                        user.name,
                        deviceDetails,
                        visitorUsername,
                        visitorName
                    ).catch(err => {
                        console.error(`Failed to send profile visit email to ${username}:`, err);
                    });
                }
            } catch (err) {
                console.error(`Error checking notification settings for ${username}:`, err);
            }
        }

        // Get profile
        const profile = await Profile.findOne({ username, deletedAt: null });
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        // Get public and unlisted links (unlisted appear in ProfilePreview but not linkhub)
        const Link = require("../model/linkModel");
        const allLinks = await Link.find({
            username,
            deletedAt: null
        }).select('source destination clicked visibility');

        // Filter public and unlisted links (exclude private)
        const visibleLinks = allLinks.filter(link => 
            link.visibility === 'public' || link.visibility === 'unlisted'
        );

        // Calculate stats (only count public links for stats)
        const publicLinks = visibleLinks.filter(link => link.visibility === 'public');
        const totalLinks = publicLinks.length;
        const totalClicks = publicLinks.reduce((sum, link) => sum + (link.clicked || 0), 0);

        // Build response based on settings
        const response = {
            success: true,
            profile: {
                username: profile.username,
                name: profile.name || user.name,
                email: settings.profile.showEmail ? user.email : null,
                location: settings.profile.showLocation ? profile.location : null,
                passion: settings.profile.showPassion ? profile.passion : null,
                bio: settings.profile.showBio ? profile.bio : null,
                image: settings.profile.showProfileImage ? profile.image : null
            },
            links: visibleLinks, // Include both public and unlisted links
            settings: {
                profile: settings.profile,
                links: settings.links,
                privacy: settings.privacy
            },
            stats: {
                totalLinks: settings.links.showLinkCount ? totalLinks : null,
                totalClicks: settings.links.showClickStats ? totalClicks : null
            }
        };

        return res.status(200).json(response);
    } catch (err) {
        console.log("Get public profile error:", err);
        return res.status(500).json({
            success: false,
            message: "Server internal error"
        });
    }
};

module.exports = {
    updateProfile,
    getProfile,
    updateProfilePic,
    getPublicProfile
};
