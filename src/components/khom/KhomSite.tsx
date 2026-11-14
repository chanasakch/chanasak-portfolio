"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { resetScroll } from "@/components/shared/motion";
import { btn } from "@/components/kit/panels";
import { baht, isEmail, isPhone, makeRef, usePersist } from "@/components/kit/persist";
import { Field, Icon, Img, Qty, Sheet, Toast } from "@/components/kit/ui";
import { byId, lamps, priceFor, type Lamp, type Shape } from "@/data/khom";

// KHOM, a concept for a woven lighting maker. Photos from Pexels (Pexels license).

const R = "/khom";
const ease = [0.22, 1, 0.36, 1] as const;


type Line = { id: string; size: number; qty: number };
type Ctx = { night: boolean; setNight: (v: boolean) => void; lines: Line[]; setLines: (v: Line[]) => void; add: (l: Line) => void; panel: null | "list" | "menu"; setPanel: (p: Ctx["panel"]) => void; toast: (m: string) => void };
const C = createContext<Ctx | null>(null);
const use = () => useContext(C)!;

export function KhomSite({ segs = [] }: { segs?: string[] }) {
  const [a, b] = segs;
  useEffect(resetScroll, [segs.join("/")]);
  const [night, setNight] = usePersist("khom:night", false);
  const [lines, setLines] = usePersist<Line[]>("khom:list", []);
  const [panel, setPanel] = useState<Ctx["panel"]>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const ctx = useMemo<Ctx>(
    () => ({
      night,
      setNight,
      lines,
      setLines,
      add: (x) => {
        setLines((p) => {
          const i = p.findIndex((y) => y.id === x.id && y.size === x.size);
          return i < 0 ? [...p, x] : p.map((y, j) => (j === i ? { ...y, qty: Math.min(99, y.qty + x.qty) } : y));
        });
        setPanel("list");
      },
      panel,
      setPanel,
      toast: setMsg,
    }),
    [night, setNight, lines, setLines, panel],
  );
  const lamp = a === "lamp" && b ? byId(b) : undefined;
  let view: ReactNode;
  if (!a) view = <Home />;
  else if (a === "lamps") view = <Lamps />;
  else if (lamp) view = <LampPage key={lamp.id} l={lamp} />;
  else if (a === "contact") view = <Contact />;
  else
    view = (
      <div className="grid min-h-[70vh] place-items-center px-5 text-center">
        <Link href={`${R}/lamps`} className={`${btn.primary} w-auto`}>
          See every lamp
        </Link>
      </div>
    );
  return (
    <C.Provider value={ctx}>
      <div className={`khom-root ${night ? "khom-night" : ""}`}>
        <Header />
        <main>{view}</main>
        <Footer />
        <ListSheet />
        <MenuSheet />
        <Toast message={msg} onDone={() => setMsg(null)} />
      </div>
    </C.Provider>
  );
}

const nav = [
  ["Lamps", `${R}/lamps`],
  ["Size guide", `${R}#size`],
  ["Projects", `${R}#projects`],
  ["Contact", `${R}/contact`],
];

