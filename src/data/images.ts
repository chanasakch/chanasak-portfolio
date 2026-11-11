// Photos from Pexels (free to use under the Pexels license, https://www.pexels.com/license/).
// Files live in /public/images as <slug>-800.webp and <slug>-1600.webp.

export type Photo = {
  slug: string;
  alt: string;
  /** pixel size of the 1600 file, used for aspect ratio */
  w: number;
  h: number;
  pexelsId: number;
  photographer?: string;
};

const p = (slug: string, alt: string, w: number, h: number, pexelsId: number, photographer?: string): Photo => ({
  slug,
  alt,
  w,
  h,
  pexelsId,
  photographer,
});

export const photos = {
  rattanArmchairStudio: p("rattan-armchair-studio", "Rattan armchair against a white plaster wall", 1664, 2432, 9396424, "Labskiii"),
  caneFoldingChair: p("cane-folding-chair", "Teak folding chair with a cane seat", 1664, 2432, 7193570, "www.kaboompics.com"),
  caneSideChairSunlight: p("cane-side-chair-sunlight", "Cane side chair in late afternoon light", 1664, 2432, 8516702, "Anna Nekrashevich"),
  balconyRattanPods: p("balcony-rattan-pods", "Two woven lounge chairs on a balcony facing misty hills", 2432, 1664, 6130068, "Quang Nguyen Vinh"),
  wanPod: p("wan-pod", "Woven lounge chair", 997, 866, 6130068, "Quang Nguyen Vinh"),
  wanTable: p("wan-table", "Woven drum side table", 730, 699, 6130068, "Quang Nguyen Vinh"),
  bellPendantsKitchen: p("bell-pendants-kitchen", "Three woven bell pendants over a kitchen island", 1664, 2432, 29589458, "Andrea Davis"),
  bellPendantsLiving: p("bell-pendants-living", "Woven bell pendants in a timber-ceilinged living room", 2432, 1664, 30018179, "Andrea Davis"),
  domePendant: p("dome-pendant", "Large woven dome pendant over a dining table", 2432, 1664, 33054911, "Mateusz Pielech"),
  trioPendants: p("trio-pendants", "Three woven pendants of different shapes on a brass bar", 1664, 2304, 15948527, "Mia Dalisay"),
  globePendant: p("globe-pendant", "Woven globe pendant above a round dining table", 1664, 2432, 29559667, "Juan Tapias"),
  caneDiningChairs: p("cane-dining-chairs", "Teak dining chairs with cane backs in a double-height room", 1664, 2432, 33479124, "Siddanth Sawant"),
  cafeCaneChairs: p("cafe-cane-chairs", "Cane-back bistro chairs in a bright caf\u00e9", 1536, 2688, 23895207, "Ayşegül"),
  bistroChairsTerrace: p("bistro-chairs-terrace", "Rows of rattan bistro chairs on a terrace", 1792, 2176, 21835298, "Iryna Varanovich"),
  archedTerraceChairs: p("arched-terrace-chairs", "Two woven armchairs under stone arches facing the sea", 2304, 1664, 37564040, "Elmer Domingo"),
  outdoorDiningWoven: p("outdoor-dining-woven", "Woven outdoor dining armchairs on a terrace above the sea", 2432, 1664, 31817166, "Ahmet ÇÖTÜR"),
  loungeTeakCane: p("lounge-teak-cane", "Teak and cane lounge chairs around a round side table", 1664, 2304, 28744513, "Charm Andaya"),
  outdoorSofaPergola: p("outdoor-sofa-pergola", "Woven outdoor sofa under a pergola at dusk", 2432, 1664, 27626171, "Ahmet ÇÖTÜR"),
  sunbedsSand: p("sunbeds-sand", "Woven sunbeds on sand under thatched parasols", 2432, 1664, 3620235, "Engin Akyurt"),
  wovenPendantStudio: p("woven-pendant-studio", "Woven cylinder pendant against a white wall", 6000, 4000, 3554241, undefined),
  wovenPendantLit: p("woven-pendant-lit", "Woven pendant lamp glowing at night", 5184, 3456, 234780, undefined),
  rattanLoungeSet: p("rattan-lounge-set", "Rattan lounge set under a timber pergola", 4320, 3240, 279867, undefined),
  outdoorDiningSet: p("outdoor-dining-set", "Woven armchairs around a teak garden table", 3497, 2063, 238377, undefined),
  lakeRoom: p("lake-room", "Bedroom with woven pendants and a lake view", 2432, 1664, 35261473, "果 芒"),
  gardenRoom: p("garden-room", "Bedroom with a wall of glass onto palms", 2432, 1664, 33467180, "Siddanth Sawant"),
  forestSuite: p("forest-suite", "Suite with a low bed and a door onto a planted terrace", 2432, 1664, 27604102, "Ansar Muhammad"),
  readingCorner: p("reading-corner", "Woven chairs by tall timber windows", 1536, 2688, 15062485, "Matteo Milan"),
  terraceDining: p("terrace-dining", "Long dining table on a stone terrace among trees", 1536, 2688, 28277111, "nur telli"),
  mistyTerrace: p("misty-terrace", "Terrace tables under a pergola above a misty valley", 2432, 1664, 15551725, "Luis Becerra  Fotógrafo"),
  resortPool: p("resort-pool", "Pool lined with palms and thatched pavilions", 1664, 2304, 27817324, "ĐỨCANH MEDIA"),
  indoorPool: p("indoor-pool", "Glass-walled pool hall with tiled floor and loungers", 1664, 2304, 9973710, "Aljona Ovtšinnikova"),
  courtyardHouse: p("courtyard-house", "Old house courtyard with lanterns and a dining table", 2048, 2048, 31213888, "Thới Nam Cao"),
  budVases: p("bud-vases", "Two stoneware bud vases with dried lavender", 3376, 5040, 2789545, undefined),
  fernPitcher: p("fern-pitcher", "Grey glazed pitcher with an embossed fern pattern", 2432, 1664, 7851712, "İbrahim Doğan"),
  whiteTablewareSet: p("white-tableware-set", "White stoneware pitcher, cup, bowl and saucer", 1792, 2176, 9223173, "DRAKE NICOLLS"),
  pitchersMimosa: p("pitchers-mimosa", "Two white pitchers, one holding mimosa", 1792, 2176, 20433164, "Ayako S"),
  vesselsShelf: p("vessels-shelf", "Three vessels on a lit plaster shelf", 1664, 2304, 10467462, "Valeriya Kobzar"),
  placeSetting: p("place-setting", "Matte white plate with a linen napkin on a woven charger", 1664, 2304, 28951621, "bissinbloguu"),
  clayWorkbench: p("clay-workbench", "Clay being worked on a studio bench", 1664, 2304, 33799212, "Bilge ."),
  throwing: p("throwing", "Hands throwing a vase on the wheel", 1664, 2304, 36370412, "Narasimhan AVPL"),
  bisqueShelves: p("bisque-shelves", "Unglazed pieces drying on studio shelves", 1664, 2304, 8063869, "ROMAN ODINTSOV"),
  glazedShelves: p("glazed-shelves", "Potter placing a finished vase on the studio shelf", 2432, 1664, 37827245, "Onur Burak Akın"),
  twoHandsWheel: p("two-hands-wheel", "Teacher guiding a student at the wheel", 2048, 1920, 36739021, "3B"),
  mugsPair: p("mugs-pair", "Two matte iron-glaze mugs", 3775, 2512, 50676, undefined),
  porcelainService: p("porcelain-service", "Faceted white porcelain tea service", 5448, 3632, 5975, undefined),
  whiteVesselsSoft: p("white-vessels-soft", "White vessels drying on a shelf", 2782, 4165, 3094032, undefined),
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

const BASE = process.env.NEXT_PUBLIC_IMG_BASE ?? "/images/";

export function photoUrl(photo: Photo, width: 800 | 1600 = 1600) {
  return `${BASE}${photo.slug}-${width}.webp`;
}

export function photoSrcSet(photo: Photo) {
  return `${photoUrl(photo, 800)} 800w, ${photoUrl(photo, 1600)} ${Math.min(1600, photo.w)}w`;
}

export function pexelsPage(photo: Photo) {
  return `https://www.pexels.com/photo/${photo.pexelsId}/`;
}
