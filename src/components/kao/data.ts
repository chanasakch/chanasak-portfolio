import type { Way } from "./Stage";

export type Colourway = Way & { name: string; swatch: string; note: string; soldOut: number[] };

export const ways: Colourway[] = [
  { id: "lagoon", variant: 0, name: "Lagoon", swatch: "#2b8fc6", note: "Bright blue knit, navy overlays", soldOut: [36, 45] },
  { id: "blush", variant: 1, name: "Blush", swatch: "#e6c4c3", note: "Pale pink knit, rose overlays", soldOut: [42] },
  { id: "ember", variant: 2, name: "Ember", swatch: "#232325", note: "Black knit, coral overlays", soldOut: [] },
  { id: "sage", variant: 1, hue: [1.95, 0.55, 0.92], name: "Sage", swatch: "#bccfb8", note: "Soft green knit, tonal overlays", soldOut: [37, 44, 45] },
  { id: "sand", variant: 1, hue: [0.55, 0.62, 1], name: "Sand", swatch: "#dacdb9", note: "Oat knit, tonal overlays", soldOut: [40] },
  { id: "forest", variant: 0, hue: [-1.6, 0.48, 0.6], name: "Forest", swatch: "#4c7a4d", note: "Deep green knit, pine overlays", soldOut: [36, 41] },
];

export const sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
export const PRICE = 3890;
export const thb = (n: number) => "฿" + n.toLocaleString("en-US");

/** EU size to foot length in cm, US men and UK */
export const chart: [number, number, string, string][] = [
  [36, 22.5, "4", "3.5"],
  [37, 23.5, "5", "4"],
  [38, 24, "5.5", "5"],
  [39, 25, "6.5", "6"],
  [40, 25.5, "7", "6.5"],
  [41, 26, "8", "7"],
  [42, 27, "8.5", "8"],
  [43, 27.5, "9.5", "9"],
  [44, 28.5, "10", "9.5"],
  [45, 29, "11", "10.5"],
];
