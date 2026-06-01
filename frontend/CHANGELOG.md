# Changelog

All notable changes to the frontend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2024-12-XX (Latest)

- **Comprehensive Analytics Dashboard Enhancement**: Complete analytics system overhaul
  - **Referrer-Based Analytics**: Added referrer category analytics (Direct, Search, Social, Internal, External)
  - **Top Referrer Sources**: Domain-level referrer tracking with detailed breakdowns
  - **Device Analytics**: Complete device type breakdown (Desktop, Mobile, Tablet)
  - **Browser Analytics**: Browser distribution tracking (Chrome, Safari, Firefox, Edge, etc.)
  - **Operating System Analytics**: OS-based analytics (Windows, macOS, Linux, iOS, Android)
  - **Hourly Distribution**: Hourly click patterns throughout the day
  - **Day of Week Analysis**: Day-of-week click distribution patterns
  - **Platform Performance**: Individual platform click metrics
  - **Link-Based Analytics**: Per-link performance tracking
  - **Multiple Chart Types**: Line, Bar, Area, and Pie charts for different data visualizations
  - **Customizable Time Ranges**: 7 days, 30 days, 90 days, 1 year, or all time
  - **Summary Cards**: Quick overview with Total Clicks, Profile Visits, Unique Countries, Top Referrer
  - **Detailed Breakdown Sections**: Referrer categories, device types, browsers, OS, geographic distribution, hourly patterns, day of week patterns
  - **Backend Integration**: Real MongoDB aggregation queries replacing mock data
  - **Data Validation**: Robust data validation with fallback logic for missing keys
  - **Chart Re-rendering**: Fixed chart updates when switching between metrics
  - **Immutable Array Handling**: Fixed "read-only array" errors by creating copies before sorting
  - **Full Theme Support**: Complete dark and light theme support with proper text contrast
  - **Responsive Design**: Mobile-optimized analytics dashboard with responsive text sizing

- **Responsive Text Sizing**: Implemented responsive typography across all pages
  - **Global Font Scaling**: Base font size scales from 14px (mobile) to 17px (desktop)
  - **Tailwind Configuration**: Added responsive font size scale to tailwind.config.js
  - **Custom Utility Classes**: Created responsive typography classes (.text-h1 to .text-h6, .text-body, .text-btn, etc.)
  - **Applied to Components**: Updated HomePage, HeroSection, AboutDeveloper, and other key pages
  - **Mobile Optimization**: Ensures optimal readability on all device sizes

- **Mobile Layout Improvements**: Enhanced mobile user experience
  - **Hero Section URL Input**: Fixed URL input box to stay on single row on mobile
    - Changed from flex-col to flex-row flex-nowrap
    - Added whitespace-nowrap to prevent text wrapping
    - Adjusted input width and spacing for mobile
    - Reduced text size on mobile for URL parts
  - **Mobile Menu Background**: Set solid background for mobile hamburger menu
    - Removed backdrop-blur for solid background
    - Added proper z-index (z-[9999]) to ensure visibility
    - Fixed backdrop overlay z-index (z-[9998])
    - Ensures menu is always visible above other elements

- **Theme Color Improvements**: Enhanced text colors for dark and light themes
  - **Analytics Page**: Complete text color overhaul for proper theme support
    - Updated all select dropdowns with proper light/dark backgrounds and text colors
    - Fixed card backgrounds from bg-white/10 to bg-white/80 for light mode visibility
    - Updated all text colors with dark mode variants (text-gray-900 dark:text-white, etc.)
    - Fixed table headers, labels, and body text for proper contrast
    - Updated progress bars and background elements for theme consistency
    - Enhanced icon colors and interactive elements
  - **Consistent Theme Support**: All text elements now properly adapt to both themes

### Added - 2024-12-XX (Previous)

- **Custom Subdomain Routing**: Revolutionary subdomain-based link format
  - Each user now gets their own custom subdomain (e.g., `username.allin1url.in`)
  - Hub link format: `https://username.allin1url.in` (replaces `https://allin1url.in/username`)
  - Platform links format: `https://username.allin1url.in/platform` (replaces `https://allin1url.in/username/platform`)
  - Environment-aware URL generation (dev: `username.localhost:8080`, prod: `username.allin1url.in`)
  - Updated all frontend components to use new subdomain format
  - Updated utility functions for consistent URL generation across app
  - All link displays, copy functions, and previews now use subdomain format
  - Backward compatible - legacy format still works for main domain access

### Added - 2024-12-XX (Previous)

- **Private Link Password Protection**: Complete password protection UI for private links
  - Password modal in Linkcard component for setting private link passwords
  - Password input with confirmation field
  - Visual indicators for link visibility status (public/unlisted/private)
  - Lock icon button on each link card for quick visibility changes
  - Dropdown menu for changing link visibility
  - Color-coded visibility badges (green/yellow/red)
  - Secure password handling with minimum length validation
  - Loading states during password setting

- **Settings Page**: Comprehensive settings page for privacy and permissions
  - Profile visibility controls (8 toggle options)
  - Link display settings (show link count, show click stats)
  - Search & discovery settings (allow search, featured, search keywords)
  - Privacy settings (show analytics, show last updated, require auth)
  - Notification settings (email on click, email on profile view, weekly report)
  - Modern UI with toggle switches and keyword management
  - Full light and dark mode support
  - Backend integration with proper state management

- **Profile Page Redesign**: Complete redesign of Profile page with modern UI
  - Added animated background with gradient orbs and grid pattern
  - Implemented glassmorphism design with backdrop blur effects
  - Enhanced profile picture upload with hover effects and loading states
  - Added form inputs with icons (User, Location, Heart, Edit)
  - Improved layout with two-column grid (profile picture on left, form on right)
  - Added smooth animations using Framer Motion
  - Added stat cards (Total Links, Total Clicks, Hub Page Status)
  - Added public profile information section
  - Full light and dark mode support

- **Settings Page**: New comprehensive settings page for privacy and permissions
  - Profile visibility controls (public, search, profile view, email, location, bio, passion, image)
  - Link display settings (show link count, show click stats)
  - Search & discovery settings (allow search, featured, search keywords)
  - Privacy settings (show analytics, show last updated, require auth)
  - Notification settings (email on click, email on profile view, weekly report)
  - Modern UI with toggle switches and keyword management
  - Full light and dark mode support

- **ProfilePreview Component**: Public profile view for visitors
  - Respects all visibility settings from user settings
  - Shows only public links (filters out unlisted/private)
  - Displays profile information based on permissions
  - Stats display (link count, clicks) based on settings
  - Responsive design with animations
  - Full light and dark mode support
  - Back button for navigation

- **Search Functionality**: User search in navigation bar
  - Real-time search with 300ms debounce
  - Search dropdown with user results
  - Click to visit profile from search results
  - Responsive design: icon on mobile, full input on desktop
  - Mobile search expands when icon is clicked
  - Loading spinner during search
  - Click-outside to close dropdown
  - Full light and dark mode support

- **Link Visibility Controls**: Per-link privacy settings
  - Added visibility field to Link model (public, unlisted, private)
  - Lock icon button on each link card
  - Dropdown menu to change visibility (public/unlisted/private)
  - Visual badge showing current visibility status
  - Color-coded visibility indicators (green/yellow/red)
  - Password protection for private links with secure modal
  - Password modal with confirmation field and validation
  - Helper methods for visibility checks
  - React Portal implementation for dropdown to prevent z-index issues

- **Database Models Enhancement**: Added timestamps and analytics support
  - Added `createdAt`, `updatedAt`, `deletedAt` to all models
  - Added `linkId` to Link model for foreign key relationships
  - Created LinkAnalytics model with comprehensive click tracking
  - Created UserSettings model for privacy and visibility controls
  - Added full timestamp tracking (date, time, timezone) in analytics
  - Comprehensive documentation for all models in `/backend/doc/`

- **Model Documentation**: Complete documentation for all database models
  - Created `/backend/doc/` folder with detailed model documentation
  - One documentation file per model (linkModel.md, userModel.md, etc.)
  - Each file includes field descriptions, enum values, usage examples
  - Added README.md in doc folder as index
  - Documentation explains why each field is required/optional

### Changed - 2024-12-XX
- **Link Model**: Added visibility and password fields
  - Added `visibility` field with enum: 'public', 'unlisted', 'private'
  - Added `password` field for unlisted link protection
  - Changed default visibility from 'private' to 'public'
  - Added helper methods: `isAccessible()`, `shouldShowInProfile()`, `shouldShowInSearch()`
  - Added indexes for visibility queries

- **UserSettings Model**: Refactored to remove redundant link visibility fields
  - Removed `links.defaultVisibility`, `links.publicLinks`, `links.unlistedLinks`
  - Removed methods: `isLinkPublic()`, `isLinkUnlisted()`, `getPublicLinks()`
  - Kept only display settings: `showLinkCount`, `showClickStats`
  - Link visibility now managed directly in Link model

