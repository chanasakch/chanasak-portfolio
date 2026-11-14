// SAAN, a concept for a Thai indoor and outdoor rattan brand.
// Photos from Pexels (Pexels license), files in /public/images/saan.

export type Lang = "en" | "th";
export type T = { en: string; th: string };
export type SaanCat = "living" | "dining" | "outdoor" | "lighting";

export const cats: { id: SaanCat; name: T; img: string; tone: string }[] = [
  { id: "living", name: { en: "Living", th: "ห้องนั่งเล่น" }, img: "saan/living", tone: "#d5dccb" },
  { id: "dining", name: { en: "Dining", th: "ห้องทานอาหาร" }, img: "saan/longtable", tone: "#ecd9c6" },
  { id: "outdoor", name: { en: "Outdoor", th: "เอาท์ดอร์" }, img: "saan/cove", tone: "#c4dcdc" },
  { id: "lighting", name: { en: "Lighting and accessories", th: "โคมไฟและของตกแต่ง" }, img: "saan/pendants", tone: "#efd2c2" },
];

export type SaanProduct = {
  id: string;
  name: string;
  cat: SaanCat;
  type: T;
  img: string;
  ratio: number;
  cut?: { img: string; ratio: number };
  price: number;
  size: string;
  material: T;
  finishes: { name: T; hex: string }[];
  weeks: number;
  blurb: T;
  outdoor?: boolean;
};

const nat = { name: { en: "Natural", th: "สีธรรมชาติ" }, hex: "#c99b62" };
const honey = { name: { en: "Honey", th: "สีน้ำผึ้ง" }, hex: "#a8703a" };
const white = { name: { en: "Chalk white", th: "สีขาวชอล์ก" }, hex: "#ece8df" };
const sand = { name: { en: "Sand", th: "สีทราย" }, hex: "#d5c3a5" };
const char = { name: { en: "Charcoal", th: "สีชาร์โคล" }, hex: "#3d3f3b" };

