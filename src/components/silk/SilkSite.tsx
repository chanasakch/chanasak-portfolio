"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Drawer, useScrolled } from "@/components/shared/ui";
import { ease, FadeUp, SplitLines } from "@/components/shared/motion";

const dyes = [
  { id: "lac", name: "Lac red", from: "Resin from lac insects on rain trees", hex: "#9b1d24" },
  { id: "indigo", name: "Indigo", from: "Fermented hom leaves, Sakon Nakhon", hex: "#1f2c5c" },
  { id: "jack", name: "Jackfruit", from: "Heartwood chips, boiled for a day", hex: "#d49a2c" },
  { id: "ebony", name: "Ebony", from: "Makluea fruit, dyed and sun-dried nine times", hex: "#1d1a18" },
  { id: "mangosteen", name: "Mangosteen", from: "Rind, boiled twice", hex: "#5a2846" },
  { id: "raw", name: "Raw silk", from: "Undyed yellow cocoons from Surin", hex: "#e8d6a2" },
];
type Dye = (typeof dyes)[number];

type Motif = { id: string; name: string; thai: string; f: (u: number, v: number) => 0 | 1 | 2 };
const motifs: Motif[] = [
  {
    id: "khom",
    name: "Khom",
    thai: "lantern",
    f: (u, v) => {
      const d = Math.abs(u - 0.5) + Math.abs(v - 0.5);
      if (d < 0.11) return 2;
      if (d < 0.19) return 0;
      if (d < 0.33) return 1;
      if (d < 0.41) return 0;
      return d > 0.47 ? 2 : 1;
    },
  },
  {
    id: "naga",
    name: "Nak",
    thai: "naga hooks",
    f: (u, v) => {
      const w = (u + Math.abs(((v * 2) % 1) - 0.5) * 0.9) % 1;
      return w < 0.2 ? 1 : w < 0.28 ? 2 : 0;
    },
  },
  {
    id: "mak",
    name: "Mak jap",
    thai: "small checks",
    f: (u, v) => {
      const uu = (u * 2) % 1;
      const vv = (v * 2) % 1;
      if (Math.abs(uu - 0.5) + Math.abs(vv - 0.5) < 0.24) return (Math.floor(u * 2) + Math.floor(v * 2)) % 2 ? 1 : 2;
      return 0;
    },
  },
  {
    id: "wave",
    name: "Lai nam",
    thai: "running water",
    f: (u, v) => {
      const b = ((v + 0.11 * Math.sin(u * Math.PI * 2)) * 3) % 1;
      const bb = b < 0 ? b + 1 : b;
      return bb < 0.24 ? 1 : bb < 0.32 ? 2 : 0;
    },
  },
];

const pieces = [
  { id: "scarf", name: "Scarf", size: "55 × 180 cm", cm: 180, price: 18500 },
  { id: "shawl", name: "Shawl", size: "90 × 200 cm", cm: 200, price: 32000 },
  { id: "metre", name: "Fabric", size: "100 cm wide, per metre", cm: 100, price: 9800 },
];
const fmt = new Intl.NumberFormat("en-US");

function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (x: number) => Math.max(0, Math.min(255, Math.round(x * k)));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}
const rand = (i: number) => {
  const x = Math.sin(i * 127.1) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Weaves an ikat pattern row by row. Each weft row is shifted a little, the way
 * hand-tied mudmee threads never quite line up, which gives the soft feathered edge.
 */
function Loom({ motif, colors, scale, className = "", onDone, speed = 7 }: { motif: Motif; colors: [Dye, Dye, Dye]; scale: number; className?: string; onDone?: (url: string) => void; speed?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const W = 720;
    const H = 540;
    cv.width = W;
    cv.height = H;
    const g = cv.getContext("2d")!;
    const rh = 3;
    const pal = colors.map((c) => [shade(c.hex, 1), shade(c.hex, 0.86)]);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let row = 0;
    let raf = 0;
    const rows = Math.ceil(H / rh);
    const drawRow = (r: number) => {
      const y = r * rh;
      const off = (rand(Math.floor(r / 3)) - 0.5) * scale * 0.07 + Math.sin(r * 0.05) * scale * 0.02;
      for (let x = 0; x < W; x += 2) {
        const u = ((((x + off) / scale) % 1) + 1) % 1;
        const v = (y / scale) % 1;
        g.fillStyle = pal[motif.f(u, v)][(x >> 1) % 3 === 0 ? 1 : 0];
        g.fillRect(x, y, 2, rh);
      }
      g.fillStyle = "rgba(0,0,0,0.07)";
      g.fillRect(0, y + rh - 1, W, 1);
    };
    const step = () => {
      const end = Math.min(rows, row + (reduce ? rows : speed));
      for (; row < end; row++) drawRow(row);
      if (row < rows) {
        g.fillStyle = "rgba(255,255,255,0.55)";
        g.fillRect(0, row * rh, W, 1.5);
        raf = requestAnimationFrame(step);
      } else done.current?.(cv.toDataURL("image/jpeg", 0.85));
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [motif, colors, scale, speed]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas ref={ref} className="block h-full w-full object-cover" aria-label={`${motif.name} pattern in ${colors.map((c) => c.name.toLowerCase()).join(", ")}`} role="img" />
      {/* silk sheen */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0)_30%,rgb(255_255_255/0.22)_48%,rgb(255_255_255/0)_62%)] mix-blend-soft-light" />
    </div>
  );
}

