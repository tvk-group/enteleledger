# EnteleLEDGER Website

Official website for EnteleLEDGER — the Permanent Record Layer (Truth Layer) of the ENTELΞKRON ecosystem.

## Domain
https://enteleledger.com

## Stack
- HTML5
- CSS3
- JavaScript (i18n for 25 languages)
- Vercel static hosting

## Structure
- `index.html` — main marketing site
- `app.html` — mobile PWA record portal (like entelekron.app / sovraprotocol.com app)
- `explorer.html`, `flow.html`, `trust.html` — app subpages
- `manifest.webmanifest` + `sw.js` — PWA install support
- `css/styles.css` — marketing site design system
- `css/app.css` — mobile app shell styles
- `js/main.js` — marketing site interactions and language switching
- `js/app.js`, `js/app-i18n.js`, `js/pwa.js` — record portal app
- `js/i18n.js` — generated marketing translations (run `node scripts/build-i18n.mjs` to rebuild)
- `scripts/` — locale source files and i18n build script
- `assets/brand/` — app icons

## Record Portal App
Installable PWA at **https://www.enteleledger.com/app.html** (configure `app.enteleledger.com` CNAME to Vercel for parity with entelekron.app).

Features: Record Explorer, Record Flow, Trust Architecture, home-screen install on iOS/Android.

## Deployment
Vercel settings (static site — no build step):
- Framework Preset: Other
- Build Command: leave empty
- Output Directory: leave empty
- Install Command: leave empty

`js/i18n.js` is committed pre-built. Regenerate locally before committing translation changes:
```bash
npm run build:i18n
```

Production URL: https://www.enteleledger.com (apex redirects to www)
