import { photos, type Photo } from "./images";

export type Glaze = {
  id: string;
  name: string;
  thai: string;
  /** light, body and pooled colours used to draw the glaze */
  colors: [string, string, string];
  speckle: string;
  text: string;
  firing: string;
};

export const glazes: Glaze[] = [
  {
    id: "celadon",
    name: "Celadon",
    thai: "ศิลาดล",
    colors: ["#cfdccf", "#a9bfae", "#7d9886"],
    speckle: "#6f8a78",
    text: "A pale jade glaze made from wood ash and a trace of iron. The green only appears when the kiln is starved of oxygen, so no two firings match exactly.",
    firing: "Reduction, 1,280 °C",
  },
  {
    id: "rice-husk",
    name: "Rice-husk white",
    thai: "ขาวแกลบ",
    colors: ["#f7f4ec", "#e8e3d6", "#cfc7b4"],
    speckle: "#a89c84",
    text: "A soft milky white made with ash from burned rice husks, collected from farms around Lampang after harvest. The silica in the husk gives it a satin surface.",
    firing: "Oxidation, 1,260 °C",
  },
  {
    id: "iron",
    name: "Iron",
    thai: "เหล็ก",
    colors: ["#7a5236", "#3b2a1f", "#1f150e"],
    speckle: "#a26a3f",
    text: "A glossy black-brown that breaks to rust where it thins over the rims. The iron comes from the same red earth we dig for our clay.",
    firing: "Reduction, 1,280 °C",
  },
  {
    id: "raw",
    name: "Bare Lampang clay",
    thai: "ดินเผาไม่เคลือบ",
    colors: ["#d4a982", "#b9875e", "#9a6942"],
    speckle: "#7a4f30",
    text: "No glaze on the outside, only a clear liner within. The flame marks the clay itself, toasting it from sand to deep orange.",
    firing: "Wood kiln, 1,240 °C",
  },
];

export type Piece = {
  name: string;
  photo: Photo;
  focus?: string;
  glaze: string;
  detail: string;
  priceThb: number;
  note?: string;
};

export const pieces: Piece[] = [
  { name: "Bud vases, pair", photo: photos.budVases, glaze: "Iron and rice-husk white", detail: "H 12 and 14 cm", priceThb: 1450 },
  { name: "Fern pitcher", photo: photos.fernPitcher, focus: "30% 50%", glaze: "Celadon grey", detail: "1.2 litres", priceThb: 1900 },
  { name: "Breakfast set", photo: photos.whiteTablewareSet, glaze: "Rice-husk white", detail: "Jug, cup, bowl and saucer", priceThb: 2600 },
  { name: "Iron mugs, pair", photo: photos.mugsPair, glaze: "Iron", detail: "320 ml each", priceThb: 1100 },
  { name: "Mimosa jugs", photo: photos.pitchersMimosa, focus: "50% 60%", glaze: "Rice-husk white", detail: "Tall and short", priceThb: 1350 },
  { name: "Shelf vessels", photo: photos.vesselsShelf, focus: "50% 55%", glaze: "Mixed glazes", detail: "Sold singly", priceThb: 850, note: "from" },
  { name: "Facet tea service", photo: photos.porcelainService, glaze: "Porcelain white", detail: "Pot, jug and six cups", priceThb: 4800 },
  { name: "Dinner plate", photo: photos.placeSetting, glaze: "Matte rice-husk white", detail: "27 cm", priceThb: 780 },
];

export type Session = { id: string; day: string; time: string; title: string; seats: number; priceThb: number };

export const sessions: Session[] = [
  { id: "s1", day: "Sat 6 Dec", time: "10:00 to 13:00", title: "First time on the wheel", seats: 2, priceThb: 2200 },
  { id: "s2", day: "Sat 13 Dec", time: "10:00 to 13:00", title: "First time on the wheel", seats: 5, priceThb: 2200 },
  { id: "s3", day: "Sun 14 Dec", time: "14:00 to 17:00", title: "Glazing your own bowls", seats: 4, priceThb: 1800 },
  { id: "s4", day: "Sat 20 Dec", time: "09:00 to 16:00", title: "A day in the studio", seats: 0, priceThb: 4500 },
];
