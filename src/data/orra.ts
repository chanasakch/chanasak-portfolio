// Photos from Pexels (Pexels license). Files in /public/images/orra as <slug>-800.webp and -1600.webp.

export type OrraOpt = { key: string; label: string; add: number; swatch?: string };
export type OrraProduct = {
  id: string;
  name: string;
  cat: OrraCat;
  price: number;
  img: string;
  ratio: number;
  gallery: { img: string; ratio: number; alt: string }[];
  alt: string;
  blurb: string;
  details: string[];
  size: string;
  lead: string;
  stock: number;
  optName?: string;
  opts?: OrraOpt[];
};
export type OrraCat = "Chairs" | "Sofas" | "Tables" | "Lighting";

export const orraCats: { name: OrraCat; slug: string; img: string; line: string }[] = [
  { name: "Chairs", slug: "chairs", img: "orra/lune-chair", line: "Lounge, dining and accent" },
  { name: "Sofas", slug: "sofas", img: "orra/terrace-sofa", line: "Modular and fixed" },
  { name: "Tables", slug: "tables", img: "orra/plank-table", line: "Solid timber, made to size" },
  { name: "Lighting", slug: "lighting", img: "orra/glow-pendant", line: "Pendants and lamps" },
];

const g = (img: string, ratio: number, alt: string) => ({ img: `orra/${img}`, ratio, alt });

