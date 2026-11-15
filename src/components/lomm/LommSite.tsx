"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { animate, AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { resetScroll } from "@/components/shared/motion";
import { btn } from "@/components/kit/panels";
import { baht, isEmail, isPhone, makeRef, usePersist } from "@/components/kit/persist";
import { Field, Icon, Img, Sheet } from "@/components/kit/ui";

// LOMM, a concept for an outdoor furniture brand. Photos from Pexels (Pexels license).

const R = "/lomm";
const ease = [0.22, 1, 0.36, 1] as const;
const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Piece = { id: string; name: string; type: string; img: string; ratio: number; price: number; w: number; d: number; round?: boolean; note: string; spec: string };
const pieces: Piece[] = [
  { id: "breeze", name: "Breeze", type: "Dining set for six", img: "lomm/rooftop", ratio: 1.46, price: 78000, w: 2.6, d: 2.4, note: "Powder coated aluminium with a woven back that dries in minutes.", spec: "Table 200 x 95 cm, six armchairs" },
  { id: "atoll", name: "Atoll", type: "Lounge set", img: "lomm/poolhouse", ratio: 1.46, price: 112000, w: 2.8, d: 2.2, note: "A three seat sofa, two armchairs and a low table, all on quick dry foam.", spec: "Sofa 210 cm, two chairs, table 90 x 90 cm" },
  { id: "tidewater", name: "Tidewater", type: "Sunbed", img: "lomm/shore", ratio: 1.46, price: 24000, w: 0.75, d: 2.0, note: "Five back positions and wheels at the head, built for hotel pool decks.", spec: "200 x 75 cm, 24 kg" },
  { id: "cabana", name: "Cabana", type: "Canopy daybed", img: "lomm/cabana", ratio: 0.72, price: 96000, w: 2.2, d: 2.2, note: "A deep woven daybed with a roof and curtains that roll up.", spec: "220 x 220 cm, height 230 cm" },
  { id: "ridge", name: "Ridge", type: "Deck chair", img: "lomm/ridge", ratio: 0.72, price: 9800, w: 0.7, d: 1.1, note: "Teak and woven sling. Folds to 8 cm for the rainy season.", spec: "70 x 110 cm, 7 kg" },
  { id: "shade", name: "Shade", type: "Cantilever parasol", img: "lomm/parasol", ratio: 0.57, price: 21000, w: 3, d: 3, round: true, note: "Turns a full circle and tilts, on a weighted base that needs no fixing.", spec: "Canopy 300 cm, UPF 50" },
];

