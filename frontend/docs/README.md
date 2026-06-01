# Frontend Documentation

This directory contains documentation for the All in1 url frontend application.

## Documentation Files

- **[PAGES.md](./PAGES.md)** - Comprehensive documentation about all page components, routing, and design patterns
- **[SECTIONS_AND_PAGES.md](./SECTIONS_AND_PAGES.md)** - Detailed documentation about section components, their parameters, and page-by-page structure

## Quick Reference

### Page Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | HomePage | Public | Landing page |
| `/home` | DashBoard | Private | Main dashboard |
| `/links` | LinkPage | Private | All links management |
| `/profile` | Profile | Private | User profile editing |
| `/profile/:username` | ProfilePreview | Public | Public profile view |
| `/settings` | Settings | Private | Privacy & settings |
| `/doc` | Documentation | Public | App documentation |
| `/about-developer` | AboutDeveloper | Public | Developer info |
| `*` | NotFound | Public | 404 page |

### Key Features

- **Search**: User search in navigation (responsive: icon on mobile)
- **Profile Management**: Edit profile with preview option
- **Link Management**: Create, edit, delete links with visibility controls
- **Settings**: Comprehensive privacy and visibility controls
- **Dark Mode**: Full support across all pages
- **Responsive**: Mobile-first design

### Design System

- **Colors**: Purple, Pink, Blue gradients
- **Effects**: Glassmorphism, backdrop blur
- **Animations**: Framer Motion
- **Icons**: React Icons (Fa, Md)
- **Styling**: Tailwind CSS

## Development

### Adding New Pages

1. Create component in `/components/pages/`
2. Add route in `/src/App.jsx`
3. Update navigation if needed
4. Ensure light/dark mode support
5. Add to this documentation

### Best Practices

- Always support light and dark modes
- Use consistent design patterns
- Add loading and error states
- Implement responsive design
- Follow accessibility guidelines
