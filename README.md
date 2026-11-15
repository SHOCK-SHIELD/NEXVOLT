# ShockShield - Community Electrical Safety Platform

> **HackNauts 2.0 Project by Team NexVolt**

A professional, feature-rich frontend web application for community-powered electrical hazard reporting and tracking. Built with vanilla HTML, CSS, and JavaScript.

## 🌟 Features

### 🎯 Core Features
- **Landing Page** - Professional marketing page with animated particle background, team showcase, and feature highlights
- **User Registration** - Multi-step form with validation, password strength meter, and social login options
- **Live Hazard Feed** - Instagram-style community feed with real-time reports, likes, comments, and verification
- **Interactive Hazard Map** - OpenStreetMap-powered map with GPS location, color-coded markers, clustering, and filtering
- **Hazard Reporting** - 3-step wizard for reporting hazards with photo upload, GPS location, and severity selection

### ⚡ Electrical Hazard Theme
- Custom color palette: Gold/Yellow (primary), Orange (warning), Red (critical), Green (success), Blue (verified)
- Animated lightning bolts, particle effects, and electrical glow animations
- Consistent theming across all pages and components
- Hazard type icons and status badges

### 🎨 UI/UX Excellence
- **Dark mode** optimized design with high contrast
- **Smooth animations** - Framer Motion-inspired transitions, hover effects, scroll animations
- **Responsive design** - Mobile-first, works on all screen sizes
- **Accessibility** - WCAG 2.1 AA compliant, keyboard navigation, ARIA labels
- **Performance** - Lazy loading, code splitting ready, optimized assets

### 🛠 Technical Features
- **Vanilla JS** - No frameworks, lightweight and fast
- **Modular architecture** - Reusable components and utilities
- **PWA Ready** - Service worker, manifest, offline support
- **Modern CSS** - Custom properties, Grid/Flexbox, clamp() fluid typography
- **Leaflet Maps** - OpenStreetMap integration with marker clustering

## 📁 Project Structure

```
SHOCKSHIELD FRONTENDD/
├── index.html              # Landing page
├── register.html           # User registration
├── login.html              # User login
├── forgot-password.html    # Password reset
├── feed.html               # Live hazard feed
├── map.html                # Interactive hazard map
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── README.md               # This file
├── styles/
│   ├── main.css            # Core design system & components
│   ├── landing.css         # Landing page styles
│   ├── auth.css            # Auth pages styles
│   ├── feed.css            # Feed page styles
│   └── map.css             # Map page styles
├── js/
│   ├── main.js             # Core utilities & global components
│   ├── particles.js        # Particle background system
│   ├── landing.js          # Landing page interactions
│   ├── auth.js             # Auth forms & validation
│   ├── feed.js             # Feed page logic
│   └── map.js              # Map page logic
└── assets/                 # Icons, images, screenshots
    ├── icons/
    └── screenshots/
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Local web server (for service worker and ES modules)

### Quick Start

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000

# Using VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then open `http://localhost:8000` in your browser.

### Development

The project uses vanilla JavaScript with ES6 modules. No build step required for development.

```bash
# Watch for changes (optional)
# Use browser dev tools for debugging
```

## 🎯 Key Pages Walkthrough

### 1. Landing Page (`index.html`)
- Animated particle canvas with electrical theme
- Hero section with animated statistics
- Feature cards with 3D hover effects
- How-it-works stepper with connector line
- Interactive hazard map preview
- Team showcase with tilt animations
- CTA section with gradient styling

### 2. Registration (`register.html`)
- Split layout with branding panel and form
- Real-time password strength meter
- Form validation with custom error messages
- Social login buttons (Google, GitHub)
- Success modal with animation

### 3. Live Feed (`feed.html`)
- Sticky filter bar (location, status, type, sort)
- Report hazard card at top
- Instagram-style post cards with:
  - Author info with verification badge
  - Hazard image with type badge
  - Description with tags
  - Action buttons (like, comment, verify, share)
  - Comment preview
- Sidebar with user stats, trending hazards, hazard types legend, safety tips
- Infinite scroll / load more

### 4. Hazard Map (`map.html`)
- Full-screen OpenStreetMap with custom controls
- Color-coded markers by status (red=unsolved, orange=in-progress, green=solved, blue=verified)
- Marker clustering for dense areas
- User location with accuracy circle
- Filter chips for status, dropdowns for type/radius
- Bottom sheet for hazard details
- Side sheet for layer controls (basemap, overlays)
- FAB buttons for report, layers, measure