export function LommSite({ segs = [] }: { segs?: string[] }) {
  const [a] = segs;
  useEffect(resetScroll, [segs.join("/")]);
  const [menu, setMenu] = useState(false);
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 mix-blend-difference text-white">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-6 px-5 sm:px-8">
          <Link href={R} className="font-display text-[24px] font-bold tracking-[-0.05em]">
            lomm
          </Link>
          <nav className="ml-auto hidden items-center gap-7 text-[14px] md:flex">
            {[
              ["Collection", `${R}#collection`],
              ["Plan a terrace", `${R}#plan`],
              ["Materials", `${R}#materials`],
              ["Enquire", `${R}/enquire`],
            ].map(([t, h]) => (
              <Link key={h} href={h} className="opacity-80 hover:opacity-100">
                {t}
              </Link>
            ))}
          </nav>
          <button className="ml-auto grid size-10 place-items-center md:hidden" aria-label="Menu" onClick={() => setMenu(true)}>
            {Icon.menu}
          </button>
        </div>
      </header>
      <Sheet open={menu} onClose={() => setMenu(false)} title="lomm">
        <nav className="grid">
          {[
            ["Collection", `${R}#collection`],
            ["Plan a terrace", `${R}#plan`],
            ["Materials", `${R}#materials`],
            ["Enquire", `${R}/enquire`],
          ].map(([t, h]) => (
            <Link key={h} href={h} onClick={() => setMenu(false)} className="font-display border-b border-line py-4 text-[24px] font-semibold">
              {t}
            </Link>
          ))}
        </nav>
      </Sheet>
      <main>{a === "enquire" ? <Enquire /> : <Home />}</main>
      <footer className="relative overflow-hidden bg-[#0b2a30] text-[#eef0ec]">
        <svg aria-hidden viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-16 w-full text-bg sm:h-24">
          <path fill="currentColor" d="M0 0h1440v58c-120 30-240 30-360 0S840 28 720 58s-240 30-360 0S120 28 0 58Z">
            <animate attributeName="d" dur="9s" repeatCount="indefinite" values="M0 0h1440v58c-120 30-240 30-360 0S840 28 720 58s-240 30-360 0S120 28 0 58Z;M0 0h1440v58c-120-26-240-26-360 0S840 88 720 58s-240-26-360 0S120 88 0 58Z;M0 0h1440v58c-120 30-240 30-360 0S840 28 720 58s-240 30-360 0S120 28 0 58Z" />
          </path>
        </svg>
        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 pb-8 pt-32 sm:px-8 md:grid-cols-[1.4fr_1fr] md:items-end">
          <p className="font-display max-w-[16ch] text-[clamp(34px,5vw,72px)] font-bold leading-[0.95] tracking-[-0.04em]">See you on the terrace.</p>
          <div className="grid gap-2 text-[14px] text-[#eef0ec]/70 md:justify-self-end">
            <p>Workshop in Pathum Thani. Showroom by appointment.</p>
            <p>Terraces, pool decks and hotels.</p>
          </div>
          <div className="flex flex-wrap justify-between gap-4 border-t border-white/15 pt-6 text-[13px] text-[#eef0ec]/55 md:col-span-2">
            <p>lomm outdoor furniture</p>
            <p>A concept site by Chanasak Choonuch. lomm is a fictional brand.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

type PlanState = { plan: Record<string, number>; setPlan: (v: Record<string, number>) => void; ready: boolean };

function Home() {
  const [plan, setPlan, ready] = usePersist<Record<string, number>>("lomm:plan", { atoll: 1, tidewater: 2, shade: 1 });
  const st: PlanState = { plan, setPlan, ready };
  return (
    <>
      <Hero />
      <Collection st={st} />
      <IndexList />
      <Planner st={st} />
      <Materials />
    </>
  );
}

/* ---------------- hero: the terrace through the day ---------------- */

type Grade = { tint: string; tintA: number; dark: number; bright: number; sat: number };
const KEYS: [number, Grade][] = [
  [6, { tint: "#ffa66e", tintA: 0.5, dark: 0.3, bright: 0.92, sat: 0.9 }],
  [9, { tint: "#fff0d2", tintA: 0.18, dark: 0, bright: 1.02, sat: 1 }],
  [12, { tint: "#ffffff", tintA: 0, dark: 0, bright: 1.06, sat: 1.05 }],
  [16, { tint: "#ffcf86", tintA: 0.28, dark: 0, bright: 1.02, sat: 1.08 }],
  [18, { tint: "#ff7f45", tintA: 0.5, dark: 0.12, bright: 0.96, sat: 1.12 }],
  [19.5, { tint: "#b9508b", tintA: 0.42, dark: 0.42, bright: 0.85, sat: 1 }],
  [21, { tint: "#3a4fa0", tintA: 0.38, dark: 0.66, bright: 0.72, sat: 0.85 }],
  [22, { tint: "#2b3a80", tintA: 0.4, dark: 0.72, bright: 0.7, sat: 0.8 }],
];
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function grade(h: number): Grade & { rgb: string } {
  let i = KEYS.findIndex(([k]) => k >= h);
  if (i <= 0) i = 1;
  const [h0, a] = KEYS[i - 1];
  const [h1, b] = KEYS[Math.min(i, KEYS.length - 1)];
  const t = h1 === h0 ? 0 : Math.min(1, Math.max(0, (h - h0) / (h1 - h0)));
  const mix = (x: number, y: number) => x + (y - x) * t;
  const ca = hex(a.tint);
  const cb = hex(b.tint);
  return {
    tint: a.tint,
    rgb: `rgb(${ca.map((v, j) => Math.round(mix(v, cb[j]))).join(" ")})`,
    tintA: mix(a.tintA, b.tintA),
    dark: mix(a.dark, b.dark),
    bright: mix(a.bright, b.bright),
    sat: mix(a.sat, b.sat),
  };
}
const clock = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60) % 60).padStart(2, "0")}`;

function Hero() {
  const [h, setH] = useState(6.5);
  const touched = useRef(false);
  useEffect(() => {
    // a short sunrise when the page opens; stops the moment someone takes the slider
    const c = animate(6.5, 11, { duration: 2.6, ease, delay: 0.4, onUpdate: (v) => !touched.current && setH(v) });
    return () => c.stop();
  }, []);
  const g = grade(h);
  const sunT = Math.min(1, Math.max(0, (h - 6) / 12));
  const night = h > 19.2;
  const sx = 10 + sunT * 80;
  const sy = 46 - Math.sin(sunT * Math.PI) * 36;
  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[#0e1420] text-white">
      <div className="absolute inset-0" style={{ filter: `brightness(${g.bright}) saturate(${g.sat})` }}>
        <Img src="lomm/cove" alt="Tables on a stone terrace above a quiet bay" className="absolute inset-0 bg-transparent" priority sizes="100vw" widths={[800, 1600, 2400]} />
      </div>
      <div className="pointer-events-none absolute inset-0 mix-blend-soft-light" style={{ background: g.rgb, opacity: g.tintA }} />
      <div className="pointer-events-none absolute inset-0 bg-[#0b1430]" style={{ opacity: g.dark }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 transition-opacity duration-700" style={{ opacity: night ? 1 : 0, background: "radial-gradient(60% 70% at 45% 100%, rgb(255 190 110 / 0.35), transparent)" }} />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.25),transparent_30%,transparent_55%,rgb(0_0_0/0.55))]" />

      <div className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-between px-5 pb-20 pt-28 sm:px-8 sm:pb-10">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease }} className="font-display max-w-[14ch] text-[clamp(44px,8vw,128px)] font-bold leading-[0.88] tracking-[-0.055em]">
          Made for the hours you spend outside
        </motion.h1>

        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-sm text-[16px] leading-relaxed text-white/85">Drag through the day. Our pieces are tested from the 6 am dew to the last drink under the lights.</p>
          <div className="w-full rounded-[22px] border border-white/20 bg-white/10 p-4 backdrop-blur-xl lg:w-[440px]">
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 100 50" className="h-12 w-24 shrink-0" aria-hidden>
                <path d="M6 46 A44 44 0 0 1 94 46" fill="none" stroke="rgb(255 255 255 / 0.35)" strokeDasharray="2 3" />
                <line x1="0" y1="46" x2="100" y2="46" stroke="rgb(255 255 255 / 0.35)" />
                {night ? <circle cx="78" cy="14" r="6" fill="#e9eefc" /> : <circle cx={sx} cy={sy} r="6" fill="#ffd27a" style={{ filter: "drop-shadow(0 0 6px #ffb84d)" }} />}
              </svg>
              <div className="grid flex-1 gap-1">
                <span className="flex justify-between text-[13px] text-white/75">
                  <span>{night ? "Evening" : h < 10 ? "Morning" : h < 16 ? "Midday" : "Late afternoon"}</span>
                  <span className="font-display text-[20px] font-semibold tabular-nums text-white">{clock(h)}</span>
                </span>
                <input
                  type="range"
                  min={6}
                  max={22}
                  step={0.25}
                  value={h}
                  aria-label="Time of day"
                  onChange={(e) => {
                    touched.current = true;
                    setH(+e.target.value);
                  }}
                  className="lomm-range w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- pinned horizontal collection ---------------- */

function Collection({ st }: { st: PlanState }) {
  const outer = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [wide, setWide] = useState(false);
  const [open, setOpen] = useState<Piece | null>(null);
  useIso(() => {
    const m = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const measure = () => {
      setWide(m.matches);
      if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    m.addEventListener("change", measure);
    return () => {
      window.removeEventListener("resize", measure);
      m.removeEventListener("change", measure);
    };
  }, []);
  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => -v * dist);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section id="collection" ref={outer} className="relative scroll-mt-0 bg-bg" style={wide ? { height: `calc(100vh + ${dist}px)` } : undefined}>
      <div className={wide ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "py-24"}>
        <div className="mx-auto mb-10 flex w-full max-w-[1500px] items-end justify-between gap-4 px-5 sm:px-8">
          <h2 className="font-display max-w-[16ch] text-[clamp(34px,4.6vw,72px)] font-bold leading-[0.92] tracking-[-0.05em]">The 2027 outdoor collection</h2>
          {wide && (
            <div className="h-[3px] w-48 overflow-hidden rounded-full bg-ink/10">
              <motion.div className="h-full origin-left bg-ink" style={{ scaleX: bar }} />
            </div>
          )}
        </div>
        <motion.div ref={track} style={wide ? { x } : undefined} className={`flex gap-5 px-5 sm:px-8 ${wide ? "w-max will-change-transform" : "snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:none]"}`} data-lenis-prevent={!wide || undefined}>
          {pieces.map((p, i) => (
            <button key={p.id} onClick={() => setOpen(p)} className="group relative w-[78vw] shrink-0 snap-start overflow-hidden rounded-[26px] text-left sm:w-[420px] lg:w-[460px]">
              <Img src={p.img} alt={`${p.name} ${p.type.toLowerCase()}`} ratio={0.8} widths={[800, 1600]} sizes="(min-width:1024px) 460px, 78vw" imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.65),transparent_50%)]" />
              <span className="absolute left-5 top-5 font-display text-[15px] font-semibold text-white/80">{String(i + 1).padStart(2, "0")}</span>
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-white">
                <span>
                  <span className="font-display block text-[30px] font-bold leading-none tracking-[-0.04em]">{p.name}</span>
                  <span className="text-[14px] text-white/80">
                    {p.type}, {baht(p.price)}
                  </span>
                </span>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:rotate-90">+</span>
              </div>
            </button>
          ))}
        </motion.div>
      </div>
      <PieceSheet p={open} onClose={() => setOpen(null)} st={st} />
    </section>
  );
}

function PieceSheet({ p, onClose, st: { plan, setPlan } }: { p: Piece | null; onClose: () => void; st: PlanState }) {
  return (
    <Sheet open={!!p} onClose={onClose} title={p ? `${p.name} ${p.type.toLowerCase()}` : ""}>
      {p && (
        <div className="grid gap-5">
          <Img src={p.img} alt="" ratio={1.3} widths={[800]} sizes="460px" className="rounded-[18px]" />
          <p className="text-[16px] leading-relaxed">{p.note}</p>
          <dl className="grid gap-2 text-[14px]">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Size</dt>
              <dd>{p.spec}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Price</dt>
              <dd>{baht(p.price)}</dd>
            </div>
          </dl>
          <button
            className={btn.primary}
            onClick={() => {
              setPlan({ ...plan, [p.id]: (plan[p.id] ?? 0) + 1 });
              onClose();
              setTimeout(() => document.getElementById("plan")?.scrollIntoView({ behavior: "smooth" }), 300);
            }}
          >
            Add to my terrace plan
          </button>
        </div>
      )}
    </Sheet>
  );
}

/* ---------------- index with a photo that follows the cursor ---------------- */

function IndexList() {
  const [on, setOn] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  const box = useRef<HTMLDivElement>(null);
  return (
    <section className="mx-auto max-w-[1500px] px-5 pb-24 pt-8 sm:px-8 lg:pb-32">
      <p className="mb-6 text-[14px] text-muted">Every piece, at a glance</p>
      <div
        ref={box}
        className="relative"
        onPointerMove={(e) => {
          const r = box.current!.getBoundingClientRect();
          x.set(e.clientX - r.left);
          y.set(e.clientY - r.top);
        }}
        onPointerLeave={() => setOn(null)}
      >
        <ul className="border-t border-line">
          {pieces.map((p, i) => (
            <li key={p.id}>
              <a href="#plan" onPointerEnter={(e) => e.pointerType === "mouse" && setOn(i)} className="group grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-line py-5 sm:grid-cols-[80px_1fr_1fr_auto]">
                <span className="hidden text-[14px] text-muted sm:block">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-[clamp(28px,4vw,56px)] font-bold leading-none tracking-[-0.05em] transition-transform duration-500 group-hover:translate-x-3">{p.name}</span>
                <span className="hidden text-[15px] text-muted sm:block">{p.type}</span>
                <span className="text-[15px] tabular-nums">{baht(p.price)}</span>
              </a>
            </li>
          ))}
        </ul>
        <motion.div className="pointer-events-none absolute left-0 top-0 z-10 hidden w-[260px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[18px] shadow-[0_30px_60px_rgb(0_0_0/0.25)] lg:block" style={{ x: sx, y: sy }} animate={{ opacity: on === null ? 0 : 1, scale: on === null ? 0.85 : 1 }} transition={{ duration: 0.25 }}>
          {pieces.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={p.id} src={`/images/${p.img}-800.webp`} alt="" className={`aspect-[4/5] w-full object-cover ${on === i ? "block" : "hidden"}`} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- terrace planner ---------------- */

type Placed = { p: Piece; x: number; y: number; n: number; w: number; d: number };

/**
 * Places each piece at the first free spot, scanning the terrace in 10 cm steps
 * and keeping 60 cm of walking space around it. Parasols stand over a seating set
 * when there is one. Anything that cannot fit is reported back.
 */
function layout(W: number, D: number, plan: Record<string, number>) {
  const gap = 0.6;
  const step = 0.1;
  const all = pieces.flatMap((p) => Array.from({ length: plan[p.id] ?? 0 }, (_, n) => ({ p, n })));
  const rects = all.filter((i) => !i.p.round).sort((a, b) => b.p.w * b.p.d - a.p.w * a.p.d);
  const rounds = all.filter((i) => i.p.round);
  const placed: Placed[] = [];
  const left: Piece[] = [];
  const free = (x: number, y: number, w: number, d: number) =>
    placed.every((o) => o.p.round || x + w + gap <= o.x + 1e-6 || o.x + o.w + gap <= x + 1e-6 || y + d + gap <= o.y + 1e-6 || o.y + o.d + gap <= y + 1e-6);
  const find = (w: number, d: number): [number, number] | null => {
    for (let y = gap; y + d <= D - gap + 1e-6; y += step) for (let x = gap; x + w <= W - gap + 1e-6; x += step) if (free(x, y, w, d)) return [x, y];
    return null;
  };
  for (const it of rects) {
    // try the piece as drawn, then turned a quarter
    let w = it.p.w;
    let d = it.p.d;
    let spot = find(w, d);
    if (!spot && w !== d) {
      [w, d] = [d, w];
      spot = find(w, d);
    }
    if (spot) placed.push({ p: it.p, x: spot[0], y: spot[1], n: it.n, w, d });
    else left.push(it.p);
  }
  const hosts = placed.filter((o) => o.w * o.d >= 4);
  rounds.forEach((it, i) => {
    const h = hosts[i];
    const x = h ? h.x + h.w / 2 - it.p.w / 2 : W / 2 - it.p.w / 2;
    const y = h ? h.y + h.d / 2 - it.p.d / 2 : D / 2 - it.p.d / 2;
    if (it.p.w <= W && it.p.d <= D) placed.push({ p: it.p, x: Math.max(0, Math.min(W - it.p.w, x)), y: Math.max(0, Math.min(D - it.p.d, y)), n: it.n, w: it.p.w, d: it.p.d });
    else left.push(it.p);
  });
  const used = placed.reduce((s, i) => s + (i.p.round ? 0 : (i.w + gap) * (i.d + gap)), 0);
  return { placed, left, ratio: used / (W * D) };
}

function Planner({ st: { plan, setPlan, ready } }: { st: PlanState }) {
  const router = useRouter();
  const [W, setW] = useState(8);
  const [D, setD] = useState(5);
  const [, setSize] = usePersist<[number, number]>("lomm:size", [8, 5]);
  const { placed, left, ratio } = useMemo(() => layout(W, D, plan), [W, D, plan]);
  const total = pieces.reduce((s, p) => s + (plan[p.id] ?? 0) * p.price, 0);
  const count = Object.values(plan).reduce((s, n) => s + n, 0);
  const VW = 600;
  const k = (VW - 20) / Math.max(W, D * 1.5);
  const VH = D * k + 20;
  const mood = left.length ? "Some pieces do not fit" : ratio > 0.75 ? "Snug, but it works" : ratio > 0.3 ? "Room to move around" : count ? "Plenty of space left" : "Add a piece to start";
  return (
    <section id="plan" className="scroll-mt-16 bg-soft">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.25fr] lg:gap-16 lg:py-32">
        <div className="grid content-start gap-8">
          <h2 className="font-display text-[clamp(34px,4.6vw,72px)] font-bold leading-[0.92] tracking-[-0.05em]">Plan your terrace</h2>
          <p className="max-w-md text-[16px] leading-relaxed text-muted">Set the size of your space, add pieces, and see them drawn to scale with room to walk between them. Send the plan and we reply with a quote.</p>
          <div className="grid grid-cols-2 gap-6">
            {(
              [
                ["Width", W, setW, 3, 14],
                ["Depth", D, setD, 2, 9],
              ] as const
            ).map(([label, v, set, min, max]) => (
              <label key={label} className="grid gap-2">
                <span className="flex justify-between text-[14px]">
                  {label} <span className="tabular-nums">{v} m</span>
                </span>
                <input type="range" min={min} max={max} step={0.5} value={v} onChange={(e) => set(+e.target.value)} className="lomm-range" />
              </label>
            ))}
          </div>
          <ul className="grid gap-2">
            {pieces.map((p) => {
              const n = plan[p.id] ?? 0;
              return (
                <li key={p.id} className="flex items-center justify-between gap-4 rounded-[16px] bg-bg px-4 py-3">
                  <span className="min-w-0">
                    <span className="block text-[15px] font-medium">
                      {p.name} <span className="font-normal text-muted">{p.type.toLowerCase()}</span>
                    </span>
                    <span className="text-[13px] text-muted">
                      {p.round ? `${p.w} m across` : `${p.w} x ${p.d} m`}, {baht(p.price)}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <button aria-label={`Remove one ${p.name}`} disabled={!n} onClick={() => setPlan({ ...plan, [p.id]: n - 1 })} className="grid size-9 place-items-center rounded-full border border-line disabled:opacity-30">
                      -
                    </button>
                    <span className="w-5 text-center tabular-nums">{n}</span>
                    <button aria-label={`Add one ${p.name}`} disabled={n >= 12} onClick={() => setPlan({ ...plan, [p.id]: n + 1 })} className="grid size-9 place-items-center rounded-full bg-ink text-bg disabled:opacity-30">
                      +
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="grid content-start gap-5 lg:sticky lg:top-20 lg:self-start">
          <div className="overflow-hidden rounded-[24px] bg-[#cfd6c4] p-3">
            <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" role="img" aria-label={`Terrace ${W} by ${D} metres with ${placed.length} pieces`}>
              <defs>
                <pattern id="tiles" width={k} height={k} patternUnits="userSpaceOnUse">
                  <path d={`M ${k} 0 L 0 0 0 ${k}`} fill="none" stroke="rgb(0 0 0 / 0.08)" />
                </pattern>
              </defs>
              <rect x="10" y="10" width={W * k} height={D * k} rx="6" fill="#e9e4d8" />
              <rect x="10" y="10" width={W * k} height={D * k} rx="6" fill="url(#tiles)" />
              {ready &&
                [...placed].sort((a, b) => Number(!!a.p.round) - Number(!!b.p.round)).map((it) => {
                  const cx = 10 + it.x * k;
                  const cy = 10 + it.y * k;
                  return (
                    <motion.g key={`${it.p.id}-${it.n}`} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, x: cx, y: cy }} transition={{ duration: 0.45, ease }} style={{ originX: 0, originY: 0 }}>
                      {it.p.round ? (
                        <circle cx={(it.w * k) / 2} cy={(it.d * k) / 2} r={(it.w * k) / 2} fill="rgb(13 85 96 / 0.14)" stroke="#0d5560" strokeDasharray="4 4" />
                      ) : (
                        <rect width={it.w * k} height={it.d * k} rx="5" fill="#0d5560" />
                      )}
                      {it.p.round ? (
                        <text x={(it.w * k) / 2} y={16} textAnchor="middle" stroke="#e9e4d8" strokeWidth="3" paintOrder="stroke" className="fill-[#0d5560] text-[11px] font-medium">
                          {it.p.name}
                        </text>
                      ) : (
                        <text
                          x={(it.w * k) / 2}
                          y={(it.d * k) / 2}
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={it.w < it.d && it.w * k < it.p.name.length * 7 + 8 ? `rotate(-90 ${(it.w * k) / 2} ${(it.d * k) / 2})` : undefined}
                          className="fill-white text-[11px] font-medium"
                        >
                          {it.p.name}
                        </text>
                      )}
                    </motion.g>
                  );
                })}
              <text x={10 + (W * k) / 2} y={VH - 2} textAnchor="middle" className="fill-black/50 text-[11px]">
                {W} m
              </text>
            </svg>
          </div>
          <div className="grid gap-3 rounded-[24px] bg-bg p-5">
            <div className="flex items-baseline justify-between gap-4">
              <span className={`text-[15px] ${left.length ? "text-[var(--bad)]" : ""}`}>{mood}</span>
              <span className="font-display text-[26px] font-bold tabular-nums tracking-[-0.03em]">{baht(total)}</span>
            </div>
            {left.length > 0 && <p className="text-[13.5px] text-muted">Not placed: {left.map((p) => p.name).join(", ")}. Make the space larger or take a piece out.</p>}
            <button
              disabled={!count}
              className={btn.primary}
              onClick={() => {
                setSize([W, D]);
                router.push(`${R}/enquire`);
              }}
            >
              Send this plan for a quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- materials ---------------- */

function Materials() {
  const tabs = [
    { id: "sun", t: "Sun", h: "1,500 hours under UV lamps", d: "The fibre and fabrics keep their colour after the equivalent of five Thai summers. Frames are powder coated, never painted.", tone: "#f4c66b" },
    { id: "rain", t: "Rain", h: "Dry an hour after a storm", d: "Cushions use open cell foam and drain through the base. Aluminium frames have no hollow joints where water can sit.", tone: "#8fb4d8" },
    { id: "salt", t: "Sea air", h: "Marine grade for beachfront hotels", d: "Stainless fixings and a thicker coat for anything within a kilometre of the sea, with a five year frame guarantee.", tone: "#7fc1b6" },
  ];
  const [on, setOn] = useState(0);
  const t = tabs[on];
  return (
    <section id="materials" className="mx-auto max-w-[1500px] scroll-mt-16 px-5 py-24 sm:px-8 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <div className="grid gap-8">
          <h2 className="font-display text-[clamp(34px,4.6vw,72px)] font-bold leading-[0.92] tracking-[-0.05em]">Built for the weather here</h2>
          <div className="flex gap-2" role="tablist">
            {tabs.map((x, i) => (
              <button key={x.id} role="tab" aria-selected={on === i} onClick={() => setOn(i)} className="relative h-11 rounded-full px-5 text-[15px]">
                {on === i && <motion.span layoutId="lomm-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.4, ease }} />}
                <span className={`relative ${on === i ? "text-bg" : ""}`}>{x.t}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }} className="grid gap-3">
              <p className="text-[24px] font-semibold tracking-[-0.02em]">{t.h}</p>
              <p className="max-w-md text-[16px] leading-relaxed text-muted">{t.d}</p>
            </motion.div>
          </AnimatePresence>
          <Link href={`${R}/enquire`} className={`${btn.primary} w-fit`}>
            Ask for samples
          </Link>
        </div>
        <div className="relative grid aspect-square place-items-center overflow-hidden rounded-[32px] transition-colors duration-700" style={{ background: t.tone }}>
          <WeatherArt id={t.id} />
        </div>
      </div>
    </section>
  );
}

function WeatherArt({ id }: { id: string }) {
  if (id === "sun")
    return (
      <svg viewBox="0 0 200 200" className="w-2/3">
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} style={{ originX: "100px", originY: "100px" }}>
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x="97" y="8" width="6" height="30" rx="3" fill="#fff8e6" transform={`rotate(${i * 30} 100 100)`} />
          ))}
        </motion.g>
        <circle cx="100" cy="100" r="44" fill="#fff8e6" />
      </svg>
    );
  if (id === "rain")
    return (
      <svg viewBox="0 0 200 200" className="w-2/3">
        {Array.from({ length: 14 }, (_, i) => (
          <motion.line key={i} x1={20 + i * 12} x2={14 + i * 12} y1="0" y2="22" stroke="#f2f7fc" strokeWidth="4" strokeLinecap="round" initial={{ y: -30 }} animate={{ y: 220 }} transition={{ duration: 1.1 + (i % 4) * 0.2, repeat: Infinity, ease: "linear", delay: (i % 5) * 0.2 }} />
        ))}
      </svg>
    );
  return (
    <svg viewBox="0 0 200 200" className="w-3/4">
      {[0, 1, 2].map((i) => (
        <motion.path key={i} d="M-40 0 Q -15 -18 10 0 T 60 0 T 110 0 T 160 0 T 210 0 T 260 0" fill="none" stroke="#effaf7" strokeWidth="6" strokeLinecap="round" transform={`translate(0 ${70 + i * 30})`} animate={{ x: [-50, 0] }} transition={{ duration: 2.4 + i * 0.6, repeat: Infinity, ease: "linear" }} />
      ))}
    </svg>
  );
}

/* ---------------- enquiry ---------------- */

function Enquire() {
  const [plan, setPlan, ready] = usePersist<Record<string, number>>("lomm:plan", {});
  const [size] = usePersist<[number, number]>("lomm:size", [8, 5]);
  const [kind, setKind] = useState("Home");
  const [f, setF] = useState({ name: "", email: "", phone: "", place: "", note: "" });
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const lines = pieces.filter((p) => (plan[p.id] ?? 0) > 0);
  const total = lines.reduce((s, p) => s + p.price * plan[p.id], 0);
  const e = {
    name: f.name.trim().length < 2 && "Enter your name",
    email: !isEmail(f.email) && "Enter a valid email",
    phone: !isPhone(f.phone) && "Enter a Thai phone number",
    note: !lines.length && f.note.trim().length < 5 && "Tell us about the space, or add pieces in the planner",
  };
  if (done)
    return (
      <div className="mx-auto grid max-w-[620px] gap-5 px-5 pb-24 pt-36">
        <span className="grid size-12 place-items-center rounded-full bg-ink text-bg">{Icon.check}</span>
        <h1 className="font-display text-[48px] font-bold leading-[0.95] tracking-[-0.05em]">Plan received</h1>
        <p className="text-muted">Reference {done}. A project designer replies to {f.email} within one working day, with prices and a suggested layout.</p>
        <Link href={R} className={`${btn.ghost} w-auto justify-self-start`}>
          Back to lomm
        </Link>
      </div>
    );
  return (
    <div className="mx-auto grid max-w-[1200px] gap-12 px-5 pb-24 pt-28 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:pt-36">
      <div className="grid content-start gap-5">
        <h1 className="font-display text-[clamp(44px,6vw,88px)] font-bold leading-[0.92] tracking-[-0.055em]">Get a quote</h1>
        {ready && lines.length > 0 ? (
          <div className="grid gap-2 rounded-[20px] bg-soft p-5 text-[14.5px]">
            <p className="text-muted">
              Your plan, {size[0]} x {size[1]} m
            </p>
            {lines.map((p) => (
              <div key={p.id} className="flex justify-between gap-4">
                <span>
                  {plan[p.id]} x {p.name} {p.type.toLowerCase()}
                </span>
                <span className="tabular-nums">{baht(p.price * plan[p.id])}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-line pt-2">
              <span>List price</span>
              <span className="tabular-nums">{baht(total)}</span>
            </div>
            <Link href={`${R}#plan`} className="text-[13.5px] underline underline-offset-4">
              Change the plan
            </Link>
          </div>
        ) : (
          <p className="text-muted">
            Tell us about the space below, or{" "}
            <Link href={`${R}#plan`} className="underline underline-offset-4">
              plan your terrace first
            </Link>
            .
          </p>
        )}
      </div>
      <div className="grid content-start gap-5 rounded-[24px] border border-line p-5 sm:p-8">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Project type">
          {["Home", "Hotel or resort", "Restaurant", "Designer"].map((k) => (
            <button key={k} role="radio" aria-checked={kind === k} onClick={() => setKind(k)} className={`rounded-full px-4 py-2 text-[14px] ${kind === k ? "bg-ink text-bg" : "border border-line"}`}>
              {k}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" autoComplete="name" value={f.name} onValue={(v) => setF({ ...f, name: v })} error={tried && e.name} />
          <Field label="Phone" type="tel" inputMode="tel" value={f.phone} onValue={(v) => setF({ ...f, phone: v })} error={tried && e.phone} />
          <Field label="Email" type="email" autoComplete="email" value={f.email} onValue={(v) => setF({ ...f, email: v })} error={tried && e.email} />
          <Field label="Location (optional)" value={f.place} onValue={(v) => setF({ ...f, place: v })} placeholder="e.g. Hua Hin" />
          <Field label="About the space" as="textarea" value={f.note} onValue={(v) => setF({ ...f, note: v })} error={tried && e.note} className="sm:col-span-2" />
        </div>
        <button
          className={`${btn.primary} sm:max-w-xs`}
          onClick={() => {
            setTried(true);
            if (Object.values(e).some(Boolean)) return;
            setDone(makeRef("LMM"));
            setPlan({});
            window.scrollTo({ top: 0 });
            window.__lenis?.scrollTo(0, { immediate: true });
          }}
        >
          Send request
        </button>
      </div>
    </div>
  );
}
