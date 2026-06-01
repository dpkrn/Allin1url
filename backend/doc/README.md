# Database Models Documentation

This directory contains comprehensive documentation for all database models used in the All in1 url application.

## Overview

The All in1 url application uses MongoDB with Mongoose ODM. All models are designed with:
- **Timestamps**: Automatic `createdAt` and `updatedAt` fields
- **Soft Deletes**: `deletedAt` field for data retention
- **Indexes**: Optimized for common query patterns
- **Relationships**: Foreign key references between models

## Models

### 1. [Link Model](./linkModel.md)
Stores user-created personalized links (bridges) that redirect to social media profiles or external destinations.

**Key Features:**
- Unique `linkId` for each link
- User association via `userId` and `username`
- Click tracking counters
- Soft delete support

### 2. [Link Analytics Model](./linkAnalyticsModel.md)
Tracks detailed information about every click on user links, including timestamps, device info, location, and browser details.

**Key Features:**
- Comprehensive timestamp tracking (date, time, timezone)
- Device, OS, and browser information
- Geographic location data
- Full timestamp formatting methods

### 3. [User Model](./userModel.md)
Core authentication and account information for registered users.

**Key Features:**
- Email and username authentication
- Hashed password storage
- Account management
- Soft delete support

### 4. [User Profile Model](./userProfile.md)
Public-facing profile information including name, bio, location, passion, and profile image.

**Key Features:**
- Display information separate from auth data
- Profile customization
- Public profile support

### 5. [User Settings Model](./userSettingsModel.md)
Privacy and visibility preferences controlling what information is visible to other users.

**Key Features:**
- Profile visibility controls
- Link visibility settings (public/private/unlisted)
- Search and discovery settings
- Privacy preferences
- Helper methods for visibility checks

### 6. [OTP Model](./otpModel.md)
Temporary verification codes for email verification, password reset, and authentication.

**Key Features:**
- Automatic expiration (5 minutes)
- Hashed OTP storage
- Email-based verification

## Model Relationships

```
User
├── UserProfile (1:1 via username)
├── UserSettings (1:1 via userId/username)
├── Links (1:many via userId)
└── LinkAnalytics (1:many via userId)

Link
└── LinkAnalytics (1:many via linkId)
```

## Common Patterns

### Soft Deletes
All models support soft deletes using the `deletedAt` field:
```javascript
// Soft delete
record.deletedAt = new Date();
await record.save();

// Query active records
const active = await Model.find({ deletedAt: null });
```

### Timestamps
All models automatically track `createdAt` and `updatedAt`:
```javascript
// Automatically set on creation
const record = new Model({ ... });
await record.save(); // createdAt and updatedAt set automatically

// updatedAt automatically updated on save
record.field = 'new value';
await record.save(); // updatedAt updated automatically
```

### Foreign Keys
Models use references for relationships:
```javascript
// In Link model
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'user'
}

// Populate when querying
const link = await Link.findById(id).populate('userId');
```

## Best Practices

1. **Always filter by `deletedAt: null`** when querying active records
2. **Hash sensitive data** (passwords, OTPs) before storing
3. **Use indexes** for frequently queried fields
4. **Validate data** before saving
5. **Use soft deletes** instead of hard deletes for data retention
6. **Check relationships** before deleting related records

## Security Considerations

- **Passwords**: Always hash using bcrypt or similar
- **OTPs**: Hash before storage, expire quickly
- **Email**: Validate format, handle case-insensitive matching
- **Privacy**: Respect user settings for data visibility
- **GDPR**: Handle user data according to privacy regulations

## Query Examples

### Finding Active User Links
```javascript
const links = await Link.find({ 
  userId: user._id, 
  deletedAt: null 
});
```

### Getting User Settings
```javascript
const settings = await UserSettings.getUserSettings(username);
```

### Finding Searchable Profiles
```javascript
const profiles = await UserSettings.find({
  'profile.isPublic': true,
  'search.allowSearch': true,
  deletedAt: null
});
```

### Querying Analytics
```javascript
const clicks = await LinkAnalytics.find({
  linkId: 'linkedin',
  deletedAt: null
}).sort({ clickDate: -1 });
```

## Documentation Structure

Each model documentation file includes:
- **Overview**: Purpose and use case
- **Schema Fields**: Detailed field documentation
  - Type and constraints
  - Purpose and examples
  - Why it's required/optional
  - Enum values (if applicable)
- **Indexes**: Performance optimizations
- **Relationships**: Model connections
- **Usage Examples**: Code examples
- **Notes**: Important considerations

## Contributing

When adding new models or modifying existing ones:
1. Update the model file
2. Update the corresponding documentation
3. Update this README if needed
4. Document any breaking changes

## Questions?

Refer to individual model documentation files for detailed information about each model's fields, methods, and usage patterns.
