"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Drawer } from "@/components/shared/ui";
import { BottleScene, type Pose } from "./BottleScene";

type Scent = { id: string; name: string; thai: string; line: string; liquid: string; bg: string; notes: [string, string][]; wear: string };

const scents: Scent[] = [
  {
    id: "mali",
    name: "Mali",
    thai: "มะลิ",
    line: "Jasmine garlands at the flower market, an hour before dawn.",
    liquid: "#d1a24a",
    bg: "#1d1a14",
    notes: [
      ["Top", "Bergamot, steamed jasmine rice"],
      ["Heart", "Jasmine sambac, orange blossom"],
      ["Base", "White musk, sandalwood"],
    ],
    wear: "8 to 10 hours",
  },
  {
    id: "monsoon",
    name: "Monsoon",
    thai: "มรสุม",
    line: "The first rain of June on hot stone and lemongrass.",
    liquid: "#8fae8c",
    bg: "#131a17",
    notes: [
      ["Top", "Lemongrass, green tea"],
      ["Heart", "Wet stone, violet leaf"],
      ["Base", "Vetiver, cedar"],
    ],
    wear: "6 to 8 hours",
  },
  {
    id: "teak",
    name: "Teak",
    thai: "สัก",
    line: "An old teak house in the evening, a lamp, a leather chair.",
    liquid: "#9a4f1e",
    bg: "#1c120c",
    notes: [
      ["Top", "Pink pepper, cardamom"],
      ["Heart", "Smoked teak, tobacco leaf"],
      ["Base", "Leather, tonka, labdanum"],
    ],
    wear: "10 to 12 hours",
  },
  {
    id: "ylang",
    name: "Ylang",
    thai: "กระดังงา",
    line: "Ylang-ylang on a warm night, skin still salty from the sea.",
    liquid: "#cf7f72",
    bg: "#1d1316",
    notes: [
      ["Top", "Mandarin, sea salt"],
      ["Heart", "Ylang-ylang, rose"],
      ["Base", "Amber, ambrette seed"],
    ],
    wear: "8 to 10 hours",
  },
];

const sizes = [
  { id: "50", label: "50 ml", price: 4200, scale: 0.9 },
  { id: "100", label: "100 ml", price: 6400, scale: 1.08 },
];

const tour = [
  { title: "A brass cap, brushed by hand", text: "Cast in solid brass in Bangkok's Chinatown and brushed until it catches light along the grain. It weighs as much as the glass beneath it." },
  { title: "A label you can keep", text: "Letterpress on cotton paper, with room for three initials. We print them while you wait at the atelier, or before we post." },
  { title: "Glass thick enough to hold light", text: "A six-millimetre base and walls ground flat, so the colour of each scent shows through like a pane of tinted window." },
];

const fmt = new Intl.NumberFormat("en-US");
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const mix = (a: Pose, b: Pose, t: number): Pose => {
  const o = { ...a };
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => (o[k] = a[k] + (b[k] - a[k]) * t));
  return o;
};

type Line = { scent: string; size: string; initials: string; qty: number; price: number };

