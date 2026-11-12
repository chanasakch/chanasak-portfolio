"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  Cursor,
  ease,
  easeInOut,
  SmoothScroll,
  SplitLines,
  useFinePointer,
} from "@/components/shared/motion";
import { IMG_BASE } from "@/data/images";

const work = [
  {
    href: "/furniture",
    shot: "furniture",
    name: "Loom & Tide",
    font: '"Hanken Grotesk Variable", sans-serif',
    weight: 600,
    track: "-0.02em",
    bg: "#2b2f2a",
    ink: "#f4f2ee",
    job: "Rattan furniture maker",
    what: "A full shop: collection with filters, product pages with photo zoom, a quote list for hotels and restaurants, projects and showroom.",
    tags: ["8 pages", "Photo zoom", "Quote list"],
  },
  {
    href: "/parfum",
    shot: "parfum",
    name: "HOM",
    font: '"Cormorant Garamond", Georgia, serif',
    weight: 300,
    track: "0.3em",
    bg: "#1d1a14",
    ink: "#efe9df",
    job: "Perfume house",
    what: "The bottle is real-time 3D. It turns as you scroll, then you spin it, change the scent and print your initials on the label.",
    tags: ["Three.js", "360° product", "Label preview"],
  },
  {
    href: "/jewelry",
    shot: "jewelry",
    name: "PHLOI",
    font: '"Italiana", Georgia, serif',
    weight: 400,
    track: "0.4em",
    bg: "#0b0d11",
    ink: "#eee9df",
    job: "Fine jewellery",
    what: "Build a solitaire ring in 3D under studio light. Stone, metal, cut and carat change the ring and the price, and your engraving appears inside the band.",
    tags: ["Three.js", "Configurator", "Booking"],
  },
  {
    href: "/ceramics",
    shot: "ceramics",
    name: "DIN",
    font: '"Schibsted Grotesk Variable", sans-serif',
    weight: 800,
    track: "-0.05em",
    bg: "#ecebe6",
    ink: "#1b1b19",
    job: "Stoneware studio",
    what: "The shop is one wall of pieces you drag in any direction. Open a piece to magnify the glaze and add it to an order.",
    tags: ["Infinite canvas", "Magnifier", "Order drawer"],
  },
  {
    href: "/hotel",
    shot: "hotel",
    name: "Ruen Doi",
    font: '"Bodoni Moda Variable", serif',
    weight: 400,
    track: "0",
    bg: "#17221e",
    ink: "#e9e4d8",
    job: "Boutique hotel",
    what: "One day at the hotel, from morning mist to night. The colours change with the hour, then a calendar shows rates and holds a room.",
    tags: ["Scroll story", "Rate calendar", "Room hold"],
  },
  {
    href: "/silk",
    shot: "silk",
    name: "Mudmee House",
    font: '"Gilda Display", Georgia, serif',
    weight: 400,
    track: "0.01em",
    bg: "#170f15",
    ink: "#f1e6d4",
    job: "Hand-woven silk",
    what: "Design an ikat scarf in natural dyes. The pattern is woven on screen row by row, then hangs as real-time 3D silk that moves in the breeze.",
    tags: ["Generative weaving", "3D silk", "Made to order"],
  },
  {
    href: "/coffee",
    shot: "coffee",
    name: "Sung Coffee",
    font: '"Fraunces Variable", Georgia, serif',
    weight: 300,
    track: "-0.02em",
    bg: "#15100d",
    ink: "#efe4d2",
    job: "Coffee roaster",
    what: "A contour map of the farms, a taste chart that reshapes for each coffee, a brew timer that walks you through the pour, and subscriptions.",
    tags: ["Map", "Taste chart", "Brew timer", "Cart"],
  },
  {
    href: "/charter",
    shot: "charter",
    name: "NAVA",
    font: '"Libre Caslon Display", Georgia, serif',
    weight: 400,
    track: "0.3em",
    bg: "#0b1d27",
    ink: "#ece6d8",
    job: "Boat charter, Phuket",
    what: "Tap islands on a sea chart and the route, the day's timeline, sunset warnings and the price are worked out as you go.",
    tags: ["Route planner", "Timeline", "Live pricing"],
  },
  {
    href: "/residence",
    shot: "residence",
    name: "RIM NAM",
    font: '"Inter Tight Variable", sans-serif',
    weight: 750,
    track: "-0.04em",
    bg: "#dddbd5",
    ink: "#14171a",
    job: "Riverside condominium",
    what: "Pick a floor on the tower to see which units are left, open the plan room by room and work out the down payment.",
    tags: ["Stacking plan", "Floor plans", "Payment calculator"],
  },
];

const jobs = [
  {
    logo: "garena.webp",
    co: "Garena Online (Thailand)",
    role: "Full Stack Engineer",
    when: "Oct 2025 to now",
    note: "Lead product delivery end to end, from PRD and system design to release, UAT and user training. Go, React, MySQL, Redis, RabbitMQ, Grafana.",
  },
  {
    logo: "realsmart.svg",
    co: "Real Smart",
    role: "Developer",
    when: "Aug 2024 to Sep 2025",
    note: "LLM chatbot and text tools, and a course and accommodation booking site with live availability. Vue, Nuxt, Node.js, Laravel.",
  },
  {
    logo: "bookdose.webp",
    co: "Bookdose",
    role: "Full Stack Web Developer",
    when: "Mar 2023 to Jul 2024",
    note: "E-library, e-commerce and e-learning systems for partners such as the Golden Jubilee Museum of Agriculture, plus APIs for the mobile apps.",
  },
  {
    logo: "act.webp",
    co: "Assumption College Thonburi",
    role: "Web Developer, internship",
    when: "Feb to May 2022",
    note: "Built the library system alone, from interviews with staff to deployment on the school server.",
  },
  {
    logo: "vpadvance.webp",
    co: "VP Advance",
    role: "Front-end Developer, internship",
    when: "Mar to Jun 2021",
    note: "Front-end for the Eastern Economic Corridor (EEC) information system.",
  },
];