## 🎨 Design System

### Colors
```css
/* Primary Gradient */
--gradient-primary: linear-gradient(135deg, #FFD700 0%, #FF6B00 50%, #FF0033 100%);

/* Status Colors */
--color-hazard-critical: #FF0033;
--color-hazard-unsolved: #FF4400;
--color-hazard-inprogress: #FFB800;
--color-hazard-solved: #00E676;
--color-hazard-verified: #00B4D8;

/* Background */
--color-bg-primary: #0A0E17;
--color-bg-secondary: #111827;
--color-bg-card: #151D2C;
```

### Typography
- **Display**: Syncopate (headlines, numbers)
- **Body**: Space Grotesk (UI text, content)
- **Mono**: JetBrains Mono (coordinates, codes)

### Spacing Scale
- `--space-xs`: 0.25rem (4px)
- `--space-sm`: 0.5rem (8px)
- `--space-md`: 1rem (16px)
- `--space-lg`: 1.5rem (24px)
- `--space-xl`: 2rem (32px)
- `--space-2xl`: 3rem (48px)
- `--space-3xl`: 4rem (64px)

## 🔧 Customization

### Adding New Hazard Types
1. Add to `HAZARD_TYPES` object in `js/feed.js` and `js/map.js`
2. Add CSS for `.hazard-type-badge.{type}` in `styles/feed.css` and `styles/map.css`
3. Add marker SVG in `HAZARD_TYPES` config

### Changing Theme Colors
Update CSS custom properties in `styles/main.css`:
```css
:root {
  --gradient-primary: linear-gradient(135deg, #YOUR_COLORS);
  --color-hazard-critical: #YOUR_RED;
  /* ... */
}
```

### Adding New Pages
1. Create HTML file with standard structure
2. Link `styles/main.css` + page-specific CSS
3. Link `js/main.js` + page-specific JS
4. Add to navigation in all pages

## 📱 PWA Features

- **Installable** - Add to home screen on mobile/desktop
- **Offline Support** - Service worker caches static assets
- **Background Sync** - Queue reports when offline
- **Push Notifications** - Hazard alerts (requires backend)
- **App Shortcuts** - Quick actions from home screen

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Focus management in modals
- Keyboard navigation support
- Reduced motion support
- High contrast mode compatible
- Screen reader tested

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Mobile Safari | 14+ | ✅ Full |
| Chrome Mobile | 90+ | ✅ Full |

## 📦 Deployment

### Static Hosting (Recommended)
- **Netlify** - Drag & drop or Git integration
- **Vercel** - Git integration with preview deployments
- **GitHub Pages** - Free hosting for public repos
- **Firebase Hosting** - Fast global CDN
- **Cloudflare Pages** - Free tier with Workers

### Server Configuration
```nginx
# Nginx example for SPA routing
location / {
    try_files $uri $uri/ /index.html;
}

# Cache static assets
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Service worker
location /sw.js {
    add_header Cache-Control "no-cache";
}
```

## 👥 Team NexVolt

| Role | Member | Responsibility |
|------|--------|----------------|
| **Captain & Frontend Lead** | Hardik Wadhwa | UI/UX, animations, map integration, team coordination |
| **Backend Lead** | Amrinder Singh | API design, database, real-time features |
| **Debugging & QA Lead** | Bhavninder Singh | Testing, performance, cross-browser compatibility |
| **Database Manager** | Rohit Singh | Data modeling, geospatial queries, analytics |

## 🏆 HackNauts 2.0

This project was built for **HackNauts 2.0** hackathon by **Team NexVolt**.

### Innovation Highlights
1. **Community-first approach** - Citizens as safety sensors
2. **Gamified participation** - Badges, leaderboards, verification
3. **Municipal integration** - Responder dashboard, SLA tracking
4. **Real-time hazard map** - OpenStreetMap with clustering
5. **Electrical safety focus** - Domain-specific hazard types

## 📄 License

MIT License - Feel free to use for learning, hackathons, or production.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Contact

**Team NexVolt** - HackNauts 2.0
- Email: nexvolt@shockshield.io
- GitHub: [github.com/nexvolt](https://github.com/nexvolt)

---

*Built with ⚡ for safer communities*