export function HomSite() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<BottleScene | null>(null);
  const hero = useRef<HTMLElement>(null);
  const craft = useRef<HTMLElement>(null);
  const config = useRef<HTMLElement>(null);
  const notes = useRef<HTMLElement>(null);
  const drag = useRef<number | null>(null);

  const [scent, setScent] = useState(scents[0]);
  const [size, setSize] = useState(sizes[1]);
  const [initials, setInitials] = useState("");
  const [zoom, setZoom] = useState(1);
  const [step, setStep] = useState(0);
  const [bag, setBag] = useState<Line[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Start the 3D scene once
  useEffect(() => {
    if (!canvas.current) return;
    const s = new BottleScene(canvas.current);
    scene.current = s;
    queueMicrotask(() => setReady(true));
    return () => s.dispose();
  }, []);

  // Liquid colour, label and size follow the choices
  useEffect(() => {
    const s = scene.current;
    if (!s) return;
    s.setScent(scent.liquid, scent.bg);
    const draw = () => s.drawLabel({ scent: scent.name, size: size.label.toUpperCase(), initials, ink: "#2a241d", paper: "#f1ece2" });
    draw();
    document.fonts?.ready.then(draw);
  }, [scent, size, initials, ready]);

  useEffect(() => {
    if (scene.current) scene.current.zoom = zoom;
  }, [zoom]);

  // Scroll choreography: each section asks the bottle for a pose, blended by how far it has scrolled
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const s = scene.current;
      if (!s || !hero.current || !craft.current || !config.current || !notes.current) return;
      const vh = window.innerHeight;
      const wide = window.innerWidth >= 1024;
      const a = clamp(-hero.current.getBoundingClientRect().top / vh);
      const cr = craft.current.getBoundingClientRect();
      const b = clamp(-cr.top / (cr.height - vh));
      const c = clamp(1 - config.current.getBoundingClientRect().top / vh);
      const d = clamp(1 - notes.current.getBoundingClientRect().top / vh);

      const start: Pose = { x: 0, y: wide ? -0.05 : 0.25, dist: wide ? 10 : 13.5, look: 0.15, spin: 1, opacity: 1, scale: size.scale };
      const cap: Pose = { ...start, x: wide ? -0.9 : 0, y: wide ? 0 : 0.5, dist: wide ? 4.2 : 6, look: 1.3, spin: 0 };
      const label: Pose = { ...cap, dist: wide ? 3.6 : 5.4, look: -0.1 };
      const base: Pose = { ...cap, dist: wide ? 4.4 : 6.2, look: -0.7 };
      const shop: Pose = { ...start, x: wide ? -1.75 : 0, y: wide ? 0 : 1.6, dist: wide ? 10 : 14, spin: 0.6 };
      const gone: Pose = { ...shop, y: shop.y + 9, opacity: 0 };

      let p = mix(start, cap, a);
      if (b > 0) p = b < 0.5 ? mix(cap, label, clamp((b - 0.22) / 0.18)) : mix(label, base, clamp((b - 0.62) / 0.18));
      if (c > 0) p = mix(b >= 1 ? base : p, shop, c);
      if (d > 0) p = mix(p, gone, d);
      s.target = p;

      const st = b < 0.3 ? 0 : b < 0.7 ? 1 : 2;
      setStep((v) => (v === st ? v : st));
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [size]);

  const add = (line: Omit<Line, "qty">) => {
    setBag((prev) => {
      const same = prev.find((l) => l.scent === line.scent && l.size === line.size && l.initials === line.initials);
      return same ? prev.map((l) => (l === same ? { ...l, qty: l.qty + 1 } : l)) : [...prev, { ...line, qty: 1 }];
    });
    setBagOpen(true);
  };
  const count = bag.reduce((n, l) => n + l.qty, 0);
  const total = bag.reduce((n, l) => n + l.qty * l.price, 0);
  const pill = (on: boolean) => `rounded-full border px-4 py-2 text-[14px] transition-colors duration-300 ${on ? "border-[#efe9df] bg-[#efe9df] text-[#1a1714]" : "border-white/20 hover:border-white/60"}`;

  return (
    <div className="relative text-[#efe9df]">
      <canvas ref={canvas} aria-label={`${scent.name} eau de parfum bottle`} role="img" className="pointer-events-none fixed inset-0 z-0 h-[100svh] w-full" />

      <header className="fixed inset-x-0 top-0 z-30 grid h-16 grid-cols-[1fr_auto_1fr] items-center px-[var(--gutter)] text-[14px]">
        <nav className="hidden gap-7 md:flex" aria-label="Main">
          {[
            ["Scents", "#shop"],
            ["Craft", "#craft"],
            ["Notes", "#notes"],
            ["Atelier", "#atelier"],
          ].map(([l, h]) => (
            <a key={h} href={h} className="opacity-70 transition-opacity hover:opacity-100">
              {l}
            </a>
          ))}
        </nav>
        <a href="#top" className="col-start-2 font-display text-[26px] tracking-[0.3em]">
          HOM
        </a>
        <button type="button" onClick={() => setBagOpen(true)} className="justify-self-end">
          Bag <span className="tabular">({count})</span>
        </button>
      </header>

      {/* Hero */}
      <section id="top" ref={hero} className="relative z-10 h-[100svh] overflow-hidden px-[var(--gutter)]">
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.3em" }}
          animate={{ opacity: 1, letterSpacing: "-0.02em" }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 select-none text-center font-display text-[clamp(9rem,34vw,34rem)] leading-none text-white/[0.06]"
        >
          Hom
        </motion.h1>
        <motion.div
          className="absolute inset-x-[var(--gutter)] bottom-16 z-20 grid items-end gap-6 sm:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          <p className="max-w-[30ch] font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.1]">Four scents of a Bangkok night, poured by hand.</p>
          <div className="flex justify-center gap-2" role="group" aria-label="Choose a scent">
            {scents.map((s) => (
              <button key={s.id} type="button" onClick={() => setScent(s)} aria-pressed={scent.id === s.id} className="group flex flex-col items-center gap-2 px-2 text-[13px]">
                <span className={`size-3 rounded-full ring-1 ring-white/40 ring-offset-4 ring-offset-transparent transition-transform ${scent.id === s.id ? "scale-125" : "opacity-60 group-hover:opacity-100"}`} style={{ background: s.liquid }} />
                <span className={scent.id === s.id ? "" : "opacity-50"}>{s.name}</span>
              </button>
            ))}
          </div>
          <p className="hidden text-right text-[13px] opacity-60 sm:block">Eau de parfum, Charoen Krung, Bangkok</p>
        </motion.div>
      </section>

      {/* Guided zoom around the bottle */}
      <section id="craft" ref={craft} className="relative z-10 h-[320vh]">
        <div className="sticky top-0 flex h-[100svh] items-end px-[var(--gutter)] pb-14 lg:items-center lg:pb-0">
          <div className="relative z-20 ml-auto w-full max-w-[420px] lg:mr-[4vw]">
            <div className="mb-8 flex gap-2" aria-hidden>
              {tour.map((_, i) => (
                <span key={i} className="h-px flex-1 bg-white/20">
                  <span className="block h-px bg-white transition-[width] duration-700" style={{ width: i <= step ? "100%" : "0%" }} />
                </span>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 24, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -16, filter: "blur(6px)" }} transition={{ duration: 0.6 }}>
                <h2 className="font-display text-[clamp(2.2rem,3.6vw,3.4rem)] leading-[1.02]">{tour[step].title}</h2>
                <p className="mt-5 text-[16px] leading-[1.7] opacity-75">{tour[step].text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Configurator */}
      <section id="shop" ref={config} className="relative grid min-h-[100svh] scroll-mt-0 lg:grid-cols-2">
        <div
          className="relative z-20 h-[52svh] cursor-grab touch-pan-y active:cursor-grabbing lg:h-auto"
          data-cursor="Drag"
          onPointerDown={(e) => {
            drag.current = e.clientX;
            scene.current?.dragStart();
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (drag.current === null) return;
            scene.current?.dragMove(e.clientX - drag.current);
            drag.current = e.clientX;
          }}
          onPointerUp={() => {
            drag.current = null;
            scene.current?.dragEnd();
          }}
          onWheel={(e) => {
            if (!e.ctrlKey && !e.altKey) return;
            e.preventDefault();
            setZoom((z) => Math.min(1.25, Math.max(0.45, z + e.deltaY * 0.002)));
          }}
        >
          <div className="absolute bottom-6 left-[var(--gutter)] flex items-center gap-3 text-[13px]">
            <span className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 backdrop-blur-sm">
              <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden>
                <path d="M1 5h16M4 2L1 5l3 3M14 2l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Drag to turn 360°
            </span>
            <div className="flex overflow-hidden rounded-full border border-white/20 backdrop-blur-sm" role="group" aria-label="Zoom">
              <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={() => setZoom((z) => Math.min(1.25, z + 0.15))} className="size-9 hover:bg-white/10" aria-label="Zoom out">
                −
              </button>
              <span className="tabular flex w-12 items-center justify-center border-x border-white/20">{Math.round((1 / zoom) * 100)}%</span>
              <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={() => setZoom((z) => Math.max(0.45, z - 0.15))} className="size-9 hover:bg-white/10" aria-label="Zoom in">
                +
              </button>
            </div>
          </div>
        </div>

        <div className="relative z-20 flex flex-col justify-center px-[var(--gutter)] py-16 lg:py-24 lg:pr-[6vw]">
          <div className="rounded-[2px] bg-black/25 p-6 backdrop-blur-xl sm:p-10 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <p className="text-[13px] opacity-60">Eau de parfum</p>
            <AnimatePresence mode="wait">
              <motion.div key={scent.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45 }}>
                <h2 className="mt-2 flex items-baseline gap-4 font-display text-[clamp(3.4rem,6vw,6rem)] leading-none">
                  {scent.name}
                  <span className="text-[0.32em] italic opacity-50">{scent.thai}</span>
                </h2>
                <p className="mt-4 max-w-[38ch] text-[16px] leading-[1.7] opacity-75">{scent.line}</p>
              </motion.div>
            </AnimatePresence>

            <fieldset className="mt-10">
              <legend className="mb-3 text-[13px] opacity-60">Scent</legend>
              <div className="flex flex-wrap gap-2">
                {scents.map((s) => (
                  <button key={s.id} type="button" onClick={() => setScent(s)} aria-pressed={scent.id === s.id} className={`${pill(scent.id === s.id)} flex items-center gap-2`}>
                    <span className="size-2.5 rounded-full" style={{ background: s.liquid }} />
                    {s.name}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-7">
              <legend className="mb-3 text-[13px] opacity-60">Size</legend>
              <div className="flex gap-2">
                {sizes.map((z) => (
                  <button key={z.id} type="button" onClick={() => setSize(z)} aria-pressed={size.id === z.id} className={pill(size.id === z.id)}>
                    {z.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="mt-7 block">
              <span className="mb-3 block text-[13px] opacity-60">Initials on the label, free</span>
              <input
                value={initials}
                onChange={(e) => setInitials(e.target.value.replace(/[^a-zA-Z.]/g, "").toUpperCase().slice(0, 3))}
                placeholder="Up to 3 letters"
                className="w-full max-w-[260px] border-b border-white/30 bg-transparent py-2 font-display text-[24px] italic tracking-[0.1em] outline-none placeholder:font-body placeholder:text-[15px] placeholder:not-italic placeholder:tracking-normal placeholder:opacity-40 focus:border-white"
              />
              <span className="mt-2 block text-[13px] opacity-50">Watch the label on the bottle as you type.</span>
            </label>

            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/15 pt-6">
              <p className="tabular font-display text-[2.2rem] leading-none">฿{fmt.format(size.price)}</p>
              <button
                type="button"
                onClick={() => add({ scent: scent.name, size: size.label, initials, price: size.price })}
                className="flex-1 rounded-full bg-[#efe9df] px-8 py-4 text-[15px] font-medium text-[#1a1714] transition-transform duration-300 hover:scale-[1.02]"
              >
                Add to bag
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section id="notes" ref={notes} className="relative z-20 overflow-hidden px-[var(--gutter)] py-[18vh]">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-[10vw] top-[10%] size-[60vw] max-w-[820px] rounded-full opacity-40 blur-[120px]"
          animate={{ backgroundColor: scent.liquid, x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ backgroundColor: { duration: 1.2 }, x: { duration: 14, repeat: Infinity }, y: { duration: 11, repeat: Infinity } }}
        />
        <div className="relative grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-[13px] opacity-60">What you smell</p>
            <h2 className="mt-3 font-display text-[clamp(2.8rem,5vw,5rem)] leading-[0.95]">
              {scent.name}, <span className="italic opacity-60">over a day</span>
            </h2>
            <p className="mt-6 text-[15px] opacity-70">Lasts {scent.wear} on skin. Longer on wool and cotton.</p>
          </div>
          <ol className="lg:col-span-7 lg:col-start-6">
            {scent.notes.map(([k, v], i) => (
              <motion.li
                key={`${scent.id}-${k}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.12 }}
                className="grid grid-cols-[90px_1fr] items-baseline gap-6 border-t border-white/15 py-8 sm:grid-cols-[140px_1fr]"
              >
                <span className="text-[13px] opacity-60">
                  {k}
                  <span className="block">{["first hour", "hours two to five", "into the evening"][i]}</span>
                </span>
                <span className="font-display text-[clamp(1.8rem,3.4vw,3.2rem)] leading-[1.05]">{v}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Discovery set and atelier */}
      <section id="atelier" className="relative z-20 grid gap-px border-t border-white/10 bg-white/10 lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-10 px-[var(--gutter)] py-16 lg:min-h-[60vh]" style={{ backgroundColor: scent.bg }}>
          <div>
            <p className="text-[13px] opacity-60">Not sure yet</p>
            <h2 className="mt-3 max-w-[14ch] font-display text-[clamp(2.4rem,4vw,4rem)] leading-[0.98]">Wear all four for a week</h2>
            <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.7] opacity-75">Four 2 ml vials in a paper case. The ฿1,200 comes off a full bottle within 60 days.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5" aria-hidden>
              {scents.map((s) => (
                <span key={s.id} className="h-14 w-3 rounded-full" style={{ background: `linear-gradient(to top, ${s.liquid} 70%, rgba(255,255,255,0.15) 70%)` }} />
              ))}
            </div>
            <button type="button" onClick={() => add({ scent: "Discovery set", size: "4 × 2 ml", initials: "", price: 1200 })} className="rounded-full border border-white/30 px-6 py-3 text-[15px] hover:border-white">
              Add the set, ฿1,200
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-10 px-[var(--gutter)] py-16" style={{ backgroundColor: scent.bg }}>
          <div>
            <p className="text-[13px] opacity-60">Atelier</p>
            <h2 className="mt-3 max-w-[14ch] font-display text-[clamp(2.4rem,4vw,4rem)] leading-[0.98]">Charoen Krung Road, by the river</h2>
            <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.7] opacity-75">Smell every scent from the raw materials up, then have your label printed while you wait. Tuesday to Sunday, 11:00 to 20:00.</p>
          </div>
          <p className="text-[15px] opacity-75">
            1240 Charoen Krung Road, Bang Rak
            <br />
            hello@hom.example
          </p>
        </div>
      </section>

      <footer className="relative z-20 overflow-hidden px-[var(--gutter)] pt-16">
        <div className="flex flex-col justify-between gap-4 text-[13px] opacity-60 sm:flex-row">
          <span>Concept site. HOM and its scents are fictional. Bottle rendered live in WebGL.</span>
          <Link href="/" className="underline underline-offset-4">
            All concepts
          </Link>
        </div>
        <p aria-hidden className="select-none pt-8 text-center font-display text-[clamp(8rem,40vw,42rem)] leading-[0.72] tracking-[0.08em] text-white/[0.07]">
          HOM
        </p>
      </footer>

      <Drawer
        open={bagOpen}
        onClose={() => setBagOpen(false)}
        title={`Bag (${count})`}
        footer={
          bag.length ? (
            <div className="grid gap-3">
              <div className="flex justify-between text-[15px]">
                <span>Subtotal</span>
                <span className="tabular">฿{fmt.format(total)}</span>
              </div>
              <p className="text-[13px] text-muted">Free delivery in Bangkok within a day. Gift wrapping is on us.</p>
              <button type="button" className="rounded-full bg-ink py-3.5 text-[15px] text-bg">
                Continue to checkout
              </button>
            </div>
          ) : undefined
        }
      >
        {bag.length === 0 ? (
          <p className="py-8 text-[15px] text-muted">Your bag is empty.</p>
        ) : (
          <ul className="divide-y divide-line">
            {bag.map((l, i) => {
              const s = scents.find((x) => x.name === l.scent);
              return (
                <li key={i} className="flex items-center gap-4 py-4">
                  <span className="flex h-16 w-12 shrink-0 items-end justify-center rounded-[3px] bg-soft p-1.5">
                    <span className="block h-[70%] w-full rounded-[2px]" style={{ background: s?.liquid ?? "#c9b48a" }} />
                  </span>
                  <div className="flex-1">
                    <p className="font-display text-[1.4rem] leading-tight">{l.scent}</p>
                    <p className="text-[13px] text-muted">
                      {l.size}
                      {l.initials && `, initials ${l.initials}`}
                    </p>
                  </div>
                  <div className="text-right text-[14px]">
                    <p className="tabular">฿{fmt.format(l.price * l.qty)}</p>
                    <div className="mt-1 flex items-center gap-2 text-muted">
                      <button type="button" aria-label="Fewer" onClick={() => setBag((b) => b.flatMap((x) => (x === l ? (x.qty > 1 ? [{ ...x, qty: x.qty - 1 }] : []) : [x])))}>
                        −
                      </button>
                      <span className="tabular">{l.qty}</span>
                      <button type="button" aria-label="More" onClick={() => setBag((b) => b.map((x) => (x === l ? { ...x, qty: x.qty + 1 } : x)))}>
                        +
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Drawer>
    </div>
  );
}
