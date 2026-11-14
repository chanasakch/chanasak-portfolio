// khom, a concept for a woven lighting maker. Photos from Pexels (Pexels license).

export type Shape = "Bell" | "Dome" | "Drum" | "Lantern" | "Wall";
export type Lamp = { id: string; name: string; shape: Shape; img: string; ratio: number; sizes: number[]; price: number; addPer10: number; line: string; detail: string; pos?: string };

export const lamps: Lamp[] = [
  { id: "nok", name: "Nok", shape: "Bell", img: "khom/dining", ratio: 1.75, sizes: [30, 40, 50], price: 3900, addPer10: 900, line: "Tall bell in natural rattan", detail: "A deep bell that keeps the bulb out of sight from the table. Hang three in a row over a long dining table.", pos: "50% 30%" },
  { id: "khao", name: "Khao", shape: "Dome", img: "khom/cafe", ratio: 0.72, sizes: [40, 55, 70], price: 4800, addPer10: 1100, line: "Wide dome with a dyed lining", detail: "A shallow dome lined in saffron cotton that warms the light. Made for cafe counters and kitchen islands.", pos: "50% 20%" },
  { id: "ruen", name: "Ruen", shape: "Bell", img: "khom/dark", ratio: 0.6, sizes: [35, 45], price: 4200, addPer10: 1000, line: "Close weave for a soft pool of light", detail: "The tight weave lets light through only at the rim, so the room stays dim and the table glows.", pos: "50% 35%" },
  { id: "lanna", name: "Lanna", shape: "Lantern", img: "khom/lanterns", ratio: 0.6, sizes: [25, 35], price: 2600, addPer10: 600, line: "Stacking lantern for stairwells", detail: "Light enough to hang in clusters of five or more at different heights down a stairwell or atrium.", pos: "50% 40%" },
  { id: "trio", name: "Trio", shape: "Drum", img: "khom/kitchen", ratio: 1.46, sizes: [30, 40], price: 3400, addPer10: 800, line: "Short drum for low ceilings", detail: "A compact drum that hangs close to the ceiling, for kitchens and corridors under 2.6 m.", pos: "50% 30%" },
  { id: "jan", name: "Jan", shape: "Wall", img: "khom/discs", ratio: 0.68, sizes: [45, 60, 80], price: 5200, addPer10: 900, line: "Woven disc wall light", detail: "A flat disc that hides the bulb behind it and throws a halo onto the wall. Hang a group as one piece.", pos: "50% 50%" },
  { id: "jan-large", name: "Jan Large", shape: "Wall", img: "khom/holding", ratio: 1.46, sizes: [90, 110], price: 8900, addPer10: 1200, line: "Statement disc for lobbies", detail: "The biggest disc we weave, made on order for hotel lobbies and double height rooms.", pos: "50% 40%" },
  { id: "rang", name: "Rang", shape: "Wall", img: "khom/trays", ratio: 1.46, sizes: [30, 40], price: 1900, addPer10: 500, line: "Set of woven wall plates", detail: "Five shallow plates in two weaves. They come unwired, as decoration beside a pair of Jan lights.", pos: "50% 50%" },
];
export const byId = (id: string) => lamps.find((l) => l.id === id);
export const priceFor = (l: Lamp, size: number) => l.price + Math.round((size - l.sizes[0]) / 10) * l.addPer10;
