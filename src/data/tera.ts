// Photos from Pexels (Pexels license). Destination photos have a foreground
// layer (<slug>-fg) cut along the skyline so the name can sit behind the landmark.

export type Dest = {
  id: string;
  name: string;
  word: string;
  place: string;
  img: string;
  w: number;
  h: number;
  /** where to keep the subject when the photo is cropped, 0 to 1 */
  fx: number;
  fy: number;
  /** vertical centre of the name, as a fraction of the photo height */
  y: number;
  /** the foreground layer starts this far down the photo; above it is only sky */
  crop: number;
  region: "Africa" | "Europe" | "Americas" | "Asia";
  season: string;
  blurb: string;
};

export const dests: Dest[] = [
  { id: "egypt", name: "Egypt", word: "EGYPT", place: "Giza and the Nile", img: "tera/egypt", w: 1920, h: 1152, fx: 0.32, fy: 0.45, y: 0.4, crop: 0.3898, region: "Africa", season: "October to April", blurb: "Stand under the last wonder of the ancient world at sunrise, then drift south on a dahabiya past temples the tour buses never reach." },
  { id: "swiss", name: "Switzerland", word: "ALPS", place: "Zermatt and the Matterhorn", img: "tera/swiss", w: 1920, h: 1314, fx: 0.49, fy: 0.25, y: 0.21, crop: 0.172, region: "Europe", season: "June to September", blurb: "Car free Zermatt, mountain huts with proper fondue and the Matterhorn reflected in the Riffelsee at dawn." },
  { id: "mexico", name: "Mexico", word: "MAYA", place: "Yucatan Peninsula", img: "tera/mexico", w: 1920, h: 1314, fx: 0.52, fy: 0.35, y: 0.29, crop: 0.2755, region: "Americas", season: "November to April", blurb: "Chichen Itza before the crowds, swims in hidden cenotes and slow afternoons in the colonial streets of Valladolid." },
  { id: "nepal", name: "Nepal", word: "NEPAL", place: "Khumbu Valley", img: "tera/nepal", w: 1920, h: 2658, fx: 0.5, fy: 0.25, y: 0.27, crop: 0.2752, region: "Asia", season: "March to May, October to November", blurb: "Twelve days on foot through Sherpa villages to the foot of Everest, with tea house nights and a rest day in Namche." },
  { id: "iceland", name: "Iceland", word: "ICELAND", place: "The South Coast", img: "tera/iceland", w: 1920, h: 1387, fx: 0.55, fy: 0.55, y: 0.57, crop: 0.5681, region: "Europe", season: "September to March", blurb: "Black sand beaches, glacier walks and, on clear nights, the northern lights over Vik." },
  { id: "lofoten", name: "Norway", word: "LOFOTEN", place: "Lofoten Islands", img: "tera/lofoten", w: 1920, h: 1387, fx: 0.4, fy: 0.2, y: 0.17, crop: 0.1961, region: "Europe", season: "June to August", blurb: "Red fishing cabins on stilts, granite peaks straight out of the sea and the midnight sun on Reinebringen." },
  { id: "santorini", name: "Greece", word: "AEGEAN", place: "Santorini and Naxos", img: "tera/santorini", w: 1920, h: 2658, fx: 0.62, fy: 0.3, y: 0.33, crop: 0.3585, region: "Europe", season: "May to October", blurb: "Caldera sunsets from Oia, then the ferry to Naxos for beaches, mountain villages and the best tomatoes in the Cyclades." },
  { id: "dolomites", name: "Italy", word: "DOLOMITI", place: "The Dolomites", img: "tera/dolomites", w: 1920, h: 768, fx: 0.52, fy: 0.3, y: 0.12, crop: 0.1185, region: "Europe", season: "June to September", blurb: "Hut to hut beneath the Tre Cime, with strudel at every refuge and a via ferrata for those who want one." },
];

export type Trip = {
  id: string;
  dest: string;
  title: string;
  days: number;
  price: number;
  single: number;
  group: number;
  level: "Easy" | "Moderate" | "Challenging";
  gallery: string[];
  highlights: string[];
  plan: [string, string][];
  includes: string[];
  excludes: string[];
  /** first departure, weeks after the start of next month */
  offset: number;
  every: number;
};

