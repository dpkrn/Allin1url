# Link Model Documentation

## Overview
The Link model stores information about user-created personalized links (bridges) that redirect users from a custom URL to their social media profiles or external destinations.

## Model Name
`link` (collection name in MongoDB)

## Schema Fields

### `username` (String, Required)
- **Type**: String
- **Required**: Yes
- **Unique**: No (multiple links per user)
- **Purpose**: Identifies which user owns this link. Used for querying all links belonging to a specific user.
- **Example**: `"johndoe"`
- **Why Required**: Essential for associating links with users and filtering user-specific links.

### `userId` (ObjectId, Required)
- **Type**: mongoose.Schema.Types.ObjectId
- **Required**: Yes
- **Unique**: No
- **Ref**: `user`
- **Purpose**: Foreign key reference to the User model. Provides a direct relationship to the user who owns this link. More efficient than username for database queries.
- **Example**: `ObjectId("507f1f77bcf86cd799439011")`
- **Why Required**: Enables efficient joins and referential integrity. Used for user-based queries and analytics.

### `linkId` (String, Required, Unique)
- **Type**: String
- **Required**: Yes
- **Unique**: Yes
- **Purpose**: Unique identifier for each link. Used as a foreign key in the linkAnalytics model to track clicks and analytics for this specific link. Also used in URL generation (e.g., `allin1url.in/username/linkId`).
- **Example**: `"linkedin"`, `"github"`, `"instagram"`
- **Why Required**: Essential for:
  - Creating unique URLs for each link
  - Linking analytics data to specific links
  - Identifying links in API requests
  - Preventing duplicate links for the same platform per user

### `source` (String, Required)
- **Type**: String
- **Required**: Yes
- **Purpose**: The platform or service name (e.g., "linkedin", "github", "instagram"). This is typically the part of the URL path that identifies the platform.
- **Example**: `"linkedin"`, `"github"`, `"twitter"`
- **Why Required**: Used to generate the personalized URL and identify the type of link. Must be unique per user (enforced by linkId).

### `destination` (String, Required)
- **Type**: String
- **Required**: Yes
- **Purpose**: The actual URL where the link redirects to. This is the user's profile URL on the specified platform.
- **Example**: `"https://www.linkedin.com/in/johndoe"`, `"https://github.com/johndoe"`
- **Why Required**: The core purpose of the link - where users are redirected when they click the personalized link.

### `notSeen` (Number, Optional)
- **Type**: Number
- **Required**: No
- **Default**: 0
- **Purpose**: Counter for tracking how many times the link has been viewed but not clicked. Useful for analytics to understand engagement rates.
- **Example**: `5`
- **Why Optional**: Not critical for core functionality, but useful for analytics.

### `clicked` (Number, Optional)
- **Type**: Number
- **Required**: No
- **Default**: 0
- **Purpose**: Counter for total number of clicks on this link. Used for displaying click statistics to users.
- **Example**: `42`
- **Why Optional**: Can be calculated from analytics, but storing it here provides faster access for display purposes.

### `visibility` (String, Required)
- **Type**: String
- **Required**: Yes
- **Default**: `'public'`
- **Enum Values**: `'public'`, `'unlisted'`, `'private'`
- **Indexed**: Yes
- **Purpose**: Controls link visibility and accessibility:
  - **`'public'`**: Visible in profile preview, searches by other users, and link hub. Fully accessible without restrictions.
  - **`'unlisted'`**: Visible in profile preview, but NOT shown in link hub. Accessible via direct URL. Does not require password.
  - **`'private'`**: NOT visible in profile preview or link hub. If accessed directly, requires password to access. Completely hidden from public view.
- **Example**: `"public"`, `"unlisted"`, `"private"`
- **Why Required**: Essential for privacy control. Defaults to `'public'` for better sharing and discoverability - links are public by default, but users can change to `'unlisted'` or `'private'` for privacy.

### `password` (String, Optional)
- **Type**: String (hashed using bcryptjs)
- **Required**: Yes when `visibility` is `'private'`, otherwise optional
- **Default**: `null`
- **Purpose**: Hashed password for private links. Used to protect private links - users must enter the password to access the link via direct URL. **Should always be hashed** before storage (using bcryptjs). Only used when `visibility` is `'private'`.
- **Example**: `"$2a$10$hashedpasswordstring..."` (hashed) or `null`
- **Why Required for Private**: Private links require password protection. Public and unlisted links don't require passwords.

### `deletedAt` (Date, Optional)
- **Type**: Date
- **Required**: No
- **Default**: null
- **Purpose**: Soft delete field. When a link is deleted, this field is set to the deletion timestamp instead of actually removing the record. Allows for:
  - Data recovery
  - Audit trails
  - Analytics on deleted links
