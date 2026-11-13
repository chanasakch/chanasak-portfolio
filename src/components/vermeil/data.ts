export const pic = (slug: string, w: 600 | 1100 | 2000) => `/images/vermeil/${slug}-${w}.webp`;
export const srcSet = (slug: string) => `${pic(slug, 600)} 600w, ${pic(slug, 1100)} 1100w, ${pic(slug, 2000)} 2000w`;
export const thb = (n: number) => "฿" + n.toLocaleString("en-US");

export type Dish = { name: string; note: string; price: number; photo?: string; tags?: string[] };
export type Course = { id: string; title: string; photo: string; dishes: Dish[] };

export const menu: Course[] = [
  {
    id: "start",
    title: "To start",
    photo: "tartare",
    dishes: [
      { name: "Beef tartare", note: "Hand-cut sirloin, egg yolk, pickled shallot, crisp rice", price: 590, photo: "tartare" },
      { name: "Crab and roasted beetroot", note: "Blue crab, golden and red beets, sour cream, dill", price: 520, photo: "starter" },
      { name: "Onion soup", note: "Slow onions, beef broth, a lid of toasted comté", price: 380 },
    ],
  },
  {
    id: "pasta",
    title: "Pasta",
    photo: "linguine",
    dishes: [
      { name: "Linguine with clams", note: "Surat Thani clams and mussels, white wine, chilli, parsley", price: 680, photo: "linguine" },
      { name: "Spaghetti, courgette and basil", note: "Fried courgette, aged parmesan, plenty of basil", price: 450, photo: "spaghetti", tags: ["Vegetarian"] },
    ],
  },
  {
    id: "sea",
    title: "From the sea",
    photo: "prawns",
    dishes: [
      { name: "Prawns on ice", note: "A ring of Andaman prawns, cocktail sauce, aioli, lemon. For two", price: 1450, photo: "prawns" },
      { name: "Sole meunière", note: "Whole sole in brown butter with capers, boned at the table", price: 1680 },
    ],
  },
  {
    id: "cellar",
    title: "From the cellar",
    photo: "glasses",
    dishes: [
      { name: "Glass of the evening", note: "A red the sommelier opened at six. Ask what it is", price: 390, photo: "glasses" },
      { name: "Negroni, champagne", note: "Our house aperitif at the bar, before you sit down", price: 420, photo: "cocktail" },
    ],
  },
];

export type Room = { id: string; name: string; photo: string; second: string; seats: string; blurb: string; detail: string[] };

export const rooms: Room[] = [
  {
    id: "hall",
    name: "The Hall",
    photo: "hall",
    second: "mirrors",
    seats: "64 seats",
    blurb: "Painted ceilings, tall mirrors and red banquettes. The room most people mean when they say Vermeil.",
    detail: ["Tables for two to eight", "Busiest from 7:30 pm", "The pianist plays Friday and Saturday"],
  },
  {
    id: "salon",
    name: "The Salon",
    photo: "salon",
    second: "stairs",
    seats: "18 seats",
    blurb: "Up the tiled staircase, a gilded room with three windows over Charoen Krung. Quieter, and a little grander.",
    detail: ["Window tables book first", "Good for anniversaries", "Reached by stairs only"],
  },
  {
    id: "bar",
    name: "The Bar",
    photo: "bar",
    second: "cocktail",
    seats: "14 at the counter",
    blurb: "A marble counter under a green lamp, for an aperitif before dinner or the full menu on your own.",
    detail: ["Walk-ins welcome", "Full menu served", "Open until 1 am"],
  },
  {
    id: "private",
    name: "The Private Room",
    photo: "private",
    second: "setting",
    seats: "Up to 24 guests",
    blurb: "A room of its own behind the hall, with one round table or two long ones and its own waiter for the night.",
    detail: ["Set menus from ฿2,900 a guest", "Your own wine list", "Book a week ahead"],
  },
];

export const wines = [
  { name: "Chablis Premier Cru", from: "Burgundy", year: 2021, glass: 520, bottle: 3200 },
  { name: "Sancerre rosé", from: "Loire", year: 2023, glass: 420, bottle: 2400 },
  { name: "Morgon, Côte du Py", from: "Beaujolais", year: 2020, glass: 450, bottle: 2700 },
  { name: "Pauillac", from: "Bordeaux", year: 2016, glass: 980, bottle: 6800 },
  { name: "Champagne, blanc de blancs", from: "Côte des Blancs", year: 2015, glass: 690, bottle: 4900 },
];
