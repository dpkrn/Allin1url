# LinkBridger API Postman Collection

This directory contains the Postman collection and environment files for testing all LinkBridger APIs.

## Files

- `LinkBridger_API_Collection.postman_collection.json` - Complete API collection with all endpoints
- `LinkBridger_API_Environment.postman_environment.json` - Environment variables for easy testing

## Setup Instructions

### 1. Import Collection and Environment

1. Open Postman
2. Click **Import** button (top left)
3. Select both JSON files:
   - `LinkBridger_API_Collection.postman_collection.json`
   - `LinkBridger_API_Environment.postman_environment.json`
4. Click **Import**

### 2. Configure Environment

1. Select **"LinkBridger API Environment"** from the environment dropdown (top right)
2. Update `base_url` if your backend is running on a different port:
   - Default: `http://localhost:8080`
   - Production: `https://your-production-url.com`

### 3. Testing Authentication Flow

1. **Sign Up Flow:**
   - Run `Send OTP (Signup)` with your email and desired username
   - Check your email for OTP
   - Run `Verify Account (Complete Signup)` with email, username, password, and OTP

2. **Sign In:**
   - Run `Sign In` with your email and password
   - The token will be automatically stored in cookies (Postman handles this)
   - For manual token usage, copy the token from cookies and set it in the `token` environment variable

3. **Using Authenticated Endpoints:**
   - After signing in, all authenticated endpoints will use the cookie automatically
   - If cookies don't work, manually set the `token` variable and use it in the Cookie header

## API Endpoints Overview

### Authentication (`/auth`)
- `POST /signup` - Send OTP for signup
- `POST /verifyacc` - Complete signup with OTP verification
- `POST /signin` - Sign in with email/password
- `POST /verify` - Verify token and get user info
- `POST /checkavailablity` - Check username availability
- `GET /signout` - Sign out
- `POST /password_reset` - Send OTP for password reset
- `POST /validate_otp` - Validate OTP and change password

### Links (`/source`)
- `POST /addnewsource` - Add new link/source (requires auth)
- `POST /getallsource` - Get all user links (requires auth)
- `POST /editlink` - Edit existing link (requires auth)
- `POST /deletelink` - Delete link (requires auth)
- `POST /notifications` - Reset notification counts (requires auth)
- `POST /updatevisibility` - Update link visibility (requires auth)

### Profile (`/profile`)
- `POST /update` - Update profile information
- `POST /getprofileinfo` - Get profile by username
- `POST /updatepic` - Update profile picture (base64 image)
- `POST /getpublicprofile` - Get public profile (respects privacy settings)

### Settings (`/settings`)
- `POST /get` - Get user settings (requires auth)
- `POST /update` - Update user settings (requires auth)

### Search (`/search`)
- `POST /users` - Search for users (public, no auth required)

### Public Routes
- `GET /:username` - Get user's link tree page
- `GET /:username/:source` - Redirect to source destination

## Adding New APIs

When you add new API endpoints, follow these steps to update the collection:

### Step 1: Add to Collection JSON

1. Open `LinkBridger_API_Collection.postman_collection.json`
2. Find the appropriate folder (or create a new one)
3. Add a new request object following this structure:

```json
{
    "name": "Your API Name",
    "request": {
        "method": "POST",  // or GET, PUT, DELETE, etc.
        "header": [
            {
                "key": "Content-Type",
                "value": "application/json"
            },
            {
                "key": "Cookie",
                "value": "token={{token}}",  // if auth required
                "description": "Token from signin cookie"
            }
        ],
        "body": {
            "mode": "raw",
            "raw": "{\n    \"field1\": \"value1\",\n    \"field2\": \"value2\"\n}"
        },
        "url": {
            "raw": "{{base_url}}/your/route/path",
            "host": ["{{base_url}}"],
            "path": ["your", "route", "path"]
        },
        "description": "Description of what this API does"
    },
    "response": []
}
```

### Step 2: Place in Correct Folder

- **Authentication** → Add to `"Authentication"` folder
- **Links** → Add to `"Links"` folder
- **Profile** → Add to `"Profile"` folder
- **Settings** → Add to `"Settings"` folder
- **Search** → Add to `"Search"` folder
- **New Category** → Create new folder in the `"item"` array

### Step 3: Add Environment Variables (if needed)

If your new API needs new environment variables:

1. Open `LinkBridger_API_Environment.postman_environment.json`
2. Add to the `"values"` array:

```json
{
    "key": "your_variable_name",
    "value": "default_value",
    "type": "default",  // or "secret" for sensitive data
    "enabled": true
}
```

3. Also add to the collection's `"variable"` array in the collection file

### Step 4: Test and Update

1. Import the updated collection into Postman
2. Test the new endpoint
3. Update the description if needed
4. Add example responses if helpful

## Tips

1. **Cookie Handling**: Postman automatically handles cookies from responses. If you need to manually set a token, use the `token` environment variable in the Cookie header.

2. **Base64 Images**: For profile picture updates, convert your image to base64 and use the format: `data:image/png;base64,YOUR_BASE64_STRING`

3. **Environment Variables**: Use `{{variable_name}}` syntax in URLs and request bodies to reference environment variables.

4. **Testing Flow**: 
   - Always start with authentication endpoints
   - Store credentials in environment variables
   - Use the stored variables in subsequent requests

5. **Error Handling**: Check response status codes:
   - `200` - Success
   - `201` - Created
   - `400` - Bad Request
   - `401` - Unauthorized
   - `404` - Not Found
   - `409` - Conflict
   - `500` - Server Error

## Collection Structure

```
LinkBridger API Collection
├── Authentication
│   ├── Send OTP (Signup)
│   ├── Verify Account (Complete Signup)
│   ├── Sign In
│   ├── Verify Token (Get User Info)
│   ├── Check Username Availability
│   ├── Sign Out
│   ├── Password Reset - Send OTP
│   └── Password Reset - Validate OTP & Change Password
├── Links
│   ├── Add New Source
│   ├── Get All Sources
│   ├── Edit Link
│   ├── Delete Link
│   ├── Set Notifications to Zero
│   └── Update Link Visibility
├── Profile
│   ├── Update Profile
│   ├── Get Profile Info
│   ├── Update Profile Picture
│   └── Get Public Profile
├── Settings
│   ├── Get Settings
│   └── Update Settings
├── Search
│   └── Search Users
└── Public Routes
    ├── Get User Link Tree
    └── Redirect to Source
```

## Notes

- All authenticated endpoints require a valid token in cookies
- The token is automatically set when you sign in (Postman handles cookies)
- For production testing, update the `base_url` environment variable
- Some endpoints may have different behaviors based on user settings (privacy, visibility, etc.)

## Troubleshooting

**Token not working:**
- Make sure you've signed in first
- Check that cookies are enabled in Postman settings
- Manually copy token from cookies and set in environment variable

**CORS errors:**
- Make sure your backend CORS settings allow your Postman origin
- Check the allowed origins in `backend/index.js`

**404 errors:**
- Verify the `base_url` is correct
- Check that the backend server is running
- Ensure the route path matches exactly

---

**Last Updated**: This collection includes all APIs as of the current codebase. Update this file when adding new endpoints.











