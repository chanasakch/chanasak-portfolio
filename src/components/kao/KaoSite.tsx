"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ease } from "@/components/shared/motion";
import { Drawer } from "@/components/shared/ui";
import { KaoStage } from "./Stage";
import { chart, PRICE, sizes, thb, ways } from "./data";

type Line = { key: string; way: number; size: number; qty: number; initials: string };
const INITIALS = 190;
const spotInfo: Record<string, { title: string; text: string; view: "side" | "back" | "top" | "sole" }> = {
  upper: { title: "Knit upper", text: "One piece of recycled polyester knit. Tighter round the middle of the foot, open over the toes so it breathes in the heat.", view: "top" },
  heel: { title: "Heel", text: "A padded collar and a firm counter hold your heel in place. You can have your initials stitched here.", view: "back" },
  midsole: { title: "Foam midsole", text: "28 mm under the heel and 20 mm under the toes. Soft for long runs, steady enough to walk in all day.", view: "side" },
  outsole: { title: "Outsole", text: "Rubber only where you land and push off, which keeps one shoe at 230 g.", view: "sole" },
};
/** dark colourways get light thread */
const lightWay = (i: number) => !["ember", "forest", "lagoon"].includes(ways[i].id);
const views = ["side", "front", "back", "top", "sole"] as const;