const skills = [
  [
    "Build",
    "Go (Fiber), React, Next.js, Node.js, TypeScript, Vue, Nuxt, Laravel, Three.js",
  ],
  ["Data", "MySQL, MongoDB, Redis, RabbitMQ, schema design, query tuning"],
  [
    "Ship",
    "Docker, Nginx, GitLab CI, GitHub Actions, CDN and object storage, Grafana",
  ],
  ["Test", "Playwright, Cypress, manual test plans, UAT"],
  ["Plan", "PRDs, user flows, acceptance criteria, ERD, C4, sequence diagrams"],
];

const certs = [
  {
    title: "Supervised Machine Learning: Regression and Classification",
    by: "DeepLearning.AI and Stanford",
    logo: "stanford.svg",
  },
  {
    title: "Introduction to Front-End Development",
    by: "Meta",
    logo: "meta.svg",
  },
  {
    title: "Introduction to Databases for Back-End Development",
    by: "Meta",
    logo: "meta.svg",
  },
  { title: "Programming with JavaScript", by: "Meta", logo: "meta.svg" },
  {
    title: "Introduction to Agile Development and Scrum",
    by: "IBM",
    logo: "ibm.svg",
  },
  {
    title: "AWS Cloud Technical Essentials",
    by: "Amazon Web Services",
    logo: "aws.svg",
  },
];

const awards = [
  { title: "Hackathon Teaching Academy Award", when: "2020" },
  {
    title:
      "CRU Robot Games: Nuclear Fusion Mechanical Innovation Power Plant for Humanity",
    when: "2019",
  },
  {
    title: "Software Innovation Teaching Academy Award, 1st runner-up",
    when: "2019",
  },
];

const stack = [
  "go",
  "fiber",
  "react",
  "nodejs",
  "typescript",
  "vue",
  "nuxt",
  "laravel",
  "mysql",
  "mongodb",
  "redis",
  "rabbitmq",
  "docker",
  "nginx",
  "gitlab",
  "githubactions",
  "grafana",
  "playwright",
  "cypress",
];

const logo = (f: string) => `${IMG_BASE}logos/${f}`;

function Logo({
  src,
  size = 40,
  className = "",
}: {
  src: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5 ring-1 ring-black/5 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo(src)}
        alt=""
        className="max-h-full max-w-full object-contain"
        loading="lazy"
      />
    </span>
  );
}

const shot = (s: string, w: 700 | 1400) => `${IMG_BASE}work/${s}-${w}.webp`;

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 mix-blend-difference text-white">
      <div className="flex items-center justify-between px-[var(--gutter)] py-5 text-[14px]">
        <Link href="/" className="font-semibold tracking-[-0.01em]">
          Chanasak Choonuch
        </Link>
        <nav className="flex gap-5 sm:gap-7">
          <a href="#work">Work</a>
          <a href="#process" className="hidden sm:inline">
            Process
          </a>
          <a href="#experience" className="hidden sm:inline">
            Experience
          </a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}

const wallRows = [
  [
    "furniture",
    "parfum",
    "silk",
    "jewelry",
    "ceramics",
    "charter",
    "hotel",
    "coffee",
    "residence",
  ],
  [
    "hotel",
    "coffee",
    "residence",
    "charter",
    "ceramics",
    "furniture",
    "jewelry",
    "silk",
    "parfum",
  ],
];

/** Phones: the same tilted wall drifting on its own, so it runs on the GPU and never fights the finger. */
function WallTouch() {
  return (
    <div
      className="relative overflow-hidden py-4 [perspective:1100px]"
      aria-hidden
    >
      <div className="space-y-3 [transform:rotateX(16deg)_scale(0.94)] [transform-origin:50%_0]">
        {wallRows.map((items, r) => (
          <div
            key={r}
            className={`flex w-max gap-3 pr-3 will-change-transform ${r ? "animate-[wall_46s_linear_infinite_reverse]" : "animate-[wall_40s_linear_infinite]"}`}
          >
            {[...items, ...items].map((s, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={shot(s, 700)}
                alt=""
                decoding="async"
                className="aspect-[16/10] w-[64vw] shrink-0 rounded-md object-cover shadow-[0_10px_24px_-14px_rgb(0_0_0/0.45)]"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Tilted wall of the sites that straightens as you scroll. */
function Wall() {
  return useFinePointer() ? <WallScroll /> : <WallTouch />;
}

function WallScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [32, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.86, 1]);
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-22%", "0%"]);
  const rows: [string[], MotionValue<string>][] = [
    [wallRows[0], x1],
    [wallRows[1], x2],
  ];
  return (
    <div
      ref={ref}
      className="relative overflow-hidden py-6 [perspective:1400px]"
    >
      <motion.div
        style={{ rotateX, scale }}
        className="origin-top space-y-4 sm:space-y-6"
      >
        {rows.map(([items, x], r) => (
          <motion.div
            key={r}
            style={{ x }}
            className="flex w-max gap-4 sm:gap-6"
          >
            {[...items, ...items.slice(0, 2)].map((s, i) => {
              const w = work.find((k) => k.shot === s)!;
              return (
                <Link
                  key={i}
                  href={w.href}
                  className="block w-[62vw] shrink-0 overflow-hidden rounded-lg shadow-[0_30px_60px_-20px_rgb(0_0_0/0.35)] sm:w-[34vw]"
                  tabIndex={-1}
                  aria-hidden
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shot(s, 700)}
                    alt=""
                    className="aspect-[16/10] w-full object-cover"
                    loading={i < 4 ? "eager" : "lazy"}
                  />
                </Link>
              );
            })}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/** Portrait that leans toward the pointer, with a live Bangkok clock under it. */
function Portrait() {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 150, damping: 15 });
  const sy = useSpring(ry, { stiffness: 150, damping: 15 });
  const [now, setNow] = useState("");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
    });
    const tick = () => setNow(f.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.4, ease }}
      className="hidden w-[clamp(140px,17vw,260px)] shrink-0 [perspective:800px] sm:block"
    >
      <motion.div
        style={{ rotateX: sx, rotateY: sy }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 16);
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 16);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        className="overflow-hidden rounded-2xl shadow-[0_30px_60px_-25px_rgb(0_0_0/0.4)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${IMG_BASE}me/me-610.webp`}
          srcSet={`${IMG_BASE}me/me-320.webp 320w, ${IMG_BASE}me/me-610.webp 610w`}
          sizes="260px"
          alt="Chanasak Choonuch"
          className="aspect-[4/5] w-full object-cover"
        />
      </motion.div>
      <p className="mt-3 flex items-center gap-2 text-[12.5px] text-muted">
        <span className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#3fa66b] opacity-60" />
          <span className="relative size-2 rounded-full bg-[#3fa66b]" />
        </span>
        Open to freelance
        {now && <span className="tabular ml-auto">Bangkok {now}</span>}
      </p>
    </motion.div>
  );
}

/** Copies the address and says so; a plain mail link would do nothing in some browsers. */
function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }}
      className="rounded-full border border-bg/30 px-5 py-2.5 text-[14px] transition-colors hover:bg-bg hover:text-ink"
    >
      {copied ? "Copied" : "Copy address"}
    </button>
  );
}

