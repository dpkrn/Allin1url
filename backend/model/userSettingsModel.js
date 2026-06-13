const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'user',
        index: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        ref: 'user',
        index: true
    },
    
    // Template Settings
    template: {
        type: String,
        default: 'default', // Default template name
        trim: true
        // Removed enum validation - templates are validated dynamically from database
    },
    
    // Profile Visibility Settings
    profile: {
        isPublic: {
            type: Boolean,
            default: false // Profile is private by default
        },
        showInSearch: {
            type: Boolean,
            default: false // Don't show in search by default
        },
        allowProfileView: {
            type: Boolean,
            default: false // Don't allow others to view profile by default
        },
        showEmail: {
            type: Boolean,
            default: false
        },
        showHeadline: {
            type: Boolean,
            default: true
        },
        showWebsite: {
            type: Boolean,
            default: true
        },
        showSkills: {
            type: Boolean,
            default: true
        },
        showLocation: {
            type: Boolean,
            default: true // Show location in public profile
        },
        showBio: {
            type: Boolean,
            default: true // Show bio in public profile
        },
        showPassion: {
            type: Boolean,
            default: true // Show passion in public profile
        },
        showProfileImage: {
            type: Boolean,
            default: true // Show profile image in public profile
        }
    },
    
    // Link Display Settings (visibility is now in Link model)
    links: {
        // Show link count in public profile
        showLinkCount: {
            type: Boolean,
            default: true
        },
        // Show click statistics in public profile
        showClickStats: {
            type: Boolean,
            default: false
        }
    },
    
    // Search & Discovery Settings
    search: {
        // Allow profile to appear in search results
        allowSearch: {
            type: Boolean,
            default: false
        },
        // Show profile in "featured" or "popular" sections
        showInFeatured: {
            type: Boolean,
            default: false
        },
        // Keywords/tags for better searchability
        searchKeywords: [{
            type: String,
            trim: true
        }]
    },
    
    // Privacy Settings
    privacy: {
        // Show analytics to public
        showAnalytics: {
            type: Boolean,
            default: false
        },
        // Allow others to see when profile was last updated
        showLastUpdated: {
            type: Boolean,
            default: false
        },
        // Require authentication to view profile
        requireAuth: {
            type: Boolean,
            default: false
        }
    },
    
    // Notification Settings (for future use)
    notifications: {
        emailOnNewClick: {
            type: Boolean,
            default: false
        },
        emailOnProfileView: {
            type: Boolean,
            default: false
        },
        emailOnLinkHubView: {
            type: Boolean,
            default: false
        },
        weeklyReport: {
            type: Boolean,
            default: false
        }
    },
    
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // This adds createdAt and updatedAt automatically
});

// Indexes for common queries
userSettingsSchema.index({ username: 1, deletedAt: 1 });
userSettingsSchema.index({ userId: 1, deletedAt: 1 });
userSettingsSchema.index({ 'profile.isPublic': 1, 'search.allowSearch': 1 });

// Method to check if profile is searchable
userSettingsSchema.methods.isSearchable = function() {
    return this.profile && 
           this.profile.isPublic && 
           this.search && 
           this.search.allowSearch &&
           !this.deletedAt;
};

// Method to check if email notification should be sent on new click
userSettingsSchema.methods.shouldEmailOnClick = function() {
    return this.notifications && 
           this.notifications.emailOnNewClick &&
           !this.deletedAt;
};

// Method to check if email notification should be sent on profile view
userSettingsSchema.methods.shouldEmailOnProfileView = function() {
    return this.notifications && 
           this.notifications.emailOnProfileView &&
           !this.deletedAt;
};

// Method to check if email notification should be sent on LinkHub view
userSettingsSchema.methods.shouldEmailOnLinkHubView = function() {
    return this.notifications && 
           this.notifications.emailOnLinkHubView &&
           !this.deletedAt;
};

// Method to check if weekly report notifications are enabled
userSettingsSchema.methods.shouldSendWeeklyReport = function() {
    return this.notifications && 
           this.notifications.weeklyReport &&
           !this.deletedAt;
};

// Method to check if any email notifications are enabled
userSettingsSchema.methods.hasEmailNotificationsEnabled = function() {
    return this.notifications && 
           (this.notifications.emailOnNewClick || 
            this.notifications.emailOnProfileView || 
            this.notifications.emailOnLinkHubView ||
            this.notifications.weeklyReport) &&
           !this.deletedAt;
};

// Static method to get settings for a user
userSettingsSchema.statics.getUserSettings = async function(userIdOrUsername, userData = null) {
    let query;
    let createData = {};
    
    if (mongoose.Types.ObjectId.isValid(userIdOrUsername)) {
        query = { userId: userIdOrUsername, deletedAt: null };
        createData.userId = userIdOrUsername;
        // If userData provided, use it; otherwise we need to fetch from User model
        if (userData && userData.username) {
            createData.username = userData.username;
        } else {
            // Need to fetch username from User model
            const User = mongoose.model('user');
            const user = await User.findById(userIdOrUsername);
            if (user) {
                createData.username = user.username;
            } else {
                throw new Error('User not found');
            }
        }
    } else {
        query = { username: userIdOrUsername, deletedAt: null };
        createData.username = userIdOrUsername;
        // If userData provided, use it; otherwise we need to fetch from User model
        if (userData && userData._id) {
            createData.userId = userData._id;
        } else {
            // Need to fetch userId from User model
            const User = mongoose.model('user');
            const user = await User.findOne({ username: userIdOrUsername });
            if (user) {
                createData.userId = user._id;
            } else {
                throw new Error('User not found');
            }
        }
    }
    
    let settings = await this.findOne(query);
    
    // Create default settings if none exist
    if (!settings && createData.userId && createData.username) {
        try {
            settings = await this.create(createData);
        } catch (error) {
            // If creation fails, try to find again (might have been created by another request)
            settings = await this.findOne(query);
            if (!settings) {
                throw error;
            }
        }
    }
    
    return settings;
};

const UserSettings = mongoose.model('userSettings', userSettingsSchema);

module.exports = UserSettings;