export const trips: Trip[] = [
  {
    id: "nile-pyramids",
    dest: "egypt",
    title: "Pyramids and the Nile by dahabiya",
    days: 9,
    price: 89000,
    single: 14000,
    group: 12,
    level: "Easy",
    gallery: ["tera/egypt", "tera/egypt-2", "tera/egypt-3"],
    highlights: ["Private sunrise entry at Giza", "Four nights on a sailing dahabiya", "Abu Simbel by road at dawn", "Egyptologist guide throughout"],
    plan: [
      ["Cairo", "Arrive and transfer to a Nile view hotel in Zamalek. Welcome dinner."],
      ["Giza and Saqqara", "Sunrise at the pyramids before the gates open to everyone else, then the step pyramid at Saqqara."],
      ["Cairo to Aswan", "Morning in the Grand Egyptian Museum, evening flight to Aswan."],
      ["Abu Simbel", "Early road trip to the temples of Ramesses II. Afternoon in a Nubian village."],
      ["Board the dahabiya", "Set sail north. Swim stops and lunch on deck."],
      ["Kom Ombo and Edfu", "Temples by morning, sailing by afternoon, dinner moored on a sandbank."],
      ["Esna", "Recently restored ceiling colours at the temple of Khnum."],
      ["Luxor", "Valley of the Kings and the Temple of Hatshepsut, with an optional hot air balloon."],
      ["Depart", "Transfer to Luxor airport."],
    ],
    includes: ["8 nights, 4 hotel and 4 on board", "All breakfasts, 6 lunches, 7 dinners", "Domestic flight Cairo to Aswan", "Entry to every site in the plan", "Egyptologist guide and tour leader"],
    excludes: ["International flights", "Visa on arrival, about USD 25", "Balloon flight, about ฿6,500"],
    offset: 1,
    every: 3,
  },
  {
    id: "zermatt-glacier",
    dest: "swiss",
    title: "Zermatt and the Glacier Express",
    days: 7,
    price: 118000,
    single: 22000,
    group: 10,
    level: "Moderate",
    gallery: ["tera/swiss", "tera/swiss-2"],
    highlights: ["Riffelsee at sunrise", "Glacier Express in Excellence class", "Night in a mountain hut", "Gornergrat railway pass"],
    plan: [
      ["Zurich to Zermatt", "Train through the Rhone valley to car free Zermatt."],
      ["Gornergrat", "Rack railway to 3,089 m and the walk down past the Riffelsee."],
      ["Five lakes walk", "A gentle 10 km loop with Matterhorn reflections."],
      ["Hornli hut", "Climb to the base camp of the Matterhorn and stay the night."],
      ["Back to the valley", "Descend for a free afternoon and a fondue farewell."],
      ["Glacier Express", "Eight hours across 291 bridges to St Moritz."],
      ["Depart", "Train to Zurich airport."],
    ],
    includes: ["6 nights in chalet hotels and one hut", "Swiss Travel Pass for the week", "Glacier Express seat reservation", "Mountain guide on hiking days"],
    excludes: ["International flights", "Lunches"],
    offset: 28,
    every: 2,
  },
  {
    id: "yucatan-cenotes",
    dest: "mexico",
    title: "Yucatan: cenotes and Chichen Itza",
    days: 8,
    price: 96000,
    single: 15000,
    group: 12,
    level: "Easy",
    gallery: ["tera/mexico", "tera/mexico-2", "tera/tikal"],
    highlights: ["Chichen Itza at opening time", "Swims in four cenotes", "Cooking class in a Maya home", "Two nights in a hacienda"],
    plan: [
      ["Merida", "Arrive in the white city. Evening walk to the Plaza Grande."],
      ["Uxmal", "The Puuc route and the Pyramid of the Magician."],
      ["Hacienda", "Drive to a restored henequen hacienda with its own cenote."],
      ["Chichen Itza", "In at 08:00, then Cenote Ik Kil before lunch."],
      ["Valladolid", "Colonial streets, cooking class and Cenote Suytun."],
      ["Ek Balam", "Climb the Acropolis, the last pyramid you still may climb."],
      ["Tulum", "Ruins above the sea and a free afternoon on the beach."],
      ["Depart", "Transfer to Cancun airport."],
    ],
    includes: ["7 nights in boutique hotels", "Daily breakfast, 4 lunches, 3 dinners", "All transport in a private van", "Site entries and guide"],
    excludes: ["International flights", "Tourist tax, about MXN 300"],
    offset: 2,
    every: 3,
  },
  {
    id: "everest-base",
    dest: "nepal",
    title: "Everest Base Camp trek",
    days: 15,
    price: 72000,
    single: 6000,
    group: 12,
    level: "Challenging",
    gallery: ["tera/nepal"],
    highlights: ["Kala Patthar at sunrise, 5,545 m", "Tengboche monastery", "Two acclimatisation days", "Porters carry your bag"],
    plan: [
      ["Kathmandu", "Arrive and kit check."],
      ["Lukla to Phakding", "Flight into the mountains and a short first walk."],
      ["Namche Bazaar", "Cross the Hillary bridge and climb to the Sherpa capital."],
      ["Rest in Namche", "Acclimatisation walk to the Everest View Hotel."],
      ["Tengboche", "Monastery and the first big Everest view."],
      ["Dingboche", "Into the high valley."],
      ["Rest in Dingboche", "Climb Nangkartshang for acclimatisation."],
      ["Lobuche", "Past the climbers memorials at Thukla."],
      ["Base Camp", "To Gorak Shep and on to Everest Base Camp."],
      ["Kala Patthar", "Sunrise climb, then descend to Pheriche."],
      ["Namche", "Long day down."],
      ["Lukla", "Last day on foot and a party with the porters."],
      ["Kathmandu", "Flight back."],
      ["Spare day", "Kept free in case weather delays the Lukla flight."],
      ["Depart", "Transfer to the airport."],
    ],
    includes: ["14 nights, 11 in tea houses", "All meals on the trek", "Lukla flights", "Permits, guide and porters", "Sleeping bag and down jacket hire"],
    excludes: ["International flights", "Travel insurance with helicopter rescue, required"],
    offset: 3,
    every: 4,
  },
  {
    id: "iceland-south",
    dest: "iceland",
    title: "Iceland south coast in winter",
    days: 6,
    price: 104000,
    single: 18000,
    group: 10,
    level: "Easy",
    gallery: ["tera/iceland", "tera/iceland-2"],
    highlights: ["Glacier walk on Solheimajokull", "Ice cave at Breidamerkurjokull", "Northern lights wake up calls", "Reynisfjara black sand beach"],
    plan: [
      ["Reykjavik", "Arrive, Sky Lagoon on the way in."],
      ["Golden Circle", "Thingvellir, Geysir and Gullfoss."],
      ["Vik", "Waterfalls at Seljalandsfoss and Skogafoss, then the black beach."],
      ["Glacier and ice cave", "Crampons on, with a glacier guide."],
      ["Jokulsarlon", "Icebergs in the lagoon and on Diamond Beach, back west."],
      ["Depart", "Transfer to Keflavik."],
    ],
    includes: ["5 nights in country hotels", "Breakfast and 4 dinners", "Glacier and ice cave guides", "4x4 minibus"],
    excludes: ["International flights", "Lunches"],
    offset: 5,
    every: 2,
  },
  {
    id: "lofoten-summit",
    dest: "lofoten",
    title: "Lofoten by sea and summit",
    days: 7,
    price: 112000,
    single: 19000,
    group: 10,
    level: "Moderate",
    gallery: ["tera/lofoten", "tera/lofoten-2"],
    highlights: ["Reinebringen at midnight", "Sea kayaking in Reinefjord", "A rorbu cabin on stilts", "Fresh cod with a fisherman"],
    plan: [
      ["Bodo to Svolvaer", "Ferry across the Vestfjord."],
      ["Henningsvaer", "The fishing village with the football pitch on the rocks."],
      ["Haukland beach", "Coast walk and an evening sauna."],
      ["Reine", "Move into rorbu cabins."],
      ["Kayak", "A full day paddling in Reinefjord."],
      ["Reinebringen", "Climb the stone steps for the midnight sun."],
      ["Depart", "Flight from Leknes."],
    ],
    includes: ["6 nights in rorbu cabins and guesthouses", "Breakfast and 5 dinners", "Kayak day with guide", "All ferries"],
    excludes: ["International flights"],
    offset: 30,
    every: 2,
  },
  {
    id: "cyclades",
    dest: "santorini",
    title: "Cyclades: Santorini and Naxos",
    days: 8,
    price: 84000,
    single: 16000,
    group: 14,
    level: "Easy",
    gallery: ["tera/santorini", "tera/stay-pool"],
    highlights: ["Caldera hike from Fira to Oia", "Boat day around the volcano", "Naxos mountain villages", "Cooking with a Naxian family"],
    plan: [
      ["Santorini", "Arrive and settle into a cave suite in Imerovigli."],
      ["Caldera walk", "Fira to Oia on the cliff path, sunset at the end."],
      ["Volcano boat", "Hot springs swim and lunch in Thirasia."],
      ["Ferry to Naxos", "Two hours to the island of beaches."],
      ["Mountain villages", "Halki, Apeiranthos and kitron tasting."],
      ["Beach day", "Plaka and Agios Prokopios."],
      ["Cooking", "Lunch with a family in the hills."],
      ["Depart", "Ferry to Athens."],
    ],
    includes: ["7 nights in small hotels", "Daily breakfast, 3 dinners", "Ferries and boat day", "Local guides"],
    excludes: ["International flights", "Lunches"],
    offset: 26,
    every: 2,
  },
  {
    id: "dolomites-huts",
    dest: "dolomites",
    title: "Dolomites hut to hut",
    days: 7,
    price: 78000,
    single: 9000,
    group: 10,
    level: "Challenging",
    gallery: ["tera/dolomites", "tera/stay-cabin"],
    highlights: ["Tre Cime circuit", "Three nights in refuges", "Optional via ferrata", "Luggage moved between valleys"],
    plan: [
      ["Cortina", "Arrive and gear check."],
      ["Tre Cime", "The classic circuit and a night at Rifugio Locatelli."],
      ["Fanes", "Across the high plateau to Rifugio Lavarella."],
      ["Lagazuoi", "Up to the war tunnels and a night above 2,700 m."],
      ["Cinque Torri", "Easy via ferrata for those who want it."],
      ["Back to Cortina", "Descend for a free evening."],
      ["Depart", "Transfer to Venice."],
    ],
    includes: ["6 nights, 3 in mountain refuges", "Half board throughout", "Mountain guide", "Luggage transfers"],
    excludes: ["International flights", "Via ferrata kit hire, about EUR 30"],
    offset: 29,
    every: 2,
  },
];

export const destById = (id: string) => dests.find((d) => d.id === id);
export const tripById = (id: string) => trips.find((t) => t.id === id);
export const tripsFor = (dest: string) => trips.filter((t) => t.dest === dest);

export type Departure = { date: Date; seats: number; price: number };

/** Upcoming departures for a trip, worked out from today so they never sit in the past. */
export function departures(t: Trip, now: Date, count = 8): Departure[] {
  const start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  start.setDate(start.getDate() + (t.offset % 7) + Math.floor(t.offset / 7) * 7);
  const out: Departure[] = [];
  for (let i = 0; out.length < count && i < 40; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i * t.every * 7);
    const seed = (t.id.length * 31 + d.getMonth() * 7 + d.getDate() * 3) % 13;
    const seats = seed === 0 ? 0 : Math.min(t.group, seed);
    const peak = [11, 0, 6, 7].includes(d.getMonth()) ? 1.08 : 1;
    out.push({ date: d, seats, price: Math.round((t.price * peak) / 500) * 500 });
  }
  return out;
}