const steps = [
  {
    t: "Listen",
    d: "We talk through the business, the customers and what the site has to do. I look at what you have now and the sites you like.",
    out: "A short brief and a site map",
  },
  {
    t: "Gather",
    d: "Logo, photos, colours, type and product details go onto one board, so we agree on the look before any page is drawn.",
    out: "A brand board",
  },
  {
    t: "Shape",
    d: "I design the key pages in your brand, with real products and copy, and share a link you can open on your phone.",
    out: "Clickable designs",
  },
  {
    t: "Review",
    d: "You comment right on the designs. I change them and mark each note done, so nothing gets lost in a chat thread.",
    out: "Signed-off designs",
  },
  {
    t: "Build",
    d: "The site is built page by page on a preview link that updates as I go, so nothing arrives as a surprise at the end.",
    out: "A working site to test",
  },
  {
    t: "Test",
    d: "Every page is checked on real phones, tablets and computers, along with forms, emails and loading speed.",
    out: "A tested site",
  },
  {
    t: "Launch",
    d: "I connect the domain, move the site live and watch it closely for the first days.",
    out: "Your site, live",
  },
  {
    t: "Hand over",
    d: "Your team learns to change products, prices and photos themselves, and I stay on hand for questions.",
    out: "A site your team can run",
  },
];

const frame =
  "overflow-hidden rounded-xl bg-white shadow-[0_40px_80px_-40px_rgb(20_20_19/0.45)] ring-1 ring-black/5";

function BrowserBar({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-black/5 bg-[#f6f6f3] px-3 py-2">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-2 rounded-full bg-black/10" />
      ))}
      <span className="ml-3 truncate rounded-md bg-white px-2.5 py-0.5 text-[11px] text-black/45 ring-1 ring-black/5">
        {url}
      </span>
    </div>
  );
}

/** Step 1: the site map draws itself. */
function MapVisual({ on }: { on: boolean }) {
  const nodes = [
    { x: 50, y: 16, l: "Home" },
    { x: 14, y: 52, l: "Shop" },
    { x: 38, y: 52, l: "Projects" },
    { x: 62, y: 52, l: "About" },
    { x: 86, y: 52, l: "Contact" },
    { x: 8, y: 84, l: "Category" },
    { x: 26, y: 84, l: "Product" },
  ];
  const links: [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 5],
    [1, 6],
  ];
  return (
    <div className={`${frame} aspect-[4/3] bg-[#fbfbf9] p-[6%]`}>
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        {links.map(([a, b], i) => (
          <motion.path
            key={i}
            d={`M${nodes[a].x} ${nodes[a].y + 5} C ${nodes[a].x} ${(nodes[a].y + nodes[b].y) / 2}, ${nodes[b].x} ${(nodes[a].y + nodes[b].y) / 2}, ${nodes[b].x} ${nodes[b].y - 5}`}
            fill="none"
            stroke="#141413"
            strokeOpacity="0.3"
            strokeWidth="0.35"
            initial={false}
            animate={{ pathLength: on ? 1 : 0 }}
            transition={{
              duration: 0.9,
              delay: on ? 0.15 + i * 0.12 : 0,
              ease,
            }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.g
            key={n.l}
            initial={false}
            animate={{
              opacity: on || i === 0 ? 1 : 0.15,
              y: on || i === 0 ? 0 : 3,
            }}
            transition={{ duration: 0.6, delay: on ? i * 0.1 : 0, ease }}
          >
            <rect
              x={n.x - 9}
              y={n.y - 4.6}
              width="18"
              height="9.2"
              rx="2"
              fill={i === 0 ? "#141413" : "#fff"}
              stroke="#141413"
              strokeOpacity="0.2"
              strokeWidth="0.3"
            />
            <text
              x={n.x}
              y={n.y + 1.3}
              fontSize="3.4"
              textAnchor="middle"
              fill={i === 0 ? "#f3f3f0" : "#141413"}
            >
              {n.l}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

/** Step 2: grey wireframe, then the finished design wipes across it. */
function DesignVisual({ on }: { on: boolean }) {
  return (
    <div className={`${frame} aspect-[4/3]`}>
      <BrowserBar url="figma.com/loom-and-tide" />
      <div className="relative h-full">
        <div className="absolute inset-0 space-y-3 p-5" aria-hidden>
          <div className="h-[46%] rounded bg-black/[0.06]" />
          <div className="h-3 w-1/2 rounded bg-black/[0.08]" />
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] rounded bg-black/[0.05]" />
            ))}
          </div>
        </div>
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ clipPath: on ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
          transition={{ duration: 1.4, delay: on ? 0.3 : 0, ease: easeInOut }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shot("furniture", 1400)}
            alt=""
            className="h-full w-full object-cover object-left-top"
          />
        </motion.div>
        <motion.span
          className="absolute inset-y-0 w-px bg-[#141413]"
          initial={false}
          animate={{ left: on ? "100%" : "0%", opacity: on ? [1, 1, 0] : 0 }}
          transition={{ duration: 1.4, delay: on ? 0.3 : 0, ease: easeInOut }}
        />
      </div>
    </div>
  );
}

/** Step 3: a preview link that keeps filling in as pages are built. */
function BuildVisual({ on }: { on: boolean }) {
  return (
    <div className={`${frame} relative aspect-[4/3]`}>
      <BrowserBar url="preview.loom-and-tide.vercel.app" />
      <motion.div
        className="absolute left-0 top-[33px] h-0.5 bg-[#3fa66b]"
        initial={false}
        animate={{ width: on ? "100%" : "0%" }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
      />
      <div
        className="h-full w-full bg-[length:100%_auto] transition-[background-position] duration-[6000ms] ease-in-out"
        style={{
          backgroundImage: `url(${IMG_BASE}work/furniture-long.webp)`,
          backgroundPosition: on ? "50% 70%" : "50% 0%",
        }}
      />
      <motion.span
        initial={false}
        animate={{ opacity: on ? 1 : 0, y: on ? 0 : 8 }}
        transition={{ delay: on ? 1.2 : 0, duration: 0.5 }}
        className="absolute bottom-4 left-4 rounded-full bg-[#141413] px-3 py-1.5 text-[11.5px] text-[#f3f3f0] shadow-lg"
      >
        Updated 2 minutes ago
      </motion.span>
    </div>
  );
}

/** Step 4: live on a phone, with its own address. */
function LaunchVisual({ on }: { on: boolean }) {
  return (
    <div className="relative flex aspect-[4/3] items-center justify-center rounded-xl bg-[#e8e7e2]">
      <motion.div
        initial={false}
        animate={{ y: on ? 0 : 24, rotate: on ? -4 : 0 }}
        transition={{ duration: 1, ease }}
        className="relative h-[86%] w-auto overflow-hidden rounded-[26px] border-[6px] border-[#141413] bg-white shadow-[0_40px_80px_-30px_rgb(20_20_19/0.6)]"
        style={{ aspectRatio: "9 / 19" }}
      >
        <div className="absolute inset-x-0 top-0 z-10 mx-auto mt-1.5 h-3.5 w-14 rounded-full bg-[#141413]" />
        <div
          className="h-full w-full bg-cover"
          style={{
            backgroundImage: `url(${IMG_BASE}work/furniture-mobile.webp)`,
            backgroundPosition: "50% 0",
          }}
        />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ opacity: on ? 1 : 0, x: on ? 0 : -12 }}
        transition={{ delay: on ? 0.6 : 0, duration: 0.6, ease }}
        className="absolute right-[8%] top-[18%] rounded-full bg-white px-3.5 py-2 text-[12px] shadow-xl ring-1 ring-black/5"
      >
        <span className="mr-2 inline-block size-2 rounded-full bg-[#3fa66b]" />
        loomandtide.co is live
      </motion.div>
    </div>
  );
}

