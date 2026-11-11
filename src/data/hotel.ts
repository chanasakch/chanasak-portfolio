import { photos, type Photo } from "./images";

export type Room = {
  slug: string;
  name: string;
  photo: Photo;
  focus?: string;
  size: number;
  bed: string;
  view: string;
  sleeps: number;
  count: number;
  fromThb: number;
  text: string;
  /** product slugs from the Loom & Tide catalogue used in this room */
  furniture: string[];
};

export const rooms: Room[] = [
  {
    slug: "lake-room",
    name: "Lake Room",
    photo: photos.lakeRoom,
    size: 38,
    bed: "King bed",
    view: "Lake and forest",
    sleeps: 2,
    count: 12,
    fromThb: 7400,
    text: "Pine-panelled rooms on the upper floor with a full-height window onto the reservoir. Mornings come in low over the water and light up the whole room.",
    furniture: ["rakang-pendant", "wan-lounge-pod", "wan-side-table"],
  },
  {
    slug: "garden-room",
    name: "Garden Room",
    photo: photos.gardenRoom,
    size: 42,
    bed: "King bed",
    view: "Garden and palms",
    sleeps: 2,
    count: 8,
    fromThb: 6200,
    text: "Ground-floor rooms that open straight onto the garden. A glass wall slides back, so the room and the terrace become one space.",
    furniture: ["malai-lounge-chair", "saeng-pendant"],
  },
  {
    slug: "forest-suite",
    name: "Forest Suite",
    photo: photos.forestSuite,
    size: 64,
    bed: "King bed and day bed",
    view: "Private planted terrace",
    sleeps: 3,
    count: 4,
    fromThb: 12800,
    text: "Four suites at the quiet end of the property, each with its own walled terrace, a reading corner and an outdoor shower among ferns.",
    furniture: ["phai-lounge-chair", "duen-globe-pendant", "sala-terrace-chair"],
  },
];

export type Space = { name: string; photo: Photo; text: string; focus?: string };

export const spaces: Space[] = [
  {
    name: "The old house",
    photo: photos.courtyardHouse,
    text: "A 1950s teak house we restored as the reception, library and evening bar.",
  },
  {
    name: "Library lounge",
    photo: photos.loungeTeakCane,
    text: "Teak and cane chairs, a wall of books on northern Thailand, tea served all day.",
    focus: "50% 65%",
  },
  {
    name: "Glasshouse pool",
    photo: photos.indoorPool,
    text: "A heated pool under glass for cool mornings in the hills, open 6:00 to 21:00.",
    focus: "50% 70%",
  },
  {
    name: "Garden pool",
    photo: photos.resortPool,
    text: "Twenty-five metres, lined with palms and two shaded sala for lunch.",
    focus: "50% 60%",
  },
];

/** Hotspots on the balcony photo, in percent of the image size. */
export const balconySpots = [
  { x: 22, y: 72, product: "wan-lounge-pod", note: "Woven in smoked rice-husk PE rattan, rated for open balconies" },
  { x: 57, y: 75, product: "wan-side-table", note: "The drum top is woven from the centre, so a glass sits flat" },
  { x: 84, y: 70, product: "wan-lounge-pod", note: "The same chair, facing the lake" },
];