export const products: SaanProduct[] = [
  {
    id: "kloud",
    name: "Kloud",
    cat: "living",
    type: { en: "Lounge armchair", th: "อาร์มแชร์" },
    img: "saan/kloud",
    ratio: 1600 / 2338,
    cut: { img: "saan/kloud-cut", ratio: 739 / 825 },
    price: 16900,
    size: "W 64 x D 72 x H 98 cm",
    material: { en: "Manau rattan, peeled cane binding", th: "หวายมะนาว พันด้วยผิวหวาย" },
    finishes: [nat, honey],
    weeks: 4,
    blurb: {
      en: "A tall rounded back bent from whole rattan poles, with a loose linen cushion. Light enough to carry to the window with one hand.",
      th: "พนักพิงสูงโค้งดัดจากหวายทั้งลำ พร้อมเบาะผ้าลินินถอดซักได้ น้ำหนักเบา ยกย้ายมุมได้ด้วยมือเดียว",
    },
  },
  {
    id: "nest",
    name: "Nest",
    cat: "living",
    type: { en: "Egg lounge chair", th: "เก้าอี้ทรงไข่" },
    img: "saan/nest",
    ratio: 1600 / 1095,
    price: 24500,
    size: "W 92 x D 86 x H 104 cm",
    material: { en: "Synthetic rattan on aluminium, outdoor rated", th: "หวายเทียมบนโครงอะลูมิเนียม ใช้กลางแจ้งได้" },
    finishes: [char, sand],
    weeks: 6,
    blurb: {
      en: "A deep woven shell that shades you on three sides. Made for balconies and terraces, it shrugs off sun and monsoon rain.",
      th: "เปลือกสานลึกที่โอบรอบตัวสามด้าน ออกแบบมาสำหรับระเบียงและชานบ้าน ทนแดดและฝนมรสุม",
    },
    outdoor: true,
  },
  {
    id: "sway",
    name: "Sway",
    cat: "living",
    type: { en: "Hanging chair", th: "เก้าอี้แขวน" },
    img: "saan/sway",
    ratio: 1600 / 2338,
    price: 14200,
    size: "W 95 x D 70 x H 128 cm, stand 195 cm",
    material: { en: "Rattan basket, powder coated steel stand", th: "ตะกร้าหวาย ขาตั้งเหล็กพ่นสี" },
    finishes: [white, nat],
    weeks: 4,
    blurb: {
      en: "Sold with its own stand, so it needs no hook in the ceiling. Rated for 120 kg.",
      th: "มาพร้อมขาตั้งในตัว ไม่ต้องเจาะเพดาน รับน้ำหนักได้ 120 กก.",
    },
  },
  {
    id: "atrium",
    name: "Atrium",
    cat: "living",
    type: { en: "Teak and cane sofa set", th: "ชุดโซฟาไม้สักและเคน" },
    img: "saan/two_chairs",
    ratio: 1600 / 2215,
    cut: { img: "saan/two_chairs-cut", ratio: 1011 / 1400 },
    price: 58000,
    size: "Sofa W 150 cm, two armchairs W 66 cm",
    material: { en: "Teak frame, woven cane panels", th: "โครงไม้สัก แผงเคนสาน" },
    finishes: [nat, honey],
    weeks: 8,
    blurb: {
      en: "A two seat sofa and a pair of armchairs with cane panels on the sides and back. The cushions are in a washable cotton twill.",
      th: "โซฟาสองที่นั่งกับอาร์มแชร์หนึ่งคู่ ข้างและพนักเป็นแผงเคนสาน เบาะผ้าคอตตอนทวิลถอดซักได้",
    },
  },
  {
    id: "bistro",
    name: "Bistro",
    cat: "dining",
    type: { en: "Stacking cafe chair", th: "เก้าอี้คาเฟ่ซ้อนได้" },
    img: "saan/bistro",
    ratio: 1600 / 1095,
    price: 5900,
    size: "W 48 x D 54 x H 86 cm",
    material: { en: "Aluminium frame, synthetic rattan weave", th: "โครงอะลูมิเนียม สานหวายเทียม" },
    finishes: [white, char],
    weeks: 4,
    blurb: {
      en: "The Paris pavement chair, built for Thai weather. Stacks eight high and hoses clean.",
      th: "เก้าอี้ริมทางแบบปารีส ทำมาเพื่ออากาศเมืองไทย ซ้อนได้ 8 ตัว ฉีดน้ำล้างได้",
    },
    outdoor: true,
  },
  {
    id: "terrace-set",
    name: "Terrace",
    cat: "dining",
    type: { en: "Dining set for six", th: "ชุดโต๊ะอาหาร 6 ที่นั่ง" },
    img: "saan/longtable",
    ratio: 1600 / 2338,
    price: 46500,
    size: "Table L 200 x W 95 cm, six armchairs",
    material: { en: "Rattan armchairs, teak table top", th: "อาร์มแชร์หวาย ท็อปโต๊ะไม้สัก" },
    finishes: [nat],
    weeks: 6,
    blurb: {
      en: "Long lunches in the garden. The armchairs have wide seats and low arms that slide under the table top.",
      th: "สำหรับมื้อยาวๆ ในสวน อาร์มแชร์เบาะกว้าง ที่วางแขนต่ำ สอดเข้าใต้โต๊ะได้พอดี",
    },
    outdoor: true,
  },
  {
    id: "sunroom",
    name: "Sunroom",
    cat: "dining",
    type: { en: "Low armchair", th: "อาร์มแชร์ทรงเตี้ย" },
    img: "saan/sunroom",
    ratio: 1600 / 2215,
    price: 12400,
    size: "W 70 x D 74 x H 76 cm",
    material: { en: "Rattan, cotton cushions", th: "หวาย เบาะผ้าฝ้าย" },
    finishes: [nat, white],
    weeks: 4,
    blurb: {
      en: "A low, wide armchair for conservatories and reading corners, sold with cushions in four colours.",
      th: "อาร์มแชร์ทรงเตี้ยและกว้าง สำหรับห้องกระจกและมุมอ่านหนังสือ เบาะมีให้เลือก 4 สี",
    },
  },
  {
    id: "cove",
    name: "Cove",
    cat: "outdoor",
    type: { en: "Modular terrace sofa", th: "โซฟาเอาท์ดอร์แบบโมดูลาร์" },
    img: "saan/cove",
    ratio: 1600 / 1095,
    price: 68000,
    size: "Corner W 240 x 240 cm",
    material: { en: "Synthetic rattan on aluminium, quick dry foam", th: "หวายเทียมบนโครงอะลูมิเนียม โฟมแห้งเร็ว" },
    finishes: [sand, char],
    weeks: 8,
    blurb: {
      en: "Corner, armless and end pieces clip together in any shape. The foam dries an hour after a storm.",
      th: "ชิ้นมุม ชิ้นกลาง และชิ้นปลาย ต่อเป็นรูปทรงไหนก็ได้ โฟมแห้งภายในชั่วโมงหลังฝนหยุด",
    },
    outdoor: true,
  },
  {
    id: "tide",
    name: "Tide",
    cat: "outdoor",
    type: { en: "Pool sunbed", th: "เตียงอาบแดดริมสระ" },
    img: "saan/sunbed",
    ratio: 1600 / 1095,
    price: 21500,
    size: "L 200 x W 72 cm, five back positions",
    material: { en: "Synthetic rattan, aluminium wheels", th: "หวายเทียม ล้ออะลูมิเนียม" },
    finishes: [white, sand],
    weeks: 6,
    blurb: {
      en: "Our most ordered piece for hotels. Wheels at the head end so one person can move it across wet tiles.",
      th: "ชิ้นที่โรงแรมสั่งมากที่สุด มีล้อที่ฝั่งหัว คนเดียวก็เข็นข้ามพื้นกระเบื้องเปียกได้",
    },
    outdoor: true,
  },
  {
    id: "deck",
    name: "Deck",
    cat: "outdoor",
    type: { en: "Folding deck chair", th: "เก้าอี้พับชายหาด" },
    img: "saan/deck",
    ratio: 1600 / 1095,
    price: 7800,
    size: "W 60 x D 110 x H 90 cm",
    material: { en: "Teak frame, woven seat", th: "โครงไม้สัก ที่นั่งสาน" },
    finishes: [nat],
    weeks: 4,
    blurb: {
      en: "Folds flat to 9 cm for storage in the rainy season. Teak greys softly if left untreated.",
      th: "พับเก็บได้บางเพียง 9 ซม. ช่วงหน้าฝน ไม้สักจะเปลี่ยนเป็นสีเทาสวยหากไม่เคลือบ",
    },
    outdoor: true,
  },
  {
    id: "drum",
    name: "Drum",
    cat: "lighting",
    type: { en: "Side table", th: "โต๊ะข้าง" },
    img: "saan/drum",
    ratio: 1600 / 2338,
    price: 4900,
    size: "D 50 x H 45 cm",
    material: { en: "Bent rattan rods", th: "ก้านหวายดัด" },
    finishes: [nat, honey],
    weeks: 3,
    blurb: {
      en: "Forty rattan rods bent around one ring. Takes a tray of drinks, or turns over as a stool.",
      th: "ก้านหวาย 40 ก้านดัดรอบวงเดียว วางถาดเครื่องดื่มได้ หรือคว่ำใช้เป็นสตูลก็ได้",
    },
  },
  {
    id: "pouf",
    name: "Pod",
    cat: "lighting",
    type: { en: "Lidded basket", th: "ตะกร้ามีฝา" },
    img: "saan/pouf",
    ratio: 1600 / 2215,
    price: 2200,
    size: "D 38 x H 30 cm",
    material: { en: "Rattan and woven cane", th: "หวายและเคนสาน" },
    finishes: [nat],
    weeks: 2,
    blurb: {
      en: "A low basket with a woven lid for throws and toys, light enough to carry from room to room.",
      th: "ตะกร้าทรงเตี้ยมีฝาสาน ใส่ผ้าห่มหรือของเล่น เบาพอจะถือย้ายห้องได้สบาย",
    },
  },
  {
    id: "lantern",
    name: "Lantern",
    cat: "lighting",
    type: { en: "Woven pendant", th: "โคมไฟแขวนสาน" },
    img: "saan/pendants",
    ratio: 1600 / 914,
    price: 5600,
    size: "D 45 x H 38 cm",
    material: { en: "Rattan shade, linen cord", th: "โคมหวาย สายผ้าลินิน" },
    finishes: [nat, white],
    weeks: 3,
    blurb: {
      en: "The weave throws a soft pattern on the ceiling. Hang three in a row over a dining table.",
      th: "ลายสานสะท้อนเงานุ่มๆ บนเพดาน แขวนสามดวงเรียงกันเหนือโต๊ะอาหารสวยที่สุด",
    },
  },
];

