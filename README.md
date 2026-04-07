# Tracy Sambu Interactive Portfolio

An immersive personal portfolio designed as a room-based experience rather than a static résumé.

## Experience Design

- Full-screen hero with interactive Three.js 3D objects
- Dark-first visual system with animated light/dark lamp toggle
- Distinct rooms: About, Projects, Community, Resources, Contact
- Motion depth: parallax, card tilt, animated overlays
- Keyboard-friendly room navigation (Arrow/Page keys)
- Project mini-case pages using problem/approach/impact framing

## Structure

- `index.html` — immersive room-based entry experience
- `assets/css/portfolio.css` — theme tokens, layout, motion, and UI styling
- `assets/js/portfolio.js` — theme persistence, parallax, card tilt, room key nav, Three.js scene
- `projects/` — focused mini-case study pages
- `sections/`, `writing/` — supporting content pages

## Tech

- HTML5
- CSS3
- JavaScript (vanilla)
- Three.js

## Accessibility & Responsiveness

- Skip link for keyboard users
- Focus-visible and keyboard room navigation support
- Reduced-motion fallbacks
- Responsive layouts for mobile/tablet/desktop