/** The woven cloth hung in soft folds. */
function Drape({ url }: { url: string | null }) {
  const n = 7;
  return (
    <div className="flex h-full items-start justify-center pt-6 [perspective:900px]">
      <div className="flex h-[88%] w-[78%]">
        {Array.from({ length: n }, (_, i) => (
          <motion.div
            key={i}
            className="relative h-full flex-1"
            initial={false}
            animate={{ rotateY: i % 2 ? -28 : 28 }}
            transition={{ duration: 1.2, ease }}
            style={{
              backgroundImage: url ? `url(${url})` : undefined,
              backgroundColor: "#0002",
              backgroundSize: `${n * 100}% 100%`,
              backgroundPosition: `${(i / (n - 1)) * 100}% 0`,
              transformOrigin: i % 2 ? "left" : "right",
            }}
          >
            <div className="absolute inset-0" style={{ background: i % 2 ? "linear-gradient(90deg,rgb(0_0_0/0.28),rgb(0_0_0/0.05))" : "linear-gradient(90deg,rgb(255_255_255/0.14),rgb(0_0_0/0.12))" }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** Header turns solid once the hero has mostly scrolled away. */
const window_h = () => (typeof window === "undefined" ? 600 : Math.round(window.innerHeight * 0.85));

const heroColors: [Dye, Dye, Dye] = [dyes[1], dyes[5], dyes[0]];

export function SilkSite() {
  const [motif, setMotif] = useState(motifs[0]);
  const [colors, setColors] = useState<[Dye, Dye, Dye]>([dyes[4], dyes[2], dyes[5]]);
  const [scale, setScale] = useState(120);
  const [piece, setPiece] = useState(pieces[0]);
  const [metres, setMetres] = useState(3);
  const [view, setView] = useState<"flat" | "draped">("flat");
  const [woven, setWoven] = useState<string | null>(null);
  const [order, setOrder] = useState(false);
  const [sent, setSent] = useState(false);
  const scrolled = useScrolled(window_h());

  const length = piece.id === "metre" ? metres * 100 : piece.cm;
  const price = piece.id === "metre" ? piece.price * metres : piece.price;
  // a weaver makes about 30 cm of mudmee a day; tying and dyeing take ten days before that
  const weeks = Math.ceil((10 + length / 30) / 6);
  const setColor = (slot: number, d: Dye) => setColors((c) => c.map((x, i) => (i === slot ? d : x)) as [Dye, Dye, Dye]);

  return (
    <div>
      <header className={`fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between px-[var(--gutter)] text-[14px] transition-colors duration-500 ${scrolled ? "bg-bg/85 text-ink backdrop-blur" : "text-white"}`}>
        <span className="font-display text-[22px] italic tracking-[-0.01em]">Mudmee House</span>
        <nav className="flex gap-6">
          <a href="#design">Design</a>
          <a href="#dyes" className="hidden sm:inline">Dyes</a>
          <a href="#process" className="hidden sm:inline">Process</a>
        </nav>
      </header>

      <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink">
        <Loom motif={motifs[0]} colors={heroColors} scale={170} speed={4} className="absolute inset-0 h-full w-full [&_canvas]:h-full [&_canvas]:object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(20_16_30/0.75),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 px-[var(--gutter)] pb-24 text-white sm:pb-16">
          <SplitLines lines={["Silk from Surin,", "tied before it is dyed"]} delay={0.4} className="font-display text-[clamp(2.6rem,7vw,6.6rem)] font-light leading-[0.95] tracking-[-0.02em]" />
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1, ease }} className="mt-8 flex flex-wrap items-center gap-6">
            <a href="#design" className="rounded-full bg-white px-6 py-3 text-[14px] text-[#221a33]">
              Design your own piece
            </a>
            <p className="max-w-[40ch] text-[14px] text-white/75">Hand-woven mudmee from twelve weavers in Tha Sawang, coloured with plant and insect dyes.</p>
          </motion.div>
        </div>
      </section>

      <section id="design" className="grid gap-10 px-[var(--gutter)] py-24 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div className="min-w-0 lg:sticky lg:top-20 lg:self-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-soft">
            <motion.div className="absolute inset-0" animate={{ opacity: view === "flat" ? 1 : 0 }} transition={{ duration: 0.6 }}>
              <Loom motif={motif} colors={colors} scale={scale} onDone={setWoven} className="h-full w-full" />
            </motion.div>
            <motion.div className="absolute inset-0 bg-soft" initial={false} animate={{ opacity: view === "draped" ? 1 : 0 }} transition={{ duration: 0.6 }} style={{ pointerEvents: view === "draped" ? "auto" : "none" }}>
              {view === "draped" && <Drape url={woven} />}
            </motion.div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[13px] text-muted">
            <span>
              {motif.name}, {motif.thai}
            </span>
            <div className="flex rounded-full border border-line p-0.5">
              {(["flat", "draped"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v} className={`rounded-full px-3.5 py-1.5 capitalize transition-colors ${view === v ? "bg-ink text-bg" : "hover:text-ink"}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <h2 className="font-display text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.02] tracking-[-0.02em]">Design a piece</h2>
          <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-muted">Every change is woven again in front of you. The weaver gets this exact drawing with your order.</p>

          <fieldset className="mt-9">
            <legend className="text-[13px] text-muted">Pattern</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {motifs.map((m) => (
                <button key={m.id} type="button" onClick={() => setMotif(m)} aria-pressed={motif.id === m.id} className={`border px-3 py-3 text-left transition-colors ${motif.id === m.id ? "border-ink bg-ink text-bg" : "border-line hover:border-ink/50"}`}>
                  <span className="block font-display text-[18px]">{m.name}</span>
                  <span className={`text-[12px] ${motif.id === m.id ? "text-bg/70" : "text-muted"}`}>{m.thai}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-8 space-y-4">
            {["Ground", "Pattern", "Edge"].map((label, slot) => (
              <fieldset key={label} className="flex flex-wrap items-center gap-3">
                <legend className="sr-only">{label} colour</legend>
                <span className="w-16 text-[13px] text-muted">{label}</span>
                <div className="flex flex-wrap gap-2">
                  {dyes.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setColor(slot, d)}
                      aria-label={`${label}: ${d.name}`}
                      aria-pressed={colors[slot].id === d.id}
                      title={d.name}
                      className={`size-8 rounded-full p-[3px] ring-1 transition ${colors[slot].id === d.id ? "ring-ink" : "ring-transparent hover:ring-line"}`}
                    >
                      <span className="block size-full rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.15)]" style={{ background: d.hex }} />
                    </button>
                  ))}
                </div>
                <span className="text-[13px]">{colors[slot].name}</span>
              </fieldset>
            ))}
          </div>

          <label className="mt-8 block text-[13px] text-muted">
            Motif size <span className="text-ink">{Math.round(scale / 6)} cm</span>
            <input type="range" min={60} max={200} step={10} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="mt-3 block w-full accent-[var(--ink)]" />
          </label>

          <fieldset className="mt-8">
            <legend className="text-[13px] text-muted">Piece</legend>
            <div className="mt-3 divide-y divide-line border-y border-line">
              {pieces.map((p) => (
                <button key={p.id} type="button" onClick={() => setPiece(p)} aria-pressed={piece.id === p.id} className="flex w-full items-center justify-between gap-4 py-3.5 text-left text-[15px]">
                  <span className="flex items-center gap-3">
                    <span className={`size-3.5 rounded-full border ${piece.id === p.id ? "border-ink bg-ink" : "border-line"}`} />
                    {p.name} <span className="text-muted">{p.size}</span>
                  </span>
                  <span className="tabular">฿{fmt.format(p.price)}</span>
                </button>
              ))}
            </div>
            {piece.id === "metre" && (
              <label className="mt-4 flex items-center gap-3 text-[14px]">
                Metres
                <input type="number" min={1} max={20} value={metres} onChange={(e) => setMetres(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} className="w-20 border border-line bg-transparent px-3 py-2" />
              </label>
            )}
          </fieldset>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <p className="tabular text-[1.6rem] font-light">฿{fmt.format(price)}</p>
            <button type="button" onClick={() => setOrder(true)} className="flex-1 rounded-full bg-accent px-6 py-3.5 text-[14px] text-white transition-opacity hover:opacity-90">
              Order this piece
            </button>
          </div>
          <p className="mt-3 text-[13px] text-muted">Woven to order in about {weeks} weeks. No two are the same, so expect small shifts in the pattern.</p>
        </div>
      </section>

      <section id="dyes" className="bg-ink px-[var(--gutter)] py-24 text-bg">
        <SplitLines as="h2" inView lines={["Six colours,", "all from plants and insects"]} className="font-display text-[clamp(2.2rem,5vw,4.6rem)] font-light leading-[0.98] tracking-[-0.02em]" />
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
          {dyes.map((d, i) => (
            <FadeUp key={d.id} delay={i * 0.06}>
              <div className="aspect-square rounded-full shadow-[inset_0_-14px_30px_rgb(0_0_0/0.25)]" style={{ background: d.hex }} />
              <p className="mt-4 font-display text-[20px]">{d.name}</p>
              <p className="mt-1 text-[13px] leading-snug text-bg/60">{d.from}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      <section id="process" className="grid gap-12 px-[var(--gutter)] py-24 lg:grid-cols-[1fr_1.4fr]">
        <h2 className="font-display text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.02] tracking-[-0.02em]">How mudmee is made</h2>
        <ol className="divide-y divide-line border-y border-line">
          {[
            ["Tie", "The weft threads are stretched on a frame and bound with strips where the colour must not go. The pattern exists only in the knots."],
            ["Dye", "Bundles go into the first dye bath. For three colours they are untied, retied and dyed again, which takes about ten days."],
            ["Weave", "The weaver lines the coloured threads up by eye as she weaves, around 30 cm a day. The small misalignments are what make it mudmee."],
            ["Finish", "The cloth is washed in tamarind water, dried in the shade and pressed by hand."],
          ].map(([t, d], i) => (
            <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-4 py-6 text-[15px]">
              <span className="tabular text-muted">{i + 1}</span>
              <div>
                <p className="font-display text-[22px]">{t}</p>
                <p className="mt-1 max-w-[56ch] leading-relaxed text-muted">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer className="flex flex-col justify-between gap-3 border-t border-line px-[var(--gutter)] pb-24 pt-8 text-[13px] text-muted sm:flex-row sm:pb-8">
        <span>Studio in Tha Sawang, Surin. Bangkok showroom at 88 Sukhumvit 49</span>
        <span>© 2026 Mudmee House</span>
      </footer>

      <Drawer open={order} onClose={() => { setOrder(false); setSent(false); }} title="Order this piece">
        {sent ? (
          <p className="py-8 font-display text-[1.8rem] leading-tight">Thank you. We will call within a day to confirm, then send a photo from the loom when weaving starts.</p>
        ) : (
          <form className="grid gap-5" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="flex items-center gap-4 bg-soft p-4 text-[14px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {woven && <img src={woven} alt="" className="size-16 shrink-0 object-cover" />}
              <div>
                <p className="font-display text-[1.3rem]">
                  {motif.name} {piece.name.toLowerCase()}
                </p>
                <p className="text-muted">
                  {colors.map((c) => c.name).join(", ")}. {piece.id === "metre" ? `${metres} m` : piece.size}
                </p>
                <p className="tabular mt-1">฿{fmt.format(price)}</p>
              </div>
            </div>
            {[["Name", "text"], ["Phone", "tel"], ["Delivery address", "text"]].map(([l, t]) => (
              <label key={l} className="grid gap-1.5 text-[13px] text-muted">
                {l}
                <input required type={t} className="border-b border-line bg-transparent py-2 text-[16px] text-ink outline-none focus:border-ink" />
              </label>
            ))}
            <button className="mt-2 rounded-full bg-accent py-4 text-[14px] text-white">Send order</button>
          </form>
        )}
      </Drawer>
    </div>
  );
}
