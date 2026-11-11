# Furniture and craft web concepts

Three working front-end concepts for Thai craft and hospitality brands. All brands, products and places are fictional.

| Route | Concept | What it shows |
| --- | --- | --- |
| `/` | Index | Links to the three concepts |
| `/furniture` | Loom & Tide, woven furniture brand and trade catalogue | Hero slideshow, new-in carousel, shop by room, live search overlay, quick view, quote drawer, filter drawer, spec pages with photo viewer, colourway drawing, Thai and English |
| `/ceramics` | DIN Studio, stoneware studio | Full-screen menu, parallax hero, pieces carousel with quick view, order drawer, glaze explorer, pinned making-process story, restaurant sample request, workshop booking |
| `/hotel` | Ruen Doi, boutique hotel | Hero slideshow, availability check, room carousel with details, furniture hotspots linked to the catalogue, photo viewer, booking drawer |

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Motion, Lenis. Fonts are self-hosted through Fontsource. No backend: product and project data live in `src/data`, the quote list is kept in the browser's localStorage, and forms show a success state without sending anything.

## Where to edit

- Products: `src/data/products.ts`
- Hotel rooms, spaces and hotspot positions: `src/data/hotel.ts`
- Ceramics pieces, glazes and workshop sessions: `src/data/ceramics.ts`
- Photos: `src/data/images.ts`
- Shared interactions (slideshow, carousel, drawer, modal, photo viewer, pinned story): `src/components/shared/ui.tsx`
- Motion (smooth scroll with Lenis, cursor, intro curtain, line reveals, scroll-lit text, image reveals, pinned sideways scroll, hover index): `src/components/shared/motion.tsx`
- Thai and English text for the trade catalogue: `src/components/trade/dict.ts`
- Brand colours and fonts: `src/app/globals.css` (`.brand-trade`, `.brand-din`, `.brand-ruen`)

### Moving the hotspots

Hotspot markers are placed by percentage on each photo. On the hotel page, press `e` to turn on placement mode, click the spot on the photo, and copy the `{ x, y }` it shows into `src/data/hotel.ts`.

## Photos

Photos come from Pexels (free under the Pexels license), resized to WebP in `public/images` at 800 and 1600 pixels wide. Credits with photographer names are listed at `/credits`.

## Deploy to Vercel

1. Push this folder to a new GitHub repository.
2. On vercel.com, choose Add New, then Project, and import the repository.
3. Keep the defaults (Next.js is detected automatically) and deploy.

Every push to the main branch redeploys.