/** Step 2: brand material pinned to one board. */
function GatherVisual({ on }: { on: boolean }) {
  const pics = [
    "rattan-armchair-studio",
    "balcony-rattan-pods",
    "bell-pendants-kitchen",
  ];
  const sw = ["#fbfbf9", "#d8b98a", "#2b2f2a", "#1d1c1a"];
  const pop = (i: number) => ({
    initial: false as const,
    animate: { opacity: on ? 1 : 0, y: on ? 0 : 14, scale: on ? 1 : 0.96 },
    transition: { duration: 0.6, delay: on ? 0.1 + i * 0.12 : 0, ease },
  });
  return (
    <div
      className={`${frame} grid aspect-[4/3] grid-cols-[1.2fr_1fr] gap-3 bg-[#fbfbf9] p-[5%]`}
    >
      <motion.div
        {...pop(0)}
        className="row-span-2 overflow-hidden rounded-lg bg-cover bg-center"
        style={{ backgroundImage: `url(${IMG_BASE}${pics[0]}-800.webp)` }}
      />
      <motion.div
        {...pop(1)}
        className="overflow-hidden rounded-lg bg-cover bg-center"
        style={{ backgroundImage: `url(${IMG_BASE}${pics[1]}-800.webp)` }}
      />
      <div className="grid grid-rows-[1fr_auto] gap-3">
        <motion.div
          {...pop(2)}
          className="overflow-hidden rounded-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${IMG_BASE}${pics[2]}-800.webp)` }}
        />
        <motion.div
          {...pop(3)}
          className="flex items-center justify-between rounded-lg bg-white p-2.5 ring-1 ring-black/5"
        >
          <div className="flex -space-x-1.5">
            {sw.map((c) => (
              <span
                key={c}
                className="size-6 rounded-full ring-2 ring-white"
                style={{
                  background: c,
                  boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.08)",
                }}
              />
            ))}
          </div>
          <span className="text-[20px] font-semibold leading-none tracking-[-0.03em] text-[#141413]">
            Aa
          </span>
        </motion.div>
      </div>
    </div>
  );
}