- **Profile Page**: Added Preview button
  - Added "Preview" button to see how profile looks to visitors
  - Button only shows when not in edit mode
  - Navigates to public profile preview page

- **Navigation**: Enhanced with search functionality
  - Added search input with icon in navbar
  - Responsive: shows icon on mobile, full input on desktop
  - Mobile search expands when icon is clicked
  - Connected Settings link in profile menu

### Fixed - 2024-12-XX (Latest)

- **Private Link Password Modal Duplication**: Fixed duplicate password modal rendering
  - Removed duplicate password modal code block in Linkcard.jsx
  - Only one modal instance now renders when setting link to private
  - Eliminated overlapping overlays and duplicate forms

- **Private Link Redirection**: Fixed password verification and redirection flow
  - Implemented proper form submission for password verification
  - Fixed backend to decode username and source before verification
  - Added direct HTTP redirect after successful password verification
  - Fixed CSP and CORS issues for password prompt page
  - Improved error handling with user-friendly messages
  - Removed client-side fetch logic in favor of standard form submission

- **Linkcard Dropdown Visibility**: Fixed privacy button dropdown visibility issues
  - Implemented React Portal to render dropdown outside parent container
  - Fixed z-index conflicts with other page elements
  - Added dynamic position calculation with viewport bounds checking
  - Fixed dropdown positioning to use viewport-relative coordinates
  - Ensured dropdown is always visible and clickable

- **CreateBridge Copy Button**: Fixed form submission issue
  - Added `type="button"` to copy button to prevent form submission
  - Copy button no longer triggers platform validation warning
  - Fixed issue where clicking copy showed "first fill the platform" warning

- **Profile Picture Upload**: Fixed click handler issues
  - Restructured profile picture container to fix hover and click handlers
  - Removed blocking div that was preventing clicks
  - Added proper event handlers on main container
  - Added pointer-events-none to hover overlay

### Added - 2024-12-20
- **Logo Implementation**: Added LinkBridger logo across all navigation bars
  - Imported logo from `assets/logo.png` in all navbar components
  - Added rotating 3D flip animation to logo (20s infinite rotation)
  - Implemented round logo design with proper visibility in both light and dark modes
  - Added logo to `Nav.jsx`, `HomePage.jsx`, `Documentation.jsx`, and `AboutDeveloper.jsx`
  - Logo includes fallback image and error handling
  - Enhanced logo visibility with background and padding for better contrast

- **Footer Component Integration**: Added Footer component to HomePage
  - Integrated Footer component into HomePage for consistent site-wide navigation
  - Footer includes links, social media icons, and "Made with ❤️" section
  - Maintains consistent design language across all pages

- **About Developer Page Navigation**: Added navigation bar to AboutDeveloper page
  - Implemented full navigation bar with logo, links (Home, Documentation, Login), and dark mode toggle
  - Navigation bar matches design pattern from Documentation page
  - Includes animated background glow and smooth transitions
  - Properly integrated with page content and animations

- **Footer About Developer Button Animation**: Enhanced "About Developer" button with advanced animations
  - Added pulsing background glow effects (multiple layers with different opacities)
  - Implemented continuous text translation animation (subtle x-axis movement)
  - Added rotating and scaling rocket icon animation
  - Implemented shimmer effect that sweeps across the button
  - Button now has enhanced focus and visual appeal

- **Documentation Page Interactive Cards**: Enhanced documentation page with interactive card designs
  - Replaced static "Only the platform name changes" card with interactive MagneticCard
  - Added matrix-style falling character background (50 animated Katakana characters)
  - Implemented floating particles animation (8 particles with position, scale, opacity animations)
  - Added rotating sparkle emojis and animated gradient title text
  - Enhanced "Special Link Section" card with matrix rain effects and glowing black background
  - Cards now feature animated border glows, corner glows, and hover effects

### Changed - 2024-12-20
- **Dashboard Light Mode Background**: Updated Dashboard background for light mode
  - Changed light mode background from dark gradient (`from-slate-900 via-purple-900 to-slate-900`) to light gradient (`from-slate-50 via-blue-50 to-purple-50`)
  - Dark mode background remains unchanged (`dark:from-gray-950 dark:via-purple-950 dark:to-gray-950`)
  - Dashboard now matches LinkPage light mode styling for consistency

- **Content Component Light Mode**: Enhanced Content component for light mode visibility
  - Updated text colors: `text-gray-200` → `text-gray-700`, `text-gray-300` → `text-gray-600`
  - Updated gradient text colors to darker shades in light mode (`from-purple-600`, `to-pink-600`)
  - Enhanced icon colors with better opacity for light mode visibility
  - Updated decorative elements (gradient lines, dots) to darker colors in light mode
  - All changes maintain dark mode compatibility

- **CreateBridge Component Light Mode**: Completely redesigned for light mode visibility
  - Changed form background from `bg-white/10` to `bg-white/80` for better contrast
  - Updated all text colors: white text → `text-gray-700`/`text-gray-800` for light mode
  - Updated input fields: `bg-white/90` with `text-gray-900` and proper borders
  - Enhanced labels, icons, and helper text for light mode visibility
  - Updated edit mode indicator with light background and dark text
  - Redesigned generated link display with light backgrounds
  - Enhanced warning modal with light backgrounds and proper text contrast
  - Updated all buttons with appropriate colors for light mode
  - All changes maintain dark mode compatibility

- **API Configuration**: Updated API base URL configuration
  - Changed from hardcoded `http://localhost:8080` to environment variable-based configuration
  - Now uses `import.meta.env.VITE_API_URL || 'https://allin1url.in'`
  - Enabled `withCredentials: true` for proper cookie handling
  - Supports both development and production environments

### Fixed - 2024-12-20
- **VerificationPage Navigation Bug**: Fixed React Router navigation API misuse
  - Changed `navigate("/verified", { state: "verified" }, { replace: true })` to `navigate("/verified", { state: "verified", replace: true })`
  - Removed unused `replace` import from react-router-dom
  - Navigation now correctly uses React Router's API with options merged into second argument

- **Documentation Page SSR Safety**: Fixed potential server-side rendering issue
  - Added safety check for `window.innerHeight` access: `(typeof window !== 'undefined' ? window.innerHeight : 800)`
  - Prevents errors during SSR or hydration mismatches
  - Ensures animation works correctly in client-side React environments

- **Logo Visibility Issues**: Fixed logo visibility across all navigation bars
  - Removed `dark:brightness-0 dark:invert` classes that caused white-only display
  - Changed `object-cover` to `object-contain` for proper logo scaling
  - Added `bg-white/10 dark:bg-gray-800/20 p-1` for subtle background and padding
  - Logo now visible in both light and dark modes with proper contrast

- **Content Component Light Mode Text Visibility**: Fixed text visibility in light mode
  - Updated tagline text colors for better contrast
  - Enhanced gradient text colors for light mode readability
  - Improved icon and decorative element visibility

- **CreateBridge Component Light Mode Visibility**: Fixed all visibility issues in light mode
  - Fixed form background transparency for better readability
  - Updated all input field colors and borders
  - Fixed label and helper text visibility
  - Enhanced modal and button visibility
  - All text elements now properly visible in light mode

- **Dashboard Light Mode Consistency**: Fixed Dashboard background to match LinkPage
  - Updated Dashboard background gradient to match LinkPage light mode styling
  - Ensures visual consistency across all dashboard sections
  - Dark mode remains unchanged

### Removed - 2024-12-20
- **Unused Code Cleanup**: Removed unused imports and code
  - Removed unused `axios` import from `Profile.jsx`
  - Removed unused `resendOtp` from `AuthRoute.js`
  - Removed unused `setDarkMode` action from `pageSlice.js`
  - Removed unused `replace` import from `VerificationPage.jsx`
  - Removed unused imports from `DashBoard.jsx` (useEffect, useState, toast, useDispatch, useSelector, api, setLinks, Nav, Form)
  - Removed commented-out code and unused route handlers
  - Cleaned up `AnalysisPage.jsx` (deleted unused file)

### Added
- **Documentation Page Glowing Background Animations**: Added multiple glowing background animation effects:
  - **Pulsing Glow Rings**: 4 animated rings that pulse with different colors (purple, pink, blue, cyan) with blur and box-shadow effects
  - **Animated Glowing Waves**: Horizontal and vertical gradient waves that sweep across the background
  - **Radial Glow Effects**: 6 radial gradient orbs that pulse and move in circular patterns
  - **Glowing Grid Lines**: Animated grid pattern with glowing purple and pink lines that pulse in opacity
  - **Animated Glow Spots**: 8 glowing spots that scale, fade, and move in wave patterns across the background
  - All effects use smooth animations with varying durations and delays for a dynamic, layered glow effect

### Fixed
- **Documentation Page Example Links Section Card Animations**: Enhanced card animations and particle positioning:
  - Moved floating particles (dots) from card's top-left corner to be centered with the icon
  - Particles now orbit around the icon center when card is hovered
  - Added continuous glowing animation on each card using animated boxShadow that pulses
  - Particles are now positioned relative to the icon container, ensuring they stay centered with the icon

