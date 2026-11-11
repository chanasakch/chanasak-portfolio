"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Photo } from "@/components/shared/Photo";
import { CloseButton, Drawer } from "@/components/shared/ui";
import { photos, photoUrl, type Photo as PhotoT } from "@/data/images";

type Cat = "vases" | "tableware" | "studio";
type Item = { name: string; photo: PhotoT; cat: Cat; price?: number; glaze: string; text: string };

const items: Item[] = [
  { name: "Bud vases, pair", photo: photos.budVases, cat: "vases", price: 1450, glaze: "Iron and rice-husk white", text: "Thrown as a pair from one ball of clay, so the walls match. H 12 and 14 cm." },
  { name: "Firing day", photo: photos.glazedShelves, cat: "studio", glaze: "Kiln shelf, 1,280 °C", text: "Fourteen hours in the wood kiln. About one piece in ten does not survive, and we keep those for the garden." },
  { name: "Fern pitcher", photo: photos.fernPitcher, cat: "tableware", price: 1900, glaze: "Celadon grey", text: "A 1.2 litre pitcher with a pulled lip that pours without a drip." },
  { name: "Shelf vessels", photo: photos.vesselsShelf, cat: "vases", price: 850, glaze: "Mixed glazes", text: "Small vessels sold singly. Each glaze pools differently in the foot." },
  { name: "On the wheel", photo: photos.throwing, cat: "studio", glaze: "Red Lampang stoneware", text: "Every piece is thrown, then trimmed the next day when the clay is leather-hard." },
  { name: "Breakfast set", photo: photos.whiteTablewareSet, cat: "tableware", price: 2600, glaze: "Rice-husk white", text: "Jug, cup, bowl and saucer. Dishwasher safe, rims rolled thick for daily use." },
  { name: "Soft white vessels", photo: photos.whiteVesselsSoft, cat: "vases", price: 2200, glaze: "Matte porcelain", text: "Three forms in unglazed porcelain, polished with a stone before firing." },
  { name: "Iron mugs, pair", photo: photos.mugsPair, cat: "tableware", price: 1100, glaze: "Iron", text: "320 ml each, a thumb rest on the handle and a raw foot." },
  { name: "Bisque shelves", photo: photos.bisqueShelves, cat: "studio", glaze: "First firing, 900 °C", text: "Pieces dry for a week on open shelves before the first firing." },
  { name: "Mimosa jugs", photo: photos.pitchersMimosa, cat: "tableware", price: 1350, glaze: "Rice-husk white", text: "A tall and a short jug. Flowers not included, though we often add some." },
  { name: "Wedging bench", photo: photos.clayWorkbench, cat: "studio", glaze: "Raw clay", text: "Clay dug ten kilometres up the road, aged a month and wedged by hand." },
  { name: "Facet tea service", photo: photos.porcelainService, cat: "tableware", price: 4800, glaze: "Porcelain white", text: "Pot, jug and six cups, each facet cut with a wire while the clay is soft." },
  { name: "Two hands", photo: photos.twoHandsWheel, cat: "studio", glaze: "Wheel class", text: "Saturday classes for six people. We fire what you make and post it three weeks later." },
  { name: "Dinner plate", photo: photos.placeSetting, cat: "tableware", price: 780, glaze: "Matte rice-husk white", text: "27 cm. We make these for twelve restaurants in Bangkok and Chiang Mai." },
];

const COLS = 6;
const ROWS = 4;
const fmt = new Intl.NumberFormat("en-US");

