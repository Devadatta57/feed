# Feed World

React + Vite frontend for the Feed World platform (exports hub, FPO portal, MSME services,
EPM registrations, Feed World publications archive, and the my-business dashboard).

## Setup

```bash
npm install
npm run dev
```

The dev server proxies API calls to the Spring Boot backend - see `src/api/config.js` for the
base URL.

## Scripts

- `npm run dev` - start the Vite dev server
- `npm run build` - production build to `dist/`
- `npm run preview` - preview the production build locally
- `npm run lint` - run Oxlint

## Structure

- `src/pages` - route-level views
- `src/components` - shared/reusable UI pieces
- `src/api` - backend API clients
- `src/locales` - i18n translation files
- `public/images`, `src/assets` - static image assets (avif for photos, svg for icons/illustrations)
