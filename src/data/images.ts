// All photos are free to use under the Pexels license (https://www.pexels.com/license/).
// Before going live, download the final picks into /public/images and point `src` at them,
// so a photo removed from Pexels can never break the page.

export type Photo = {
  id: number;
  alt: string;
  /** Pexels page, used on the credits list */
  page: string;
};

const p = (id: number, slug: string, alt: string): Photo => ({
  id,
  alt,
  page: `https://www.pexels.com/photo/${slug}-${id}/`,
});

export const photos = {
  // Studio and product-led
  bambooChairStudio: p(9396422, "brown-wooden-armchair-on-concrete-floor", "Woven armchair on a concrete floor against a white wall"),
  minimalRattanRoom: p(9396399, "rattan-furniture-in-minimalist-house-interior", "Rattan furniture in a minimal interior"),
  wickerArmchairTable: p(8987823, "brown-wooden-framed-gray-padded-armchair", "Hand-woven armchair with a side table"),
  weaveCloseUp: p(14957889, "wicker-armchair-in-close-up", "Close-up of a woven armchair"),
  armrestDetail: p(16647086, "close-up-of-wooden-and-wickered-chair", "Detail of a woven armrest on a wooden frame"),
  greenCushionChair: p(16647088, "wickered-chairs-by-table", "Woven chair with a green cushion beside a glass table"),
  greenCushionDetail: p(16647089, "close-up-of-wickered-and-wooden-chair", "Woven chair and wooden frame in daylight"),
  chairsPatternFloor: p(18464896, "design-chairs-on-display", "Rattan chairs on a patterned floor"),
  chevronResortSet: p(12713220, "customized-furniture-made-of-rattan", "Rattan set on chevron tiles in a Thai resort"),
  wovenChairsInterior: p(9381048, "brown-wooden-chair-beside-round-table", "Woven chairs and tables in a contemporary room"),
  cafeRattanRow: p(25328879, "chairs-and-tables-in-row-in-restaurant", "Rattan chairs and tables in a sunlit café"),
  tropicalCushionPair: p(32497580, "cozy-patio-seating-with-tropical-plant-decor", "Two rattan chairs beside a tall plant"),
  pampasRattanChair: p(30059653, "cozy-modern-interior-with-pampas-and-rattan-chair", "Rattan chair in a modern interior"),
  sunlitWickerChair: p(18396532, "elegant-wicker-chair", "Woven chair in a sunlit apartment"),
  windowArmchair: p(5825409, "cozy-interior-with-wicker-chair-in-corner", "Woven armchair with cushion by a window"),
  windowArmchairTop: p(5825410, "wicker-chair-with-cushion-near-window", "Woven armchair seen from above"),
  sunlitRattanArmchair: p(9890646, "patio-furniture-set", "Rattan armchair and table in a sunlit room"),
  brightRoomSet: p(21614915, "wicker-table-and-chairs", "Woven table and chairs in a bright room"),
  loveseatBase: p(271648, "white-suede-loveseat-with-brown-wicker-base", "Sofa on a woven base"),
  patioModernSet: p(8041135, "an-empty-sofa-set", "Outdoor patio with woven seating"),
  rooftopSet: p(11888487, "sofa-set-on-the-roof-top", "Rooftop terrace with woven furniture"),
  terraceSet: p(26793170, "sofa-and-chairs-on-house-terrace", "Outdoor rattan set on a terrace"),
  gardenPatioSet: p(27975920, "gc-rattan-outdoor-crafts", "Rattan seating on a garden patio"),
  baliDining: p(32675934, "elegant-outdoor-dining-in-bali-with-wicker-chairs", "Outdoor dining with white woven chairs"),
  gardenSofa: p(6430742, "cozy-rattan-sofa-with-cushions-in-tropical-garden", "Rattan sofa in a tropical garden"),

  // Material and craft
  hexWeave: p(6594391, "close-up-photo-of-natural-rattan-hexagonal-woven-material", "Hexagonal rattan weave"),
  rawRattan: p(14055719, "pile-of-rattan-raw-materials-photo", "Bundles of raw rattan"),
  naturalWeave: p(36299694, "natural-wicker-texture-close-up-pattern", "Natural woven texture"),
  woodWeave: p(18372339, "close-up-a-woven-wicker-structure", "Woven structure in close-up"),
  rattanMat: p(265009, "round-wicker-board-on-wooden-surface", "Woven rattan mat"),
  workshop: p(32403960, "traditional-handicraft-workshop-in-ha-n-i", "Handicraft workshop"),
  handsWeaving: p(4219654, "top-view-photo-of-two-person-s-hands-weaving", "Two pairs of hands weaving"),

  // Lighting
  wickerPendants: p(17299918, "wicker-lamps-hanging", "Three woven pendant lamps against a grey wall"),
  rattanLamps: p(235187, "beige-pendant-lamp-switch-on-outside-house", "Rattan lamps hanging indoors"),
  wovenCeilingLights: p(39078818, "modern-ceiling-lamps-in-contemporary-interior", "Woven ceiling shades in a modern interior"),
  wovenFixtures: p(34941015, "cozy-display-of-rustic-woven-light-fixtures", "Display of woven light fixtures"),

  // Hospitality
  rattanHeadboard: p(39836709, "cozy-boutique-hotel-room-with-rattan-headboard", "Hotel room with a rattan headboard"),
  canopyBedroom: p(29000313, "luxurious-tropical-resort-bedroom-with-canopy-bed", "Tropical resort bedroom with a canopy bed"),
  villaInterior: p(4917176, "interior-of-typical-villa-located-in-lush-tropical-garden", "Villa interior in a tropical garden"),
  hotelLobby: p(31080809, "elegant-luxury-hotel-lobby-with-warm-ambiance", "Hotel lobby in warm light"),
  baliPool: p(2259226, "swimming-pool-beside-cottages", "Pool beside resort cottages"),
  pergolaPool: p(32516576, "luxurious-poolside-retreat-with-wooden-pergola", "Pool with a wooden pergola and loungers"),
  poolWicker: p(11045257, "wicker-table-and-chairs-near-swimming-pool", "Woven table and chairs near a pool"),
  tropicalPoolside: p(37517002, "luxurious-tropical-poolside-with-lounge-chairs", "Tropical poolside with lounge chairs"),
  modernHotelPool: p(33881123, "modern-and-luxurious-outdoor-hotel-pool-area", "Modern hotel pool with sun loungers"),
  palmLoungers: p(11448503, "patio-chaise-lounge-chairs-by-the-pool", "Chaise loungers among palm trees"),
  cafeWarm: p(28704256, "cozy-parisian-cafe-interior-with-warm-lighting", "Café interior in warm light"),
  sunsetHotel: p(37031491, "sunset-view-of-modern-tropical-hotel", "Tropical hotel at sunset"),
  quietRoom: p(4995109, "chairs-for-relaxation-in-empty-room", "Lounge chairs in a quiet room"),
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

export function photoUrl(photo: Photo, width = 1600) {
  return `https://images.pexels.com/photos/${photo.id}/pexels-photo-${photo.id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

export function photoSrcSet(photo: Photo, widths = [640, 1024, 1600, 2200]) {
  return widths.map((w) => `${photoUrl(photo, w)} ${w}w`).join(", ");
}
