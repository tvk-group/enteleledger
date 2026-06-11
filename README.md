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
- `index.html` — main page with all sections
- `css/styles.css` — design system and animations
- `js/main.js` — interactions and language switching
- `js/i18n.js` — generated translations (run `node scripts/build-i18n.mjs` to rebuild)
- `scripts/` — locale source files and i18n build script

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