/** Step 4: comments land on the design and get resolved. */
function ReviewVisual({ on }: { on: boolean }) {
  const notes = [
    { x: "62%", y: "30%", t: "Can the headline be one line?" },
    { x: "22%", y: "58%", t: "Use the teak chair here" },
    { x: "70%", y: "72%", t: "Price a little larger" },
  ];
  return (
    <div className={`${frame} relative aspect-[4/3]`}>
      <BrowserBar url="figma.com/loom-and-tide/comments" />
      <div className="relative h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot("furniture", 1400)}
          alt=""
          className="h-full w-full object-cover object-left-top opacity-90"
        />
        {notes.map((n, i) => (
          <motion.div
            key={n.t}
            className="absolute flex items-start gap-2"
            style={{ left: n.x, top: n.y }}
            initial={false}
            animate={{ opacity: on ? 1 : 0, y: on ? 0 : 8 }}
            transition={{ duration: 0.5, delay: on ? 0.3 + i * 0.45 : 0, ease }}
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full rounded-bl-none bg-[#141413] text-[11px] text-white shadow-lg">
              {i + 1}
            </span>
            <span className="whitespace-nowrap rounded-lg bg-white px-2.5 py-1.5 text-[11.5px] text-[#141413] shadow-xl ring-1 ring-black/5">
              {n.t}
              <motion.span
                className="ml-2 inline-block text-[#3fa66b]"
                initial={false}
                animate={{ opacity: on ? 1 : 0 }}
                transition={{ delay: on ? 2 + i * 0.3 : 0 }}
              >
                Done
              </motion.span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Step 6: checked on the screens people really use. */
function TestVisual({ on }: { on: boolean }) {
  const checks = [
    "iPhone, Safari",
    "Android, Chrome",
    "iPad",
    "Mac and Windows",
    "Forms and emails",
  ];
  return (
    <div
      className={`${frame} grid aspect-[4/3] grid-cols-[1.4fr_1fr] items-center gap-6 bg-[#fbfbf9] p-[6%]`}
    >
      <div className="relative h-[78%]">
        <div
          className="absolute inset-y-0 left-0 right-[22%] overflow-hidden rounded-md border-[5px] border-[#141413] bg-cover bg-top"
          style={{ backgroundImage: `url(${shot("furniture", 700)})` }}
        />
        <motion.div
          initial={false}
          animate={{ y: on ? 0 : 20, opacity: on ? 1 : 0 }}
          transition={{ duration: 0.7, delay: on ? 0.2 : 0, ease }}
          className="absolute bottom-[-6%] right-[4%] h-[72%] overflow-hidden rounded-[14px] border-[4px] border-[#141413] bg-cover bg-top shadow-xl"
          style={{
            aspectRatio: "9 / 19",
            backgroundImage: `url(${IMG_BASE}work/furniture-mobile.webp)`,
          }}
        />
      </div>
      <ul className="space-y-2.5 text-[12.5px] text-[#141413]">
        {checks.map((c, i) => (
          <li key={c} className="flex items-center gap-2">
            <span className="relative flex size-5 items-center justify-center rounded-full border border-black/15">
              <motion.span
                className="absolute inset-0 rounded-full bg-[#3fa66b]"
                initial={false}
                animate={{ scale: on ? 1 : 0 }}
                transition={{ duration: 0.35, delay: on ? 0.5 + i * 0.25 : 0 }}
              />
              <svg viewBox="0 0 12 12" className="relative size-3" aria-hidden>
                <motion.path
                  d="M2.5 6.2 5 8.5 9.5 3.5"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={false}
                  animate={{ pathLength: on ? 1 : 0 }}
                  transition={{
                    duration: 0.3,
                    delay: on ? 0.65 + i * 0.25 : 0,
                  }}
                />
              </svg>
            </span>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Step 8: your team changes a price and it goes live. */
function HandoverVisual({ on }: { on: boolean }) {
  const [price, setPrice] = useState("18,500");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (!on) return;
    const seq = [
      "18,50",
      "18,5",
      "18,",
      "18",
      "1",
      "17",
      "17,",
      "17,9",
      "17,90",
      "17,900",
    ];
    const ids = seq.map((v, i) =>
      window.setTimeout(() => setPrice(v), 700 + i * 110),
    );
    ids.push(window.setTimeout(() => setSaved(true), 2200));
    return () => {
      ids.forEach(clearTimeout);
      setPrice("18,500");
      setSaved(false);
    };
  }, [on]);
  return (
    <div className={`${frame} relative grid aspect-[4/3] grid-cols-[30%_1fr]`}>
      <div className="space-y-2 border-r border-black/5 bg-[#f6f6f3] p-4 text-[12px] text-black/50">
        <p className="mb-4 font-semibold text-[#141413]">Loom &amp; Tide</p>
        {["Products", "Projects", "Pages", "Orders"].map((x, i) => (
          <p
            key={x}
            className={
              i === 0
                ? "rounded-md bg-white px-2 py-1 text-[#141413] ring-1 ring-black/5"
                : "px-2 py-1"
            }
          >
            {x}
          </p>
        ))}
      </div>
      <div className="space-y-3 p-5 text-[12px] text-[#141413]">
        <div className="flex items-center gap-3">
          <span
            className="size-12 rounded-md bg-cover bg-center"
            style={{
              backgroundImage: `url(${IMG_BASE}rattan-armchair-studio-800.webp)`,
            }}
          />
          <div>
            <p className="font-semibold">Kanok armchair</p>
            <p className="text-black/45">3 finishes</p>
          </div>
        </div>
        <label className="block">
          <span className="text-black/45">Price</span>
          <span className="mt-1 flex items-center rounded-md px-2.5 py-2 ring-1 ring-[#141413]">
            ฿<span className="tabular">{price}</span>
            {on && !saved && (
              <span className="ml-px h-3.5 w-px animate-pulse bg-[#141413]" />
            )}
          </span>
        </label>
        <span
          className={`inline-flex rounded-md px-3 py-1.5 transition-colors duration-300 ${saved ? "bg-[#3fa66b] text-white" : "bg-[#141413] text-white"}`}
        >
          {saved ? "Published" : "Publish"}
        </span>
      </div>
      <motion.p
        initial={false}
        animate={{ opacity: saved ? 1 : 0, y: saved ? 0 : 10 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-4 right-4 rounded-full bg-[#141413] px-3.5 py-2 text-[11.5px] text-white shadow-lg"
      >
        Live on the site
      </motion.p>
    </div>
  );
}

const visuals = [
  MapVisual,
  GatherVisual,
  DesignVisual,
  ReviewVisual,
  BuildVisual,
  TestVisual,
  LaunchVisual,
  HandoverVisual,
];

/** The steps of a project. On large screens a picture of each step stays in view and changes as you read. */
function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const fine = useFinePointer();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 50%"],
  });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach(
          (e) =>
            e.isIntersecting &&
            setActive(Number((e.target as HTMLElement).dataset.i)),
        ),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="process" className="px-[var(--gutter)] pt-32">
      <div className="grid gap-4 lg:grid-cols-2 lg:items-end">
        <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
          How a project runs
        </h2>
        <p className="max-w-[44ch] text-[16px] leading-relaxed text-muted lg:justify-self-end">
          The same steps whether it is a shop, a booking site or a brand page.
          You can see where things stand at any point.
        </p>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="relative hidden lg:block">
          <div className="sticky top-[18vh]">
            <div className="relative">
              {visuals.map((V, i) => (
                <motion.div
                  key={i}
                  className={i ? "absolute inset-0" : "relative"}
                  initial={false}
                  animate={{
                    opacity: active === i ? 1 : 0,
                    scale: active === i ? 1 : 0.97,
                  }}
                  transition={{ duration: 0.6, ease }}
                  style={{ pointerEvents: active === i ? "auto" : "none" }}
                >
                  <V on={active === i} />
                </motion.div>
              ))}
            </div>
            <div className="mt-5 flex gap-1.5">
              {steps.map((s, i) => (
                <span
                  key={s.t}
                  className="h-0.5 flex-1 overflow-hidden rounded-full bg-line"
                >
                  <motion.span
                    className="block h-full bg-ink"
                    initial={false}
                    animate={{ width: i <= active ? "100%" : "0%" }}
                    transition={{ duration: 0.6, ease }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div ref={ref} className="relative pl-10 sm:pl-14">
          <span className="absolute bottom-2 left-[11px] top-2 w-px bg-line sm:left-[15px]" />
          <motion.span
            className="absolute left-[11px] top-2 w-px origin-top bg-ink sm:left-[15px]"
            style={{ height: fine ? fill : "calc(100% - 16px)" }}
          />
          <ol className="space-y-16 lg:space-y-[22vh] lg:py-[14vh]">
            {steps.map((s, i) => {
              const V = visuals[i];
              return (
                <li
                  key={s.t}
                  ref={(el) => {
                    items.current[i] = el;
                  }}
                  data-i={i}
                  className="relative"
                >
                  <span
                    className={`tabular absolute -left-10 top-0 flex size-6 items-center justify-center rounded-full border text-[12px] transition-colors duration-500 sm:-left-14 sm:size-8 sm:text-[13px] ${active >= i ? "border-ink bg-ink text-bg" : "border-line bg-bg text-muted"}`}
                  >
                    {i + 1}
                  </span>
                  <h3
                    className={`text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold tracking-[-0.03em] transition-colors duration-500 ${active === i ? "text-ink" : "lg:text-ink/40"}`}
                  >
                    {s.t}
                  </h3>
                  <p className="mt-2 max-w-[48ch] text-[16px] leading-relaxed text-muted">
                    {s.d}
                  </p>
                  <p className="mt-4 inline-flex rounded-full bg-soft px-3.5 py-1.5 text-[13px]">
                    {s.out}
                  </p>
                  <div className="mt-6 lg:hidden">
                    <V on={active === i} />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

const included = [
  [
    "Designed for your brand",
    "Your colours, type and photos, not a theme with your logo on it.",
  ],
  [
    "Works on every screen",
    "Laid out for phones first, then tablets and large screens.",
  ],
  [
    "Content you can edit",
    "Products, prices, photos and pages updated by your team without code.",
  ],
  [
    "Fast and easy to find",
    "Quick to load, with page titles, descriptions and sharing previews set up.",
  ],
  [
    "Launch handled",
    "Domain, hosting, forms and analytics connected and tested.",
  ],
  [
    "Help after launch",
    "A direct line to me for fixes and questions once the site is live.",
  ],
];

/** A plain checklist: what every project includes. Each tick draws as it comes into view. */
function Included() {
  return (
    <section className="px-[var(--gutter)] pt-32">
      <div className="grid gap-10 rounded-3xl bg-ink px-6 py-14 text-bg sm:px-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20 lg:px-16 lg:py-20">
        <div>
          <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
            What you get
          </h2>
          <p className="mt-4 max-w-[34ch] text-[16px] leading-relaxed text-bg/60">
            Part of every project, whatever its size.
          </p>
        </div>
        <ul className="divide-y divide-bg/10 border-y border-bg/10">
          {included.map(([t, d], i) => (
            <motion.li
              key={t}
              initial="off"
              whileInView="on"
              viewport={{ once: true, margin: "-12% 0px" }}
              className="grid grid-cols-[2rem_1fr] items-baseline gap-x-4 py-5 sm:grid-cols-[2rem_minmax(0,0.9fr)_minmax(0,1.3fr)] sm:gap-x-6"
            >
              <span className="relative top-1 flex size-6 items-center justify-center rounded-full border border-bg/25">
                <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
                  <motion.path
                    d="M2.5 6.2 5 8.5 9.5 3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={{
                      off: { pathLength: 0 },
                      on: {
                        pathLength: 1,
                        transition: {
                          duration: 0.5,
                          delay: 0.15 + i * 0.06,
                          ease,
                        },
                      },
                    }}
                  />
                </svg>
              </span>
              <p className="text-[17px] font-semibold tracking-[-0.015em]">
                {t}
              </p>
              <p className="col-start-2 mt-1 text-[15px] leading-relaxed text-bg/60 sm:col-start-3 sm:mt-0">
                {d}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const faqs = [
  [
    "What do you need from me to start?",
    "Your logo, any brand guide you have, product or service details, and good photos if you have them. A list of two or three sites you like helps a lot. If photos are missing, I can suggest a photographer or work with what you have.",
  ],
  [
    "Can my team update the site ourselves?",
    "Yes. Products, prices, photos and most pages are edited in a simple admin, and I walk your team through it before launch.",
  ],
  [
    "What does it cost to keep running?",
    "Usually a domain renewal each year, plus hosting that is often free or low cost for small and medium sites. It depends on traffic and features, and I explain the options before we choose.",
  ],
  [
    "Can you work from our current website?",
    "Yes. I can move your existing products, pages and images across, and set up redirects so old links and search rankings are kept.",
  ],
  [
    "How do we stay in touch during the project?",
    "A short check-in each week, a preview link you can open any time, and LINE or email for quick questions.",
  ],
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      id="faq"
      className="grid gap-10 px-[var(--gutter)] pt-32 lg:grid-cols-[1fr_1.6fr] lg:gap-20"
    >
      <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
        Questions clients ask
      </h2>
      <ul className="border-t border-line">
        {faqs.map(([q, a], i) => {
          const on = open === i;
          return (
            <li key={q} className="border-b border-line">
              <button
                type="button"
                onClick={() => setOpen(on ? null : i)}
                aria-expanded={on}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span
                  className={`text-[clamp(1.05rem,1.6vw,1.3rem)] tracking-[-0.01em] transition-colors ${on ? "text-ink" : "text-ink/75 group-hover:text-ink"}`}
                >
                  {q}
                </span>
                <span
                  className={`relative flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${on ? "border-ink bg-ink text-bg" : "border-line group-hover:border-ink"}`}
                  aria-hidden
                >
                  <span className="absolute h-px w-3.5 bg-current" />
                  <motion.span
                    className="absolute h-3.5 w-px bg-current"
                    animate={{ scaleY: on ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[62ch] pb-7 pr-12 text-[16px] leading-relaxed text-muted">
                      {a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * The sites in use, recorded from the browser. Plays muted when it scrolls
 * into view and pauses when it leaves, with a button to stop it.
 */
function Reel() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused && !reduce)
          v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [userPaused]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      v.play().catch(() => {});
    } else {
      setUserPaused(true);
      v.pause();
    }
  };

  return (
    <section className="px-[var(--gutter)] pt-24" aria-label="Showreel">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.1, ease }}
        className="group relative overflow-hidden rounded-2xl bg-ink shadow-[0_50px_100px_-50px_rgb(20_20_19/0.6)]"
      >
        <video
          ref={video}
          className="block aspect-[16/10] w-full object-cover"
          poster="/video/showreel.jpg"
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) =>
            setProgress(
              e.currentTarget.currentTime / (e.currentTarget.duration || 1),
            )
          }
        >
          <source src="/video/showreel.mp4" type="video/mp4" />
        </video>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause the showreel" : "Play the showreel"}
          className="absolute bottom-4 right-4 flex size-11 items-center justify-center rounded-full bg-white/85 text-[#141413] shadow-lg backdrop-blur transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
        >
          {playing ? (
            <svg viewBox="0 0 12 12" className="size-3.5" aria-hidden>
              <rect
                x="2.5"
                y="2"
                width="2.4"
                height="8"
                rx="0.6"
                fill="currentColor"
              />
              <rect
                x="7.1"
                y="2"
                width="2.4"
                height="8"
                rx="0.6"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 12 12" className="ml-0.5 size-3.5" aria-hidden>
              <path d="M3 1.8v8.4L10 6z" fill="currentColor" />
            </svg>
          )}
        </button>
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/15">
          <span
            className="block h-full bg-white/80"
            style={{ width: `${progress * 100}%` }}
          />
        </span>
      </motion.div>
      <p className="mt-4 text-[14px] text-muted">
        The sites in use, recorded straight from the browser. Each one is live
        below.
      </p>
    </section>
  );
}

function WorkCard({
  w,
  i,
  progress,
}: {
  w: (typeof work)[number];
  i: number;
  progress: MotionValue<number>;
}) {
  const n = work.length;
  const scale = useTransform(
    progress,
    [i / n, 1],
    [1, 1 - (n - 1 - i) * 0.035],
  );
  const fine = useFinePointer();
  const [peek, setPeek] = useState(false);
  return (
    <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center">
      <motion.article
        style={{
          scale: fine ? scale : 1,
          background: w.bg,
          color: w.ink,
          top: fine ? `${i * 14}px` : 0,
        }}
        className="relative grid origin-top items-center gap-8 overflow-hidden rounded-2xl p-6 sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-14 lg:p-14"
      >
        <div className="min-w-0">
          <p className="text-[13px] opacity-60">{w.job}</p>
          <h3
            className="mt-3 text-[clamp(2.2rem,4.5vw,4rem)] leading-none"
            style={{
              fontFamily: w.font,
              fontWeight: w.weight,
              letterSpacing: w.track,
            }}
          >
            {w.name}
          </h3>
          <p className="mt-6 max-w-[44ch] text-[15.5px] leading-relaxed opacity-80">
            {w.what}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2 text-[12.5px]">
            {w.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-current/25 px-3 py-1"
              >
                {t}
              </li>
            ))}
          </ul>
          <Link
            href={w.href}
            className="mt-8 inline-flex rounded-full px-6 py-3 text-[14px] transition-transform hover:scale-[1.03]"
            style={{ background: w.ink, color: w.bg }}
          >
            Open the site
          </Link>
        </div>
        <Link
          href={w.href}
          data-cursor="Open"
          onPointerEnter={() => setPeek(true)}
          className="group relative block min-w-0 overflow-hidden rounded-lg shadow-[0_40px_80px_-30px_rgb(0_0_0/0.5)]"
          aria-label={`Open ${w.name}`}
        >
          {peek && w.shot !== "ceramics" && (
            <span
              aria-hidden
              className="absolute inset-0 z-10 bg-[length:100%_auto] bg-top opacity-0 transition-[opacity,background-position] duration-[400ms,7000ms] ease-[ease,cubic-bezier(0.45,0,0.55,1)] group-hover:bg-bottom group-hover:opacity-100"
              style={{
                backgroundImage: `url(${IMG_BASE}work/${w.shot}-long.webp)`,
              }}
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={shot(w.shot, 1400)}
            srcSet={`${shot(w.shot, 700)} 700w, ${shot(w.shot, 1400)} 1400w`}
            sizes="(min-width:1024px) 55vw, 90vw"
            alt={`${w.name} home page`}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover"
          />
        </Link>
      </motion.article>
    </div>
  );
}

function Work() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return (
    <section id="work" className="px-[var(--gutter)] pt-28">
      <div className="grid gap-4 lg:grid-cols-2 lg:items-end">
        <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
          Selected work
        </h2>
        <p className="max-w-[46ch] text-[16px] leading-relaxed text-muted lg:justify-self-end">
          Shops, booking, configurators and planners for nine kinds of business,
          designed and built in Next.js. Open any of them and use it on your
          phone or laptop.
        </p>
      </div>
      <div ref={ref} className="mt-12 space-y-6 lg:mt-4 lg:space-y-0">
        {work.map((w, i) => (
          <WorkCard key={w.href} w={w} i={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

export function Profile() {
  return (
    <div className="b-me [--cursor-ink:#f3f3f0] [--cursor:#141413]">
      <SmoothScroll />
      <Cursor />
      <Nav />
      <section className="px-[var(--gutter)] pt-28 sm:pt-36">
        <div className="flex items-end justify-between gap-6">
          <SplitLines
            as="h1"
            lines={["Chanasak", "Choonuch"]}
            delay={0.15}
            className="text-[clamp(3.4rem,14vw,12rem)] font-semibold leading-[0.86] tracking-[-0.055em]"
          />
          <Portrait />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease }}
          className="mt-10 grid gap-8 border-t border-line pt-6 sm:grid-cols-[1.3fr_1fr_1fr] sm:gap-10"
        >
          <div className="flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${IMG_BASE}me/me-320.webp`}
              alt=""
              className="aspect-square w-16 shrink-0 rounded-full object-cover object-top sm:hidden"
            />
            <p className="max-w-[38ch] text-[clamp(1.05rem,1.5vw,1.3rem)] leading-snug">
              Full stack engineer in Bangkok. I take web products from the first
              requirement to the production release.
            </p>
          </div>
          <div className="flex items-center gap-3 text-[14px] text-muted">
            <Logo src="garena.webp" />
            <p>
              <span className="block text-ink">Garena Online (Thailand)</span>
              Full Stack Engineer
            </p>
          </div>
          <div className="flex items-center gap-3 text-[14px] text-muted">
            <Logo src="chula.svg" />
            <p>
              <span className="block text-ink">Chulalongkorn University</span>
              M.Sc. Software Engineering
            </p>
          </div>
        </motion.div>
      </section>

      <div className="mt-16">
        <Wall />
      </div>

      <Reel />

      <Work />
      <Process />
      <Included />

      <section id="experience" className="px-[var(--gutter)] pt-32">
        <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold tracking-[-0.035em]">
          Experience
        </h2>
        <ol className="mt-10 border-t border-line">
          {jobs.map((j) => (
            <li
              key={j.co}
              className="grid gap-3 border-b border-line py-6 sm:grid-cols-[1.3fr_1fr_2fr] sm:gap-8"
            >
              <div className="flex items-start gap-4">
                <Logo src={j.logo} size={44} />
                <div>
                  <p className="text-[17px] font-medium tracking-[-0.01em]">
                    {j.co}
                  </p>
                  <p className="text-[14px] text-muted">{j.when}</p>
                </div>
              </div>
              <p className="text-[15px]">{j.role}</p>
              <p className="max-w-[60ch] text-[15px] leading-relaxed text-muted">
                {j.note}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-16 px-[var(--gutter)] pt-28 lg:grid-cols-2">
        <div>
          <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.03em]">
            Tools
          </h2>
          <ul className="mt-8 flex flex-wrap gap-2">
            {stack.map((t) => (
              <li key={t} title={t}>
                <Logo
                  src={`${t}.svg`}
                  size={44}
                  className="transition-transform duration-300 hover:-translate-y-1"
                />
              </li>
            ))}
          </ul>
          <dl className="mt-8 border-t border-line">
            {skills.map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-[5rem_1fr] gap-4 border-b border-line py-4 text-[15px]"
              >
                <dt className="text-muted">{k}</dt>
                <dd className="leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.03em]">
            Education
          </h2>
          <dl className="mt-8 border-t border-line text-[15px]">
            <div className="flex items-center gap-4 border-b border-line py-4">
              <Logo src="chula.svg" size={44} />
              <div>
                <dt className="font-medium">Chulalongkorn University</dt>
                <dd className="text-muted">
                  M.Sc. Software Engineering, 2023 to now
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-4 border-b border-line py-4">
              <Logo src="rmutp.webp" size={44} />
              <div>
                <dt className="font-medium">
                  Rajamangala University of Technology Phra Nakhon
                </dt>
                <dd className="text-muted">
                  B.S.Tech.Ed. Computer Engineering, 2018 to 2023, GPAX 3.47
                </dd>
              </div>
            </div>
          </dl>
          <h2 className="mt-16 text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.03em]">
            Certificates
          </h2>
          <ul className="mt-8 border-t border-line text-[15px]">
            {certs.map((c) => (
              <li
                key={c.title}
                className="flex items-center gap-4 border-b border-line py-3.5"
              >
                <Logo src={c.logo} size={36} />
                <div className="min-w-0">
                  <p className="leading-snug">{c.title}</p>
                  <p className="text-[13px] text-muted">
                    {c.by}, Coursera, 2022
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <h2 className="mt-16 text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold tracking-[-0.03em]">
            Awards
          </h2>
          <ul className="mt-8 border-t border-line text-[15px]">
            {awards.map((a) => (
              <li
                key={a.title}
                className="flex justify-between gap-6 border-b border-line py-3.5"
              >
                <span>{a.title}</span>
                <span className="shrink-0 text-muted">{a.when}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq />

      <section
        id="contact"
        className="mt-32 bg-ink px-[var(--gutter)] pb-24 pt-24 text-bg sm:pb-12"
      >
        <p className="text-[15px] text-bg/60">Have a site to build?</p>
        <a
          href="mailto:chanasak.choonuch@gmail.com"
          className="mt-4 block break-all text-[clamp(1.6rem,5.4vw,5.4rem)] font-semibold leading-[1] tracking-[-0.04em] transition-opacity hover:opacity-70"
        >
          chanasak.choonuch@gmail.com
        </a>
        <div className="mt-8">
          <CopyEmail email="chanasak.choonuch@gmail.com" />
        </div>
        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-bg/15 pt-6 text-[14px] text-bg/60 sm:flex-row">
          <span>063 828 5292</span>
          <span>Bangkok, Thailand</span>
          <Link href="/credits" className="hover:text-bg">
            Photo credits
          </Link>
        </div>
      </section>
    </div>
  );
}