export const byId = (id: string) => products.find((p) => p.id === id);

export const projects = [
  { id: "villa", img: "saan/p_villa", name: { en: "Hillside pool villas, Phuket", th: "พูลวิลล่าบนเนินเขา ภูเก็ต" }, scope: { en: "84 sunbeds, 26 lounge sets", th: "เตียงอาบแดด 84 ตัว ชุดเลานจ์ 26 ชุด" }, year: 2025 },
  { id: "overwater", img: "saan/p_overwater", name: { en: "Overwater suites, Maldives", th: "ห้องพักกลางน้ำ มัลดีฟส์" }, scope: { en: "Terrace sets for 40 suites", th: "ชุดระเบียงสำหรับ 40 ห้องพัก" }, year: 2024 },
  { id: "garden", img: "saan/p_garden", name: { en: "Garden resort, Koh Samui", th: "การ์เด้นรีสอร์ท เกาะสมุย" }, scope: { en: "Pool deck and restaurant", th: "พื้นที่ริมสระและห้องอาหาร" }, year: 2025 },
  { id: "rooftop", img: "saan/p_rooftop", name: { en: "Rooftop bar, Pattaya", th: "รูฟท็อปบาร์ พัทยา" }, scope: { en: "Bar stools and daybeds", th: "สตูลบาร์และเดย์เบด" }, year: 2026 },
  { id: "cafe", img: "saan/p_cafe", name: { en: "All day cafe, Chiang Mai", th: "คาเฟ่ เชียงใหม่" }, scope: { en: "Seating for 60", th: "ที่นั่ง 60 ที่" }, year: 2026 },
];

