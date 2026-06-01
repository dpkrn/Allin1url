# Frontend Pages Documentation

This document provides comprehensive information about all pages in the All in1 url frontend application.

## Table of Contents

- [Overview](#overview)
- [Page Components](#page-components)
- [Routing](#routing)
- [Design Patterns](#design-patterns)
- [Light & Dark Mode](#light--dark-mode)

## Overview

The All in1 url frontend is built with React 18 and uses React Router for navigation. All pages follow consistent design patterns with:
- Animated backgrounds with gradient orbs
- Glassmorphism effects
- Smooth animations using Framer Motion
- Full light and dark mode support
- Responsive design for all screen sizes

## Page Components

### 1. HomePage (`/components/pages/HomePage.jsx`)

**Route**: `/` (public, redirects to `/home` if authenticated)

**Purpose**: Landing page for unauthenticated users

**Features**:
- Hero section with call-to-action
- Feature highlights
- Sign up / Login options
- Responsive design
- Animated background

**Access**: Public (no authentication required)

---

### 2. DashBoard (`/components/DashBoard.jsx`)

**Route**: `/home` (private, requires authentication)

**Purpose**: Main dashboard combining multiple components

**Components Included**:
- Content component (hero section)
- CreateBridge component (link creation form)
- LinkPage component (list of all links)
- Footer component

**Features**:
- Single-page dashboard experience
- All link management in one place
- Responsive layout

**Access**: Private (authentication required)

---

### 3. CreateBridge (`/components/pages/CreateBridge.jsx`)

**Route**: Accessed via `/home` or direct navigation

**Purpose**: Create and edit personalized links

**Features**:
- Create new links with platform name and destination URL
- Edit existing links
- Platform change warning modal
- Link preview after creation
- Copy to clipboard functionality
- Form validation
- Loading states
- Full light and dark mode support

**Key Functionality**:
- **Create Mode**: Add new link with platform and destination
- **Edit Mode**: Modify existing link (shows warning if platform changes)
- **Link Preview**: Shows generated personalized link
- **Copy Button**: Copies link to clipboard (fixed: now has `type="button"`)

**Form Fields**:
- Platform Name (text input, lowercase)
- Destination URL (URL input)

**API Endpoints Used**:
- `POST /source/addnewsource` - Create new link
- `POST /source/editlink` - Update existing link

---

### 4. LinkPage (`/components/pages/LinkPage.jsx`)

**Route**: `/links` (private, requires authentication)

**Purpose**: Display and manage all user links

**Features**:
- List of all user links
- Hub link display (main profile link)
- Copy hub link to clipboard
- Create new bridge button
- Stats summary cards (Total Links, Total Clicks, Hub Page)
- Empty state with call-to-action
- Responsive grid layout
- Animated background

**Components Used**:
- Linkcard component for each link

**Stats Cards**:
- **Total Links**: Count of all user links
- **Total Clicks**: Sum of clicks across all links
- **Hub Page**: Status indicator (Live)

**API Endpoints Used**:
- `POST /source/getallsource` - Fetch all user links

---

### 5. Profile (`/components/pages/Profile.jsx`)

**Route**: `/profile` (private, requires authentication)

**Purpose**: User profile management and editing

**Features**:
- Profile picture upload with hover effects
- Edit profile information (name, location, passion, bio)
- Username display
- Stats cards (Total Links, Total Clicks, Hub Page)
- Public profile information section
- Preview button to see public view
- Full light and dark mode support

**Form Fields**:
- Full Name (text input)
- Location (text input)
- Passion (text input)
- Bio (textarea)

**Profile Picture**:
- Click to upload new image
- Hover overlay with camera icon
- Loading spinner during upload
- Image validation (type and size)

**Edit Mode**:
- Toggle between view and edit mode
- Save/Cancel buttons
- Form validation
- Loading states

**Preview Button**:
- Navigates to `/profile/{username}` to see public view
- Only visible when not in edit mode

**API Endpoints Used**:
- `POST /profile/getprofileinfo` - Get profile data
- `POST /profile/update` - Update profile information
- `POST /profile/updatepic` - Update profile picture

---

### 6. ProfilePreview (`/components/pages/ProfilePreview.jsx`)

**Route**: `/profile/:username` (public, no authentication required)

**Purpose**: Public profile view for visitors

**Features**:
- Displays profile information based on visibility settings
- Shows only public links (filters out unlisted/private)
- Respects all privacy settings
- Stats display (if enabled in settings)
- Back button for navigation
- Responsive design
- Full light and dark mode support

**Visibility Controls**:
- Profile image (if `showProfileImage` is true)
- Location (if `showLocation` is true)
- Passion (if `showPassion` is true)
- Bio (if `showBio` is true)
- Link count (if `showLinkCount` is true)
- Click stats (if `showClickStats` is true)

**Link Display**:
- Only shows links with `visibility: 'public'`
- Links are clickable and open in new tab
- Shows platform name and destination URL
- Visual indicators for link visibility

**States**:
- **Loading**: Shows spinner while fetching data
- **Protected**: Shows "Profile Protected" message if profile is not public
- **Empty Links**: Shows message if no public links exist

**API Endpoints Used**:
- `POST /profile/getpublicprofile` - Get public profile data with settings

---

### 7. Settings (`/components/pages/Settings.jsx`)

**Route**: `/settings` (private, requires authentication)

**Purpose**: Manage privacy and visibility settings

**Features**:
- Profile visibility controls
- Link display settings
- Search & discovery settings
- Privacy settings
- Notification settings
- Keyword management for search
- Save settings functionality
- Full light and dark mode support

**Settings Sections**:

1. **Profile Visibility**:
   - Make Profile Public
   - Show in Search Results
   - Allow Profile View
   - Show Email
   - Show Location
   - Show Bio
   - Show Passion
   - Show Profile Image

2. **Link Display**:
   - Show Link Count
   - Show Click Statistics

3. **Search & Discovery**:
   - Allow Search
   - Show in Featured
   - Search Keywords (add/remove)

4. **Privacy**:
   - Show Analytics
   - Show Last Updated
   - Require Authentication

5. **Notifications**:
   - Email on New Click
   - Email on Profile View
   - Weekly Report

**API Endpoints Used**:
- `POST /settings/get` - Get user settings
- `POST /settings/update` - Update user settings

---

### 8. Documentation (`/components/Documentation.jsx`)

**Route**: `/doc` (public)

**Purpose**: Application documentation and guides

**Features**:
- Comprehensive documentation
- Interactive cards and animations
- Feature explanations
- Usage examples
- Responsive design

**Access**: Public (no authentication required)

---

### 9. AboutDeveloper (`/components/pages/AboutDeveloper.jsx`)

**Route**: `/about-developer` (public)

**Purpose**: Information about the developer

**Features**:
- Developer information
- Social links
- Project information
- Responsive design

**Access**: Public (no authentication required)

---

### 10. NotFound (`/components/pages/NotFound.jsx`)

**Route**: `*` (catch-all for 404 errors)

**Purpose**: 404 error page

**Features**:
- User-friendly error message
- Navigation options
- Responsive design

**Access**: Public

---

## Routing

Routes are defined in `/src/App.jsx`:

```javascript
<Routes>
  <Route path='/doc' element={<Documentation/>} />
  <Route path='/login' element={<AuthRoute><AuthPage /></AuthRoute>}/>
  <Route path='/verify' element={<VerificationPage />} />
  <Route path='/links' element={<PrivateRoute><LinkPage/></PrivateRoute>} />
  <Route path='/' element={<AuthRoute><HomePage/></AuthRoute>} />
  <Route path='/profile' element={<PrivateRoute><ProfilePage/></PrivateRoute>} />
  <Route path='/profile/:username' element={<ProfilePreview/>} />
  <Route path='/settings' element={<PrivateRoute><Settings/></PrivateRoute>} />
  <Route path='/home' element={<PrivateRoute><DashBoard /></PrivateRoute>} />
  <Route path='/verified' element={<VerifiedPage />} />
  <Route path='/reset_password' element={<PasswordReset />} />
  <Route path='/about-developer' element={<AboutDeveloper />} />
  <Route path='*' element={<NotFound />} />
</Routes>
```

### Route Types

- **Public Routes**: Accessible without authentication
  - `/`, `/doc`, `/about-developer`, `/profile/:username`, `/verify`, `/verified`, `/reset_password`

- **Private Routes**: Require authentication
  - `/home`, `/links`, `/profile`, `/settings`

- **Auth Routes**: Redirect authenticated users
  - `/`, `/login`

---

## Design Patterns

### Common Patterns Across Pages

1. **Animated Background**:
   ```javascript
   // Gradient orbs that follow mouse movement
   <motion.div
     className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
     animate={{
       x: mousePosition.x * 0.5 - 200,
       y: mousePosition.y * 0.5 - 200,
     }}
   />
   ```

2. **Glassmorphism Cards**:
   ```javascript
   className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
   ```

3. **Framer Motion Animations**:
   ```javascript
   const containerVariants = {
     hidden: { opacity: 0 },
     visible: {
       opacity: 1,
       transition: { staggerChildren: 0.1 }
     }
   };
   ```

4. **Loading States**:
   - Spinner animations
   - Disabled buttons during loading
   - Loading text indicators

5. **Error Handling**:
   - Toast notifications for errors
   - User-friendly error messages
   - Graceful fallbacks

---

## Light & Dark Mode

All pages support both light and dark modes using Tailwind's `dark:` prefix.

### Color Scheme

**Light Mode**:
- Background: `bg-white`, `bg-gray-50`
- Text: `text-gray-900`, `text-gray-700`
- Cards: `bg-white/80`, `bg-white/90`
- Borders: `border-gray-200`, `border-gray-300`

**Dark Mode**:
- Background: `dark:bg-gray-900`, `dark:bg-gray-800`
- Text: `dark:text-white`, `dark:text-gray-300`
- Cards: `dark:bg-gray-900/50`, `dark:bg-gray-800/50`
- Borders: `dark:border-gray-700`, `dark:border-gray-600`

### Implementation

Dark mode is managed via Redux (`store.page.darkMode`) and applied using:
- Tailwind's `dark:` variant
- System preference detection
- Manual toggle in navigation bar
- Persistent storage (localStorage)

### Best Practices

1. **Always provide dark mode variants** for all UI elements
2. **Test in both modes** during development
3. **Use semantic colors** (e.g., `text-gray-900 dark:text-white`)
4. **Maintain contrast ratios** for accessibility
5. **Use opacity for overlays** that work in both modes

---

## Component Dependencies

### Shared Components

- **Linkcard** (`/components/linkcard/Linkcard.jsx`): Displays individual link cards
- **Nav** (`/components/navbar/Nav.jsx`): Navigation bar with search
- **Footer** (`/components/footer/Footer.jsx`): Site footer
- **Notification** (`/components/notification/Notification.jsx`): Notification system

### Redux State

- **userSlice**: User data, links, authentication state
- **pageSlice**: Dark mode, edit link data, sidebar menu

### API Utilities

- **api.js** (`/utils/api.js`): Axios instance with base URL and credentials

---

## Responsive Design

All pages are fully responsive with breakpoints:
- **Mobile**: `< 640px` (sm)
- **Tablet**: `640px - 1024px` (md)
- **Desktop**: `> 1024px` (lg)

### Mobile Optimizations

- Search: Icon button on mobile, expands to input
- Navigation: Collapsible menu on mobile
- Forms: Stacked layout on mobile
- Cards: Full width on mobile
- Buttons: Full width or stacked on mobile

---

## Performance Considerations

1. **Lazy Loading**: Components loaded on demand
2. **Code Splitting**: Route-based code splitting
3. **Image Optimization**: Proper image formats and sizes
4. **Animation Performance**: GPU-accelerated animations
5. **Debouncing**: Search queries debounced (300ms)

---

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader support

---

## Notes

- All pages use consistent design language
- Animations enhance UX without being distracting
- Error states are handled gracefully
- Loading states provide user feedback
- Forms have real-time validation
- Toast notifications for user actions