- **Documentation Page Example Links Section Card Layout**: Improved card layout and text display:
  - Centered icon horizontally with animated glow effect that moves with the icon
  - Restored continuous icon animation (rotate, scale, and float) that was previously working
  - Icon glow effect is now centered and moves along with the icon animation
  - Changed URL text to show full link without ellipsis by using tighter letter spacing (`letterSpacing: '-0.3px'`) and word spacing (`wordSpacing: '-1px'`)
  - Reduced font size to `text-[10px] md:text-xs` to ensure full link visibility
  - Centered all text elements (icon, platform name, URL) for better visual alignment

- **Documentation Page Example Links Section Animation Fix**: Fixed animation conflicts in the AnimatedLinkCard component:
  - Separated floating animation into a wrapper motion.div to prevent conflicts with initial animations
  - Fixed animate prop structure to ensure cards are visible and animate correctly
  - Improved inView detection margin from "-50px" to "-100px" for better trigger timing
  - Added proper component structure with nested motion wrappers
  - Ensured cards have minimum height (`min-h-[180px]`) and proper flex layout
  - Fixed title gradient to use bg-clip-text instead of inline styles for better compatibility

### Changed
- **Documentation Page Example Links Section Redesign**: Completely replaced the ContainerScroll component with a stunning new animated 3D card grid:
  - **3D Floating Cards**: Each platform link is now displayed in a beautiful 3D floating card with magnetic hover effects
  - **Individual Card Animations**: Each card features:
    - Continuous floating animation (up and down movement)
    - 3D rotation effects on hover with perspective transforms
    - Animated gradient backgrounds that pulse and morph
    - Shimmer effects that sweep across cards on hover
    - 6 floating particles that explode outward on hover
    - Platform-specific emoji icons with rotation animations
    - Pulsing glow effects that intensify on hover
    - Arrow indicators with animated movement
  - **Animated Title**: Gradient text title with moving background position animation
  - **Background Glow**: Pulsing background glow effect behind the card grid
  - **Grid Layout**: Responsive 3-column grid (1 column mobile, 2 columns tablet, 3 columns desktop)
  - **Color-Coded Cards**: Each platform has its own unique gradient color scheme
  - **Enhanced Bottom Note**: Animated note text with pulsing opacity
  - Removed ContainerScroll dependency and replaced with custom animated component
  - Cards use MagneticCard wrapper for 3D magnetic hover effects
  - All animations are optimized for performance with proper cleanup

### Fixed
- **Footer Vertical Height Reduction**: Significantly reduced the vertical height of the Footer component:
  - Reduced main padding from `py-8 md:py-10` to `py-4 md:py-6`
  - Reduced grid gap from `gap-8 md:gap-12` to `gap-6 md:gap-8`
  - Reduced logo margin from `mb-6` to `mb-3`
  - Reduced heading margins from `mb-4` to `mb-2`
  - Reduced divider margin from `my-8` to `my-4`
  - Reduced bottom section gap from `gap-6` to `gap-4`
  - Reduced "Made with Love" margin from `mt-6` to `mt-4`
  - Changed description line-height from `leading-relaxed` to `leading-normal` for more compact text
- **Footer Light Mode Visibility and Spacing**: Fixed footer visibility issues and reduced excessive spacing:
  - Fixed Footer component text colors for light mode: changed headings from `text-white` to `text-gray-900 dark:text-gray-200`
  - Fixed footer links from `text-gray-400` to `text-gray-700 dark:text-gray-500` with proper hover states
  - Fixed footer description and copyright text colors for light mode visibility
  - Removed duplicate footer element in Documentation.jsx (removed redundant `<motion.footer>`)
- **Documentation Page Spacing Optimization**: Significantly reduced spacing throughout the page for a more compact layout:
  - Reduced section margins from `mb-12 md:mb-16` to `mb-6 md:mb-8`
  - Reduced heading margins from `mb-12` to `mb-6 md:mb-8`
  - Reduced feature cards spacing from `space-y-8 md:space-y-12` to `space-y-4 md:space-y-6`
  - Reduced various `mb-8` values to `mb-4 md:mb-6` for tighter spacing
  - Reduced hero section spacing (`mb-6` to `mb-4`)
- **Documentation Page Light Mode Text Visibility**: Fixed multiple text visibility issues in light mode:
  - Changed Platform Support section text from `text-gray-300` to `text-gray-700` for better contrast
  - Fixed Troubleshooting section heading from `text-white` to `text-gray-900 dark:text-white`
  - Fixed FAQ question text from `text-white` to `text-gray-900 dark:text-gray-200`
  - Improved subtitle text visibility by changing `text-gray-400` to `text-gray-600` in multiple locations (CTA subtitle and Platform Support footer text)
  - All text elements now have proper dark mode variants for optimal visibility in both themes

### Added
- **Documentation Page Complete Animation Redesign**: Completely redesigned the Documentation page with cutting-edge animations and visual effects:
  - **Floating Particle System**: Added 30+ floating particles throughout the page with dynamic colors (purple, pink, blue, cyan) that continuously animate with varying sizes, delays, and durations
  - **3D Card Transforms**: Implemented `MagneticCard` component with 3D perspective transforms that respond to mouse movement, creating immersive magnetic hover effects
  - **Enhanced Feature Cards**: Redesigned feature cards with:
    - 3D rotation effects on hover (rotateY, rotateZ)
    - Shimmer effects that sweep across cards
    - Floating particles that appear on hover (6 particles per card)
    - Animated gradient backgrounds that pulse and morph
    - Icon rotation animations with glow effects
    - Image parallax effects with 3D transforms
    - Text animations with scale and position changes
  - **Dynamic Background Enhancements**:
    - Morphing gradient orbs that scale and change opacity continuously
    - 5 additional floating orbs with random movement patterns
    - Rotating gradient rings (3 rings) with conic gradients
    - Animated grid with wave opacity effects
  - **Enhanced Navigation**:
    - Logo with continuous 3D rotation (20s infinite rotation)
    - Animated gradient text with moving background position
    - Text glow effects with pulsing opacity
    - Navigation links with magnetic hover and slide animations
    - Dark mode toggle with rotation and glow effects
    - Get Started button with shimmer, gradient animation, and particle effects
  - **3D Introduction Section**:
    - Magnetic card with 3D hover effects
    - Animated border glow that sweeps around the card
    - Floating particles within the section
    - Text with animated gradient background position
    - Text shadow glow effects
    - Animated bold text with pulsing text shadows
    - URL highlighting with color animation
  - **Enhanced CTA Button**:
    - 3D magnetic hover effects with perspective transforms
    - Animated gradient background with moving position
    - Shimmer effect that continuously sweeps across
    - Rocket icon with rotation and vertical movement
    - Glow effect that pulses on hover
    - 8 floating particles that explode outward on hover
  - **Parallax Effects**: Multiple elements use parallax scrolling and mouse-tracking for depth
  - **Morphing Gradients**: Background gradients continuously morph with scale and opacity changes
  - **Wave Animations**: Grid and border elements use wave-like opacity animations
  - All animations are optimized for performance with proper cleanup and throttling

### Changed
- **HomePage Dark Mode Background Reverted**: Reverted the dark mode main background gradient from `dark:from-gray-950 dark:via-purple-950 dark:to-gray-950` back to the original `dark:from-slate-900 dark:via-purple-900 dark:to-slate-900` to restore the original dark mode appearance. Light mode improvements remain unchanged.
- **HomePage Card Edge Animations Finalized**: Implemented final animation styles for card borders:
  - **"Trusted by Thousands" section**: Rotating conic gradient border (3s rotation) with pulsing glow effect (3s cycle) and 8 animated dots/orbs moving around the border perimeter continuously
  - **"Perfect for Everyone" section**: Added 8 animated dots/orbs moving around the border perimeter of each benefit card
  - **"Powerful Features" section**: Kept pulsing glow border animation, made all cards consistent height using flexbox layout (`h-full flex flex-col`) to prevent odd-looking card size variations
  - Dots animation: 8 dots move clockwise around card perimeter with staggered delays (0.15s between each), pulsing scale and opacity effects
