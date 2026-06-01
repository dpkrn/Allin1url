# Backend Changelog

All notable changes to the backend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2024-12-XX (Latest)

- **Comprehensive Analytics API Enhancement**: Complete analytics system with real data aggregation
  - **Referrer Analytics**: Added referrer category aggregation (Direct, Search, Social, Internal, External)
  - **Top Referrer Sources**: Domain-level referrer tracking with categorization logic
  - **Device Analytics**: Device type aggregation (Desktop, Mobile, Tablet)
  - **Browser Analytics**: Browser distribution aggregation (Chrome, Safari, Firefox, Edge, etc.)
  - **Operating System Analytics**: OS-based aggregation (Windows, macOS, Linux, iOS, Android)
  - **Hourly Distribution**: Hourly click patterns aggregation (0-23 hours)
  - **Day of Week Analysis**: Day-of-week click distribution (Sunday through Saturday)
  - **Platform Performance**: Individual platform click metrics aggregation
  - **Link-Based Analytics**: Per-link performance tracking with clicks and visits
  - **MongoDB Aggregation Pipelines**: Replaced mock data with real aggregation queries
  - **Date Range Filtering**: Proper time range filtering (7d, 30d, 90d, 1y, all)
  - **Data Structure Consistency**: Ensured consistent data formats across all metrics
  - **Referrer Categorization**: Intelligent referrer categorization logic
  - **Domain Extraction**: Extracts domain names from referrer URLs
  - **Statistics Calculation**: Total clicks, profile visits, unique countries, top referrer

### Added - 2024-12-XX (Previous)

- **Custom Subdomain Routing**: Complete subdomain-based routing system
  - Subdomain middleware (`resolveUsername`) to extract username from subdomain
  - Root route handler for subdomain linkhub display (`username.allin1url.in/`)
  - Subdomain source route handler (`username.allin1url.in/platform`)
  - Main domain redirects to frontend (`allin1url.in` → `allin1url.in/app/`)
  - Separate nginx server blocks for main domain and wildcard subdomains
  - EJS helper function (`getUserLinkUrl`) for subdomain URL generation in templates
  - Updated all 13 EJS templates to use subdomain format
  - Environment-aware URL generation (dev: `username.localhost:8080`, prod: `username.allin1url.in`)
  - CORS configuration updated to allow all subdomains
  - Password-protected links work correctly with subdomain routing
  - LinkHub generation updated for subdomain format in error messages

### Added - 2024-12-XX (Previous)

- **Link Model Enhancements**: Added visibility and password fields
  - Added `visibility` field with enum: 'public', 'unlisted', 'private'
  - Default value: 'public'
  - Added `password` field for unlisted link protection (hashed)
  - Added `linkId` field (unique string) for foreign key relationships
  - Added `deletedAt` field for soft deletes
  - Added `createdAt` and `updatedAt` via timestamps
  - Added indexes: `{ userId: 1, visibility: 1, deletedAt: 1 }`
  - Added helper methods: `isAccessible()`, `shouldShowInProfile()`, `shouldShowInSearch()`

- **LinkAnalytics Model**: Comprehensive click tracking model
  - Tracks every click with full timestamp information
  - Location data (country, city, region, IP address)
  - Device information (type, brand, model)
  - Operating system (name, version)
  - Browser information (name, version)
  - Referrer and user agent
  - Full timestamp object with multiple formats
  - Helper method: `getFullTimestamp()` for formatted timestamps
  - Compound indexes for efficient queries
  - Soft delete support

- **UserSettings Model**: Privacy and visibility controls
  - Profile visibility settings (8 toggle options)
  - Link display settings (show count, show stats)
  - Search & discovery settings (allow search, featured, keywords)
  - Privacy settings (analytics, last updated, require auth)
  - Notification settings (email on click, profile view, weekly report)
  - Helper method: `isSearchable()` for profile search
  - Static method: `getUserSettings()` for easy access
  - Automatic settings creation on first access

- **Model Timestamps**: Added to all models
  - `createdAt`: Auto-generated timestamp
  - `updatedAt`: Auto-updated timestamp
  - `deletedAt`: Soft delete timestamp (optional)

- **Model Documentation**: Comprehensive documentation
  - Created `/backend/doc/` folder
  - One markdown file per model
  - Field descriptions with examples
  - Enum values documented
  - Required/optional explanations
  - Usage examples
  - Index information
  - Relationship documentation
  - README.md as index

### Changed - 2024-12-XX

- **Link Model**: Enhanced with visibility controls
  - Changed default visibility from 'private' to 'public'
  - Added password field for unlisted links
  - Added linkId for foreign key relationships

- **User Model**: Added soft delete support
  - Added `deletedAt` field
  - Maintains timestamps (already had)

- **UserProfile Model**: Added soft delete and public profile support
  - Added `deletedAt` field
  - Removed `isPublic` field (moved to UserSettings)
  - Maintains timestamps (already had)

- **UserSettings Model**: Refactored link visibility
  - Removed `links.defaultVisibility`
  - Removed `links.publicLinks` array
  - Removed `links.unlistedLinks` array
  - Removed link visibility methods
  - Kept only display settings (showLinkCount, showClickStats)
  - Link visibility now managed in Link model

### API Endpoints Needed

The following endpoints need to be implemented:

1. **Settings Endpoints**:
   - `POST /settings/get` - Get user settings
   - `POST /settings/update` - Update user settings

2. **Link Visibility Endpoint**:
   - `POST /source/updatevisibility` - Update link visibility

3. **Search Endpoint**:
   - `POST /search/users` - Search for users (returns searchable profiles)

4. **Public Profile Endpoint**:
   - `POST /profile/getpublicprofile` - Get public profile data with settings and public links only

### Added - 2024-12-XX (Latest)

- **Private Link Password Protection**: Complete password protection system for private links
  - Password prompt page (`password_prompt.ejs`) for collecting passwords
  - Secure password verification endpoint (`/link/verify-password`)
  - Base64 encoding/decoding of username and source for security
  - Direct HTTP redirect after successful password verification
  - Support for both form submissions and JSON API requests
  - Error handling with user-friendly error messages
  - Click tracking and email notifications for password-protected link access
  - Secure password hashing using bcryptjs
  - Automatic redirect to destination URL after verification

- **Link Visibility System**: Enhanced link visibility controls
  - Three visibility levels: `public`, `unlisted`, `private`
  - Public links: Visible in profile preview, searches, and link hub
  - Unlisted links: Not in link hub or profile, but accessible via direct URL with password
  - Private links: Completely hidden, require password for direct access
  - Per-link visibility settings with visual indicators
  - Helper methods: `isAccessible()`, `shouldShowInProfile()`, `shouldShowInSearch()`

- **Public Profile System**: Public profile viewing and search
  - Public profile endpoint with optional authentication (`verifyTokenOptional`)
  - Profile preview component for visitors
  - User search functionality in navigation
  - Respects all privacy settings from UserSettings model
  - Owner preview functionality to see how profile appears to visitors

- **Settings Management**: Comprehensive privacy and visibility controls
  - Settings page for managing all privacy preferences
  - Profile visibility controls (8 toggle options)
  - Link display settings
  - Search & discovery settings
  - Privacy and notification settings
  - Backend integration with proper nested object updates

### Notes

- All models now support soft deletes
- Timestamps are automatically managed by Mongoose
- Link visibility is per-link, not global
- UserSettings provides granular privacy controls
- LinkAnalytics provides comprehensive click tracking
- Private links use secure password verification with direct redirection