/** The switch that turns the whole site to evening. */
function LightSwitch() {
  const { night, setNight } = use();
  return (
    <button role="switch" aria-checked={night} aria-label="Evening light" onClick={() => setNight(!night)} className="flex items-center gap-2 text-[13px]">
      <span className={`relative h-7 w-12 rounded-full transition-colors duration-500 ${night ? "bg-[#e9a23b]" : "bg-ink/15"}`}>
        <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-transform duration-500 ${night ? "translate-x-6 shadow-[0_0_8px_2px_rgb(255_200_120/0.6)]" : "translate-x-1"}`} />
      </span>
      <span className="ml-1 hidden w-[62px] sm:inline">{night ? "Lights on" : "Daylight"}</span>
    </button>
  );
}

function Header() {
  const { lines, setPanel } = use();
  const n = lines.reduce((s, x) => s + x.qty, 0);
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-xl transition-colors duration-700">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-5 sm:px-8">
        <Link href={R} className="font-display text-[22px] font-semibold tracking-[-0.03em]">
          khom
        </Link>
        <nav className="hidden items-center gap-6 text-[14px] text-muted md:flex">
          {nav.map(([t, h]) => (
            <Link key={h} href={h} className="hover:text-ink">
              {t}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <LightSwitch />
          <button onClick={() => setPanel("list")} className="flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[14px] text-bg">
            List <span className="tabular-nums">{n}</span>
          </button>
          <button onClick={() => setPanel("menu")} aria-label="Menu" className="grid size-10 place-items-center rounded-full border border-line md:hidden">
            {Icon.menu}
          </button>
        </div>
      </div>
    </header>
  );
}

function MenuSheet() {
  const { panel, setPanel } = use();
  return (
    <Sheet open={panel === "menu"} onClose={() => setPanel(null)} title="khom">
      <nav className="grid">
        {nav.map(([t, h]) => (
          <Link key={h} href={h} onClick={() => setPanel(null)} className="font-display border-b border-line py-4 text-[24px]">
            {t}
          </Link>
        ))}
      </nav>
    </Sheet>
  );
}

/* ---------------- home ---------------- */

function Home() {
  return (
    <>
      <Hero />
      <Shapes />
      <SizeGuide />
      <Craft />
      <Projects />
    </>
  );
}

// where the three pendants hang in the dining photo, as fractions of the frame
const GLOWS = [
  { x: 0.335, y: 0.38 },
  { x: 0.46, y: 0.38 },
  { x: 0.593, y: 0.38 },
];

function Hero() {
  const { night, setNight } = use();
  return (
    <section className="px-3 pt-20 sm:px-5 sm:pt-24">
      <div className="relative mx-auto max-w-[1440px] overflow-hidden rounded-[20px]" style={{ aspectRatio: "16 / 9.2" }}>
        <Img src="khom/dining" alt="Three woven pendants over a dining table" className="absolute inset-0" priority sizes="100vw" />
        {/* evening: the room darkens and each shade glows */}
        <div className="pointer-events-none absolute inset-0 bg-[#0c0906] transition-opacity duration-[1200ms]" style={{ opacity: night ? 0.72 : 0 }} />
        {GLOWS.map((g, i) => (
          <span
            key={i}
            className="pointer-events-none absolute h-[42%] w-[20%] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen transition-opacity duration-[1400ms]"
            style={{ left: `${g.x * 100}%`, top: `${g.y * 100}%`, opacity: night ? 1 : 0, transitionDelay: `${i * 160}ms`, background: "radial-gradient(closest-side, rgb(255 196 110 / 0.85), rgb(255 160 60 / 0.25) 45%, transparent)" }}
          />
        ))}
        <span className="pointer-events-none absolute left-[46%] top-[66%] h-[30%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen transition-opacity delay-500 duration-[1600ms]" style={{ opacity: night ? 0.55 : 0, background: "radial-gradient(closest-side, rgb(255 190 110 / 0.6), transparent)" }} />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_8_6/0.6),transparent_45%)]" />
        <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-5 text-white sm:inset-x-10 sm:bottom-9">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }} className="font-display max-w-[13ch] text-[clamp(38px,6.4vw,96px)] font-semibold leading-[0.95] tracking-[-0.04em]">
            Lamps woven by hand in Ayutthaya
          </motion.h1>
          <div className="grid gap-3">
            <button onClick={() => setNight(!night)} className="inline-flex h-12 items-center gap-3 rounded-full bg-white/15 px-5 text-[15px] backdrop-blur-md hover:bg-white/25">
              <span className={`size-2.5 rounded-full transition-colors ${night ? "bg-[#ffc46e] shadow-[0_0_10px_3px_rgb(255_196_110/0.8)]" : "bg-white/60"}`} />
              {night ? "Back to daylight" : "See them at night"}
            </button>
            <Link href={`${R}/lamps`} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] text-[#14110e]">
              Browse lamps {Icon.arrow}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Shapes() {
  const shapes: Shape[] = ["Bell", "Dome", "Drum", "Lantern", "Wall"];
  const [s, setS] = useState<Shape>("Bell");
  const list = lamps.filter((l) => l.shape === s);
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:py-32">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 className="font-display max-w-[18ch] text-[clamp(30px,4vw,56px)] font-semibold leading-[1] tracking-[-0.035em]">Five shapes, each in three weaves</h2>
        <div className="flex flex-wrap gap-2" role="tablist">
          {shapes.map((x) => (
            <button key={x} role="tab" aria-selected={s === x} onClick={() => setS(x)} className={`rounded-full px-4 py-2 text-[14px] transition-colors ${s === x ? "bg-ink text-bg" : "border border-line hover:border-ink/40"}`}>
              {x}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={s} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((l) => (
            <LampCard key={l.id} l={l} />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function LampCard({ l }: { l: Lamp }) {
  return (
    <Link href={`${R}/lamp/${l.id}`} className="group grid content-start gap-3">
      <div className="relative overflow-hidden rounded-[18px]">
        <Img src={l.img} alt={`${l.name}, ${l.line.toLowerCase()}`} ratio={4 / 5} widths={[800]} position={l.pos} sizes="(min-width:1024px) 33vw, 50vw" imgClassName="transition-[transform,filter] duration-[1.2s] ease-out group-hover:scale-[1.05] group-hover:brightness-110" />
        <span className="absolute left-3 top-3 rounded-full bg-black/35 px-3 py-1 text-[12px] text-white backdrop-blur">{l.sizes.map((s) => `${s}`).join(" / ")} cm</span>
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <span>
          <span className="font-display block text-[19px] font-semibold tracking-[-0.02em]">{l.name}</span>
          <span className="text-[14px] text-muted">{l.line}</span>
        </span>
        <span className="shrink-0 text-[14px]">from {baht(l.price)}</span>
      </div>
    </Link>
  );
}

/**
 * Size guide: set the table and see how many pendants fit, how wide they should be
 * and how high to hang them, drawn to scale.
 */
function SizeGuide() {
  const { add, toast } = use();
  const [len, setLen] = useState(200);
  const [wid, setWid] = useState(95);
  const count = Math.max(1, Math.min(4, Math.round(len / 70)));
  const ideal = Math.round((wid * 0.5) / 5) * 5;
  const pick = useMemo(() => {
    const opts = lamps.filter((l) => l.shape !== "Wall").flatMap((l) => l.sizes.map((s) => ({ l, s })));
    return opts.sort((a, b) => Math.abs(a.s - ideal) - Math.abs(b.s - ideal))[0];
  }, [ideal]);
  const W = 640;
  const scale = (W - 80) / 300;
  const tw = len * scale;
  const tx = (W - tw) / 2;
  const gap = tw / count;
  const dia = pick.s * scale;
  return (
    <section id="size" className="scroll-mt-20 bg-soft transition-colors duration-700">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:py-32">
        <div className="grid content-start gap-8">
          <h2 className="font-display text-[clamp(30px,4vw,56px)] font-semibold leading-[1] tracking-[-0.035em]">How many, how big, how high</h2>
          <p className="max-w-md text-[16px] leading-relaxed text-muted">Set your dining table and we work out the pendants for it, using the spacing our lighting designers use on hotel projects.</p>
          <label className="grid gap-3">
            <span className="flex justify-between text-[14px]">
              Table length <span className="tabular-nums">{len} cm</span>
            </span>
            <input type="range" min={100} max={300} step={10} value={len} onChange={(e) => setLen(+e.target.value)} className="khom-range" />
          </label>
          <label className="grid gap-3">
            <span className="flex justify-between text-[14px]">
              Table width <span className="tabular-nums">{wid} cm</span>
            </span>
            <input type="range" min={60} max={140} step={5} value={wid} onChange={(e) => setWid(+e.target.value)} className="khom-range" />
          </label>
          <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6">
            {[
              ["Pendants", String(count)],
              ["Shade width", `${pick.s} cm`],
              ["Above table", "75 cm"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[13px] text-muted">{k}</dt>
                <dd className="font-display text-[28px] font-semibold tracking-[-0.03em]">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                add({ id: pick.l.id, size: pick.s, qty: count });
                toast(`${count} x ${pick.l.name} added to your list`);
              }}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] text-bg"
            >
              Add {count} x {pick.l.name} {pick.s} cm
            </button>
            <Link href={`${R}/lamp/${pick.l.id}`} className="text-[14px] underline underline-offset-4">
              About {pick.l.name}
            </Link>
          </div>
        </div>
        <div className="grid place-items-center rounded-[20px] bg-bg p-4 transition-colors duration-700 sm:p-8">
          <svg viewBox={`0 0 ${W} 360`} className="w-full" role="img" aria-label={`${count} pendants of ${pick.s} cm over a ${len} by ${wid} cm table`}>
            <line x1="0" y1="20" x2={W} y2="20" className="stroke-current opacity-20" />
            {Array.from({ length: count }, (_, i) => {
              const cx = tx + gap * (i + 0.5);
              return (
                <motion.g key={`${count}-${i}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.06, ease }}>
                  <line x1={cx} y1="20" x2={cx} y2={150 - dia * 0.55} className="stroke-current opacity-50" />
                  <path d={`M ${cx - dia / 2} 150 Q ${cx - dia / 2} ${150 - dia * 0.6} ${cx} ${150 - dia * 0.6} Q ${cx + dia / 2} ${150 - dia * 0.6} ${cx + dia / 2} 150 Z`} fill="#c9985c" className="khom-shade" />
                </motion.g>
              );
            })}
            <motion.rect animate={{ x: tx, width: tw }} transition={{ duration: 0.4, ease }} y="232" height="12" rx="3" className="fill-current opacity-80" />
            <motion.rect animate={{ x: tx + 14, width: 6 }} y="244" height="90" className="fill-current opacity-60" />
            <motion.rect animate={{ x: tx + tw - 20, width: 6 }} transition={{ duration: 0.4, ease }} y="244" height="90" className="fill-current opacity-60" />
            <line x1={tx + tw + 18} y1="150" x2={tx + tw + 18} y2="232" className="stroke-current opacity-40" strokeDasharray="3 4" />
            <text x={tx + tw + 26} y="196" className="fill-current text-[13px] opacity-70">
              75 cm
            </text>
            <text x={W / 2} y="356" textAnchor="middle" className="fill-current text-[13px] opacity-70">
              {len} cm table
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}

