// Photos from Pexels (Pexels license). Files in /public/images/soniq as <slug>-800.webp and -1600.webp.

export type SoniqCat = "Headphones" | "Earbuds" | "Watches" | "Speakers" | "Smart home";
export type SoniqProduct = {
  id: string;
  name: string;
  cat: SoniqCat;
  price: number;
  was?: number;
  img: string;
  ratio: number;
  gallery: { img: string; ratio: number; alt: string }[];
  alt: string;
  tag: string;
  blurb: string;
  specs: [string, string][];
  box: string[];
  stock: number;
  color: string;
  swatch: string;
};

export const soniqCats: { name: SoniqCat; slug: string }[] = [
  { name: "Headphones", slug: "headphones" },
  { name: "Earbuds", slug: "earbuds" },
  { name: "Watches", slug: "watches" },
  { name: "Speakers", slug: "speakers" },
  { name: "Smart home", slug: "smart-home" },
];

const g = (img: string, ratio: number, alt: string) => ({ img: `soniq/${img}`, ratio, alt });

export const soniq: SoniqProduct[] = [
  {
    id: "halo",
    name: "Halo ANC",
    cat: "Headphones",
    price: 8990,
    was: 10490,
    img: "soniq/halo-white",
    ratio: 1600 / 1156,
    alt: "Ivory over-ear headphones on a pink background",
    gallery: [g("halo-white", 1600 / 1156, "Halo ANC in ivory"), g("halo-model", 1, "Woman wearing Halo ANC headphones"), g("halo-model-2", 1600 / 1095, "Adjusting Halo ANC on the head")],
    tag: "Quiet that adapts to the room",
    blurb: "Six microphones listen to the room and cancel the hum of the BTS, the office air conditioning or a long flight. Memory foam cushions in vegan leather keep them comfortable past hour three.",
    specs: [["Battery", "40 hours, 60 with ANC off"], ["Charging", "USB-C, 10 minutes for 5 hours"], ["Noise cancelling", "Adaptive, 6 microphones"], ["Codecs", "LDAC, AAC, SBC"], ["Weight", "254 g"], ["Bluetooth", "5.3 with multipoint"]],
    box: ["Halo ANC headphones", "Travel case", "USB-C cable", "3.5 mm audio cable"],
    stock: 14,
    color: "Ivory",
    swatch: "#efe9dc",
  },
  {
    id: "nocturne",
    name: "Nocturne",
    cat: "Headphones",
    price: 6490,
    img: "soniq/nocturne",
    ratio: 1600 / 1156,
    alt: "Black over-ear headphones on black",
    gallery: [g("nocturne", 1600 / 1156, "Nocturne headphones in black")],
    tag: "Deep bass, all day comfort",
    blurb: "A 40 mm driver tuned for weight at the low end without muddying voices. Fold flat into a slim pouch for the commute.",
    specs: [["Battery", "50 hours"], ["Charging", "USB-C"], ["Noise cancelling", "Passive"], ["Weight", "228 g"], ["Bluetooth", "5.3"]],
    box: ["Nocturne headphones", "Soft pouch", "USB-C cable"],
    stock: 20,
    color: "Black",
    swatch: "#1a1a1a",
  },
  {
    id: "lumen",
    name: "Lumen Fold",
    cat: "Headphones",
    price: 4290,
    img: "soniq/lumen",
    ratio: 1600 / 1156,
    alt: "Lilac folding headphones on a yellow background",
    gallery: [g("lumen", 1600 / 1156, "Lumen Fold in lilac")],
    tag: "Folds into a coat pocket",
    blurb: "Light, bright and built to be thrown in a bag. Volume is capped at a safe level for younger listeners with one long press.",
    specs: [["Battery", "35 hours"], ["Charging", "USB-C"], ["Safe volume mode", "85 dB limit"], ["Weight", "182 g"]],
    box: ["Lumen Fold headphones", "USB-C cable", "Sticker sheet"],
    stock: 30,
    color: "Lilac",
    swatch: "#cfc4e6",
  },
  {
    id: "vela",
    name: "Vela Studio",
    cat: "Headphones",
    price: 11900,
    img: "soniq/vela",
    ratio: 1600 / 1156,
    alt: "Indigo studio headphones on a black stand",
    gallery: [g("vela", 1600 / 1156, "Vela Studio on its stand"), g("studio", 1600 / 1095, "Recording a podcast with Vela Studio")],
    tag: "Flat, honest sound for creators",
    blurb: "Closed back monitors with a flat response, so what you mix is what everyone else hears. Comes with a weighted aluminium stand.",
    specs: [["Driver", "50 mm, 32 ohm"], ["Response", "5 Hz to 40 kHz"], ["Connection", "Wired, detachable cable"], ["Weight", "298 g"]],
    box: ["Vela Studio headphones", "Aluminium stand", "Coiled 3 m cable", "6.3 mm adapter"],
    stock: 8,
    color: "Indigo",
    swatch: "#5b5f9c",
  },
  {
    id: "ember",
    name: "Ember On-Ear",
    cat: "Headphones",
    price: 2490,
    img: "soniq/ember",
    ratio: 1600 / 1095,
    alt: "Red on-ear headphones on dark stones with smoke",
    gallery: [g("ember", 1600 / 1095, "Ember On-Ear in red"), g("ember-wired", 1600 / 2215, "Ember wired to a phone")],
    tag: "Wired, simple, loud",
    blurb: "No battery, no pairing, no app. Plug in and play, with a microphone on the cable for calls.",
    specs: [["Connection", "3.5 mm, inline mic"], ["Driver", "40 mm"], ["Weight", "148 g"]],
    box: ["Ember On-Ear headphones"],
    stock: 40,
    color: "Red",
    swatch: "#b3212b",
  },
  {
    id: "pulse",
    name: "Pulse Buds",
    cat: "Earbuds",
    price: 3990,
    img: "soniq/pulse-model",
    ratio: 1600 / 2338,
    alt: "Woman wearing a white earbud",
    gallery: [g("pulse-model", 1600 / 2338, "Pulse Buds worn")],
    tag: "Small enough to sleep in",
    blurb: "Low profile earbuds that sit flush in the ear, with noise cancelling and a case that charges on any wireless pad.",
    specs: [["Battery", "8 hours, 32 with case"], ["Noise cancelling", "Hybrid ANC"], ["Water", "IPX4"], ["Charging", "USB-C and wireless"]],
    box: ["Pulse Buds", "Charging case", "Four sizes of tips", "USB-C cable"],
    stock: 25,
    color: "White",
    swatch: "#f2f2f0",
  },
  {
    id: "orbit",
    name: "Orbit Sport",
    cat: "Watches",
    price: 7490,
    img: "soniq/orbit",
    ratio: 1600 / 2215,
    alt: "Smartwatch with an orange strap and a red ribbon on white",
    gallery: [g("orbit", 1600 / 2215, "Orbit Sport with orange strap"), g("orbit-hand", 1600 / 2215, "Orbit Sport held in a hand")],
    tag: "Two weeks between charges",
    blurb: "GPS, heart rate and sleep tracking in a light case with a strap that dries fast after a run along the river.",
    specs: [["Battery", "14 days typical"], ["Display", "1.4 inch AMOLED"], ["Water", "5 ATM"], ["Sensors", "GPS, heart rate, SpO2"]],
    box: ["Orbit Sport watch", "Magnetic charger", "Extra strap loop"],
    stock: 12,
    color: "Signal orange",
    swatch: "#ff5b1f",
  },
  {
    id: "orbit-classic",
    name: "Orbit Classic",
    cat: "Watches",
    price: 9990,
    img: "soniq/orbit-classic",
    ratio: 1536 / 2688,
    alt: "Black smartwatch with a steel case on a wrist",
    gallery: [g("orbit-classic", 1536 / 2688, "Orbit Classic on the wrist")],
    tag: "A smartwatch that passes for a watch",
    blurb: "A rotating steel bezel to scroll, a sapphire crystal and a link bracelet you can size at home with the included tool.",
    specs: [["Battery", "7 days typical"], ["Case", "46 mm stainless steel"], ["Crystal", "Sapphire"], ["Water", "5 ATM"]],
    box: ["Orbit Classic watch", "Magnetic charger", "Link removal tool"],
    stock: 6,
    color: "Graphite",
    swatch: "#2f3236",
  },
  {
    id: "tidal",
    name: "Tidal Party",
    cat: "Speakers",
    price: 5990,
    img: "soniq/tidal",
    ratio: 1600 / 914,
    alt: "Black portable party speaker with a microphone on an orange background",
    gallery: [g("tidal", 1600 / 914, "Tidal Party speaker with microphone")],
    tag: "Karaoke night, sorted",
    blurb: "A handle, a wireless microphone that docks in the top, and enough volume for a garden. Pairs with a second Tidal for stereo.",
    specs: [["Output", "60 W"], ["Battery", "18 hours"], ["Water", "IPX5"], ["Extras", "Wireless mic, guitar input"]],
    box: ["Tidal Party speaker", "Wireless microphone", "Charger"],
    stock: 10,
    color: "Black",
    swatch: "#222",
  },
  {
    id: "sentry",
    name: "Sentry Home Kit",
    cat: "Smart home",
    price: 3290,
    img: "soniq/sentry",
    ratio: 1600 / 1156,
    alt: "White indoor camera with a hub and a door sensor",
    gallery: [g("sentry", 1600 / 1156, "Sentry camera, hub and sensor")],
    tag: "See the living room from the office",
    blurb: "A 2K camera that pans and tilts, a hub and a door sensor. Recordings stay on a memory card at home unless you choose cloud backup.",
    specs: [["Video", "2K, night vision"], ["Storage", "microSD up to 256 GB"], ["Works with", "Google Home, Alexa"], ["Power", "USB-C"]],
    box: ["Pan and tilt camera", "Hub", "Door sensor", "Mounting kit"],
    stock: 18,
    color: "White",
    swatch: "#f4f4f4",
  },
];

export const soniqById = (id: string) => soniq.find((p) => p.id === id);
export const CARE = 590;

export const soniqSlides = [
  { id: "halo", img: "soniq/halo-model", ratio: 1, bg: "#cdc4c4", spot: { x: 0.72, y: 0.5 }, title: ["Smart tech,", "smarter living"], line: "Headphones, earbuds and watches built to disappear into your day." },
  { id: "pulse", img: "soniq/pulse-model", ratio: 1600 / 2338, bg: "#cfd1cd", spot: { x: 0.585, y: 0.4 }, title: ["Quiet in", "your pocket"], line: "Pulse Buds sit flush in the ear with hybrid noise cancelling and 32 hours in the case." },
  { id: "orbit", img: "soniq/orbit", ratio: 1600 / 2215, bg: "#f1f0f4", spot: { x: 0.47, y: 0.5 }, title: ["Two weeks,", "one charge"], line: "Orbit Sport tracks runs, sleep and heart rate, and only needs its charger twice a month." },
];