- **HomePage Animated Edge Borders on Cards**: Added continuous rotating edge animations to cards in "Trusted by Thousands" and "Powerful Features" sections:
  - Implemented rotating conic gradient borders that continuously animate around card edges
  - Uses Framer Motion's `animate` with `rotate` from 0 to 360 degrees
  - 3-second rotation duration with infinite repeat and linear easing
  - Gradient colors: purple (#9333ea), pink (#ec4899), blue (#3b82f6)
  - Animation runs automatically without mouse interaction
  - Applied to both statistics cards and feature cards
- **HomePage Statistics and Features Sections Dark Mode Redesign**: Enhanced the "Trusted by Thousands" and "Powerful Features" sections specifically for dark mode with:
  - Added gradient backgrounds (`dark:from-purple-950/40 dark:via-slate-900/60 dark:to-blue-950/40` for stats, `dark:from-slate-900/60 dark:via-purple-950/40 dark:to-pink-950/40` for features)
  - Decorative background blur orbs for visual depth
  - Enhanced card designs with gradient backgrounds (`dark:from-gray-800/80 dark:via-gray-900/80 dark:to-gray-800/80`)
  - Improved borders with purple glow effects (`dark:border-purple-500/30` with `dark:shadow-[0_0_20px_rgba(147,51,234,0.15)]`)
  - Gradient text effects for headings and numbers in dark mode
  - Hover effects with enhanced shadows and border glows
  - Icon drop shadows for better visibility
  - Gradient overlays on hover for interactive feedback
  - Light mode remains completely unchanged

### Fixed
- **AuthPage Axios Error Status Check**: Fixed the 409 conflict detection in `handleSignUp` function. Changed `err.status === 409` to `err.response?.status === 409` to correctly access the HTTP status code from axios error objects. This ensures username conflict handling (redirecting to login) works properly.
- **Documentation Page DOM Nesting Warning**: Fixed React DOM nesting warning where `<div>` (from `FlipWords` component) was appearing as a descendant of `<p>`. Changed the parent `<motion.p>` to `<motion.div>` to allow proper nesting of block-level elements.
- **AuthPage Signup Button Validation**: Fixed the signup button's `disabled` condition to properly prevent form submission with invalid usernames. Changed from `disabled={loading || (username.length >= 5 && !isAvailable)}` to `disabled={loading || username.length < 5 || (username.length >= 5 && !isAvailable)}`. The button is now correctly disabled when username length is less than 5 characters, preventing invalid form submissions.

### Added
- **Documentation Page Navigation Menu with Theme Toggle**: Added a comprehensive navigation menu to the Documentation page (`/doc`) with:
  - Logo and brand name (clickable to navigate home)
  - Navigation links (Home, Login) - visible on desktop
  - Dark mode toggle button with improved visibility in light mode (`bg-white/90`, `text-gray-800`, `border-gray-300`)
  - Get Started button with responsive text
  - Consistent styling with `bg-white/95 dark:bg-gray-900/50` navbar background
  - Proper z-index and backdrop blur for glassmorphism effect

### Changed
- **Documentation Page Theme Consistency**: Updated `Documentation.jsx` to match `LinkPage`'s dark mode and light mode styling. Removed explicit background gradient (now inherits from Dashboard), updated all text colors to use `text-gray-900 dark:text-white` for headings and `text-gray-700 dark:text-gray-400` for body text, updated navigation bar to `bg-white/95` in light mode, and adjusted example links container to use darker backgrounds in light mode for better visibility.

### Enhanced
- **Documentation Page Text Visibility Improvements**: Enhanced text visibility throughout the Documentation page:
  - Updated body text colors from `text-gray-700` to `text-gray-800` for better contrast in light mode
  - Improved FAQ chevron icon colors: `text-purple-600 dark:text-purple-400` for better visibility
  - Enhanced example check circle colors: `text-green-600 dark:text-green-400`
  - Updated subtitle text from `text-gray-400` to `text-gray-600` for better readability
  - Fixed use case section heading colors to match theme consistency
  - All text now properly adapts to both light and dark modes with improved contrast ratios

### Added - 2024-12-19
+- **HomePage Background Gradients for Card Effects**: Added subtle gradients to section backgrounds to enhance card visual appeal
  - Statistics section: Added gradient background (`from-purple-50/80 via-pink-50/80 to-blue-50/80`) in light mode
  - Features section: Added gradient background (`from-blue-50/80 via-purple-50/80 to-pink-50/80`) in light mode
  - Benefits section: Added gradient background (`from-blue-50/80 via-indigo-50/80 to-purple-50/80`) in light mode
  - Hero section: Updated gradient to lighter tones (`from-purple-50/60 via-pink-50/60 to-blue-50/60`) in light mode
  - Statistics cards: Updated to `bg-white/90` with purple-tinted borders (`border-purple-200/60`) for better contrast
  - Features cards: Updated to `bg-white/90` with purple-tinted borders (`border-purple-200/60`) for better contrast
  - Added hover effects on card borders for better interactivity
  - Reduced radial gradient opacity in hero section for subtler effect
  - All gradients use low opacity (80% or 60%) to maintain readability while adding visual depth
  - Dark mode remains unchanged with transparent backgrounds

+- **HomePage Light Mode Visibility Improvements**: Improved visibility in light mode with lighter backgrounds and better text contrast
  - Changed main background from dark (`from-slate-900 via-purple-900 to-slate-900`) to light (`from-slate-50 via-blue-50 to-purple-50`) in light mode
  - Statistics section: Added light background (`bg-white/80`) in light mode with backdrop blur
  - Features section: Added light gradient background (`from-blue-50 via-purple-50 to-pink-50`) in light mode
  - Benefits section: Added light background (`bg-white/80`) in light mode with backdrop blur
  - Updated all text colors: headings use `text-gray-800` in light mode, body text uses `text-gray-600`
  - Statistics cards: Changed from glassmorphism to solid white background (`bg-white`) in light mode
  - Features cards: Changed from glassmorphism to solid white background (`bg-white`) in light mode
  - Updated navigation bar: Changed to white background (`bg-white/95`) in light mode for better visibility
  - Updated dark mode toggle button: Changed to white background (`bg-white/90`) with dark text in light mode
  - Updated hero section background: Lighter gradient (`from-purple-100/50 via-pink-100/50 to-blue-100/50`) in light mode
  - All sections now have proper contrast and visibility in both light and dark modes
  - Dark mode remains unchanged with dark backgrounds and light text

+- **HomePage Dark Mode Toggle Button**: Added dark mode/light mode toggle button to HomePage
  - Added dark mode toggle button in the navigation header (similar to Nav component)
  - Imported `useDispatch` and `toggleDarkMode` from Redux
  - Imported `MdDarkMode` and `MdLightMode` icons from react-icons
  - Toggle button positioned between logo and navigation links
  - Button has hover effects (scale and rotate) and smooth transitions
  - Shows sun icon (MdLightMode) in dark mode and moon icon (MdDarkMode) in light mode
  - Button styled with glassmorphism design matching the application theme
  - HomePage now defaults to dark mode background (`from-slate-900 via-purple-900 to-slate-900`)
  - Updated all text colors to work properly in both light and dark modes
  - Updated navigation bar background to dark (`bg-gray-800/95`) in light mode for consistency
  - All sections (Statistics, Features, Benefits) now use transparent backgrounds to inherit dark theme
  - Updated all text colors: headings use `text-white dark:text-gray-200`, body text uses `text-gray-300 dark:text-gray-400`
  - Cards use glassmorphism with `bg-white/10` backgrounds for proper contrast
  - Maintains responsive design and all animations

### Fixed - 2024-12-19
+- **Nav Component Complete Redesign**: Completely redesigned the navigation bar with modern interactive design
  - Implemented glassmorphism design with backdrop blur and gradient borders
  - Added interactive mouse-tracking gradient orb background
  - Redesigned logo section with hover effects and gradient text
  - Enhanced navigation links with active state indicators using Framer Motion `layoutId`
  - Added icons to navigation links (FaHome, FaLink, FaBook)
  - Redesigned dark mode toggle with smooth animations and hover effects
  - Enhanced notification button with animated badge and modern dropdown
  - Redesigned profile menu with glassmorphism, icons (FaUser, FaCog, FaSignOutAlt), and smooth animations
  - Improved mobile menu with slide-in animation and modern styling
  - Added AnimatePresence for smooth transitions on dropdowns and mobile menu
  - Consistent gradient color scheme (purple, pink, blue) matching the rest of the application
  - Improved accessibility with proper ARIA labels and focus states

+- **Footer Component Complete Redesign**: Completely redesigned the footer with modern interactive design
  - Implemented glassmorphism design with backdrop blur and gradient borders
  - Added interactive mouse-tracking gradient orbs background
  - Added animated grid pattern for visual depth
  - Redesigned brand section with hover effects and gradient text
  - Enhanced footer links with hover animations (translate-x effect) and rocket icons
  - Redesigned social media icons with hover effects, glassmorphism cards, and smooth animations
  - Added "Made with ❤️" section with animated heart icon
  - Improved responsive design with better grid layout
  - Added Framer Motion animations for scroll-triggered reveals
  - Consistent gradient color scheme matching the application theme
  - Improved visual hierarchy and spacing

+- **Notification Component Complete Redesign**: Completely redesigned the notification component with improved text and styling
  - Enhanced notification cards with glassmorphism design and gradient borders
  - Added icons (FaChartLine, FaLink, FaMousePointer) for better visual communication
  - Improved text: Changed from "X clicks on Y" to "X New Click(s)" with platform badge
  - Added empty state with friendly message and icon
  - Implemented staggered entry animations using Framer Motion
  - Added hover effects and smooth transitions
  - Enhanced visual hierarchy with gradient badges and progress indicators
  - Better spacing and typography for improved readability
  - Consistent design language with the rest of the application

+- **Nav Component Light Mode Visibility**: Improved navigation links and navbar visibility in light mode
  - Changed navbar background from `bg-white/10` to `bg-gray-800/95` in light mode for better visibility
  - Updated navbar border from `border-white/20` to `border-gray-700/50` in light mode
  - Desktop nav links: Changed inactive links from `text-gray-300` to `text-gray-900 dark:text-gray-300` for better contrast
  - Desktop nav links: Updated active link text to `text-white dark:text-white` for consistency
  - Mobile sidebar: Changed background from `bg-white/10` to `bg-gray-800/95` in light mode
  - Mobile sidebar links: Updated to `text-white dark:text-gray-300` for better visibility
  - Maintained all dark mode styles unchanged

+- **Notification and Profile Menu Z-Index and Light Mode Visibility**: Fixed overlapping issues and improved visibility
  - Increased z-index from `z-10` to `z-[100]` for both notification dropdown and profile menu to appear above other elements
  - Changed notification dropdown background from `bg-white/10` to `bg-gray-800/95` in light mode (95% opacity for better visibility)
  - Changed profile menu background from `bg-white/10` to `bg-gray-800/95` in light mode
  - Updated borders from `border-white/20` to `border-gray-700/50` in light mode for better definition
  - Updated notification item backgrounds to `bg-gray-700/30` in light mode for better contrast
  - Changed all text colors to white/light colors for readability on dark backgrounds in light mode
  - Maintained all dark mode styles unchanged
  - Fixed overlapping with Create Bridge button and other page elements

+- **Notification and Profile Menu Light Mode Text Visibility**: Improved text visibility in light mode
  - Notification empty state: Changed `text-gray-300` to `text-gray-900` and `text-gray-400` to `text-gray-700`
  - Notification items: Changed count text from `text-white` to `text-gray-900 dark:text-white`
  - Notification badge: Changed `text-purple-300` to `text-purple-600 dark:text-purple-300` for better contrast
  - Notification destination: Changed `text-gray-400` to `text-gray-700` for better readability
  - Profile menu dropdown: Changed username from `text-white` to `text-gray-900 dark:text-white`
  - Profile menu welcome text: Changed `text-gray-400` to `text-gray-700 dark:text-gray-400`
  - Profile menu items: Changed `text-gray-200` to `text-gray-900 dark:text-gray-200` for better visibility
  - Profile menu sign out: Changed `text-red-300` to `text-red-600 dark:text-red-300` for better contrast
  - Notification dropdown header: Changed title from `text-white` to `text-gray-900 dark:text-white`
  - Maintained all dark mode styles unchanged

+- **LinkPage Light Mode Transparent Link Containers**: Made link containers more transparent and less dark
  - Reduced link container opacity from `bg-gray-800/90` to `bg-gray-800/40` in light mode for better transparency
  - Reduced border opacity from `border-gray-700/50` to `border-gray-700/30` for lighter appearance
  - Link text remains white for readability on semi-transparent dark containers
  - Maintained all dark mode styles unchanged
  - Applied to Hub Link container and Personalized Link containers in Linkcard components

+- **LinkPage Light Mode Text Visibility**: Improved text visibility in light mode for LinkPage and Linkcard components
  - Changed text colors from `text-white` to `text-gray-900 dark:text-white` for headings and important text
  - Changed `text-gray-300` to `text-gray-700` for body text in light mode
  - Changed `text-gray-400` to `text-gray-700` for labels and secondary text in light mode
  - Maintained all dark mode styles unchanged
  - Improved contrast and readability across all text elements in light mode

+- **CreateBridge and LinkPage Excessive Gap**: Fixed excessive spacing between CreateBridge and LinkPage components
  - Removed `min-h-screen` from both components since they're sections within Dashboard, not standalone pages
  - Removed duplicate background containers (Dashboard now provides the background)
  - Changed padding from `min-h-screen p-4` to `py-8 md:py-12 px-4` for more reasonable section spacing
  - Components now flow seamlessly as sections within the Dashboard without forced full-screen heights
  - Maintains all interactive background effects while eliminating excessive gaps

+- **Content.jsx Design Consistency**: Fixed visual inconsistency between Content, CreateBridge, and LinkPage components
  - Updated Dashboard background to match dark theme (`from-slate-900 via-purple-900 to-slate-900`)
  - Removed duplicate background container from Content.jsx to allow seamless flow with Dashboard
  - Standardized gradient orbs pattern to match CreateBridge and LinkPage (purple, pink, blue with /20 opacity)
  - Updated animated grid pattern to match other components
  - Adjusted text colors and icon opacity to work consistently across all sections
  - All three sections (Content, CreateBridge, LinkPage) now appear as one cohesive page with seamless transitions
  - Maintains interactive mouse-tracking background effects across all sections

+- **linktree.ejs Profile Picture Centering**: Fixed profile picture alignment
  - Profile picture was appearing on the left instead of being horizontally centered
  - Added `text-align: center` to `.profile` class in styles.css
  - Profile picture wrapper (inline-block) now centers properly within the profile card
  - Also centers username, bio, and other text content for better visual balance

+- **linktree.ejs CSS Linter Error**: Fixed red line/linter error on EJS template syntax
  - CSS linter was complaining about EJS syntax `<%= index * 0.1 %>` inside inline style attribute
  - Changed from inline style with EJS to data attribute `data-delay`
  - Updated JavaScript to read `data-delay` attribute and apply animation delay programmatically
  - Eliminates CSS linter false positive while maintaining the same functionality
  - Animation delay is now applied both via CSS `animationDelay` and JavaScript `setTimeout` timing

+- **SVG Attribute Warnings (Nav & Footer)**: Fixed React DOM property warnings for SVG attributes
  - Converted kebab-case SVG attributes to camelCase as required by React
  - Fixed `stroke-width` → `strokeWidth` in Nav.jsx (3 occurrences)
  - Fixed `stroke-linecap` → `strokeLinecap` in Nav.jsx (3 occurrences)
  - Fixed `stroke-linejoin` → `strokeLinejoin` in Nav.jsx (3 occurrences)
  - Fixed `fill-rule` → `fillRule` in Footer.jsx (4 occurrences)
  - Eliminates all React warnings about invalid DOM properties in SVG elements

+- **Content Component Icon Import Error**: Fixed `FaSparkles` import error
  - `FaSparkles` is not exported from `react-icons/fa`
  - Replaced with `HiSparkles` from `react-icons/hi2` to match usage in other components
  - Resolves "The requested module does not provide an export named 'FaSparkles'" error

+- **AnimatedCounter IntersectionObserver Conflict**: Fixed frozen counter display when props change
  - Removed redundant internal `IntersectionObserver` that conflicted with parent's `useInView` hook
  - The component was using both `statsInView` (from parent) and its own observer, causing issues when `end` or `duration` props changed
  - When props changed, the effect would re-run, disconnect the observer, but the new observer wouldn't fire because `useInView` already triggered with `once: true`
  - Now uses `statsInView` directly to trigger animation, eliminating the conflict
  - Added `hasAnimatedRef` to track animation state and properly restart animation when props change
  - Animation now correctly restarts when `end` or `duration` changes, even if element is already in view
  - Prevents frozen counter display on subsequent prop updates

+- **Content Component Complete Redesign**: Completely redesigned the Content component with modern interactive design
  - Added interactive mouse-tracking gradient orbs that follow cursor movement
  - Implemented animated grid pattern background with parallax effect
  - Redesigned logo/title with gradient text effect and glowing backdrop
  - Added floating decorative icons (FaLink, FaSparkles, FaRocket) with pulse animations
  - Enhanced taglines with gradient text highlights and improved typography
  - Added scroll-triggered animations using Framer Motion's `useInView` hook
  - Implemented smooth spring animations for all elements
  - Added decorative wave effect at the bottom
  - Improved responsive design for all screen sizes
  - Matches the modern glassmorphism and interactive style of other redesigned pages
  - Maintains dark mode support with proper color transitions

+- **State Update on Unmounted Component (AuthPage)**: Fixed React warnings about state updates on unmounted components
+  - Added `isMountedRef` to track component mount status
+  - Modified `handleSignUp` and `handleLogin` to check `isMountedRef.current` before calling `setLoading(false)` in finally block
+  - Set loading to false before navigation in success paths to prevent finally block from executing after unmount
+  - Added early returns after navigation to prevent finally block execution
+  - Properly handles cleanup in useEffect to set `isMountedRef.current = false` on unmount
+  - Eliminates React warnings about memory leaks and state updates on unmounted components

+- **React Hooks Rules Violation (Documentation)**: Fixed hooks being called inside map loop
+  - `useRef()` and `useInView()` were being called inside `features.map()` loop, violating React's Rules of Hooks
+  - Created separate `FeatureCard` component that properly uses hooks at the top level
+  - Each feature card now has its own component instance with proper hook usage
+  - Maintains all animations and functionality while following React best practices
+  - Prevents potential errors when number of features changes between renders

+- **CreateBridge Component Complete Redesign**: Completely redesigned the bridge creation/editing component with modern animations
+  - Added interactive mouse-tracking gradient orbs that follow cursor movement
+  - Implemented glassmorphism design with backdrop blur effects throughout
+  - Enhanced form with modern input fields featuring icons and better visual hierarchy
+  - Redesigned header with gradient icon and animated title
+  - Added edit mode indicator with animated badge
+  - Improved input fields with icon indicators (Link icon for platform, Globe icon for URL)
+  - Enhanced action buttons with gradient backgrounds and loading states
+  - Redesigned generated link display with animated entrance and gradient background
+  - Modernized warning modal with glassmorphism, gradient backgrounds, and better visual hierarchy
+  - Added smooth animations for form elements using Framer Motion
+  - Improved visual feedback for all interactions
+  - Fully responsive design optimized for all screen sizes
+  - Better spacing, typography, and color scheme
+  - Maintained all original functionality (create, edit, warning modal, etc.)

+- **LinkPage Complete Redesign**: Completely redesigned the user's link management page with modern animations
+  - Added interactive mouse-tracking gradient orbs that follow cursor movement
+  - Implemented glassmorphism design with backdrop blur effects throughout
+  - Enhanced header section with gradient text and modern typography
+  - Redesigned hub link card with icon, better layout, and hover effects
+  - Added stats summary cards showing total links, total clicks, and hub page status
+  - Improved empty state with animated icon and call-to-action button
+  - Enhanced link cards with staggered animations on load
+  - Fully responsive design optimized for all screen sizes
+  - Smooth scroll animations using Framer Motion
+  - Modern gradient buttons with hover effects
+  - Animated grid background pattern for depth

+- **Linkcard Component Redesign**: Completely redesigned individual link cards
+  - Modern glassmorphism card design with gradient borders
+  - Redesigned click counter with gradient icon and better visual hierarchy
+  - Enhanced action buttons with gradient backgrounds and hover animations
+  - Added "Open" button to directly visit the link
+  - Improved mobile responsiveness with separate mobile click counter
+  - Better spacing and typography throughout
+  - Smooth hover effects with scale and translate animations
+  - Gradient text for platform names
+  - Modern copy button with gradient background

+- **Public Linktree Page Fixes and Enhancements**: Fixed issues and enhanced the public linktree page (linktree.ejs)
+  - **Fixed Mouse Tracking Performance**: Improved mouse tracking with requestAnimationFrame and percentage-based calculations
+    - Changed from direct pixel calculations to percentage-based for better responsiveness
+    - Implemented RAF loop for smooth animations instead of updating on every mousemove
+    - Added proper cleanup to prevent memory leaks
+    - Better performance on all devices
+  - **Fixed Image Loading**: Added fallback image with SVG placeholder if profile image fails to load
    - Shows user's initial letter in a gradient circle if image is missing
    - Prevents broken image icons
+  - **Fixed Empty State**: Added proper handling for when user has no links
+    - Shows friendly message instead of empty space
+    - Styled empty state with dashed border
+  - **Enhanced Script Execution**: Improved JavaScript with proper DOM ready checks
+    - Wrapped code in IIFE for better scope management
+    - Added proper event listener cleanup
+    - Prevents errors if elements don't exist
+  - **Added Ripple Effect**: Added click ripple animation on buttons for better feedback
+    - Creates visual feedback when links are clicked
+    - Smooth animation that fades out
+  - **Improved Accessibility**: Added better accessibility features
+    - Added focus states for keyboard navigation
    - Added proper alt text for images
+    - Added rel="noopener noreferrer" for security
+    - Added meta description for SEO
+  - **Touch Device Optimizations**: Added specific styles for touch devices
+    - Removed hover effects on touch devices
+    - Better active states for mobile
+    - Improved tap targets
+  - **Performance Improvements**: Added will-change properties for better animation performance
+    - Smooth scrolling enabled
+    - Better browser optimization hints
+  - **Enhanced Responsive Design**: Improved mobile experience
+    - Better spacing on very small screens
+    - Adjusted font sizes and letter spacing
+    - Improved button sizes for touch
+  - **Better Error Handling**: Added null checks and error handling throughout
+    - Prevents JavaScript errors if elements are missing
+    - Graceful degradation

+- **Public Linktree Page Redesign**: Completely redesigned the public linktree page (linktree.ejs)
+  - Modern glassmorphism design with backdrop blur effects
+  - Interactive mouse-tracking gradient orbs (purple, blue, orange) that follow cursor
+  - Animated grid background pattern for depth
+  - Enhanced profile picture with glowing effect and pulse animation
+  - Gradient username text with animated underline
+  - Modern link buttons with hover effects, scale animations, and shimmer effect
-  - Smooth fade-in animations for all elements
+  - Smooth fade-in animations for all elements with staggered delays
+  - Arrow indicators on buttons that animate on hover
+  - Heart animation in footer
+  - Fully responsive design for mobile, tablet, and desktop
+  - Updated typography with Poppins and Montserrat fonts
+  - Modern CSS with smooth transitions and animations
+  - Improved accessibility and user experience

+- **Added Missing Features to HomePage and Documentation**: Added two important features that were missing
+  - **All Links at One Place**: Added feature highlighting the hub link functionality
+    - Users can access all their links by visiting https://allin1url.in/username (without platform name)
+    - Creates a beautiful landing page showing all profiles in one place
+    - Perfect for sharing in bios, resumes, and business cards
+    - Added to HomePage features section with FaHome icon
+    - Updated in Documentation page with enhanced description
+  - **Real-Time Email Notifications**: Added email notification feature
+    - Get instant email notifications every time someone visits your links
+    - Stay informed about who's checking out your profiles in real-time
+    - Perfect for tracking engagement and knowing when potential clients or employers view your links
+    - Added to HomePage features section with FaEnvelope icon
+    - Added to Documentation page features section
+    - Mentioned in "How It Works" section for better visibility

+- **Documentation Page Complete Redesign**: Completely redesigned documentation page with modern animations and interactive elements
+  - Added interactive mouse-tracking gradient orbs that follow cursor movement
+  - Implemented glassmorphism design with backdrop blur effects throughout
+  - Enhanced all sections with smooth scroll animations using Framer Motion
+  - Redesigned feature cards with gradient icons, hover effects, and scale animations
+  - Added interactive FAQ section with smooth expand/collapse animations
+  - Enhanced "How It Works" section with step-by-step cards and icons
+  - Redesigned testimonials with star ratings and hover effects
+  - Added gradient buttons with hover animations
+  - Improved visual hierarchy with gradient text headings
+  - Added animated grid background pattern for depth
+  - Enhanced all links with hover effects and smooth transitions
+  - Redesigned future enhancements section with gradient cards
+  - Improved spacing, typography, and responsive design
+  - Added icon components from react-icons for better visual appeal
+  - Maintained all original content and functionality
+  - Fully responsive design optimized for all screen sizes
+  - **NEW: Use Cases Section**: Added comprehensive use cases for different user types
+    - Job Seekers, Content Creators, Developers, Students, Businesses, and Freelancers
+    - Each use case includes description, icon, gradient styling, and example applications
+    - Interactive cards with hover effects and smooth animations
+  - **NEW: Best Practices Section**: Added best practices guide for optimal LinkBridger usage
+    - Six key best practices with icons and detailed explanations
    - Tips on username selection, platform naming, link updates, analytics, testing, and sharing
+  - **NEW: Platform Support Section**: Added comprehensive list of supported platforms
+    - Visual grid showcasing 30+ supported platforms (LinkedIn, GitHub, Instagram, etc.)
+    - Interactive platform cards with hover effects
+    - Emphasizes that any platform with a URL can be supported
+  - **NEW: Security & Privacy Section**: Added security and privacy information
+    - Four key security features: Secure Authentication, Privacy First, HTTPS Encryption, Secure Infrastructure
+    - Gradient icon cards with detailed explanations
+    - Builds user trust and confidence
+  - **NEW: Troubleshooting Section**: Added comprehensive troubleshooting guide
+    - Six common issues with detailed solutions
+    - Color-coded icons for different issue types
+    - Contact information for additional support
+    - Interactive cards with hover effects

+- **Mouse Position Calculation Bug**: Fixed incorrect mouse position calculation in HomePage.jsx
+  - Previous calculation `(e.clientX / window.innerWidth - 0.5) * 20` produced values in -10 to 10 pixel range
+  - These small/negative values caused incorrect gradient positioning when used in CSS `radial-gradient`
+  - Changed to percentage-based calculation: `(e.clientX / window.innerWidth) * 100` for x and `(e.clientY / window.innerHeight) * 100` for y
+  - Updated gradient to use percentages (`${mousePosition.x}% ${mousePosition.y}%`) instead of pixels
+  - Gradient now correctly follows mouse cursor across entire viewport (0% to 100%)
+  - Fixed backgroundPosition animation to use percentages with proper bounds checking
+  - Eliminates off-screen gradient placement and ensures smooth mouse tracking

+- **State Update on Unmounted Component**: Fixed memory leak warnings in AuthPage.jsx
+  - Removed `setLoading(false)` calls before `navigate()` in both `handleSignUp` and `handleLogin`
+  - After navigation, component unmounts, causing finally block's `setLoading(false)` to update unmounted component
+  - Now only the finally block handles `setLoading(false)`, preventing state updates on unmounted components
+  - Moved form state resets (`setLoginEmail`, `setLoginPassword`) before navigation to ensure they execute
+  - Eliminates React warnings about memory leaks and state updates on unmounted components

+- **AuthPage Complete Redesign**: Completely redesigned login/signup page with modern animations
+  - Removed old CSS-based design that had z-index conflicts preventing input clicks
+  - Created new modern design with glassmorphism effects and gradient backgrounds
+  - Added interactive mouse-tracking gradient orbs that follow cursor movement
+  - Implemented smooth form transitions with Framer Motion AnimatePresence
+  - Added animated toggle buttons with layoutId for smooth tab switching
+  - Modern input fields with icons, focus states, and proper z-index hierarchy
+  - Gradient buttons with hover animations and loading states
+  - Animated grid background pattern for depth
+  - Feature pills showcasing key benefits
+  - Fully responsive design for all screen sizes
+  - All input fields now properly clickable and functional
+  - Maintained all original authentication logic and functionality
+  - Added password visibility toggles with eye icons
+  - Username availability indicator with animated icons
+  - Smooth entrance animations for all form elements

+- **Mouse Position Throttling Logic Bug**: Fixed incorrect throttle timestamp update in RAF callback
+  - `lastUpdateTime` was being updated inside RAF callback, causing continuous unnecessary RAF scheduling
+  - When RAF was scheduled, `lastUpdateTime` remained old, so subsequent mousemove events would see `now - lastUpdateTime < throttleDelay` as true
+  - This caused multiple RAFs to be scheduled unnecessarily, even though `rafId === null` check prevented duplicates
+  - Fixed by updating `lastUpdateTime` immediately when scheduling RAF, not inside the callback
+  - Now subsequent mousemove events correctly see we're still within throttle window
+  - Prevents unnecessary RAF scheduling and improves performance

+- **Mouse Position Throttling Bug**: Fixed stale mouse position in RAF callback
+  - RAF callback was capturing event coordinates from first mousemove event via closure
+  - When multiple mousemove events fired before RAF executed, it used stale coordinates
+  - Added `latestMousePositionRef` to store latest position, updated on every mousemove
+  - RAF callback now reads from ref at execution time, ensuring latest position is used
+  - Eliminates lag in mouse tracking gradient effect
+  - Mouse tracking now smoothly follows actual cursor movement

+- **AuthPage Functionality**: Fixed login and signup forms not working properly
+  - Added Font Awesome CDN link to index.html for icon support
+  - Changed button types from "button" to "submit" for proper form submission
+  - Added `onSubmit` handlers to forms instead of `onClick` on buttons
+  - Added form validation with `required` and `minLength` attributes
+  - Added `disabled` state to buttons during loading to prevent multiple submissions
+  - Improved user experience with proper form validation and loading states
+  - Fixed email input types to use `type="email"` for better validation

+- **AuthPage CSS Overlap Issue**: Fixed login page overlapping HomePage
+  - Scoped all AuthPage CSS classes to `.auth-container` to prevent global style conflicts
+  - Added `isolation: isolate` to create new stacking context for AuthPage
+  - Updated all `.container` references in App.css to `.auth-container` to prevent affecting other pages
+  - Scoped form, input-field, panel, button, and animation styles to AuthPage only
+  - Prevents AuthPage styles from leaking to HomePage and other components
+  - Ensures proper z-index isolation between pages
+
+- **AnimatedCounter Performance Issue**: Fixed component recreation on every parent re-render
+  - Moved `AnimatedCounter` component outside of `HomePage` to prevent recreation on re-renders
+  - `AnimatedCounter` was being recreated on every `mousePosition` state update, causing unmount/remount cycles
+  - This interrupted animations and canceled pending `requestAnimationFrame` calls
+  - Component is now stable and only re-renders when its own props change
+  - Added `statsInView` as a prop instead of using closure to maintain proper dependency tracking
+  - Optimized mouse position updates with throttling (16ms delay, ~60fps) to reduce unnecessary re-renders
+  - Added `passive: true` to mouse event listener for better performance
+  - Proper cleanup of `requestAnimationFrame` in mouse handler cleanup function
+
+- **AnimatedCounter Memory Leak**: Fixed memory leak in AnimatedCounter component
+  - Added proper cleanup for `requestAnimationFrame` using `cancelAnimationFrame`
+  - Added `isMountedRef` to prevent state updates on unmounted components
+  - Stored animation frame ID in `animationFrameRef` for proper cancellation
+  - Prevents React warnings about updating state on unmounted components
+  - Eliminates memory leaks when component unmounts during animation
+
+- **Twitter Icon Import Error**: Fixed import error for Twitter icon
+  - Changed `SiTwitter` to `SiX` from `react-icons/si` (Twitter rebranded to X)
+  - Resolves "does not provide an export named 'SiTwitter'" error
+  - Updated to use correct export name for X/Twitter icon
+
+### Added - 2024-12-19
+- **Interactive Home Page**: Completely redesigned landing page with modern animations and investor-friendly content
+  - Hero section with typewriter effect and gradient text animations
+  - Flip words animation for platform names (LinkedIn, GitHub, Instagram, etc.)
+  - Mouse-tracking background effects for interactive experience
+  - Animated scroll indicator with smooth transitions
+  - Platform icons showcase with hover animations
+  - Statistics section with animated counters (10,000+ users, 50,000+ links, 1M+ clicks, 99% uptime)
+  - Interactive feature cards with gradient icons and hover effects
+  - Benefits section for three target audiences (Professionals, Creators, Developers)
+  - Final CTA section with gradient background
+  - Navigation header for non-authenticated users with logo and action buttons
+  - Fully responsive design optimized for mobile, tablet, and desktop devices
+    - Mobile-first approach with breakpoints: sm (640px), md (768px), lg (1024px)
+    - Responsive text sizes: text-2xl sm:text-3xl md:text-4xl lg:text-5xl
+    - Flexible grid layouts: grid-cols-2 md:grid-cols-4 for stats, md:grid-cols-2 lg:grid-cols-3 for features
+    - Responsive padding and spacing: px-4 sm:px-6 lg:px-8, gap-4 sm:gap-6 md:gap-8
+    - Mobile-optimized buttons: full-width on mobile, auto-width on larger screens
+    - Responsive navigation: logo text hidden on very small screens, compact button sizes
+    - Touch-friendly interactive elements with appropriate sizing for mobile devices
+  - Dark mode support throughout all sections
+  - Smooth scroll animations using Framer Motion
+  - Performance optimized with `useInView` hooks for scroll-triggered animations
+
+- **Enhanced Typography**: Upgraded font system for better visual appeal
+  - Added Poppins font family for body text (weights 300-900)
+  - Added Montserrat font family for headings (weights 300-900)
+  - Maintained Inter font as fallback
+  - Improved font weights and letter spacing for better readability
+  - Enhanced typography hierarchy across the application
+
+- **Routing Updates**: Updated App.jsx to use new HomePage as landing page
+  - Changed root route (`/`) to display new interactive HomePage
+  - HomePage now serves as the primary landing experience for non-authenticated users
+  - Maintains existing Documentation page at `/doc` route
+
+### Changed - 2024-12-19
- **Edit Link Functionality**: Redesigned edit link feature to reuse CreateBridge component
  - Removed prompt dialog for editing links
  - Edit button now populates CreateBridge form with existing link data
  - Platform field is now editable during edit mode (both platform and destination can be changed)
  - Added custom warning modal dialog when platform name is changed (old link becomes invalid)
  - Replaced browser prompt with professional styled modal component
  - Modal includes warning icon, color-coded old/new links, and clear action buttons
  - Warning only appears for platform changes, not destination changes
  - Modal shows old and new link URLs with visual distinction (red for old, green for new)
  - Fully styled with dark mode support and smooth transitions
  - Button text changes from "Create New" to "Update Bridge" in edit mode
  - Added "Cancel" button to exit edit mode
  - Added visual indicator showing link ID being edited
  - Automatic scroll to CreateBridge form when edit is triggered
  - Reuses same form component for both create and update operations
  - Platform changes update the source state in real-time during editing

### Added - 2024-12-19
- **Dark Mode Support**: Complete dark mode implementation with toggle button in navbar
  - Added dark mode toggle button with sun/moon icons in navigation bar
  - Dark mode preference persisted in localStorage
  - Smooth transitions between light and dark modes
  - Dark mode class applied to document root for Tailwind CSS dark mode support

- **Font Improvements**: Professional typography enhancements
  - Upgraded Inter font family with extended weight range (300-800)
  - Added font smoothing for better rendering across browsers
  - Improved line heights and letter spacing for better readability
  - Enhanced typography hierarchy for headings and paragraphs

- **Redux State Management**: Added edit link state management
  - Added `editLinkData` state to `pageSlice.js` for managing edit mode
  - Added `setEditLinkData` and `clearEditLinkData` actions
  - Enables communication between Linkcard and CreateBridge components

- **Component Dark Mode Styling**: All components updated with dark mode support
  - App.jsx: Dark mode initialization and background gradients
  - Nav.jsx: Dark mode toggle button and dark mode styling
  - Content.jsx: Dark mode background and text colors
  - CreateBridge.jsx: Dark mode form styling and input fields
  - LinkPage.jsx: Dark mode card and text styling
  - Linkcard.jsx: Dark mode card backgrounds and text colors
  - Documentation.jsx: Complete dark mode support for all sections
  - Footer.jsx: Dark mode styling for all footer elements
  - NotFound.jsx: Dark mode background and text styling
  - Profile.jsx: Dark mode form and input styling
  - Notification.jsx: Dark mode notification styling

- **Image Visibility**: Enhanced image visibility in dark mode
  - Added brightness and contrast filters for images in dark mode
  - Logo inversion in dark mode for better visibility
  - Profile images with ring borders for better definition
  - Feature images with adjusted brightness/contrast

### Changed - 2024-12-19
- **Default Theme**: Changed default theme from system preference to light mode
  - Updated `pageSlice.js` to default to `false` (light mode)
  - Updated `App.jsx` initialization to default to light mode instead of system preference

- **Font Configuration**: Enhanced font system
  - Updated `fonts.css` with comprehensive font styling rules
  - Added font smoothing and improved typography defaults
  - Standardized font weights and line heights across the application

- **Tailwind Configuration**: Added dark mode support
  - Enabled `darkMode: 'class'` in `tailwind.config.js`
  - Configured for class-based dark mode switching

- **App.css**: Added dark mode styles for authentication forms
  - Dark mode styles for input fields
  - Dark mode styles for form titles
  - Dark mode styles for placeholders and icons

### Fixed - 2024-12-19
- **Grammar and Spelling**: Fixed multiple grammatical errors throughout the application
  - "Linkdin" → "LinkedIn" (multiple occurrences)
  - "linkdin" → "linkedin" (lowercase)
  - "Persionalized" → "Personalized"
  - "Plateform" → "Platform"
  - "linktree is live live on" → "linktree is live on"
  - "forgot password?" → "Forgot password?"
  - "you have no any new clicks" → "You have no new clicks"
  - "mark as read" → "Mark as Read"
  - "bridge has been made successfully" → "Bridge has been created successfully"
  - "Link Bridger" → "LinkBridger" (consistent branding)
  - "No links found. add new link..." → "No links found. Add a new link..."
  - "Codeforce" → "Codeforces"
  - Fixed various capitalization and punctuation issues

- **Link Edit Functionality**: Fixed broken edit link feature
  - Updated `handleEditLink` function in `Linkcard.jsx` to properly handle link editing
  - Added prompt dialog for editing destination URL
  - Fixed undefined variable reference (`tempArr`)
  - Improved error handling and user feedback

- **Link Update State Management**: Fixed silent failure when updating deleted links
  - Added check to verify link exists in Redux state before updating
  - If link is missing from state (e.g., deleted during edit), the updated link is now added back to the array
  - Added user warning notification when link is restored during update
  - Prevents silent data loss when link state is out of sync
  - Ensures successful backend updates are always reflected in frontend state

- **Error Handling Logic**: Fixed operator precedence bug in authentication error handling
  - Fixed incorrect condition `if(!err.status===401)` which evaluated as `(!err.status) === 401` (always false)
  - Changed to `if(err.response?.status !== 401)` to correctly skip error toasts for 401 authentication errors
  - Added proper optional chaining for `err.response?.status` since axios errors have status in response object
  - Prevents showing error toasts for expected 401 (unauthorized) errors during token verification

- **Form Validation**: Fixed submit button type to enable HTML5 validation
  - Changed submit button from `type="button"` to `type="submit"` in CreateBridge component
  - Added `onSubmit={handleSubmit}` handler to form element (was missing, causing form not to submit)
  - Enables native HTML5 form validation for required fields (platform and destination)
  - Prevents form submission with empty fields, reducing unnecessary API calls
  - Added `disabled` attribute to buttons during loading state to prevent multiple submissions
  - Form now properly validates inputs before calling `handleSubmit` function

- **Warning Modal and Update Functionality**: Fixed issues with link update and warning modal
  - Fixed missing `onSubmit` handler on form element that prevented form submission
  - Moved warning modal outside form element to prevent form submission interference
  - Added `type="button"` to modal buttons to prevent accidental form submission
  - Added `.trim()` to platform comparison and data handling for better reliability
  - Fixed update functionality for both platform and destination changes
  - Warning modal now properly displays when platform is changed
  - Update now works correctly whether platform is changed or only destination is changed
  - Fixed stale data issue: `handleConfirmUpdate` now uses current form state instead of `pendingUpdate`
  - Prevents outdated values from being applied if user modifies form while modal is open
  - Added input field disabling while modal is open to prevent confusion and ensure data consistency
  - Fixed platform change detection: Normalize platform value when populating from `editLinkData`
  - Ensures consistent case comparison even if database has mixed-case platform names (e.g., "LinkedIn")
  - Prevents false positive warnings when only destination is being updated
  - Platform value is now normalized to lowercase when form is populated, ensuring accurate change detection
  - Fixed duplicate API calls: Added `disabled={loading}` to "Continue Anyway" button in warning modal
  - Prevents multiple clicks and duplicate update requests while update is in progress
  - Added loading state text ("Updating...") to provide user feedback
  - Also disabled Cancel button during loading to prevent modal closure during update
  - Added disabled styling (opacity and cursor) for better UX
  - Fixed race condition: Made `handleConfirmUpdate` async and added `await` to `performUpdate` call
  - Prevents modal from closing and state from clearing before API call completes
  - Ensures proper sequencing: modal closes only after update completes
  - Matches the pattern used in `handleSubmit` for consistency
  - Prevents race conditions where toast messages and state updates may not display correctly
  - Fixed submit button state: Added `showWarningModal` to disabled condition
  - Submit button now disabled when warning modal is displayed, preventing duplicate form submissions
  - Prevents bypassing platform change validation by clicking submit while modal is open
  - Also disabled Cancel button during warning modal for consistency
  - Added disabled styling classes for better visual feedback
  - Fixed loading state bug: Added `finally` block to `performUpdate` function
  - Ensures loading state is always reset, even if API returns 200 with `success: false`
  - Added explicit handling for successful HTTP responses with `success: false`
  - Prevents UI from getting stuck in loading state
  - Matches the pattern used in create link function for consistency
  - User now sees error message when update fails, instead of silent failure
  - Fixed duplicate loading state reset: Removed redundant `setLoading(false)` from create link success path
  - Create link function now only resets loading in `finally` block, matching edit path pattern
  - Added explicit handling for create link responses with `success: false`
  - Ensures consistent behavior between create and update operations
  - Prevents unnecessary duplicate state updates

- **Dark Mode Initialization**: Removed redundant localStorage read
  - Removed duplicate `useEffect` in `App.jsx` that was re-reading localStorage and dispatching `setDarkMode`
  - Dark mode is already correctly initialized from localStorage in `pageSlice.js` via `getInitialDarkMode()`
  - Eliminates redundant state updates and prevents potential visual flash on initial page load
  - Removed unused `setDarkMode` import from `App.jsx`
  - Dark mode class is now applied once based on the correctly initialized Redux state

- **Accessibility**: Fixed label-input associations
  - Fixed `htmlFor` attribute mismatch in AuthPage signup form
  - Removed incorrect `aria-describedby` attribute
  - Ensured proper label-input associations for checkboxes

- **Dark Mode Visibility**: Fixed text and image visibility issues in dark mode
  - All text now has proper contrast in dark mode
  - Images are visible with appropriate filters
  - Background gradients updated for dark mode
  - Form inputs have proper dark mode styling

### Enhanced - 2024-12-19
- **User Experience**: Improved overall design consistency
  - Consistent color transitions across all components
  - Improved hover states and interactive elements
  - Better visual hierarchy and spacing
  - Enhanced button styles with dark mode support

- **Component Styling**: Enhanced visual design
  - Improved card designs with dark mode support
  - Better form styling with dark mode variants
  - Enhanced button gradients and hover effects
  - Improved spacing and layout consistency

## [Previous Versions]

### Initial Release
- Basic authentication system
- Link management functionality
- User profile management
- Documentation page
- Responsive design with Tailwind CSS

