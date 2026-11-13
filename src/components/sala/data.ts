import type { PieceSpec } from "./Showroom";

export type Finish = { name: string; color: string; note?: string };
export type Piece = PieceSpec & {
  name: string;
  kind: "Seating" | "Objects";
  price: number;
  blurb: string;
  made: string;
  lead: string;
  dims: [number, number, number];
  finishes: Finish[];
};

export const pieces: Piece[] = [
  {
    id: "chair",
    file: "/models/sala/chair.glb",
    rot: -0.55,
    name: "Nang lounge chair",
    kind: "Seating",
    price: 26500,
    blurb: "A low, wide seat for reading in. Deep buttoned velvet over a hardwood frame, sized for the corner of a Bangkok condo.",
    made: "Cotton velvet, solid wood frame, brass label",
    lead: "Made to order in 6 to 8 weeks",
    dims: [83, 57, 69],
    finishes: [
      { name: "Mango velvet", color: "#e0763c", note: "with oiled teak legs" },
      { name: "Peacock velvet", color: "#11706c", note: "with black legs" },
    ],
  },
  {
    id: "sofa",
    file: "/models/sala/sofa.glb",
    rot: -0.38,
    name: "Wong sofa",
    kind: "Seating",
    price: 89000,
    blurb: "One long curve that seats four and floats on slim lacquered legs. Looks as good from behind as it does from the front.",
    made: "Cotton velvet, beech frame, legs with brass caps",
    lead: "Made to order in 8 to 10 weeks",
    dims: [219, 102, 79],
    finishes: [
      { name: "Champagne", color: "#cbbca2" },
      { name: "Navy", color: "#26345e" },
      { name: "Dove grey", color: "#d8d7d2" },
      { name: "Black", color: "#202022" },
      { name: "Blush", color: "#e8d3cf" },
    ],
  },
  {
    id: "pouf",
    file: "/models/sala/pouf.glb",
    rot: 0,
    name: "Bua floor pouf",
    kind: "Seating",
    price: 8900,
    blurb: "Pleated by hand from the centre out, like a lotus opening. Sit on it, put your feet up, or leave it where the light lands.",
    made: "Silk blend over a foam core",
    lead: "In stock, delivered in 3 days",
    dims: [61, 61, 20],
    finishes: [{ name: "Plum", color: "#7b3a63" }],
  },
  {
    id: "lamp",
    file: "/models/sala/lamp.glb",
    rot: 0,
    plinth: 0.52,
    name: "Fong table lamp",
    kind: "Objects",
    price: 7400,
    blurb: "A mouth-blown glass globe that catches colour as you walk past it, under a dark linen drum shade.",
    made: "Blown glass, chrome base, linen shade",
    lead: "In stock, delivered in 3 days",
    dims: [30, 30, 48],
    finishes: [{ name: "Smoke linen", color: "#5b524d" }],
  },
  {
    id: "plant",
    file: "/models/sala/plant.glb",
    rot: 0.5,
    name: "Bon in terracotta",
    kind: "Objects",
    price: 1450,
    blurb: "A caladium with soft pink veins, potted in unglazed clay from Ratchaburi. Likes bright shade and a drink twice a week.",
    made: "Live plant, 30 cm terracotta pot",
    lead: "Delivered in Bangkok within 2 days",
    dims: [70, 66, 84],
    finishes: [{ name: "Natural clay", color: "#c47e57" }],
  },
  {
    id: "vases",
    file: "/models/sala/vases.glb",
    rot: -0.3,
    plinth: 0.72,
    name: "Ngam bud vases",
    kind: "Objects",
    price: 2200,
    blurb: "Two small footed vases, one a little taller. Enough for a single stem each on a bedside table.",
    made: "Mouth-blown glass, set of two",
    lead: "In stock, delivered in 3 days",
    dims: [22, 14, 20],
    finishes: [{ name: "Clear", color: "#dfe7e6" }],
  },
  {
    id: "cup",
    file: "/models/sala/cup.glb",
    rot: 0.3,
    plinth: 0.78,
    name: "Lai cup and saucer",
    kind: "Objects",
    price: 1100,
    blurb: "Fine porcelain with a grey floral band painted by hand. Holds a proper cup of tea, about 200 ml.",
    made: "Porcelain, hand-painted",
    lead: "In stock, delivered in 3 days",
    dims: [15, 15, 7],
    finishes: [{ name: "Grey bloom", color: "#c9cbd0" }],
  },
];

export const thb = (n: number) => "฿" + n.toLocaleString("en-US");
