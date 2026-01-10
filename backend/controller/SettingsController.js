const UserSettings = require("../model/userSettingsModel");
const User = require("../model/userModel");
const Project = require("../model/projectModel");

// Get user settings
const getSettings = async (req, res) => {
    try {
        const userId = req.userId;
        const { username } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Get user info if username not provided
        let userData = null;
        if (!username) {
            userData = await User.findById(userId);
            if (!userData) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
        }

        // Use the static method to get or create settings
        const settings = await UserSettings.getUserSettings(
            username || userId,
            userData
        );

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: "Settings not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Settings retrieved successfully",
            settings
        });
    } catch (err) {
        console.log("Get settings error:", err);
        return res.status(500).json({
            success: false,
            message: "Server internal error"
        });
    }
};

// Update user settings
const updateSettings = async (req, res) => {
    try {
        const userId = req.userId;
        const { username, category, field, value, ...settingsData } = req.body;
        console.log("category",category)
        console.log("field",field)
        console.log("value",value)
        console.log("settingsData",settingsData)
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Get user info
        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get or create settings
        let settings = await UserSettings.getUserSettings(userId, userData);

        if (!settings) {
            return res.status(404).json({
                success: false,
                message: "Settings not found"
            });
        }

        // Handle single field update (new format)
        if (category && field !== undefined && value !== undefined) {
            const validCategories = ['profile', 'links', 'search', 'privacy', 'notifications', 'template'];
            
            if (!validCategories.includes(category)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid category. Valid options are: ${validCategories.join(', ')}`
                });
            }

            // Handle template update
            if (category === 'template') {
                // Get valid templates from database
                const project = await Project.getProjectConfig();
                const validTemplates = project && project.availableTemplates 
                    ? project.availableTemplates
                        .filter(t => t.status === true)
                        .map(t => t.template)
                    : ['default']; // Fallback to default if project config not found
                
                if (!validTemplates.includes(value)) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid template. Valid options are: ${validTemplates.join(', ')}`
                    });
                }
                settings.template = value;
                await settings.save();
                
                return res.status(200).json({
                    success: true,
                    message: "Template updated successfully",
                    settings
                });
            }

            // Check if profile is private and field requires public profile
            const requiresPublicProfile = [
                'showInSearch',
                'allowProfileView',
                'showEmail'
            ];
            
            const searchRequiresPublicProfile = [
                'allowSearch',
                'showInFeatured'
            ];
            
            // If profile is private, don't allow updates to fields that require public profile
            if (category === 'profile' && requiresPublicProfile.includes(field)) {
                if (!settings.profile || !settings.profile.isPublic) {
                    return res.status(400).json({
                        success: false,
                        message: "Cannot update this setting. Profile must be public first."
                    });
                }
            }
            
            // If profile is private, don't allow updates to search fields that require public profile
            if (category === 'search' && searchRequiresPublicProfile.includes(field)) {
                if (!settings.profile || !settings.profile.isPublic) {
                    return res.status(400).json({
                        success: false,
                        message: "Cannot update this setting. Profile must be public first."
                    });
                }
            }

            // Validate and update the specific field
            if (category === 'profile') {
                const validFields = ['isPublic', 'showInSearch', 'allowProfileView', 'showEmail', 'showLocation', 'showBio', 'showPassion', 'showProfileImage'];
                if (!validFields.includes(field)) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid field for profile category. Valid options are: ${validFields.join(', ')}`
                    });
                }
                // Convert boolean fields properly
                const boolValue = typeof value === 'string' ? value === 'true' : Boolean(value);
                settings.set(`profile.${field}`, boolValue);
                settings.markModified('profile');
            } else if (category === 'links') {
                const validFields = ['showLinkCount', 'showClickStats'];
                if (!validFields.includes(field)) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid field for links category. Valid options are: ${validFields.join(', ')}`
                    });
                }
                const boolValue = typeof value === 'string' ? value === 'true' : Boolean(value);
                settings.set(`links.${field}`, boolValue);
                settings.markModified('links');
            } else if (category === 'search') {
                const validFields = ['allowSearch', 'showInFeatured', 'searchKeywords'];
                if (!validFields.includes(field)) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid field for search category. Valid options are: ${validFields.join(', ')}`
                    });
                }
                if (field === 'searchKeywords') {
                    // Validate that value is an array
                    if (!Array.isArray(value)) {
                        return res.status(400).json({
                            success: false,
                            message: "searchKeywords must be an array"
                        });
                    }
                    settings.set('search.searchKeywords', value);
                } else {
                    const boolValue = typeof value === 'string' ? value === 'true' : Boolean(value);
                    settings.set(`search.${field}`, boolValue);
                }
                settings.markModified('search');
            } else if (category === 'privacy') {
                const validFields = ['showAnalytics', 'showLastUpdated', 'requireAuth'];
                if (!validFields.includes(field)) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid field for privacy category. Valid options are: ${validFields.join(', ')}`
                    });
                }
                const boolValue = typeof value === 'string' ? value === 'true' : Boolean(value);
                settings.set(`privacy.${field}`, boolValue);
                settings.markModified('privacy');
            } else if (category === 'notifications') {
                const validFields = ['emailOnNewClick', 'emailOnProfileView', 'emailOnLinkHubView', 'weeklyReport'];
                if (!validFields.includes(field)) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid field for notifications category. Valid options are: ${validFields.join(', ')}`
                    });
                }
                // Convert value to boolean if needed
                const boolValue = typeof value === 'string' ? value === 'true' : Boolean(value);
                
                // Use set() method with dot notation for nested fields (more reliable in Mongoose)
                settings.set(`notifications.${field}`, boolValue);
                settings.markModified('notifications');
                
                console.log(`Updating notifications.${field} to ${boolValue} (type: ${typeof boolValue}) for user ${userId}`);
            }

            const savedSettings = await settings.save();
            
            // Verify the save worked (especially for notifications)
            if (category === 'notifications') {
                const boolValue = typeof value === 'string' ? value === 'true' : Boolean(value);
                const verification = await UserSettings.findById(settings._id);
                console.log(`Verification - notifications.${field} saved as:`, verification?.notifications?.[field], `(expected: ${boolValue})`);
            }

            return res.status(200).json({
                success: true,
                message: "Setting updated successfully",
                settings
            });
        }

        // Handle bulk update (old format for backward compatibility)
        // Update template if provided
        if (settingsData.template !== undefined) {
            // Get valid templates from database
            const project = await Project.getProjectConfig();
            const validTemplates = project && project.availableTemplates 
                ? project.availableTemplates
                    .filter(t => t.status === true)
                    .map(t => t.template)
                : ['default']; // Fallback to default if project config not found
            
            if (validTemplates.includes(settingsData.template)) {
                settings.template = settingsData.template;
            } else {
                return res.status(400).json({
                    success: false,
                    message: `Invalid template. Valid options are: ${validTemplates.join(', ')}`
                });
            }
        }
        
        // Update settings - use Object.assign and markModified for nested objects
        if (settingsData.profile) {
            Object.assign(settings.profile, settingsData.profile);
            settings.markModified('profile');
        }
        if (settingsData.links) {
            Object.assign(settings.links, settingsData.links);
            settings.markModified('links');
        }
        if (settingsData.search) {
            // Handle searchKeywords array separately
            if (settingsData.search.searchKeywords !== undefined) {
                settings.search.searchKeywords = settingsData.search.searchKeywords;
            }
            // Update other search fields
            if (settingsData.search.allowSearch !== undefined) {
                settings.search.allowSearch = settingsData.search.allowSearch;
            }
            if (settingsData.search.showInFeatured !== undefined) {
                settings.search.showInFeatured = settingsData.search.showInFeatured;
            }
            settings.markModified('search');
        }
        if (settingsData.privacy) {
            Object.assign(settings.privacy, settingsData.privacy);
            settings.markModified('privacy');
        }
        if (settingsData.notifications) {
            Object.assign(settings.notifications, settingsData.notifications);
            settings.markModified('notifications');
        }

        await settings.save();

        return res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            settings
        });
    } catch (err) {
        console.error("Update settings error:", err);
        return res.status(500).json({
            success: false,
            message: "Server internal error",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
