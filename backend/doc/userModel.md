# User Model Documentation

## Overview
The User model stores core authentication and account information for registered users. This is the primary user account model used for login, authentication, and user identification.

## Model Name
`user` (collection name in MongoDB)

## Schema Fields

### `name` (String, Optional)
- **Type**: String
- **Required**: No
- **Purpose**: User's full name or display name. Used for personalization and display purposes. Can be updated later through the profile.
- **Example**: `"John Doe"`, `"Jane Smith"`
- **Why Optional**: Users may register with just email/username initially and add their name later.

### `email` (String, Required, Unique)
- **Type**: String
- **Required**: Yes
- **Unique**: Yes
- **Purpose**: User's email address. Used for:
  - Account identification
  - Password reset
  - Email verification
  - Communication
  - Login (alternative to username)
- **Example**: `"john.doe@example.com"`
- **Why Required**: Essential for account recovery, notifications, and user identification. Must be unique to prevent duplicate accounts.

### `password` (String, Required)
- **Type**: String (hashed)
- **Required**: Yes
- **Purpose**: User's password. **Should always be hashed** before storage (using bcrypt, argon2, or similar). Never store plain text passwords.
- **Example**: `"$2b$10$hashedpasswordstring..."` (hashed)
- **Why Required**: Required for authentication and account security. Must be hashed using a secure hashing algorithm.

### `username` (String, Required, Unique)
- **Type**: String
- **Required**: Yes
- **Unique**: Yes
- **Purpose**: Unique username for the user. Used for:
  - Public profile URLs (e.g., `allin1url.in/username`)
  - User identification
  - Login
  - Display purposes
- **Example**: `"johndoe"`, `"jane_smith"`
- **Why Required**: Essential for creating unique user identifiers and public URLs. Must be unique to prevent conflicts.

### `deletedAt` (Date, Optional)
- **Type**: Date
- **Required**: No
- **Default**: `null`
- **Purpose**: Soft delete field. When a user account is deleted, this field is set to the deletion timestamp instead of actually removing the record. Allows for:
  - Account recovery within a grace period
  - Data retention for legal/compliance reasons
  - Audit trails
  - Preventing username reuse immediately after deletion
- **Example**: `2024-01-15T10:30:00.000Z` or `null`
- **Why Optional**: Accounts are active by default. Only set when an account is deleted.

### `createdAt` (Date, Auto-generated)
- **Type**: Date
- **Auto-generated**: Yes (via `timestamps: true`)
- **Purpose**: Timestamp of when the user account was created. Useful for:
  - Displaying account age
  - Analytics on user registration patterns
  - Account verification timelines
- **Example**: `2024-01-15T10:30:00.000Z`

### `updatedAt` (Date, Auto-generated)
- **Type**: Date
- **Auto-generated**: Yes (via `timestamps: true`)
- **Purpose**: Timestamp of when the user account was last modified. Automatically updated whenever the document is saved. Useful for tracking account activity.
- **Example**: `2024-01-15T10:30:00.000Z`

## Indexes
- `email`: Automatically indexed due to `unique: true`
- `username`: Automatically indexed due to `unique: true`
- Consider adding compound index on `{ email: 1, deletedAt: 1 }` for soft delete queries

## Relationships
- **Has one**: UserProfile (via `username`)
- **Has one**: UserSettings (via `userId` or `username`)
- **Has many**: Links (via `userId`)
- **Has many**: LinkAnalytics (via `userId`)

## Security Considerations

### Password Storage
- **Never** store passwords in plain text
- Always hash passwords before saving
- Use strong hashing algorithms (bcrypt, argon2, scrypt)
- Recommended: bcrypt with salt rounds >= 10

### Email Validation
- Validate email format before saving
- Consider email verification flow
- Handle case-insensitive email matching

### Username Validation
- Enforce username rules (length, characters allowed)
- Prevent reserved usernames
- Handle case-insensitive username matching if needed

## Usage Examples

### Creating a User
```javascript
const bcrypt = require('bcrypt');

const hashedPassword = await bcrypt.hash(password, 10);
const user = new User({
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: hashedPassword,
  username: 'johndoe'
});
await user.save();
```

### Finding Active Users
```javascript
const activeUsers = await User.find({ 
  deletedAt: null 
});
```

### Soft Delete User
```javascript
user.deletedAt = new Date();
await user.save();
```

### Finding User by Email or Username
```javascript
const user = await User.findOne({ 
  $or: [
    { email: identifier },
    { username: identifier }
  ],
  deletedAt: null
});
```

## Notes
- Always filter by `deletedAt: null` when querying active users
- Passwords must be hashed before saving
- Email and username are case-sensitive by default (consider normalization)
- When deleting a user, also consider soft-deleting related records (links, profiles, etc.)
- The `name` field can be synced with the UserProfile model for consistency
