# Furniture and craft web concepts

Three working front-end concepts for Thai craft and hospitality brands. All brands, products and places are fictional.

| Route | Concept | Signature interaction |
| --- | --- | --- |
| `/` | Index | Links to the six concepts |
| `/parfum` | HOM, fragrance house | Live 3D bottle toured on scroll, 360 turn, zoom, scent and size switching, initials printed on the label |
| `/furniture` | Loom & Tide | Full rattan furniture shop: home, collection with filters, product pages with photo zoom, quote list, projects, trade programme, contact |
| `/jewelry` | PHLOI, fine jewellery | 3D solitaire ring with stone, metal, cut, carat and an engraving preview |
| `/ceramics` | DIN, stoneware studio | Endless drag-through wall of pieces, magnifier, filters, order drawer |
| `/hotel` | Ruen Doi, boutique hotel | One day told hour by hour as the page moves from morning to night, rate calendar and room hold |
| `/residence` | Rim Nam, riverside residences | Stacking plan by floor, interactive floor plan, payment calculator |

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Motion, Lenis, three.js. Fonts are self-hosted through Fontsource. No backend: product and project data live in `src/data`, the quote list is kept in the browser's localStorage, and forms show a success state without sending anything.

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
