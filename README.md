# FlowGesture — Demo & Design Notes

Demo (click to open): https://flowgesture.netlify.app

If the site hosts a demo video, open the link and look for the "Demo" or play icon to watch the interactive walkthrough.

## Quick summary
- Purpose: gesture-driven demo showing flow interactions for touch/mouse input.
- Target: product designers, frontend engineers, and UX researchers.
- Core interaction types: tap, swipe, drag, long-press, multi-touch pinch/zoom.

## UX flow (high level)
1. Onboarding: short tips overlay describing primary gestures.
2. Demo canvas: live interactive area where gestures are recorded and visualized.
3. Timeline / playback: replay recorded gestures with speed control.
4. Export / share: generate a short shareable link or video of the session.

## UI components
- Header: title + demo link + record/play controls.
- Gesture canvas: central stage with live gesture visualization (trails, touch points).
- Timeline: scrub, play/pause, speed control, markers.
- Controls panel: toggle overlays, enable/disable gesture types, export button.
- Modals: onboarding, export options, short help.

## Design details
- Layout: responsive single-column on mobile, two-column on desktop (canvas + controls).
- Visual language: high-contrast action color for touch points and trails; muted greys for background.
- Typography: system sans for performance; scale with modular type scale.
- Spacing: 8px baseline grid for consistent rhythm and alignment.
- Motion: subtle easing for playback and UI transitions; keep animations short (<250ms) for responsiveness.

## Accessibility & robustness
- Keyboard equivalents for primary actions (record, play, export).
- ARIA labels for controls and status messages (recording, playback).
- Reduced-motion mode: respect user OS preference to limit animations.
- Graceful fallback for non-touch devices (mouse drag emulates touch).

## Performance & instrumentation
- Throttle pointer events and compress recorded points for playback.
- Use requestAnimationFrame for canvas rendering.
- Lazy-load assets and defer non-critical scripts.
- Add basic analytics for demo play/record events (opt-out friendly).

## Developer notes (how to run)
1. Clone repo
2. npm install
3. npm start
4. Open http://localhost:3000 (or visit the demo link above)

## File structure (suggested)
- src/
    - components/Canvas.jsx
    - components/Timeline.jsx
    - components/Controls.jsx
    - styles/
    - utils/gestures.js
    - pages/DemoPage.jsx

## Quick tips for the hosted demo
- Use desktop with mouse or mobile for real touch interactions.
- Try long-press + drag to see hold-and-drag patterns.
- Enable "show trails" for better visual feedback when recording.

If you want, I can expand any section into a full design spec, accessibility checklist, or component props list.