export function DinWall() {
  const wrap = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, vx: 0, vy: 0, down: false, moved: 0, lx: 0, ly: 0 });
  const [dims, setDims] = useState({ tw: 300, th: 380, gap: 24 });
  const [filter, setFilter] = useState<Cat | "all">("all");
  const [open, setOpen] = useState<Item | null>(null);
  const [intro, setIntro] = useState(true);
  const [about, setAbout] = useState(false);
  const [bag, setBag] = useState<{ name: string; price: number; qty: number }[]>([]);
  const [bagOpen, setBagOpen] = useState(false);

  useEffect(() => {
    const size = () => {
      const w = window.innerWidth;
      const tw = w < 640 ? w * 0.46 : w < 1024 ? w * 0.3 : w * 0.2;
      setDims({ tw, th: tw * 1.28, gap: w < 640 ? 12 : 28 });
    };
    size();
    window.addEventListener("resize", size);
    const t = setTimeout(() => setIntro(false), 1600);
    return () => {
      window.removeEventListener("resize", size);
      clearTimeout(t);
    };
  }, []);

  const W = COLS * (dims.tw + dims.gap);
  const H = ROWS * (dims.th + dims.gap) ;

  // Inertia loop: position eases with velocity, the plane shrinks a touch while moving fast
  useEffect(() => {
    let raf = 0;
    const p = pos.current;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!p.down) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.93;
        p.vy *= 0.93;
      }
      const ox = (((p.x % W) + W) % W) - W;
      const oy = (((p.y % H) + H) % H) - H;
      const speed = Math.min(1, Math.hypot(p.vx, p.vy) / 60);
      if (plane.current) plane.current.style.transform = `translate3d(${ox}px, ${oy}px, 0) scale(${1 - speed * 0.06})`;
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [W, H]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      pos.current.vx -= e.deltaX * 0.08;
      pos.current.vy -= e.deltaY * 0.08;
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, []);

  const add = (it: Item, qty: number) => {
    setBag((b) => (b.some((l) => l.name === it.name) ? b.map((l) => (l.name === it.name ? { ...l, qty: l.qty + qty } : l)) : [...b, { name: it.name, price: it.price!, qty }]));
    setOpen(null);
    setBagOpen(true);
  };
  const count = bag.reduce((n, l) => n + l.qty, 0);

  const tiles = Array.from({ length: COLS * ROWS }, (_, i) => {
    const c = i % COLS;
    const r = Math.floor(i / COLS);
    const it = items[(r * 5 + c * 3) % items.length];
    return { it, x: c * (dims.tw + dims.gap), y: r * (dims.th + dims.gap) + (c % 2 ? (dims.th + dims.gap) / 2 : 0), key: i };
  });

  return (
    <div className="fixed inset-0 overflow-hidden bg-bg text-ink">
      <div
        ref={wrap}
        className="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
        data-cursor="Drag"
        onPointerDown={(e) => {
          const p = pos.current;
          p.down = true;
          p.moved = 0;
          p.lx = e.clientX;
          p.ly = e.clientY;
          p.vx = p.vy = 0;
        }}
        onPointerMove={(e) => {
          const p = pos.current;
          if (!p.down) return;
          const dx = e.clientX - p.lx;
          const dy = e.clientY - p.ly;
          p.x += dx;
          p.y += dy;
          p.vx = dx;
          p.vy = dy;
          p.moved += Math.abs(dx) + Math.abs(dy);
          p.lx = e.clientX;
          p.ly = e.clientY;
        }}
        onPointerUp={() => (pos.current.down = false)}
        onPointerLeave={() => (pos.current.down = false)}
      >
        <div ref={plane} className="absolute left-0 top-0 will-change-transform" style={{ width: W * 2, height: H * 2 }}>
          {[0, 1].flatMap((bx) =>
            [0, 1].map((by) =>
              tiles.map((t) => {
                const dim = filter !== "all" && t.it.cat !== filter;
                return (
                  <button
                    key={`${bx}${by}${t.key}`}
                    type="button"
                    tabIndex={bx || by ? -1 : 0}
                    onClick={() => pos.current.moved < 8 && setOpen(t.it)}
                    data-cursor={dim ? "Drag" : "Open"}
                    className="group absolute block text-left"
                    style={{ left: t.x + bx * W, top: t.y + by * H, width: dims.tw }}
                  >
                    <span className={`block overflow-hidden transition-[opacity,filter] duration-700 ${dim ? "opacity-15 grayscale" : ""}`}>
                      <Photo photo={t.it.photo} className="aspect-[4/5] w-full" imgClassName="pointer-events-none transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]" sizes="22vw" />
                    </span>
                    <span className={`mt-2 flex justify-between gap-3 text-[12px] transition-opacity duration-500 ${dim ? "opacity-0" : "opacity-0 group-hover:opacity-100"}`} style={{ height: 0 }}>
                      <span>{t.it.name}</span>
                      {t.it.price && <span className="tabular">฿{fmt.format(t.it.price)}</span>}
                    </span>
                  </button>
                );
              }),
            ),
          )}
        </div>
      </div>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between p-[var(--gutter)] pt-5 mix-blend-difference text-white">
        <span className="pointer-events-auto text-[clamp(2.4rem,5vw,4.4rem)] font-[800] leading-[0.8] tracking-[-0.06em]">DIN</span>
        <p className="hidden max-w-[22ch] text-center text-[14px] leading-snug md:block">Stoneware thrown and wood-fired in Lampang, Thailand</p>
        <div className="pointer-events-auto flex gap-5 text-[14px]">
          <button type="button" onClick={() => setAbout(true)}>Studio</button>
          <button type="button" onClick={() => setBagOpen(true)}>
            Order <span className="tabular">({count})</span>
          </button>
        </div>
      </header>

      <nav aria-label="Filter" className="fixed bottom-20 left-1/2 z-20 flex -translate-x-1/2 gap-1 rounded-full bg-ink/90 p-1 text-[13px] text-bg backdrop-blur-md">
        {(["all", "vases", "tableware", "studio"] as const).map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f} className={`rounded-full px-3.5 py-2 capitalize transition-colors sm:px-5 ${filter === f ? "bg-bg text-ink" : "hover:bg-white/10"}`}>
            {f}
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {intro && (
          <motion.div className="pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-center bg-bg" exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
            <motion.p initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="text-[clamp(5rem,22vw,20rem)] font-[800] leading-none tracking-[-0.07em]">
              DIN
            </motion.p>
            <p className="mt-2 text-[14px] text-muted">Drag or scroll in any direction</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{open && <Detail item={open} onClose={() => setOpen(null)} onAdd={add} />}</AnimatePresence>

      <Drawer open={about} onClose={() => setAbout(false)} title="The studio">
        <div className="grid gap-6 text-[16px] leading-relaxed">
          <p className="text-[clamp(1.6rem,3vw,2rem)] font-[600] leading-[1.15] tracking-[-0.02em]">Four potters, one wood kiln, red clay dug ten kilometres up the road.</p>
          <p className="text-muted">Nothing is cast in a mould, so no two cups are the same. Glazes are mixed from rice-husk ash, iron-rich earth and wood ash from our own kiln.</p>
          <dl className="grid grid-cols-2 gap-4 border-t border-line pt-5 text-[14px]">
            <div><dt className="text-muted">Studio</dt><dd>212 Ban Pong Road, Lampang</dd></div>
            <div><dt className="text-muted">Open</dt><dd>Thursday to Sunday, 10:00 to 17:00</dd></div>
            <div><dt className="text-muted">Wheel classes</dt><dd>Saturdays, ฿2,200, six people</dd></div>
            <div><dt className="text-muted">Restaurants</dt><dd>From 48 pieces per design</dd></div>
          </dl>
          <p className="text-[13px] text-muted">Concept site. DIN is fictional. Photos from Pexels.</p>
        </div>
      </Drawer>

      <Drawer
        open={bagOpen}
        onClose={() => setBagOpen(false)}
        title={`Order (${count})`}
        footer={
          bag.length ? (
            <div className="grid gap-3">
              <div className="flex justify-between text-[15px]"><span>Subtotal</span><span className="tabular">฿{fmt.format(bag.reduce((n, l) => n + l.qty * l.price, 0))}</span></div>
              <p className="text-[13px] text-muted">Every piece varies a little. We email photos of the exact ones before taking payment.</p>
              <button type="button" className="rounded-full bg-ink py-3.5 text-[15px] text-bg">Send order request</button>
            </div>
          ) : undefined
        }
      >
        {bag.length === 0 ? (
          <p className="py-8 text-[15px] text-muted">Nothing yet. Open a piece on the wall to add it.</p>
        ) : (
          <ul className="divide-y divide-line">
            {bag.map((l) => {
              const it = items.find((i) => i.name === l.name)!;
              return (
                <li key={l.name} className="flex items-center gap-4 py-4">
                  <Photo photo={it.photo} className="aspect-[4/5] w-16 shrink-0" sizes="64px" />
                  <span className="flex-1 font-[600]">{l.name}<span className="block text-[13px] font-normal text-muted">× {l.qty}</span></span>
                  <span className="tabular">฿{fmt.format(l.price * l.qty)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Drawer>
    </div>
  );
}

/** Full-screen piece view. Hovering the photo magnifies it under the pointer. */
function Detail({ item, onClose, onAdd }: { item: Item; onClose: () => void; onAdd: (i: Item, q: number) => void }) {
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [qty, setQty] = useState(1);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  return (
    <motion.div role="dialog" aria-modal="true" aria-label={item.name} className="fixed inset-0 z-40 grid overflow-y-auto bg-bg lg:grid-cols-[1.2fr_1fr]" initial={{ clipPath: "inset(50% 50% 50% 50%)" }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
      <div
        className="relative h-[62svh] cursor-zoom-in overflow-hidden lg:h-[100svh]"
        data-cursor="Zoom"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onPointerLeave={() => setZoom(null)}
      >
        <Photo photo={item.photo} className="h-full w-full" sizes="60vw" priority />
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-300"
          style={{ opacity: zoom ? 1 : 0, backgroundImage: `url(${photoUrl(item.photo, 1600)})`, backgroundSize: "240%", backgroundPosition: zoom ? `${zoom.x}% ${zoom.y}%` : "50% 50%" }}
        />
        <span className="absolute bottom-4 left-4 rounded-full bg-bg/90 px-3 py-1.5 text-[12px] backdrop-blur lg:hidden">Pinch to look closer</span>
      </div>
      <div className="flex flex-col px-[var(--gutter)] py-10 lg:py-16">
        <div className="flex justify-end"><CloseButton onClick={onClose} /></div>
        <motion.div className="my-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
          <p className="text-[13px] capitalize text-muted">{item.cat}</p>
          <h2 className="mt-2 text-[clamp(2.6rem,5vw,5rem)] font-[700] leading-[0.92] tracking-[-0.045em]">{item.name}</h2>
          <p className="mt-4 text-[15px] text-accent">{item.glaze}</p>
          <p className="mt-6 max-w-[40ch] text-[17px] leading-[1.6] text-muted">{item.text}</p>
          {item.price ? (
            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-6">
              <span className="tabular text-[1.8rem] font-[600] tracking-[-0.02em]">฿{fmt.format(item.price)}</span>
              <span className="flex items-center rounded-full border border-line">
                <button type="button" className="size-11" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Fewer">−</button>
                <span className="tabular w-6 text-center">{qty}</span>
                <button type="button" className="size-11" onClick={() => setQty(qty + 1)} aria-label="More">+</button>
              </span>
              <button type="button" onClick={() => onAdd(item, qty)} className="flex-1 rounded-full bg-ink px-6 py-3.5 text-[15px] text-bg">Add to order</button>
            </div>
          ) : (
            <p className="mt-10 border-t border-line pt-6 text-[15px]">From the studio. Not for sale, but you can visit Thursday to Sunday.</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