export function KaoSite() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<KaoStage | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<number | null>(null);
  const [view, setView] = useState<(typeof views)[number] | null>(null);
  const [bag, setBag] = useState<Line[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [guide, setGuide] = useState(false);
  const [flash, setFlash] = useState(false);
  const [initials, setInitials] = useState("");
  const [spot, setSpot] = useState<string | null>(null);
  const dots = useRef<(HTMLButtonElement | null)[]>([]);
  const [spotIds, setSpotIds] = useState<string[]>([]);
  const [moved, setMoved] = useState(false);
  const way = ways[index];
  const count = bag.reduce((s, l) => s + l.qty, 0);

  useEffect(() => {
    if (!canvas.current) return;
    let alive = true;
    const s = new KaoStage(canvas.current, "#efefec");
    stage.current = s;
    s.onIndex = (i) => {
      setIndex(i);
      setSize((z) => (z && ways[i].soldOut.includes(z) ? null : z));
    };
    s.load("/models/kao/runner.glb", ways, (n) => alive && setProgress(n))
      .then(() => {
        if (!alive) return;
        s.begin();
        setSpotIds(s.spots.map((x) => x.id));
        setReady(true);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
      s.dispose();
    };
  }, []);

  // keep the hotspot dots pinned to the turning shoe
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const pts = stage.current?.spotsOnScreen();
      dots.current.forEach((el, i) => {
        if (!el) return;
        const p = pts?.[i];
        el.style.opacity = p?.facing ? "1" : "0";
        el.style.pointerEvents = p?.facing ? "auto" : "none";
        if (p) el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
      });
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [open]);

  // the initials follow the shoe in front, in a thread that shows on its colour
  useEffect(() => {
    stage.current?.setInitials(initials, lightWay(index));
  }, [initials, index, ready]);

  const openShoe = useCallback(() => {
    stage.current?.setOpen(true);
    setOpen(true);
    setView(null);
    setMoved(true);
  }, []);
  const close = useCallback(() => {
    stage.current?.setOpen(false);
    setOpen(false);
    setSpot(null);
  }, []);
  const pickWay = useCallback((i: number) => {
    stage.current?.goTo(i);
    setMoved(true);
  }, []);
  const step = useCallback(
    (d: number) => {
      const s = stage.current;
      if (!s) return;
      setMoved(true);
      if (open) {
        // change colour without leaving the close-up
        s.setOpen(false);
        s.goTo((s.index() + d + s.count) % s.count);
        window.setTimeout(() => s.setOpen(true), 380);
        setView(null);
      } else s.step(d);
    },
    [open],
  );

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (bagOpen || guide) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select")) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") step(1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") step(-1);
      else if (e.key === "Escape" && open) close();
      else if (e.key === "Enter" && !open && t === document.body) openShoe();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [step, close, openShoe, open, bagOpen, guide]);

  useEffect(() => {
    const el = wrap.current;
    const s = stage.current;
    if (!el || !s) return;
    let down: { lx: number; ly: number; t: number } | null = null;
    let dist = 0;
    let vel = 0;
    let speed = 0;
    let lastT = 0;
    const pd = (e: PointerEvent) => {
      if (e.button !== 0) return;
      down = { lx: e.clientX, ly: e.clientY, t: performance.now() };
      dist = 0;
      speed = 0;
      lastT = performance.now();
      s.grab();
      el.setPointerCapture(e.pointerId);
    };
    const pm = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      s.pointer(e.clientX - r.left, e.clientY - r.top);
      if (!down) return;
      const dx = e.clientX - down.lx;
      const dy = e.clientY - down.ly;
      down.lx = e.clientX;
      down.ly = e.clientY;
      dist += Math.abs(dx) + Math.abs(dy);
      if (dist < 6) return;
      setMoved(true);
      if (s.open) {
        s.turnBy(dx * 0.01, dy * 0.01);
        vel = vel * 0.5 + dx * 0.01 * 0.5;
        setView(null);
      } else {
        const d = -(Math.abs(dx) >= Math.abs(dy) ? dx : -dy) / s.pixelsPerShoe();
        s.scrub(d);
        const now = performance.now();
        speed = speed * 0.6 + (d / Math.max(8, now - lastT)) * 1000 * 0.4;
        lastT = now;
      }
    };
    const pu = (e: PointerEvent) => {
      if (!down) return;
      const tap = dist < 6 && performance.now() - down.t < 600;
      down = null;
      s.fling(performance.now() - lastT > 90 ? 0 : speed);
      if (!tap && s.open) s.release(vel);
      vel = 0;
      if (!tap || s.open) return;
      const r = el.getBoundingClientRect();
      const i = s.pick(e.clientX - r.left, e.clientY - r.top);
      if (i < 0) return;
      if (i === s.index()) openShoe();
      else s.goTo(i);
    };
    let acc = 0;
    let accT = 0;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      setMoved(true);
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (s.open) return s.turnBy(-d * 0.004, 0);
      // a trackpad flick or one notch of a wheel moves one shoe
      const now = performance.now();
      if (now - accT > 220) acc = 0;
      accT = now;
      acc += d;
      if (Math.abs(acc) > 40) {
        s.step(Math.sign(acc));
        acc = -Math.sign(acc) * 400;
      }
    };
    el.addEventListener("pointerdown", pd);
    el.addEventListener("pointermove", pm);
    el.addEventListener("pointerup", pu);
    el.addEventListener("pointercancel", pu);
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", pd);
      el.removeEventListener("pointermove", pm);
      el.removeEventListener("pointerup", pu);
      el.removeEventListener("pointercancel", pu);
      el.removeEventListener("wheel", wheel);
    };
  }, [ready, openShoe]);

  const add = () => {
    if (!size) return;
    const key = `${index}-${size}-${initials}`;
    setBag((b) => (b.some((l) => l.key === key) ? b.map((l) => (l.key === key ? { ...l, qty: Math.min(5, l.qty + 1) } : l)) : [...b, { key, way: index, size, qty: 1, initials }]));
    setFlash(true);
    window.setTimeout(() => setFlash(false), 1600);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-bg text-ink">
      <div ref={wrap} data-cursor={open ? "Turn" : "Drag"} className="absolute inset-0 touch-none select-none" aria-hidden>
        <canvas ref={canvas} className="block size-full" />
      </div>

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-6">
        <button type="button" onClick={close} className="font-display text-[26px] font-extrabold leading-none tracking-[-0.03em] [font-stretch:66%]">
          KAO
        </button>
        <div className="flex items-center gap-5 text-[13px]">
          <button type="button" onClick={() => setGuide(true)} className="hover:opacity-60">
            Size guide
          </button>
          <button type="button" onClick={() => setBagOpen(true)} className="flex items-center gap-2 hover:opacity-60">
            Bag
            <motion.span
              key={count}
              initial={{ scale: count ? 1.35 : 1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, ease }}
              className={`flex size-6 items-center justify-center rounded-full text-[11px] ${count ? "bg-ink text-bg" : "border border-line"}`}
            >
              {count}
            </motion.span>
          </button>
        </div>
      </header>

      {/* name of the colourway in front */}
      <AnimatePresence>
        {!open && ready && (
          <motion.div
            className="pointer-events-none absolute left-5 top-[76px] z-10 sm:left-8 md:top-[104px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-display text-[clamp(56px,10.5vw,168px)] font-extrabold uppercase leading-[0.82] tracking-[-0.035em] [font-stretch:66%]">
              Runner 01
            </h1>
            <div className="mt-4 flex items-center gap-3 md:mt-6">
              <AnimatePresence mode="wait">
                <motion.p
                  key={way.id}
                  className="flex items-center gap-2 text-[15px]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease }}
                >
                  <span className="size-3 rounded-full" style={{ background: way.swatch, boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.1)" }} />
                  {way.name}
                </motion.p>
              </AnimatePresence>
              <span className="text-[15px] text-muted">{thb(PRICE)}</span>
            </div>
            <button type="button" onClick={openShoe} className="pointer-events-auto mt-5 rounded-full bg-ink px-6 py-3 text-[14px] text-bg transition-opacity hover:opacity-85">
              Choose your size
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* every colourway, bottom */}
      <AnimatePresence>
        {!open && ready && (
          <motion.div
            className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-2 px-4 pb-[max(68px,calc(env(safe-area-inset-bottom)+56px))] sm:pb-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease }}
          >
            <p className={`text-[12px] text-muted transition-opacity duration-700 ${moved ? "opacity-0" : ""}`}>
              <span className="pointer-coarse:hidden">Scroll for the next colour, click the shoe to open it</span>
              <span className="hidden pointer-coarse:inline">Swipe for the next colour, tap the shoe to open it</span>
            </p>
            <div className="flex max-w-full gap-1 overflow-x-auto rounded-2xl bg-white/60 p-1 sm:gap-1.5" role="tablist" aria-label="Colourways">
              {ways.map((w, i) => (
                <button
                  key={w.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={w.name}
                  onClick={() => pickWay(i)}
                  className={`relative h-12 w-[52px] shrink-0 rounded-xl transition-colors sm:h-14 sm:w-[72px] ${i === index ? "bg-white" : "hover:bg-white/70"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/kao/${w.id}.webp`} alt="" className="size-full object-contain p-1" draggable={false} />
                  {i === index && <motion.span layoutId="kao-way" className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-ink" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* close-up */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="bar"
              className="absolute left-5 top-[64px] z-20 sm:left-8 md:top-[92px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button type="button" onClick={close} className="flex items-center gap-2 rounded-full border border-line bg-white/70 py-2 pl-3 pr-4 text-[13px] transition-colors hover:border-ink">
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <path d="M12 7H2M6 3L2 7l4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                All colours
              </button>
            </motion.div>
            {spotIds.map((id, i) => (
              <button
                key={id}
                ref={(el) => {
                  dots.current[i] = el;
                }}
                type="button"
                aria-label={spotInfo[id].title}
                aria-expanded={spot === id}
                onClick={() => {
                  setSpot(spot === id ? null : id);
                  stage.current?.view(spotInfo[id].view);
                  setView(spotInfo[id].view);
                }}
                className="group absolute left-0 top-0 z-[15] flex size-9 items-center justify-center opacity-0 transition-opacity duration-300"
              >
                <span className={`absolute size-7 rounded-full bg-white/50 ${spot === id ? "" : "animate-ping [animation-duration:2.4s]"}`} aria-hidden />
                <span className={`relative flex size-5 items-center justify-center rounded-full text-[13px] leading-none shadow-[0_2px_10px_rgb(0_0_0/0.18)] transition-colors ${spot === id ? "bg-ink text-bg" : "bg-white text-ink group-hover:bg-ink group-hover:text-bg"}`} aria-hidden>
                  {spot === id ? "−" : "+"}
                </span>
              </button>
            ))}
            <AnimatePresence>
              {spot && (
                <motion.div
                  key={spot}
                  role="status"
                  className="absolute left-5 top-[116px] z-20 w-[min(300px,calc(100vw-40px))] rounded-2xl bg-white/95 p-4 shadow-[0_12px_40px_rgb(0_0_0/0.1)] sm:left-8 md:top-[148px]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.3, ease }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[14px] font-medium">{spotInfo[spot].title}</p>
                    <button type="button" onClick={() => setSpot(null)} aria-label="Close" className="-mr-1 -mt-1 flex size-7 items-center justify-center rounded-full text-muted hover:text-ink">
                      ×
                    </button>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{spotInfo[spot].text}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              key="views"
              className="absolute inset-x-0 bottom-[calc(var(--kao-sheet,0px)+14px)] z-20 flex justify-center md:bottom-8 md:right-[min(440px,40vw)]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex gap-1 rounded-full bg-white/70 p-1 text-[12px]">
                {views.map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={view === v}
                    onClick={() => {
                      stage.current?.view(v);
                      setView(v);
                    }}
                    className={`rounded-full px-3 py-1.5 capitalize transition-colors ${view === v ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </motion.div>
            <Panel
              key="panel"
              index={index}
              size={size}
              setSize={setSize}
              onAdd={add}
              flash={flash}
              onWay={(i) => {
                const s = stage.current;
                if (!s || i === index) return;
                s.setOpen(false);
                s.goTo(i);
                window.setTimeout(() => s.setOpen(true), 380);
                setView(null);
              }}
              onGuide={() => setGuide(true)}
              initials={initials}
              onInitials={(t) => {
                setInitials(t);
                if (t) {
                  stage.current?.view("back");
                  setView("back");
                }
              }}
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!ready && (
          <motion.div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-bg" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-display text-[26px] font-extrabold tracking-[-0.03em] [font-stretch:66%]">KAO</p>
            {failed ? (
              <p className="max-w-[300px] text-center text-[13px] text-muted">This page needs WebGL to show the shoes. Try a recent version of Chrome, Safari or Firefox.</p>
            ) : (
              <div className="h-px w-40 bg-line">
                <div className="h-px bg-ink transition-[width] duration-300" style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="sr-only">
        {ways.map((w, i) => (
          <li key={w.id}>
            <button
              type="button"
              onClick={() => {
                pickWay(i);
                openShoe();
              }}
            >
              Runner 01 in {w.name}, {thb(PRICE)}
            </button>
          </li>
        ))}
      </ul>

      <Bag open={bagOpen} onClose={() => setBagOpen(false)} lines={bag} setLines={setBag} />
      <Drawer open={guide} onClose={() => setGuide(false)} title="Size guide">
        <p className="text-[14px] leading-relaxed text-muted">Stand on a sheet of paper, mark your heel and longest toe, and measure between them. If you are between sizes, go up. Runner 01 fits true to size with a roomy toe.</p>
        <SizeFinder
          onPick={(eu) => {
            setSize(eu);
            setGuide(false);
            if (!open) openShoe();
          }}
          soldOut={ways[index].soldOut}
        />
        <table className="mt-6 w-full text-left text-[14px] tabular-nums">
          <thead className="text-[12px] text-muted">
            <tr className="border-b border-line">
              <th className="py-2 font-normal">EU</th>
              <th className="py-2 font-normal">Foot length</th>
              <th className="py-2 font-normal">US men</th>
              <th className="py-2 font-normal">UK</th>
            </tr>
          </thead>
          <tbody>
            {chart.map(([eu, cm, us, uk]) => (
              <tr key={eu} className="border-b border-line">
                <td className="py-2.5">{eu}</td>
                <td className="py-2.5">{cm} cm</td>
                <td className="py-2.5">{us}</td>
                <td className="py-2.5">{uk}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-10 border-t border-line pt-4 text-[11px] leading-relaxed text-muted">Shoe 3D model by Shopify, from the Khronos glTF sample library, CC BY 4.0. Extra colours are tinted in the browser.</p>
      </Drawer>
    </div>
  );
}

function SizeFinder({ onPick, soldOut }: { onPick: (eu: number) => void; soldOut: number[] }) {
  const [cm, setCm] = useState(26);
  // the smallest size whose length leaves the foot at least 0.3 cm of room
  const fit = chart.find(([, len]) => len >= cm + 0.3) ?? chart[chart.length - 1];
  const out = soldOut.includes(fit[0]);
  return (
    <div className="mt-6 rounded-2xl bg-[#f3f3f0] p-4">
      <label className="flex items-baseline justify-between text-[13px]">
        <span>Your foot length</span>
        <span className="tabular-nums">{cm.toFixed(1)} cm</span>
      </label>
      <input type="range" min={22} max={29.5} step={0.1} value={cm} onChange={(e) => setCm(Number(e.target.value))} aria-label="Foot length in centimetres" className="mt-2 w-full accent-[#161616]" />
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-[14px]" aria-live="polite">
          Your size is <span className="font-semibold">EU {fit[0]}</span>
          <span className="text-muted">, US {fit[2]}</span>
          {out && <span className="block text-[12px] text-muted">Sold out in this colour</span>}
        </p>
        <button type="button" disabled={out} onClick={() => onPick(fit[0])} className="shrink-0 rounded-full bg-ink px-4 py-2 text-[13px] text-bg hover:opacity-90 disabled:opacity-30">
          Use EU {fit[0]}
        </button>
      </div>
    </div>
  );
}

function Panel({
  index,
  size,
  setSize,
  onAdd,
  flash,
  onWay,
  onGuide,
  initials,
  onInitials,
}: {
  index: number;
  size: number | null;
  setSize: (n: number) => void;
  onAdd: () => void;
  flash: boolean;
  onWay: (i: number) => void;
  onGuide: () => void;
  initials: string;
  onInitials: (t: string) => void;
}) {
  const [personal, setPersonal] = useState(!!initials);
  const price = PRICE + (initials ? INITIALS : 0);
  const w = ways[index];
  const ref = useRef<HTMLElement>(null);
  // keep the view buttons just above the sheet on phones
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const mobile = window.innerWidth < 768;
      document.documentElement.style.setProperty("--kao-sheet", mobile ? `${el.offsetHeight}px` : "0px");
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--kao-sheet");
    };
  }, []);
  return (
    <motion.aside
      ref={ref}
      aria-label={`Runner 01 in ${w.name}`}
      data-sheet
      className="absolute inset-x-0 bottom-0 z-20 rounded-t-[22px] bg-[#f8f8f6] px-5 pb-[max(18px,env(safe-area-inset-bottom))] pt-5 shadow-[0_-12px_40px_rgb(0_0_0/0.07)] md:inset-y-0 md:left-auto md:right-0 md:w-[min(440px,40vw)] md:overflow-y-auto md:rounded-none md:px-9 md:pb-10 md:pt-[108px] md:shadow-[-24px_0_60px_rgb(0_0_0/0.05)]"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-[clamp(30px,3.2vw,44px)] font-extrabold uppercase leading-none tracking-[-0.03em] [font-stretch:66%]">Runner 01</h2>
        <p className="text-[17px] tabular-nums">{thb(PRICE)}</p>
      </div>
      <p className="mt-2 text-[13px] text-muted">
        <span className="text-ink">{w.name}.</span> {w.note}
      </p>

      <div className="mt-4 flex gap-2 md:mt-6" role="radiogroup" aria-label="Colour">
        {ways.map((x, i) => (
          <button
            key={x.id}
            type="button"
            role="radio"
            aria-checked={i === index}
            aria-label={x.name}
            onClick={() => onWay(i)}
            className={`size-9 rounded-full ring-offset-2 ring-offset-[#f8f8f6] transition-shadow ${i === index ? "ring-1 ring-ink" : "hover:ring-1 hover:ring-ink/30"}`}
            style={{ background: x.swatch, boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.1)" }}
          />
        ))}
      </div>

      <div className="mt-4 flex items-baseline justify-between md:mt-7">
        <p className="text-[13px]">Size, EU</p>
        <button type="button" onClick={onGuide} className="text-[12px] text-muted underline underline-offset-4 hover:text-ink">
          Size guide
        </button>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1.5" role="radiogroup" aria-label="Size">
        {sizes.map((n) => {
          const out = w.soldOut.includes(n);
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={size === n}
              disabled={out}
              onClick={() => setSize(n)}
              className={`relative h-10 rounded-lg border text-[13px] tabular-nums transition-colors md:h-11 ${
                size === n ? "border-ink bg-ink text-bg" : out ? "cursor-not-allowed border-line text-muted/50" : "border-line hover:border-ink"
              }`}
            >
              {n}
              {out && <span className="absolute inset-x-2 top-1/2 h-px -rotate-[18deg] bg-current" aria-hidden />}
              {out && <span className="sr-only"> sold out</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex min-h-11 items-center gap-3 rounded-xl border border-line px-3 md:mt-4">
        <label className="flex flex-1 cursor-pointer items-center gap-2.5 text-[13px]">
          <input
            type="checkbox"
            checked={personal}
            onChange={(e) => {
              setPersonal(e.target.checked);
              if (!e.target.checked) onInitials("");
            }}
            className="size-4 accent-[#161616]"
          />
          Initials on the heel <span className="text-muted">+{thb(INITIALS)}</span>
        </label>
        {personal && (
          <input
            autoFocus
            value={initials}
            onChange={(e) => onInitials(e.target.value.replace(/[^a-z]/gi, "").toUpperCase().slice(0, 3))}
            placeholder="ABC"
            aria-label="Up to three initials"
            maxLength={3}
            autoCapitalize="characters"
            className="h-8 w-[74px] rounded-lg border border-line bg-white px-2 text-center text-[14px] font-semibold tracking-[0.18em] outline-none focus:border-ink"
          />
        )}
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={!size}
        className="relative mt-4 h-12 w-full overflow-hidden rounded-full bg-ink text-[14px] text-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35 md:mt-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={flash ? "a" : size ? "b" : "c"} className="block" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.25 }}>
            {flash ? "Added to your bag" : size ? `Add size ${size} to bag, ${thb(price)}` : "Choose a size"}
          </motion.span>
        </AnimatePresence>
      </button>
      <p className="mt-3 text-center text-[12px] text-muted">Free delivery in Thailand. Swap the size within 30 days.</p>

      <dl className="mt-8 hidden gap-3 border-t border-line pt-6 text-[13px] md:grid">
        {[
          ["Upper", "One-piece knit from recycled polyester"],
          ["Sole", "Foam midsole, 28 mm at the heel, rubber outsole"],
          ["Weight", "230 g for one EU 42"],
          ["Made in", "Samut Prakan, Thailand"],
        ].map(([k, v]) => (
          <div key={k} className="grid grid-cols-[88px_1fr] gap-3">
            <dt className="text-muted">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </motion.aside>
  );
}

function Bag({ open, onClose, lines, setLines }: { open: boolean; onClose: () => void; lines: Line[]; setLines: (f: (l: Line[]) => Line[]) => void }) {
  const [stage, setStage] = useState<"bag" | "pay" | "done">("bag");
  const [ref, setRef] = useState("");
  const [pay, setPay] = useState("PromptPay");
  const total = lines.reduce((s, l) => s + (PRICE + (l.initials ? INITIALS : 0)) * l.qty, 0);
  const done = () => {
    onClose();
    if (stage === "done") window.setTimeout(() => setStage("bag"), 500);
  };
  return (
    <Drawer
      open={open}
      onClose={done}
      title={stage === "pay" ? "Checkout" : "Your bag"}
      footer={
        stage === "bag" && lines.length ? (
          <div>
            <div className="flex justify-between text-[14px]">
              <span className="text-muted">Total, delivery included</span>
              <span className="tabular-nums">{thb(total)}</span>
            </div>
            <button type="button" onClick={() => setStage("pay")} className="mt-4 h-12 w-full rounded-full bg-ink text-[14px] text-bg hover:opacity-90">
              Checkout
            </button>
          </div>
        ) : null
      }
    >
      {stage === "done" ? (
        <div className="pt-4">
          <p className="font-display text-[30px] font-extrabold uppercase leading-none tracking-[-0.03em] [font-stretch:66%]">Order placed</p>
          <p className="mt-4 text-[14px] leading-relaxed text-muted">
            Order {ref}. {pay === "PromptPay" ? "We have sent the PromptPay QR code to your phone." : "Pay the courier when the parcel arrives."} Parcels leave our warehouse the next working day and reach most of Thailand in two to three days.
          </p>
          <button type="button" onClick={done} className="mt-6 rounded-full border border-line px-5 py-2.5 text-[13px] hover:border-ink">
            Keep looking
          </button>
        </div>
      ) : stage === "pay" ? (
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setRef("KAO-" + Math.floor(10000 + Math.random() * 89999));
            setLines(() => []);
            setStage("done");
          }}
        >
          {[
            ["Name", "name", "name", "text"],
            ["Phone", "tel", "tel", "tel"],
            ["Address", "address", "street-address", "text"],
            ["Postcode", "postcode", "postal-code", "text"],
          ].map(([label, name, ac, type]) => (
            <label key={name} className="grid gap-1.5 text-[13px]">
              <span className="text-muted">{label}</span>
              <input required name={name} autoComplete={ac} type={type} inputMode={name === "postcode" ? "numeric" : undefined} pattern={name === "postcode" ? "[0-9]{5}" : undefined} className="h-11 rounded-xl border border-line bg-transparent px-3 text-[14px] outline-none focus:border-ink" />
            </label>
          ))}
          <fieldset className="grid gap-2 text-[14px]">
            <legend className="mb-1.5 text-[13px] text-muted">Payment</legend>
            {["PromptPay", "Cash on delivery"].map((p) => (
              <label key={p} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 ${pay === p ? "border-ink" : "border-line"}`}>
                <input type="radio" name="pay" value={p} checked={pay === p} onChange={() => setPay(p)} className="accent-[#161616]" />
                {p}
              </label>
            ))}
          </fieldset>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={() => setStage("bag")} className="h-12 rounded-full border border-line px-5 text-[14px] hover:border-ink">
              Back
            </button>
            <button type="submit" className="h-12 flex-1 rounded-full bg-ink text-[14px] text-bg hover:opacity-90">
              Pay {thb(total)}
            </button>
          </div>
        </form>
      ) : lines.length === 0 ? (
        <p className="pt-4 text-[14px] text-muted">Nothing here yet. Open a colour, pick your size and add it.</p>
      ) : (
        <ul className="grid gap-5">
          {lines.map((l) => {
            const w = ways[l.way];
            return (
              <li key={l.key} className="flex gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-[#efefec]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/kao/${w.id}.webp`} alt="" className="size-full object-contain p-1" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3 text-[14px]">
                    <span>Runner 01</span>
                    <span className="tabular-nums">{thb((PRICE + (l.initials ? INITIALS : 0)) * l.qty)}</span>
                  </div>
                  <p className="text-[12px] text-muted">
                    {w.name}, EU {l.size}
                    {l.initials ? `, initials ${l.initials}` : ""}
                  </p>
                  <div className="mt-auto flex items-center gap-3 pt-2 text-[13px]">
                    <div className="flex items-center rounded-full border border-line">
                      <button type="button" aria-label="One fewer" className="size-8 text-muted hover:text-ink" onClick={() => setLines((ls) => ls.map((x) => (x.key === l.key ? { ...x, qty: Math.max(1, x.qty - 1) } : x)))}>
                        −
                      </button>
                      <span className="w-4 text-center tabular-nums">{l.qty}</span>
                      <button type="button" aria-label="One more" className="size-8 text-muted hover:text-ink" onClick={() => setLines((ls) => ls.map((x) => (x.key === l.key ? { ...x, qty: Math.min(5, x.qty + 1) } : x)))}>
                        +
                      </button>
                    </div>
                    <button type="button" className="text-muted underline-offset-4 hover:text-ink hover:underline" onClick={() => setLines((ls) => ls.filter((x) => x.key !== l.key))}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Drawer>
  );
}