function Craft() {
  return (
    <section className="mx-auto grid max-w-[1440px] gap-4 px-5 py-24 sm:px-8 md:grid-cols-[1.3fr_1fr] lg:py-32">
      <div className="relative overflow-hidden rounded-[20px]">
        <Img src="khom/holding" alt="A woven disc held up against a yellow wall" ratio={1.46} sizes="(min-width:768px) 55vw, 100vw" />
      </div>
      <div className="grid content-between gap-8 rounded-[20px] border border-line p-7 sm:p-10">
        <h2 className="font-display text-[clamp(28px,3.4vw,46px)] font-semibold leading-[1.02] tracking-[-0.035em]">Two days of weaving in every shade</h2>
        <ul className="grid gap-4 text-[15px]">
          {[
            ["Rattan and bamboo", "Split by hand and dried in the sun for two weeks"],
            ["Woven on a mould", "One weaver per shade, from the crown to the rim"],
            ["Wired in Bangkok", "Certified fittings, E27 holders, three metres of cable"],
          ].map(([t, d]) => (
            <li key={t} className="grid gap-0.5 border-t border-line pt-4">
              <span className="font-medium">{t}</span>
              <span className="text-muted">{d}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Projects() {
  const list = [
    { img: "khom/cafe", name: "Corner cafe, Ari", note: "12 Khao domes over the counter", pos: "50% 20%" },
    { img: "khom/lanterns", name: "Boutique hotel stairwell, Chiang Mai", note: "28 Lanna lanterns over four floors", pos: "50% 50%" },
    { img: "khom/kitchen", name: "Family kitchen, Nonthaburi", note: "Three Trio drums over the island", pos: "50% 30%" },
  ];
  return (
    <section id="projects" className="mx-auto max-w-[1440px] scroll-mt-20 px-5 pb-24 sm:px-8 lg:pb-32">
      <h2 className="font-display mb-10 text-[clamp(30px,4vw,56px)] font-semibold leading-[1] tracking-[-0.035em]">Where they hang</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {list.map((p) => (
          <figure key={p.name} className="group grid gap-3">
            <div className="overflow-hidden rounded-[18px]">
              <Img src={p.img} alt={p.name} ratio={4 / 5} widths={[800]} position={p.pos} sizes="(min-width:768px) 33vw, 100vw" imgClassName="transition-transform duration-[1.2s] group-hover:scale-[1.04]" />
            </div>
            <figcaption>
              <span className="block text-[16px] font-medium">{p.name}</span>
              <span className="text-[14px] text-muted">{p.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-[20px] bg-ink px-7 py-10 text-bg transition-colors duration-700 sm:px-10">
        <p className="font-display max-w-xl text-[clamp(24px,2.6vw,36px)] font-semibold leading-[1.1] tracking-[-0.03em]">Lighting a hotel, cafe or a whole house? Send us the plan.</p>
        <Link href={`${R}/contact`} className="inline-flex h-12 items-center gap-2 rounded-full bg-bg px-6 text-[15px] text-ink">
          Get a lighting quote {Icon.arrow}
        </Link>
      </div>
    </section>
  );
}

/* ---------------- lamps ---------------- */

function Lamps() {
  const [shape, setShape] = useState<"All" | Shape>("All");
  const list = lamps.filter((l) => shape === "All" || l.shape === shape);
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-28 sm:px-8 lg:pt-36">
      <h1 className="font-display text-[clamp(44px,7vw,100px)] font-semibold leading-[0.95] tracking-[-0.045em]">All lamps</h1>
      <div className="mt-8 flex flex-wrap gap-2 border-b border-line pb-5">
        {(["All", "Bell", "Dome", "Drum", "Lantern", "Wall"] as const).map((x) => (
          <button key={x} aria-pressed={shape === x} onClick={() => setShape(x)} className={`rounded-full px-4 py-2 text-[14px] ${shape === x ? "bg-ink text-bg" : "border border-line hover:border-ink/40"}`}>
            {x}
          </button>
        ))}
        <span className="ml-auto self-center text-[14px] text-muted">{list.length} lamps</span>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {list.map((l) => (
          <LampCard key={l.id} l={l} />
        ))}
      </div>
    </div>
  );
}

function LampPage({ l }: { l: Lamp }) {
  const { add, toast } = use();
  const [size, setSize] = useState(l.sizes[0]);
  const [qty, setQty] = useState(1);
  const price = priceFor(l, size);
  const more = lamps.filter((x) => x.id !== l.id).slice(0, 4);
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-24 sm:px-8 lg:pt-28">
      <nav className="mb-6 text-[13px] text-muted">
        <Link href={`${R}/lamps`} className="hover:text-ink">
          Lamps
        </Link>{" "}
        / {l.shape}
      </nav>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <Img src={l.img} alt={`${l.name}, ${l.line.toLowerCase()}`} ratio={Math.max(0.8, Math.min(1.3, l.ratio))} position={l.pos} priority sizes="(min-width:1024px) 55vw, 100vw" className="rounded-[20px]" />
        <div className="grid content-start gap-7 lg:sticky lg:top-24 lg:self-start">
          <div className="grid gap-2">
            <p className="text-[14px] text-muted">{l.shape}</p>
            <h1 className="font-display text-[clamp(44px,6vw,84px)] font-semibold leading-[0.95] tracking-[-0.045em]">{l.name}</h1>
            <p className="text-[20px] tabular-nums">{baht(price)}</p>
          </div>
          <p className="max-w-md text-[16px] leading-relaxed text-muted">{l.detail}</p>
          <div className="grid gap-3">
            <p className="text-[14px]">Diameter</p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Diameter">
              {l.sizes.map((s) => (
                <button key={s} role="radio" aria-checked={size === s} onClick={() => setSize(s)} className={`h-11 rounded-full px-5 text-[14px] ${size === s ? "bg-ink text-bg" : "border border-line"}`}>
                  {s} cm
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Qty value={qty} onChange={setQty} max={99} />
            <button
              onClick={() => {
                add({ id: l.id, size, qty });
                toast(`${l.name} added to your list`);
              }}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-ink text-[15px] text-bg"
            >
              Add to list, {baht(price * qty)}
            </button>
          </div>
          <dl className="grid gap-px overflow-hidden rounded-[16px] bg-line text-[14px]">
            {[
              ["Material", "Rattan and bamboo, natural finish"],
              ["Fitting", l.shape === "Wall" && l.id === "rang" ? "Decorative, unwired" : "E27, LED bulb included, 3 m cable"],
              ["Made to order", "3 weeks, 5 weeks for 20 or more"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_1fr] gap-4 bg-bg px-4 py-3 transition-colors duration-700">
                <dt className="text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <section className="mt-24">
        <h2 className="font-display mb-8 text-[clamp(26px,3vw,40px)] font-semibold tracking-[-0.03em]">More lamps</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {more.map((x) => (
            <LampCard key={x.id} l={x} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ListSheet() {
  const { lines, setLines, panel, setPanel } = use();
  const close = () => setPanel(null);
  const total = lines.reduce((s, x) => s + priceFor(byId(x.id)!, x.size) * x.qty, 0);
  return (
    <Sheet
      open={panel === "list"}
      onClose={close}
      title="Your list"
      footer={
        lines.length > 0 && (
          <div className="grid gap-3">
            <div className="flex justify-between text-[15px]">
              <span>Estimated total</span>
              <span className="tabular-nums">{baht(total)}</span>
            </div>
            <Link href={`${R}/contact`} onClick={close} className={btn.primary}>
              Send for a quote
            </Link>
          </div>
        )
      }
    >
      {lines.length === 0 ? (
        <div className="grid gap-4 py-10 text-center">
          <p className="text-muted">Nothing here yet.</p>
          <Link href={`${R}/lamps`} onClick={close} className={btn.ghost}>
            Browse lamps
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5">
          {lines.map((x, i) => {
            const l = byId(x.id)!;
            return (
              <li key={`${x.id}-${x.size}`} className="grid grid-cols-[72px_1fr] gap-4">
                <Img src={l.img} alt="" ratio={1} widths={[800]} position={l.pos} sizes="72px" className="rounded-[12px]" />
                <div className="grid gap-1">
                  <div className="flex justify-between gap-3 text-[15px]">
                    <span>
                      {l.name} {x.size} cm
                    </span>
                    <span className="tabular-nums">{baht(priceFor(l, x.size) * x.qty)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <Qty value={x.qty} max={99} onChange={(n) => setLines(lines.map((y, j) => (j === i ? { ...y, qty: n } : y)))} />
                    <button className="text-[13px] text-muted underline underline-offset-4" onClick={() => setLines(lines.filter((_, j) => j !== i))}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Sheet>
  );
}

function Contact() {
  const { lines, setLines } = use();
  const [f, setF] = useState({ name: "", email: "", phone: "", note: "" });
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const e = {
    name: f.name.trim().length < 2 && "Enter your name",
    email: !isEmail(f.email) && "Enter a valid email",
    phone: !isPhone(f.phone) && "Enter a Thai phone number",
    note: !lines.length && f.note.trim().length < 5 && "Tell us about the space, or add lamps to your list",
  };
  if (done)
    return (
      <div className="mx-auto grid max-w-[620px] gap-5 px-5 pb-24 pt-36">
        <span className="grid size-12 place-items-center rounded-full bg-ink text-bg">{Icon.check}</span>
        <h1 className="font-display text-[44px] font-semibold leading-[1] tracking-[-0.04em]">Thanks, we will be in touch</h1>
        <p className="text-muted">
          Reference {done}. Prices, lead times and a wiring sheet go to {f.email} within one working day.
        </p>
        <Link href={`${R}/lamps`} className={`${btn.ghost} w-auto justify-self-start`}>
          Back to lamps
        </Link>
      </div>
    );
  return (
    <div className="mx-auto grid max-w-[1200px] gap-12 px-5 pb-24 pt-28 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:pt-36">
      <div className="grid content-start gap-5">
        <h1 className="font-display text-[clamp(44px,6vw,84px)] font-semibold leading-[0.95] tracking-[-0.045em]">Get a quote</h1>
        <p className="max-w-md text-muted">For homes, cafes and hotels. Trade pricing from ten lamps.</p>
        {lines.length > 0 && (
          <ul className="grid gap-2 text-[14px]">
            {lines.map((x) => (
              <li key={`${x.id}-${x.size}`} className="flex justify-between rounded-[12px] bg-soft px-4 py-2.5 transition-colors duration-700">
                <span>
                  {x.qty} x {byId(x.id)!.name} {x.size} cm
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="grid content-start gap-4 rounded-[20px] border border-line p-5 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" autoComplete="name" value={f.name} onValue={(v) => setF({ ...f, name: v })} error={tried && e.name} />
          <Field label="Phone" type="tel" inputMode="tel" value={f.phone} onValue={(v) => setF({ ...f, phone: v })} error={tried && e.phone} />
          <Field label="Email" type="email" autoComplete="email" value={f.email} onValue={(v) => setF({ ...f, email: v })} error={tried && e.email} className="sm:col-span-2" />
          <Field label="About the space" as="textarea" value={f.note} onValue={(v) => setF({ ...f, note: v })} error={tried && e.note} className="sm:col-span-2" />
        </div>
        <button
          className={`${btn.primary} sm:max-w-xs`}
          onClick={() => {
            setTried(true);
            if (Object.values(e).some(Boolean)) return;
            setDone(makeRef("KHM"));
            setLines([]);
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

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-6 px-5 py-12 sm:px-8">
        <p className="font-display text-[clamp(60px,12vw,160px)] font-semibold leading-[0.8] tracking-[-0.06em]">khom</p>
        <div className="grid gap-1 text-[14px] text-muted">
          <p>Workshop in Bang Pahan, Ayutthaya</p>
          <p>A concept site by Chanasak Choonuch. khom is a fictional brand.</p>
        </div>
      </div>
    </footer>
  );
}
