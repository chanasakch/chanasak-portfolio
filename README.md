# Furniture and craft web concepts

Three working front-end concepts for a Thai rattan furniture brand. All brands, products, clients and projects are fictional.

| Route | Concept | What it shows |
| --- | --- | --- |
| `/` | Index | Links to the three concepts |
| `/saan` | SAAN Atelier, brand site | Editorial hero, collections, colourway picker, material process, designers, awards, showroom booking |
| `/trade` | Loom & Tide Trade, B2B catalogue | Filters, search, product spec pages, live colourway drawing, printable spec sheet, quote list, Thai and English |
| `/projects` | Ruen Projects, hospitality showcase | Case studies by sector, shop-the-space hotspots, project facts, client quotes, inquiry form |

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
- Projects and hotspot positions: `src/data/projects.ts`
- Photos: `src/data/images.ts`
- Thai and English text for the trade catalogue: `src/components/trade/dict.ts`
- Brand colours and fonts: `src/app/globals.css` (`.brand-saan`, `.brand-trade`, `.brand-ruen`)

### Moving the hotspots

Hotspot markers are placed by percentage on each photo. On any project page, press `e` to turn on placement mode, click the spot on the photo, and copy the `{ x, y }` it shows into `src/data/projects.ts`.

## Photos

Photos come from Pexels (free under the Pexels license) and load from the Pexels CDN. Before showing this to a client, download the final photos into `public/images` and point `photoUrl` in `src/data/images.ts` at them, so a photo removed from Pexels cannot break the page. Credits are listed at `/credits`.

## Deploy to Vercel

1. Push this folder to a new GitHub repository.
2. On vercel.com, choose Add New, then Project, and import the repository.
3. Keep the defaults (Next.js is detected automatically) and deploy.

Every push to the main branch redeploys.