- **Example**: `2024-01-15T10:30:00.000Z` or `null`
- **Why Optional**: Links are active by default. Only set when a link is deleted.

### `createdAt` (Date, Auto-generated)
- **Type**: Date
- **Auto-generated**: Yes (via `timestamps: true`)
- **Purpose**: Timestamp of when the link was created. Useful for:
  - Displaying creation date to users
  - Sorting links by creation date
  - Analytics on link creation patterns
- **Example**: `2024-01-15T10:30:00.000Z`

### `updatedAt` (Date, Auto-generated)
- **Type**: Date
- **Auto-generated**: Yes (via `timestamps: true`)
- **Purpose**: Timestamp of when the link was last modified. Automatically updated whenever the document is saved.
- **Example**: `2024-01-15T10:30:00.000Z`

## Indexes
- `userId`: Indexed for fast user-based queries
- `linkId`: Indexed for fast link lookups (unique index)
- `visibility`: Indexed for visibility-based queries
- `{ userId: 1, visibility: 1, deletedAt: 1 }`: Compound index for querying user's links by visibility
- `{ username: 1, visibility: 1, deletedAt: 1 }`: Compound index for querying links by username and visibility

## Relationships
- **Belongs to**: User (via `userId`)
- **Has many**: LinkAnalytics (via `linkId`)

## Instance Methods

### `isAccessible(requirePassword = false)`
Checks if the link is accessible based on its visibility.

**Parameters**:
- `requirePassword` (Boolean, Optional): If `true`, checks if password is set for unlisted links

**Returns**: Boolean

**Logic**:
- Returns `false` if link is deleted
- Returns `true` if visibility is `'public'`
- Returns `true` for `'unlisted'` if password is not required or password exists
- Returns `false` for `'private'` links

### `shouldShowInProfile()`
Checks if link should be displayed in profile/hub.

**Returns**: Boolean - `true` only if visibility is `'public'` and link is not deleted

### `shouldShowInSearch()`
Checks if link should appear in search results.

**Returns**: Boolean - `true` only if visibility is `'public'` and link is not deleted

## Usage Examples

### Creating a Public Link
```javascript
const link = new Link({
  username: 'johndoe',
  userId: user._id,
  linkId: 'linkedin',
  source: 'linkedin',
  destination: 'https://www.linkedin.com/in/johndoe',
  visibility: 'public'
});
await link.save();
```

### Creating an Unlisted Link with Password
```javascript
const bcrypt = require('bcrypt');
const password = 'mySecretPassword';
const hashedPassword = await bcrypt.hash(password, 10);

const link = new Link({
  username: 'johndoe',
  userId: user._id,
  linkId: 'private-portfolio',
  source: 'portfolio',
  destination: 'https://myportfolio.com',
  visibility: 'unlisted',
  password: hashedPassword
});
await link.save();
```

### Creating a Private Link
```javascript
const link = new Link({
  username: 'johndoe',
  userId: user._id,
  linkId: 'secret-link',
  source: 'secret',
  destination: 'https://secret.com',
  visibility: 'private'
  // password not needed for private links
});
await link.save();
```

### Querying Public Links for Profile
```javascript
const publicLinks = await Link.find({ 
  userId: user._id, 
  visibility: 'public',
  deletedAt: null 
});
```

### Checking Link Accessibility
```javascript
const link = await Link.findOne({ linkId: 'linkedin' });

if (link.visibility === 'unlisted' && link.password) {
  // Show password form
  // Verify password: await bcrypt.compare(enteredPassword, link.password);
}

if (link.shouldShowInProfile()) {
  // Display in profile
}
```

### Querying User Links
```javascript
const userLinks = await Link.find({ 
  userId: user._id, 
  deletedAt: null 
});
```

### Soft Delete
```javascript
link.deletedAt = new Date();
await link.save();
```

## Notes
- The `linkId` should typically match the `source` value for consistency, but can be customized
- When a link is deleted, set `deletedAt` instead of using `remove()` or `deleteOne()`
- Always filter by `deletedAt: null` when querying active links
- **Visibility defaults to `'public'`** for better sharing and discoverability - links are public by default, but users can change to `'unlisted'` or `'private'` for privacy
- **Password must be hashed** before storing (use bcrypt, argon2, or similar)
- For `'unlisted'` links, password is required - validate this in your controller
- Use helper methods (`shouldShowInProfile()`, `shouldShowInSearch()`) for consistent visibility checks
- Public links are visible everywhere (profile, search, hub)
- Unlisted links are accessible via direct URL but require password
- Private links show "link protected" message if accessed directly
