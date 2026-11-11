# Furniture and craft web concepts

Three working front-end concepts for Thai craft and hospitality brands. All brands, products and places are fictional.

| Route | Concept | What it shows |
| --- | --- | --- |
| `/` | Index | Links to the three concepts |
| `/furniture` | Loom & Tide, woven furniture brand and trade catalogue | Hero, shop by room, filters, search, spec pages, colourway drawing, printable spec sheet, quote list, Thai and English |
| `/ceramics` | DIN Studio, stoneware studio | Product grid, glaze explorer, making process, restaurant sample request, workshop booking |
| `/hotel` | Ruen Doi, boutique hotel | Availability check, room tabs, furniture hotspots linked to the catalogue, spaces, stay request |

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Motion. Fonts are self-hosted through Fontsource. No backend: product and project data live in `src/data`, the quote list is kept in the browser's localStorage, and forms show a success state without sending anything.

## Where to edit

- Products: `src/data/products.ts`
- Hotel rooms, spaces and hotspot positions: `src/data/hotel.ts`
- Ceramics pieces, glazes and workshop sessions: `src/data/ceramics.ts`
- Photos: `src/data/images.ts`
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