export const orra: OrraProduct[] = [
  {
    id: "lune-chair",
    name: "Lune lounge chair",
    cat: "Chairs",
    price: 38500,
    img: "orra/lune-chair",
    ratio: 1600 / 1156,
    alt: "Bentwood lounge chair with a sand upholstered seat against a concrete wall",
    gallery: [g("lune-chair", 1600 / 1156, "Lune lounge chair against concrete")],
    blurb: "A moulded walnut shell that wraps the shoulders, with a deep seat cushion you sink into slowly. Built for long evenings with a book.",
    details: ["Moulded walnut veneer shell, solid walnut legs", "High resilience foam seat with a feather topper", "Removable cover, dry clean", "Made in our Samut Sakhon workshop"],
    size: "W 74 x D 78 x H 76 cm, seat height 40 cm",
    lead: "In stock. Delivered in 5 to 7 days",
    stock: 6,
    optName: "Upholstery",
    opts: [
      { key: "sand", label: "Sand boucle", add: 0, swatch: "#cbbfa8" },
      { key: "char", label: "Charcoal wool", add: 2400, swatch: "#3b3a38" },
      { key: "moss", label: "Moss velvet", add: 3200, swatch: "#59613f" },
    ],
  },
  {
    id: "saddle-chair",
    name: "Saddle lounge chair",
    cat: "Chairs",
    price: 46000,
    img: "orra/saddle-chair",
    ratio: 1600 / 2215,
    alt: "Cognac leather lounge chair on a woven rug",
    gallery: [g("saddle-chair", 1600 / 2215, "Saddle lounge chair in cognac leather")],
    blurb: "Vegetable tanned leather slung over a solid oak frame. It darkens and softens where you sit, so after a year it is entirely yours.",
    details: ["Solid oak frame, oiled", "Full grain vegetable tanned leather, 2.2 mm", "Loose seat and back cushions", "Leather care kit included"],
    size: "W 70 x D 82 x H 74 cm, seat height 38 cm",
    lead: "Made to order. Ready in 6 weeks",
    stock: 12,
    optName: "Leather",
    opts: [
      { key: "cognac", label: "Cognac", add: 0, swatch: "#a0612f" },
      { key: "espresso", label: "Espresso", add: 0, swatch: "#4a2f22" },
    ],
  },
  {
    id: "cove-chair",
    name: "Cove shell chair",
    cat: "Chairs",
    price: 52000,
    img: "orra/cove-chair",
    ratio: 1,
    alt: "Teal upholstered shell chair beside tall windows in a panelled room",
    gallery: [g("cove-chair", 1, "Cove shell chair in teal velvet")],
    blurb: "A deep shell that lets you curl up sideways. Upholstered by hand in one continuous piece of velvet with no visible seams on the inside.",
    details: ["Fibreglass shell on a polished steel base", "Cotton velvet, 52,000 rubs", "Matching footstool available on request"],
    size: "W 101 x D 86 x H 92 cm",
    lead: "Made to order. Ready in 8 weeks",
    stock: 12,
    optName: "Velvet",
    opts: [
      { key: "teal", label: "Deep teal", add: 0, swatch: "#2e5b57" },
      { key: "rust", label: "Rust", add: 0, swatch: "#8d4a2c" },
    ],
  },
  {
    id: "spindle-chair",
    name: "Spindle dining chair",
    cat: "Chairs",
    price: 9800,
    img: "orra/spindle-chair",
    ratio: 1600 / 2215,
    alt: "Wooden spindle back dining chair against a dark wall",
    gallery: [g("spindle-chair", 1600 / 2215, "Spindle dining chair")],
    blurb: "Seven turned spindles and a saddle seat carved from one board. Light enough to lift with one hand, strong enough for every day.",
    details: ["Solid teak from certified plantations", "Hand carved saddle seat", "Sold individually, order in pairs or sets"],
    size: "W 52 x D 50 x H 84 cm, seat height 46 cm",
    lead: "In stock. Delivered in 5 to 7 days",
    stock: 24,
    optName: "Finish",
    opts: [
      { key: "teak", label: "Natural teak", add: 0, swatch: "#9a6337" },
      { key: "ebony", label: "Ebonised", add: 800, swatch: "#262321" },
    ],
  },
  {
    id: "plank-table",
    name: "Plank dining table",
    cat: "Tables",
    price: 64000,
    img: "orra/plank-table",
    ratio: 1,
    alt: "Solid wood dining table with splayed legs on a pale background",
    gallery: [g("plank-table", 1, "Plank dining table"), g("room-living", 1600 / 1095, "Dining corner in an open plan living room")],
    blurb: "Wide boards with their grain matched by eye, joined without metal fixings. Each top is cut to the size of your room.",
    details: ["Solid acacia boards, hardwax oil finish", "Bridle jointed legs, no metal fixings", "Seats six at 180 cm, ten at 260 cm"],
    size: "D 95 x H 75 cm, length as chosen",
    lead: "Made to order. Ready in 7 weeks",
    stock: 8,
    optName: "Length",
    opts: [
      { key: "180", label: "180 cm", add: 0 },
      { key: "220", label: "220 cm", add: 9000 },
      { key: "260", label: "260 cm", add: 17000 },
    ],
  },
  {
    id: "terrace-sofa",
    name: "Terrace modular sofa",
    cat: "Sofas",
    price: 128000,
    img: "orra/terrace-sofa",
    ratio: 1600 / 1318,
    alt: "Low grey modular sofa in a living room with a ring pendant above",
    gallery: [g("terrace-sofa", 1600 / 1318, "Terrace modular sofa in a living room")],
    blurb: "Low, deep modules that clip together in any order. Start with three seats and add a corner or chaise when you move.",
    details: ["Kiln dried hardwood frame, 15 year guarantee", "Feather wrapped foam seats", "Performance weave, stain resistant", "Modules join with hidden steel clips"],
    size: "3 seat: W 270 x D 105 x H 66 cm",
    lead: "Made to order. Ready in 8 weeks",
    stock: 6,
    optName: "Layout",
    opts: [
      { key: "3", label: "Three seat", add: 0 },
      { key: "corner", label: "Corner, five seat", add: 54000 },
      { key: "chaise", label: "Three seat with chaise", add: 31000 },
    ],
  },
  {
    id: "dune-sofa",
    name: "Dune sofa",
    cat: "Sofas",
    price: 89000,
    img: "orra/dune-sofa",
    ratio: 1600 / 1156,
    alt: "Cream sofa against a ribbed timber wall with a mushroom lamp",
    gallery: [g("dune-sofa", 1600 / 1156, "Dune sofa against a timber wall"), g("dune-detail", 1600 / 1156, "Dune sofa arm with a throw and lamp")],
    blurb: "Rounded arms and a single long seat cushion, so nobody gets the gap in the middle. Covered in a heavy linen that softens with washing.",
    details: ["Hardwood frame, sprung base", "Single bench seat cushion", "Washable stonewashed linen cover"],
    size: "W 240 x D 98 x H 72 cm",
    lead: "In stock. Delivered in 7 to 10 days",
    stock: 4,
    optName: "Linen",
    opts: [
      { key: "oat", label: "Oat", add: 0, swatch: "#ddd3c2" },
      { key: "clay", label: "Clay", add: 0, swatch: "#b58c6c" },
    ],
  },
  {
    id: "halo-pendant",
    name: "Halo pendant",
    cat: "Lighting",
    price: 7400,
    img: "orra/halo-pendant",
    ratio: 1536 / 2560,
    alt: "Black metal dome pendant casting a pool of light",
    gallery: [g("halo-pendant", 1536 / 2560, "Halo pendant lit")],
    blurb: "A spun steel dome with a matt inside that throws a soft, glare free pool of light. Hang one over a reading chair or three over a counter.",
    details: ["Spun steel, powder coated", "E27 lamp holder, LED bulb included", "Adjustable 2 m cloth cable"],
    size: "Diameter 32 cm, height 24 cm",
    lead: "In stock. Delivered in 3 to 5 days",
    stock: 30,
    optName: "Colour",
    opts: [
      { key: "black", label: "Black", add: 0, swatch: "#1f1f1f" },
      { key: "brass", label: "Brushed brass", add: 1800, swatch: "#b39255" },
    ],
  },
  {
    id: "glow-pendant",
    name: "Ember pendant",
    cat: "Lighting",
    price: 12600,
    img: "orra/glow-pendant",
    ratio: 1536 / 2560,
    alt: "Copper lined pendants glowing in a dark concrete stairwell",
    gallery: [g("glow-pendant", 1536 / 2560, "Ember pendants in a stairwell")],
    blurb: "A copper lined shade that warms the light to the colour of late sun. Made for stairwells, double height rooms and long dining tables.",
    details: ["Aluminium shade, copper leaf inside", "Dimmable, 2,200 K LED", "Ceiling rose and 3 m cable"],
    size: "Diameter 22 cm, height 30 cm",
    lead: "In stock. Delivered in 3 to 5 days",
    stock: 18,
  },
];

export const orraById = (id: string) => orra.find((p) => p.id === id);
export const orraOpt = (p: OrraProduct, key?: string) => p.opts?.find((o) => o.key === key) ?? p.opts?.[0];

export const orraSlides = [
  { img: "orra/lune-chair", cat: "Chairs" as OrraCat, title: ["Spaces that", "mirror you"], line: "Chairs shaped by hand in our Samut Sakhon workshop, finished to the fabric you choose.", card: "Lasting lounge chairs", pos: "38% 60%" },
  { img: "orra/terrace-sofa", cat: "Sofas" as OrraCat, title: ["Sit low,", "stay long"], line: "Modular sofas that grow with the room, from three seats to a full corner.", card: "Modular sofas", pos: "50% 60%" },
  { img: "orra/room-living", cat: "Tables" as OrraCat, title: ["Gather round", "good wood"], line: "Solid timber tables cut to the length of your room and joined without metal.", card: "Made to size tables", pos: "50% 50%" },
  { img: "orra/glow-pendant", cat: "Lighting" as OrraCat, title: ["Light that", "settles you"], line: "Pendants with warm, glare free light for stairwells, counters and reading corners.", card: "Warm pendants", pos: "50% 40%" },
];
