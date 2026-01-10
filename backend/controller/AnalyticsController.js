const mongoose = require('mongoose');
const Link = require('../model/linkModel');
const LinkAnalytics = require('../model/linkAnalyticsModel');

const getAnalytics = async (req, res) => {
    try {
        const userId = req.userId;
        const { username, timeRange } = req.body;

        if (!userId || !username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        // Get all links for the user (excluding deleted links)
        const links = await Link.find({ 
            username, 
            userId,
            deletedAt: null 
        }, {
            source: 1,
            destination: 1,
            clicked: 1,
            notSeen: 1,
            visibility: 1,
            _id: 1
        });

        const linkIds = links.map(link => link._id);

        // Calculate date range
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        let days = 30;
        let startDate = new Date(today);
        
        switch (timeRange) {
            case '7d':
                days = 7;
                startDate.setDate(today.getDate() - 6); // Include today + 6 days
                break;
            case '30d':
                days = 30;
                startDate.setDate(today.getDate() - 29); // Include today + 29 days
                break;
            case '90d':
                days = 90;
                startDate.setDate(today.getDate() - 89);
                break;
            case '1y':
                days = 365;
                startDate.setDate(today.getDate() - 364);
                break;
            case 'all':
                startDate = null; // No start date limit
                days = 365; // For display purposes
                break;
            default:
                days = 30;
                startDate.setDate(today.getDate() - 29);
        }

        startDate?.setHours(0, 0, 0, 0); // Start of the day

        // Build match conditions for analytics
        const matchConditions = {
            userId: new mongoose.Types.ObjectId(userId),
            username,
            deletedAt: null
        };

        // Add date filter if not 'all'
        if (timeRange !== 'all' && startDate) {
            matchConditions.clickDate = {
                $gte: startDate,
                $lte: today
            };
        }

        // Filter by links if available (only show analytics for existing links)
        if (linkIds.length > 0) {
            matchConditions.$or = [
                { linkId: { $in: linkIds } },
                { linkId: null } // Include profile visits (linkId is null for profile visits)
            ];
        } else {
            // If no links, only show profile visits
            matchConditions.linkId = null;
        }

        // Generate date range for time series data
        const generateDateRange = () => {
            const dates = [];
            const rangeDays = timeRange === 'all' ? 365 : days;
            for (let i = rangeDays - 1; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                dates.push({
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    fullDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                });
            }
            return dates;
        };

        const dateRange = generateDateRange();

        // 1. Profile Visits (where linkId is null)
        const profileVisitsQuery = { ...matchConditions, linkId: null };
        const profileVisitsAggregation = await LinkAnalytics.aggregate([
            { $match: profileVisitsQuery },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$clickDate" }
                    },
                    visits: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Map to date range
        const profileVisitsMap = new Map(
            profileVisitsAggregation.map(item => [item._id, item.visits])
        );
        const profileVisits = dateRange.map(({ date, fullDate }) => {
            const dateStr = fullDate.toISOString().split('T')[0];
            return {
                date,
                visits: profileVisitsMap.get(dateStr) || 0
            };
        });

        // 2. Click Counts (all clicks including profile visits)
        const clickCountsAggregation = await LinkAnalytics.aggregate([
            { $match: matchConditions },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$clickDate" }
                    },
                    clicks: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const clickCountsMap = new Map(
            clickCountsAggregation.map(item => [item._id, item.clicks])
        );
        const clickCounts = dateRange.map(({ date, fullDate }) => {
            const dateStr = fullDate.toISOString().split('T')[0];
            return {
                date,
                clicks: clickCountsMap.get(dateStr) || 0
            };
        });

        // 3. Location Data (real data)
        const locationAggregation = await LinkAnalytics.aggregate([
            { $match: { ...matchConditions, 'location.country': { $ne: null } } },
            {
                $group: {
                    _id: '$location.country',
                    value: { $sum: 1 }
                }
            },
            { $sort: { value: -1 } },
            { $limit: 10 }
        ]);
        const locationData = locationAggregation.map(item => ({
            name: item._id || 'Unknown',
            value: item.value
        }));

        // 4. OS Data (real data)
        const osAggregation = await LinkAnalytics.aggregate([
            { $match: { ...matchConditions, 'os.name': { $ne: null } } },
            {
                $group: {
                    _id: '$os.name',
                    value: { $sum: 1 }
                }
            },
            { $sort: { value: -1 } },
            { $limit: 10 }
        ]);
        const osData = osAggregation.map(item => ({
            name: item._id || 'Unknown',
            value: item.value
        }));

        // 5. Browser Data (real data)
        const browserAggregation = await LinkAnalytics.aggregate([
            { $match: { ...matchConditions, 'browser.name': { $ne: null } } },
            {
                $group: {
                    _id: '$browser.name',
                    value: { $sum: 1 }
                }
            },
            { $sort: { value: -1 } },
            { $limit: 10 }
        ]);
        const browserData = browserAggregation.map(item => ({
            name: item._id || 'Unknown',
            value: item.value
        }));

        // 6. Device Data (real data)
        const deviceAggregation = await LinkAnalytics.aggregate([
            { $match: { ...matchConditions, 'device.type': { $ne: null } } },
            {
                $group: {
                    _id: '$device.type',
                    value: { $sum: 1 }
                }
            },
            { $sort: { value: -1 } }
        ]);
        const deviceData = deviceAggregation.map(item => ({
            name: item._id.charAt(0).toUpperCase() + item._id.slice(1) || 'Unknown',
            value: item.value
        }));

        // 7. Referrer Data (NEW - real referrer analytics)
        const referrerAggregation = await LinkAnalytics.aggregate([
            { $match: matchConditions },
            {
                $group: {
                    _id: '$referrer',
                    value: { $sum: 1 },
                    clicks: { $sum: 1 }
                }
            },
            { $sort: { value: -1 } },
            { $limit: 20 }
        ]);
        
        // Process referrer data - extract domain names and categorize
        const referrerData = referrerAggregation.map(item => {
            let name = item._id || 'direct';
            let category = 'direct';
            
            if (name !== 'direct' && name !== 'null' && name !== '') {
                try {
                    const url = new URL(name);
                    name = url.hostname.replace('www.', '');
                    
                    // Categorize referrers
                    if (name.includes('google') || name.includes('bing') || name.includes('yahoo') || name.includes('duckduckgo')) {
                        category = 'search';
                    } else if (name.includes('facebook') || name.includes('twitter') || name.includes('linkedin') || name.includes('instagram') || name.includes('youtube') || name.includes('tiktok')) {
                        category = 'social';
                    } else if (name.includes('clickly.cv') || name.includes(username)) {
                        category = 'internal';
                    } else {
                        category = 'external';
                    }
                } catch (e) {
                    // Invalid URL, keep as is
                    category = 'other';
                }
            } else {
                name = 'Direct';
                category = 'direct';
            }
            
            return {
                name,
                value: item.value,
                clicks: item.clicks,
                category,
                originalReferrer: item._id
            };
        });

        // 8. Referrer by Category (group referrers by category)
        const referrerByCategory = referrerData.reduce((acc, item) => {
            const category = item.category;
            if (!acc[category]) {
                acc[category] = { name: category.charAt(0).toUpperCase() + category.slice(1), value: 0, clicks: 0 };
            }
            acc[category].value += item.value;
            acc[category].clicks += item.clicks;
            return acc;
        }, {});
        const referrerCategoryData = Object.values(referrerByCategory);

        // 9. Platform Data (by link source - real data)
        const platformAggregation = await LinkAnalytics.aggregate([
            { $match: { ...matchConditions, linkId: { $ne: null } } },
            { $lookup: { from: 'links', localField: 'linkId', foreignField: '_id', as: 'link' } },
            { $unwind: { path: '$link', preserveNullAndEmptyArrays: true } },
            { $match: { 'link.source': { $ne: null } } },
            {
                $group: {
                    _id: '$link.source',
                    clicks: { $sum: 1 }
                }
            },
            { $sort: { clicks: -1 } }
        ]);
        const platformData = platformAggregation.map(item => ({
            name: item._id ? (item._id.charAt(0).toUpperCase() + item._id.slice(1)) : 'Unknown',
            clicks: item.clicks,
            value: item.clicks
        }));

        // 10. Link Data (by link with clicks and visits)
        const linkAggregation = await LinkAnalytics.aggregate([
            { $match: { ...matchConditions, linkId: { $ne: null } } },
            { $lookup: { from: 'links', localField: 'linkId', foreignField: '_id', as: 'link' } },
            { $unwind: { path: '$link', preserveNullAndEmptyArrays: true } },
            { $match: { 'link.source': { $ne: null } } },
            {
                $group: {
                    _id: '$link.source',
                    clicks: { $sum: 1 }
                }
            },
            { $sort: { clicks: -1 } }
        ]);
        const linkData = linkAggregation.map(item => ({
            name: item._id ? (item._id.charAt(0).toUpperCase() + item._id.slice(1)) : 'Unknown',
            clicks: item.clicks,
            visits: item.clicks // Use clicks as visits for now
        }));

        // 11. Hourly Distribution (time-based analytics)
        const hourlyAggregation = await LinkAnalytics.aggregate([
            { $match: matchConditions },
            {
                $group: {
                    _id: { $hour: '$clickDate' },
                    clicks: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        const hourlyData = Array.from({ length: 24 }, (_, hour) => {
            const hourData = hourlyAggregation.find(h => h._id === hour);
            return {
                hour: `${hour}:00`,
                clicks: hourData?.clicks || 0
            };
        });

        // 12. Day of Week Distribution
        const dayOfWeekAggregation = await LinkAnalytics.aggregate([
            { $match: matchConditions },
            {
                $project: {
                    dayOfWeek: { $dayOfWeek: '$clickDate' }
                }
            },
            {
                $group: {
                    _id: '$dayOfWeek',
                    clicks: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeekData = Array.from({ length: 7 }, (_, day) => {
            const dayData = dayOfWeekAggregation.find(d => d._id === day + 1);
            return {
                name: dayNames[day],
                clicks: dayData?.clicks || 0,
                value: dayData?.clicks || 0
            };
        });

        return res.status(200).json({
            success: true,
            analytics: {
                profileVisits,
                clickCounts,
                locationData,
                osData,
                browserData,
                deviceData,
                referrerData,
                referrerCategoryData,
                platformData,
                linkData,
                hourlyData,
                dayOfWeekData
            }
        });

    } catch (err) {
        console.error('Error fetching analytics:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Internal Error',
            error: err.message
        });
    }
};

const saveAnalytics = async ({
  linkId,
  userId,
  username,
  req
}) => {
    if (req.skipAnalytics) {
        return;
    }
      
  try {
    const payload = req?.analyticsPayload || {};
    const details = req?.details || {}; // Keep for backward compatibility

    const analytics = new LinkAnalytics({
      linkId,
      userId,
      username,

      // Location
      location: {
        country: payload?.location?.country || details?.country || null,
        city: payload?.location?.city || details?.city || null,
        region: payload?.location?.region || null,
        ipAddress: payload?.location?.ipAddress || details?.ip || null
      },

      // Device
      device: {
        type: payload?.device?.type || null,
        brand: payload?.device?.brand || null,
        model: payload?.device?.model || null
      },

      // OS
      os: {
        name: payload?.os?.name || null,
        version: payload?.os?.version || null
      },

      // Browser
      browser: {
        name: payload?.browser?.name || details?.browser || null,
        version: payload?.browser?.version || null
      },

      // Referrer
      referrer: payload?.referrer || 'direct',

      // User Agent
      userAgent: payload?.userAgent || null,

      // clickDate is auto-set
      // clickedTime is auto-derived in pre-save hook
    });
    // console.log(analytics)

    await analytics.save();
  } catch (err) {
    console.error('❌ Failed to save analytics:', err);
  }
};

const getClickDetails = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            username,
            linkId,
            page = 1,
            limit = 50,
            search = '',
            startDate,
            endDate
        } = req.body;

        if (!userId || !username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        // Build match conditions
        const matchConditions = {
            userId: new mongoose.Types.ObjectId(userId),
            username,
            deletedAt: null
        };

        // Filter by specific link if provided
        if (linkId) {
            matchConditions.linkId = new mongoose.Types.ObjectId(linkId);
        }

        // Date range filter
        if (startDate || endDate) {
            matchConditions.clickDate = {};
            if (startDate) {
                matchConditions.clickDate.$gte = new Date(startDate);
            }
            if (endDate) {
                matchConditions.clickDate.$lte = new Date(endDate);
            }
        }

        // Search filter (search in referrer, userAgent, browser.name, os.name, device info)
        if (search) {
            matchConditions.$or = [
                { 'referrer': { $regex: search, $options: 'i' } },
                { 'userAgent': { $regex: search, $options: 'i' } },
                { 'browser.name': { $regex: search, $options: 'i' } },
                { 'os.name': { $regex: search, $options: 'i' } },
                { 'device.brand': { $regex: search, $options: 'i' } },
                { 'device.model': { $regex: search, $options: 'i' } },
                { 'location.country': { $regex: search, $options: 'i' } },
                { 'location.city': { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const totalCount = await LinkAnalytics.countDocuments(matchConditions);

        // Get paginated results
        const clicks = await LinkAnalytics.find(matchConditions)
            .populate('linkId', 'source destination')
            .sort({ clickDate: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        // Format the response
        const formattedClicks = clicks.map(click => ({
            _id: click._id,
            linkId: click.linkId?._id || "linkhub" ,
            linkSource: click.linkId?.source || 'Unknown',
            linkDestination: click.linkId?.destination || 'linkhub',
            clickDate: click.clickDate,
            clickedTime: click.clickedTime,
            location: click.location,
            device: click.device,
            os: click.os,
            browser: click.browser,
            referrer: click.referrer,
            userAgent: click.userAgent,
            seen: click.seen
        }));

        return res.status(200).json({
            success: true,
            data: {
                clicks: formattedClicks,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / limit),
                    totalClicks: totalCount,
                    hasNext: page * limit < totalCount,
                    hasPrev: page > 1
                }
            }
        });

    } catch (err) {
        console.error('❌ Failed to get click details:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Internal Error'
        });
    }
};

const getClickDetailsV1 = async (req, res) => {
    try {
        const userId = req.userId;
        const { username } = req.body;

        if (!userId || !username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        // Get all clicks for the user (no pagination, return all for mock format)
        const clicks = await LinkAnalytics.find({
            userId: new mongoose.Types.ObjectId(userId),
            username,
            deletedAt: null
        })
        .populate('linkId', 'source destination')
        .sort({ clickDate: -1 }) // Most recent first
        .lean();

        // Transform data to match the original mock format
        const mockFormattedClicks = clicks.map(click => ({
            _id: click._id.toString(),
            linkId: click.linkId?._id?.toString() || "undefined",
            linkSource: click.linkId?.source || 'linkhub',
            shortUrl: `/${click.linkId?.source || 'unknown'}`,
            linkDestination: click.linkId?.destination || `${username}.clickly.cv`,
            clickDate: click.clickDate,
            clickedTime: click.clickedTime,
            location: click.location,
            device: click.device,
            os: click.os,
            browser: click.browser,
            referrer: click.referrer,
            userAgent: click.userAgent,
            seen: click.seen
        }));

        return res.status(200).json({
            success: true,
            data: mockFormattedClicks
        });

    } catch (err) {
        console.error('❌ Failed to get click details v1:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Internal Error'
        });
    }
};

const markReadNotification = async (req, res) => {
    try {
        const { clickId } = req.body;
        const userId = req.userId;

        if (!clickId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Click ID is required'
            });
        }

        // Update the specific click to mark as seen
        const updatedClick = await LinkAnalytics.findOneAndUpdate(
            { _id: clickId, userId: userId },
            { $set: { seen: true } },
            { new: true }
        );

        if (!updatedClick) {
            return res.status(404).json({
                success: false,
                message: 'Click not found or access denied'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: updatedClick
        });

    } catch (err) {
        console.error('❌ Failed to mark notification as read:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Internal Error'
        });
    }
};

module.exports = {
    getAnalytics,
    getClickDetails,
    getClickDetailsV1,
    markReadNotification,
    saveAnalytics,
};

