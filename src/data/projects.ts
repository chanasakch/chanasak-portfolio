import { photos, type Photo } from "./images";

export type ProjectType = "hotel" | "residence" | "restaurant" | "screen";

export type Hotspot = {
  /** percent from the left edge of the image */
  x: number;
  /** percent from the top edge of the image */
  y: number;
  product: string;
  note: string;
};

export type Project = {
  slug: string;
  name: string;
  location: string;
  year: number;
  type: ProjectType;
  client: string;
  designer: string;
  pieces: number;
  custom: number;
  weeks: number;
  hero: Photo;
  cover: Photo;
  intro: string;
  brief: string;
  made: string;
  /** Hotspot coordinates are tuned per photo. Press "e" on the project page to read new ones. */
  space: { photo: Photo; caption: string; hotspots: Hotspot[] };
  gallery: Photo[];
  quote: { text: string; by: string; role: string };
};

export const typeLabels: Record<ProjectType, string> = {
  hotel: "Hotels and resorts",
  residence: "Residences",
  restaurant: "Restaurants and bars",
  screen: "Film and editorial",
};

export const projects: Project[] = [
  {
    slug: "baan-talay-hua-hin",
    name: "Baan Talay Resort",
    location: "Hua Hin, Thailand",
    year: 2026,
    type: "hotel",
    client: "Baan Talay Hospitality",
    designer: "Atelier Lumpini",
    pieces: 412,
    custom: 3,
    weeks: 14,
    hero: photos.baliPool,
    cover: photos.pergolaPool,
    intro: "Pool deck, beach bar and 48 garden villas for a family-run resort on the Gulf coast.",
    brief:
      "The owners wanted the resort to feel like a beach house that grew over decades, not a hotel fitted out in one go. Everything outside had to survive salt air and monsoon rain, and the bar team needed stools they could move around without a trolley.",
    made:
      "We matched the Prang bar stool and Duang sunbed to the resort's sea-glass blue, then wove a custom 2.4 m round daybed for the lawn. Villa interiors use Malai lounge chairs and Saeng pendants, so the natural rattan carries indoors.",
    space: {
      photo: photos.pergolaPool,
      caption: "Pool pergola with Duang sunbeds and Noi side tables",
      hotspots: [
        { x: 30, y: 68, product: "duang-sunbed", note: "Strap colour matched to the pool tile" },
        { x: 52, y: 72, product: "noi-side-table", note: "Terrazzo top, woven base" },
        { x: 74, y: 58, product: "wan-daybed", note: "Custom 2.4 m version" },
      ],
    },
    gallery: [photos.palmLoungers, photos.canopyBedroom, photos.chevronResortSet, photos.tropicalPoolside],
    quote: {
      text: "They sent a weaver to the site before we ordered, to test the rope against our pool chemicals. That is the kind of detail that made us trust them with 400 pieces.",
      by: "Napat R.",
      role: "Owner, Baan Talay Resort",
    },
  },
  {
    slug: "the-sathorn-residences",
    name: "The Sathorn Residences",
    location: "Bangkok, Thailand",
    year: 2025,
    type: "residence",
    client: "Riverline Development",
    designer: "In-house design team",
    pieces: 186,
    custom: 2,
    weeks: 10,
    hero: photos.modernHotelPool,
    cover: photos.poolWicker,
    intro: "Rooftop pool, co-working lounge and sky garden for a 38-storey condominium.",
    brief:
      "Common areas in a high-rise get heavy daily use and harsh afternoon sun. The developer needed furniture that looked premium in the sales gallery photos and still looked that way five years later.",
    made:
      "Kluen chairs and lounge sets in a sand colourway for the roof, with UV-stable rope and quick-dry cushions. The co-working lounge uses Phai armchairs around a long Chan table built to the room's exact length.",
    space: {
      photo: photos.poolWicker,
      caption: "Rooftop pool terrace with the Kluen lounge set",
      hotspots: [
        { x: 38, y: 64, product: "kluen-lounge-set", note: "Sand colourway, quick-dry cushions" },
        { x: 62, y: 70, product: "kluen-dining-chair", note: "Stacks four high for events" },
      ],
    },
    gallery: [photos.rooftopSet, photos.terraceSet, photos.brightRoomSet],
    quote: {
      text: "Residents photograph the roof more than any other part of the building. The furniture is a big reason why.",
      by: "Kanokwan S.",
      role: "Head of Design, Riverline Development",
    },
  },
  {
    slug: "kinnaree-brasserie",
    name: "Kinnaree Brasserie",
    location: "Bangkok, Thailand",
    year: 2025,
    type: "restaurant",
    client: "Kinnaree Group",
    designer: "Studio Saladaeng",
    pieces: 140,
    custom: 1,
    weeks: 8,
    hero: photos.cafeWarm,
    cover: photos.cafeRattanRow,
    intro: "A 120-seat brasserie with a terrace and a twelve-seat bar.",
    brief:
      "The designer wanted a Parisian café feel with Thai materials. Chairs had to be light enough for staff to reset the room twice a night and comfortable through a three-hour dinner.",
    made:
      "Tor cane chairs indoors, Prang dining armchairs in lacquer red on the terrace, and Kaew counter stools at the bar. Saeng pendants hang in a row above the banquettes.",
    space: {
      photo: photos.cafeRattanRow,
      caption: "Terrace seating with Tor chairs",
      hotspots: [
        { x: 34, y: 66, product: "tor-cane-chair", note: "Hand-caned back" },
        { x: 66, y: 62, product: "prang-dining-armchair", note: "Lacquer red frame" },
      ],
    },
    gallery: [photos.wovenChairsInterior, photos.wickerPendants, photos.greenCushionChair],
    quote: {
      text: "We changed the chair finish three weeks before opening. They made it happen without moving the date.",
      by: "Thanawat K.",
      role: "Founder, Kinnaree Group",
    },
  },
  {
    slug: "koh-yao-villas",
    name: "Koh Yao Villas",
    location: "Phang Nga, Thailand",
    year: 2024,
    type: "hotel",
    client: "Andaman Private Villas",
    designer: "Bangkok Project Studio",
    pieces: 96,
    custom: 4,
    weeks: 16,
    hero: photos.villaInterior,
    cover: photos.gardenSofa,
    intro: "Six private pool villas on an island reachable only by boat.",
    brief:
      "Every piece had to arrive by longtail boat and be carried up a hill, so weight and packing mattered as much as looks. The architect asked for furniture that disappears into the jungle views.",
    made:
      "Flat-packed Lom easy chairs and Malai sofas in a smoked finish, plus four custom headboards woven to fit the villa beds. Each crate was sized for two people to carry.",
    space: {
      photo: photos.gardenSofa,
      caption: "Villa terrace with the Malai sofa",
      hotspots: [
        { x: 46, y: 60, product: "malai-sofa", note: "Smoked finish" },
        { x: 72, y: 56, product: "lom-easy-chair", note: "Flat-packed for boat delivery" },
      ],
    },
    gallery: [photos.rattanHeadboard, photos.canopyBedroom, photos.quietRoom],
    quote: {
      text: "Not a single piece arrived damaged, after a truck, a boat and a hill. I still don't know how.",
      by: "Lena M.",
      role: "General Manager, Andaman Private Villas",
    },
  },
  {
    slug: "hotel-nakhon-lounge",
    name: "Hotel Nakhon Lobby Lounge",
    location: "Chiang Mai, Thailand",
    year: 2024,
    type: "hotel",
    client: "Nakhon Hotels",
    designer: "Doi Design Office",
    pieces: 64,
    custom: 0,
    weeks: 9,
    hero: photos.hotelLobby,
    cover: photos.sunlitRattanArmchair,
    intro: "Lobby lounge and library for a heritage hotel in the old city.",
    brief:
      "The hotel was restoring a 1960s building and wanted furniture with the same craft and warmth as the original teak joinery.",
    made:
      "Phai armchairs in pairs around low tables, Lom chairs in the library, and a cluster of Saeng pendants over the reception desk.",
    space: {
      photo: photos.sunlitRattanArmchair,
      caption: "Library corner with the Phai armchair",
      hotspots: [{ x: 50, y: 58, product: "phai-armchair", note: "Natural finish" }],
    },
    gallery: [photos.wickerPendants, photos.windowArmchair, photos.minimalRattanRoom],
    quote: {
      text: "Guests ask where the chairs are from almost every day.",
      by: "Siriporn T.",
      role: "Hotel Manager, Hotel Nakhon",
    },
  },
  {
    slug: "andaman-series-set",
    name: "Set dressing for an Andaman series",
    location: "Krabi, Thailand",
    year: 2025,
    type: "screen",
    client: "International streaming production",
    designer: "Production design team",
    pieces: 58,
    custom: 6,
    weeks: 5,
    hero: photos.sunsetHotel,
    cover: photos.chairsPatternFloor,
    intro: "Furniture for a resort set in an international drama series.",
    brief:
      "The production needed a fictional luxury resort to look lived-in on camera, with pieces that read well in close-up and in wide shots.",
    made:
      "We supplied 52 catalogue pieces and six one-off chairs, woven in five weeks to fit the shooting schedule.",
    space: {
      photo: photos.chairsPatternFloor,
      caption: "Resort lounge set with Prang and Malai pieces",
      hotspots: [
        { x: 36, y: 62, product: "malai-lounge-chair", note: "Featured in the opening scene" },
        { x: 64, y: 64, product: "prang-bar-stool", note: "Ink and cane colourway" },
      ],
    },
    gallery: [photos.pampasRattanChair, photos.tropicalCushionPair],
    quote: {
      text: "Every piece looked right on camera without any dressing. That saved us days.",
      by: "Production designer",
      role: "Name withheld at the studio's request",
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
