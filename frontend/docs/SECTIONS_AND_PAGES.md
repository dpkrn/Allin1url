# Sections and Pages Documentation

This document provides comprehensive information about the page structure, section components, and how they are organized in the All in1 url frontend application.

## Table of Contents

1. [Overview](#overview)
2. [Section Components](#section-components)
3. [Page Structure](#page-structure)
4. [Page-by-Page Documentation](#page-by-page-documentation)
5. [Section Parameters Reference](#section-parameters-reference)

---

## Overview

The frontend is organized with a modular structure where each page has its own folder containing:
- The main page component (e.g., `HomePage.jsx`)
- A `sections/` subfolder containing page-specific section components
- An `index.js` file for easy imports

### Directory Structure

```
frontend/src/components/pages/
├── HomePage/
│   ├── HomePage.jsx
│   └── sections/
│       ├── HeroSection.jsx
│       ├── FeaturesSection.jsx
│       ├── StatisticsSection.jsx
│       ├── BenefitsSection.jsx
│       ├── CTASection.jsx
│       └── index.js
├── Documentation/
│   ├── Documentation.jsx
│   └── sections/
│       ├── FeaturesSection.jsx
│       └── index.js
└── [Other pages...]
```

---

## Section Components

### 1. HeroSection

**Location:** `pages/HomePage/sections/HeroSection.jsx`

**Purpose:** The main hero/landing section with animated background, typewriter effect, and call-to-action buttons.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `words` | Array | `[]` | Array of word objects for TypewriterEffect. Each object: `{text: string, className: string}` |
| `flipWords` | Array | `[]` | Array of strings for FlipWords animation (e.g., `["LinkedIn", "GitHub"]`) |
| `description` | String | `""` | Main description text displayed below the heading |
| `highlightText` | String | `""` | Highlighted text shown below description (purple gradient) |
| `ctaText` | String | `"Get Started Free"` | Primary CTA button text |
| `ctaAction` | Function | `null` | Custom function for primary CTA. If null, navigates to `/login` |
| `secondaryCtaText` | String | `"Learn More"` | Secondary CTA button text (optional) |
| `secondaryCtaAction` | Function | `null` | Custom function for secondary CTA. If null, navigates to `/doc` |
| `platforms` | Array | `[]` | Array of platform objects: `{name: string, icon: JSX, color: string}` |
| `showScrollIndicator` | Boolean | `true` | Whether to show the animated scroll indicator |
| `className` | String | `""` | Additional CSS classes |
| `mousePosition` | Object | `{x: 0, y: 0}` | Mouse position for interactive background (percentage: 0-100) |
| `isAuthenticated` | Boolean | `false` | Whether user is authenticated (affects padding) |

**Example Usage:**
```jsx
<HeroSection
  words={[
    { text: "Transform", className: "text-5xl font-bold" },
    { text: "Your", className: "text-5xl font-bold" }
  ]}
  flipWords={["LinkedIn", "GitHub", "Instagram"]}
  description="All in1 url transforms your social media presence."
  highlightText="One link to rule them all."
  ctaText="Get Started Free"
  platforms={[
    { name: "LinkedIn", icon: <SiLinkedin />, color: "text-blue-600" }
  ]}
  mousePosition={mousePosition}
  isAuthenticated={isAuthenticated}
/>
```

---

### 2. StatisticsSection

**Location:** `pages/HomePage/sections/StatisticsSection.jsx`

**Purpose:** Displays animated statistics with rotating gradient borders and animated counters.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `stats` | Array | `[]` | Array of stat objects: `{value: number, suffix: string, label: string, icon: JSX}` |
| `title` | String | `"Trusted by Thousands"` | Main heading text |
| `subtitle` | String | `"Join the community..."` | Subtitle text below heading |
| `className` | String | `""` | Additional CSS classes |
| `sectionRef` | Ref | `null` | React ref for scroll tracking (optional) |

**Example Usage:**
```jsx
<StatisticsSection
  stats={[
    { value: 10000, suffix: "+", label: "Active Users", icon: <FaUsers /> },
    { value: 50000, suffix: "+", label: "Links Created", icon: <FaLink /> }
  ]}
  title="Trusted by Thousands"
  subtitle="Join the community of professionals"
  sectionRef={statsRef}
/>
```

**Features:**
- Animated counters that count up when section comes into view
- Rotating gradient borders with glow effects
- Responsive grid layout (2 columns on mobile, 4 on desktop)
- Dark mode support with gradient text effects

---

### 3. FeaturesSection

**Location:** `pages/HomePage/sections/FeaturesSection.jsx` and `pages/Documentation/sections/FeaturesSection.jsx`

**Purpose:** Displays feature cards in either grid or list layout with animated borders and hover effects.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `features` | Array | `[]` | Array of feature objects (see Feature Object below) |
| `title` | String | `"Powerful Features"` | Main heading text |
| `subtitle` | String | `"Everything you need..."` | Subtitle text (optional, can be empty string) |
| `className` | String | `""` | Additional CSS classes |
| `sectionRef` | Ref | `null` | React ref for scroll tracking |
| `layout` | String | `"grid"` | Layout type: `"grid"` or `"list"` |

**Feature Object Structure:**
```javascript
{
  icon: JSX | Component,           // Icon component or JSX element
  title: string,                   // Feature title
  description: string,             // Feature description (or use 'desc')
  desc: string,                    // Alternative to 'description'
  color: string,                   // Tailwind gradient classes (e.g., "from-blue-500 to-cyan-500")
  gradient: string,                // Alternative to 'color'
  delay: number                    // Animation delay (optional, for grid layout)
}
```

**Example Usage (Grid Layout):**
```jsx
<FeaturesSection
  features={[
    {
      icon: <FaLink className="w-8 h-8" />,
      title: "Personalized Links",
      description: "Create memorable URLs...",
      color: "from-blue-500 to-cyan-500",
      delay: 0.1
    }
  ]}
  title="Powerful Features"
  subtitle="Everything you need to manage your social presence"
  layout="grid"
/>
```

**Example Usage (List Layout):**
```jsx
<FeaturesSection
  features={[
    {
      icon: FaLink,  // Component reference
      title: "Personalized Smart Links",
      desc: "Generate easy-to-remember links...",
      gradient: "from-blue-500 to-cyan-500"
    }
  ]}
  title="Key Features"
  subtitle=""
  layout="list"
/>
```

**Features:**
- Supports both grid (3 columns) and list (vertical) layouts
- Animated pulsing glow borders
- Handles both React component icons and JSX icon elements
- Normalizes `description`/`desc` and `color`/`gradient` automatically
- Dark mode support with gradient overlays

---

### 4. BenefitsSection

**Location:** `pages/HomePage/sections/BenefitsSection.jsx`

**Purpose:** Displays benefit cards with gradient backgrounds and checkmark lists.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `benefits` | Array | `[]` | Array of benefit objects (see Benefit Object below) |
| `title` | String | `"Perfect for Everyone"` | Main heading text |
| `subtitle` | String | `"Whether you're a professional..."` | Subtitle text |
| `className` | String | `""` | Additional CSS classes |
| `sectionRef` | Ref | `null` | React ref for scroll tracking |

**Benefit Object Structure:**
```javascript
{
  title: string,                   // Benefit category title
  points: string[],               // Array of benefit points (displayed with checkmarks)
  icon: JSX,                      // Icon element
  gradient: string                // Tailwind gradient classes (e.g., "from-blue-600 to-cyan-600")
}
```

**Example Usage:**
```jsx
<BenefitsSection
  benefits={[
    {
      title: "For Professionals",
      points: [
        "Build your brand with consistent, memorable links",
        "Professional appearance on resumes and business cards"
      ],
      icon: <FaUsers className="w-12 h-12" />,
      gradient: "from-blue-600 to-cyan-600"
    }
  ]}
  title="Perfect for Everyone"
  subtitle="Whether you're a professional, creator, or developer"
  sectionRef={benefitsRef}
/>
```

**Features:**
- Gradient background cards with animated checkmarks
- Responsive grid (1 column mobile, 2 tablet, 3 desktop)
- Staggered animations on scroll
- White text on gradient backgrounds

---

### 5. CTASection (Call-to-Action Section)

**Location:** `pages/HomePage/sections/CTASection.jsx`

**Purpose:** A prominent call-to-action section with gradient background and centered CTA button. Used to encourage users to take action (sign up, get started, etc.).

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | `"Ready to Transform Your Links?"` | Main heading text (large, white) |
| `subtitle` | String | `"Join thousands of professionals..."` | Subtitle text (white with opacity) |
| `ctaText` | String | `"Get Started Now"` | Button text |
| `ctaAction` | Function | `null` | Custom click handler. If null, navigates to `/login` |
| `className` | String | `""` | Additional CSS classes |

**Example Usage:**
```jsx
<CTASection
  title="Ready to Transform Your Links?"
  subtitle="Join thousands of professionals who trust All in1 url"
  ctaText="Get Started Now"
/>
```

**With Custom Action:**
```jsx
<CTASection
  title="Start Your Journey Today"
  subtitle="Create your first personalized link in minutes"
  ctaText="Create Account"
  ctaAction={() => {
    // Custom logic
    navigate('/signup');
  }}
/>
```

**Features:**
- Purple-pink-blue gradient background
- Large, bold white text
- Prominent white button with hover effects
- Fully responsive typography
- Animated entrance on scroll

---

## Page Structure

### How Sections Are Organized

Each page follows this pattern:

1. **Page Folder:** `pages/[PageName]/`
2. **Main Component:** `[PageName].jsx`
3. **Sections Folder:** `sections/` containing page-specific section components
4. **Index File:** `sections/index.js` for easy imports

### Import Pattern

```jsx
// In HomePage.jsx
import {
  HeroSection,
  FeaturesSection,
  StatisticsSection,
  BenefitsSection,
  CTASection
} from './sections';
```

---

## Page-by-Page Documentation

### 1. HomePage

**Location:** `pages/HomePage/HomePage.jsx`

**Route:** `/` (public, requires non-authentication)

**Sections Used:**
1. **HeroSection** - Main landing section
2. **StatisticsSection** - Animated statistics
3. **FeaturesSection** - Feature cards (grid layout)
4. **BenefitsSection** - Benefit cards for different user types
5. **CTASection** - Final call-to-action

**Data Structures:**

```javascript
// Words for typewriter effect
const words = [
  {
    text: "Transform",
    className: "text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
  },
  // ... more words
];

// Flip words for animation
const flipWords = ["LinkedIn", "GitHub", "Instagram", "Portfolio", "YouTube", "Twitter"];

// Features array
const features = [
  {
    icon: <FaLink className="w-8 h-8" />,
    title: "Personalized Links",
    description: "Create memorable URLs...",
    color: "from-blue-500 to-cyan-500",
    delay: 0.1
  },
  // ... more features
];

// Benefits array
const benefits = [
  {
    title: "For Professionals",
    points: ["Point 1", "Point 2"],
    icon: <FaUsers className="w-12 h-12" />,
    gradient: "from-blue-600 to-cyan-600"
  },
  // ... more benefits
];

// Statistics array
const stats = [
  { value: 10000, suffix: "+", label: "Active Users", icon: <FaUsers /> },
  // ... more stats
];

// Platforms array
const platforms = [
  { name: "LinkedIn", icon: <SiLinkedin />, color: "text-blue-600" },
  // ... more platforms
];
```

**Special Features:**
- Navigation bar (only when not authenticated)
- Mouse position tracking for interactive background
- Dark mode toggle in navigation
- Scroll indicators

---

### 2. Documentation

**Location:** `pages/Documentation/Documentation.jsx`

**Route:** `/doc` (public)

**Sections Used:**
1. **FeaturesSection** - Key features (list layout)

**Data Structures:**

```javascript
// Features array (for Documentation page)
const features = [
  {
    img: "easy-to-remember.webp",  // Image path (not used in FeaturesSection)
    title: "Personalized Smart Links",
    desc: "Generate easy-to-remember links...",
    icon: FaLink,  // Component reference
    gradient: "from-blue-500 to-cyan-500"
  },
  // ... more features
];
```

**Special Features:**
- Uses FeaturesSection with `layout="list"` for vertical feature display
- Contains many custom sections (Introduction, How It Works, etc.) that are not yet componentized
- Animated background with particles
- 3D card effects with magnetic hover

**Note:** This page has many hardcoded sections that could be extracted into reusable components in the future.

---

## Section Parameters Reference

### Quick Reference Table

| Section | Required Props | Optional Props | Layout Options |
|---------|---------------|----------------|----------------|
| **HeroSection** | `words`, `flipWords` | `description`, `highlightText`, `ctaText`, `platforms`, `mousePosition`, `isAuthenticated` | N/A |
| **StatisticsSection** | `stats` | `title`, `subtitle`, `sectionRef` | N/A |
| **FeaturesSection** | `features` | `title`, `subtitle`, `layout`, `sectionRef` | `"grid"` or `"list"` |
| **BenefitsSection** | `benefits` | `title`, `subtitle`, `sectionRef` | N/A |
| **CTASection** | None | `title`, `subtitle`, `ctaText`, `ctaAction` | N/A |

---

## Best Practices

### 1. Creating New Sections

When creating a new section component:

1. Place it in the appropriate page's `sections/` folder
2. Export it from `sections/index.js`
3. Accept props with sensible defaults
4. Support both light and dark modes
5. Make it responsive
6. Use Framer Motion for animations
7. Document all props in JSDoc comments

### 2. Interchanging Content

To interchange content between pages:

1. **Same Section, Different Data:**
   ```jsx
   // In HomePage.jsx
   <FeaturesSection features={homeFeatures} layout="grid" />
   
   // In Documentation.jsx
   <FeaturesSection features={docFeatures} layout="list" />
   ```

2. **Reusing Sections:**
   - Copy the section component to the target page's `sections/` folder
   - Or create a shared sections folder if truly reusable
   - Update imports accordingly

3. **Customizing Sections:**
   - All sections accept `className` prop for additional styling
   - Most accept custom action handlers
   - Use props to customize titles, subtitles, and content

### 3. Data Format Compatibility

**FeaturesSection** automatically normalizes:
- `description` or `desc` → always use `description` internally
- `color` or `gradient` → always use `color` internally
- Component icons or JSX icons → handles both

This allows easy data interchange between pages.

---

## Section Component Details

### CTASection Explained

**What is CTASection?**

CTASection (Call-to-Action Section) is a reusable component designed to prompt users to take a specific action, typically at the end of a page or after presenting key information. It features:

- **Gradient Background:** Purple-pink-blue gradient that stands out
- **Large Typography:** Bold, attention-grabbing text
- **Prominent Button:** White button with arrow icon
- **Responsive Design:** Adapts to all screen sizes
- **Animation:** Smooth entrance animation when scrolled into view

**When to Use:**
- End of landing pages
- After feature presentations
- Before closing a page
- To encourage sign-ups or conversions

**Customization:**
- Change title and subtitle text
- Customize button text
- Add custom click handlers
- Add additional CSS classes

---

## Migration Guide

If you need to move sections between pages:

1. **Copy the section file** to the target page's `sections/` folder
2. **Update import paths** in the section component (e.g., `../ui/` → `../../ui/`)
3. **Update the page component** to import from the new location
4. **Update `sections/index.js`** to export the section
5. **Test all functionality** including animations and interactions

---

## Future Enhancements

Potential sections that could be extracted:

- **HowItWorksSection** - Step-by-step process display
- **TestimonialsSection** - User testimonials carousel
- **FAQSection** - Accordion-style FAQ
- **PlatformSection** - Platform icons showcase
- **PricingSection** - Pricing tiers (if applicable)

---

## Troubleshooting

### Common Issues

1. **Import Path Errors:**
   - Check relative path depth (count `../` needed)
   - Verify file exists at target location
   - Check `sections/index.js` exports

2. **Section Not Rendering:**
   - Verify props are passed correctly
   - Check data array structure matches expected format
   - Ensure icons are valid React components or JSX

3. **Styling Issues:**
   - Check dark mode classes are applied
   - Verify Tailwind classes are correct
   - Ensure responsive breakpoints are set

4. **Animation Not Working:**
   - Check Framer Motion is imported
   - Verify `viewport={{ once: true }}` for scroll animations
   - Ensure refs are passed correctly for scroll tracking

---

## Summary

The section-based architecture provides:

✅ **Modularity** - Each section is self-contained  
✅ **Reusability** - Sections can be used across pages  
✅ **Maintainability** - Easy to update and modify  
✅ **Flexibility** - Props allow customization  
✅ **Consistency** - Shared design patterns  
✅ **Scalability** - Easy to add new sections  

This structure makes it easy to interchange content between pages while maintaining clean, organized code.