export const ui = {
  nav: { en: ["Collection", "Projects", "Our story", "E-catalogue", "Contact"], th: ["สินค้า", "ผลงาน", "เรื่องราวของเรา", "แคตตาล็อก", "ติดต่อ"] },
  hero: { en: "Rattan furniture for living rooms, terraces and hotels, woven in Pathum Thani.", th: "เฟอร์นิเจอร์หวายสำหรับบ้าน ระเบียง และโรงแรม สานด้วยมือที่ปทุมธานี" },
  heroCta: { en: "Explore the collection", th: "ดูสินค้าทั้งหมด" },
  quote: { en: "Quote list", th: "รายการขอราคา" },
  add: { en: "Add to quote list", th: "เพิ่มในรายการขอราคา" },
  added: { en: "Added to your quote list", th: "เพิ่มในรายการขอราคาแล้ว" },
  from: { en: "From", th: "เริ่มต้น" },
  weeks: { en: "Made to order in", th: "ผลิตตามสั่งภายใน" },
  wk: { en: "weeks", th: "สัปดาห์" },
  all: { en: "All", th: "ทั้งหมด" },
  outdoorOk: { en: "Indoor and outdoor", th: "ใช้ได้ทั้งในและนอกบ้าน" },
};

export const tr = (t: T, l: Lang) => t[l];
