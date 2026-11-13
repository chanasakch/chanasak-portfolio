"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/kit/ui";
import { dests, tripsFor, type Dest } from "@/data/tera";

const ease = [0.22, 1, 0.36, 1] as const;
const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Box = { cw: number; ch: number; dpr: number };

/** Where a photo lands when it covers the box, keeping its focus point in view. */
function cover(d: Dest, { cw, ch }: Box) {
  const s = Math.max(cw / d.w, ch / d.h);
  const w = d.w * s;
  const h = d.h * s;
  return { left: (cw - w) * d.fx, top: (ch - h) * d.fy, width: w, height: h };
}

/** Width of the word at 100px in the display face, measured once fonts are ready. */
function useWordWidths() {
  const [widths, setWidths] = useState<Record<string, number>>({});
  useEffect(() => {
    let live = true;
    const measure = () => {
      const probe = document.createElement("span");
      probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:800 100px "Archivo Variable",system-ui,sans-serif;font-stretch:125%;letter-spacing:-0.02em';
      document.body.appendChild(probe);
      const out: Record<string, number> = {};
      for (const d of dests) {
        probe.textContent = d.word;
        out[d.id] = probe.getBoundingClientRect().width;
      }
      probe.remove();
      if (live) setWidths(out);
    };
    document.fonts.ready.then(measure);
    return () => {
      live = false;
    };
  }, []);
  return widths;
}

function Slide({ d, box, size, active, first }: { d: Dest; box: Box; size: number; active: boolean; first: boolean }) {
  const r = cover(d, box);
  // keep the word clear of the header
  const cy = Math.max(r.top + r.height * d.y, 84 + size * 0.42);
  const src = (fg: boolean) => `/images/${d.img}${fg ? "-fg" : ""}`;
  const set = (fg: boolean) => [960, 1280, 1920].map((w) => `${src(fg)}-${w}.webp ${w}w`).join(", ");
  // never ask for more than twice the CSS size, phones with 3x screens do not need it
  const dpr = box.dpr;
  const sizes = `${Math.ceil((r.width * Math.min(dpr, 2)) / dpr)}px`;
  return (
    <div className="absolute inset-0" aria-hidden={!active}>
      <div className="absolute" style={{ left: r.left, top: r.top, width: r.width, height: r.height }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${src(false)}-1920.webp`} srcSet={set(false)} sizes={sizes} alt={`${d.place}, ${d.name}`} fetchPriority={first ? "high" : undefined} className="absolute inset-0 size-full" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(10_12_16/0.45),transparent_28%)]" />
      {size > 0 && (
        <div className="pointer-events-none absolute inset-x-0 flex justify-center" style={{ top: cy, transform: "translateY(-50%)" }}>
          <motion.p
            className="font-display whitespace-nowrap leading-none text-white"
            style={{ fontSize: size, fontWeight: 800, fontStretch: "125%", letterSpacing: "-0.02em", textShadow: "0 2px 40px rgb(0 0 0 / 0.12)" }}
            initial={{ opacity: 0, y: size * 0.25 }}
            animate={{ opacity: active ? 0.96 : 0, y: active ? 0 : -size * 0.1 }}
            transition={{ duration: 1.1, ease, delay: active ? 0.15 : 0 }}
          >
            {d.word}
          </motion.p>
        </div>
      )}
      <div className="absolute" style={{ left: r.left, top: r.top + r.height * d.crop, width: r.width, height: r.height * (1 - d.crop) }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${src(true)}-1920.webp`} srcSet={set(true)} sizes={sizes} alt="" className="absolute inset-0 size-full" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_12_16/0.72),rgb(10_12_16/0.2)_38%,transparent_60%)]" />
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [box, setBox] = useState<Box>({ cw: 1440, ch: 900, dpr: 2 });
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const widths = useWordWidths();
  const n = dests.length;
  const go = (k: number) => setI(((k % n) + n) % n);

  useIso(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ cw: e.contentRect.width, ch: e.contentRect.height, dpr: window.devicePixelRatio || 1 }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const d = dests[i];
  const next = dests[(i + 1) % n];
  const trip = tripsFor(d.id)[0];
  const sizeFor = (x: Dest) => (widths[x.id] ? Math.min((box.cw * (box.cw < 640 ? 0.9 : 0.86)) / (widths[x.id] / 100), box.ch * 0.34) : 0);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-[#0d0f12] text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Destinations"
    >
      {dests.map((x, k) => {
        // only the current slide and its neighbours are in the page, the rest load when needed
        const near = k === i || k === (i + 1) % n || k === (i - 1 + n) % n;
        if (!near) return null;
        return (
          <div key={x.id} className="absolute inset-0 transition-opacity duration-[1200ms] ease-out" style={{ opacity: k === i ? 1 : 0, zIndex: k === i ? 1 : 0 }}>
            <Slide d={x} box={box} size={sizeFor(x)} active={k === i} first={k === 0} />
          </div>
        );
      })}

      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end gap-6 px-5 pb-20 pt-28 sm:px-8 lg:pb-28">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div className="grid max-w-xl gap-5">
            <AnimatePresence mode="wait">
              <motion.div key={d.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.6, ease }} className="grid gap-2">
                <p className="text-[14px] text-white/75">
                  {d.place}, {d.name}
                </p>
                <p className="hidden max-w-md text-[16px] leading-relaxed text-white/90 sm:block sm:text-[17px]">{d.blurb}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex flex-wrap items-center gap-3">
              <Link href={`/tera/trip/${trip.id}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-[#15140f] hover:bg-white/90">
                Book now {Icon.arrow}
              </Link>
              <Link href={`/tera/trips?d=${d.id}`} className="inline-flex h-12 items-center rounded-full border border-white/35 px-6 text-[15px] backdrop-blur-md hover:bg-white/10">
                All {d.name} trips
              </Link>
            </div>
            <dl className="flex gap-8 sm:mt-2 sm:gap-12">
              {[
                ["12K+", "Travellers since 2015"],
                ["40", "Trip leaders"],
                ["4.9", "Average review"],
              ].map(([k, v]) => (
                <div key={v}>
                  <dt className="font-display text-[26px] font-bold sm:text-[32px]">{k}</dt>
                  <dd className="text-[12.5px] text-white/70">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex items-center gap-3 rounded-[24px] border border-white/20 bg-white/10 p-2.5 backdrop-blur-xl sm:w-[400px]">
            <button onClick={() => go(i + 1)} className="relative h-[84px] w-[110px] shrink-0 overflow-hidden rounded-[16px]" aria-label={`Next destination, ${next.name}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/${next.img}-960.webp`} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
            </button>
            <div className="grid min-w-0 flex-1 gap-2 pr-2">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-[15px]">Next: {next.name}</p>
                <p className="text-[13px] tabular-nums text-white/70">
                  {String(i + 1).padStart(2, "0")}/{String(n).padStart(2, "0")}
                </p>
              </div>
              <span className="relative block h-[3px] overflow-hidden rounded-full bg-white/25">
                <span key={i} className="absolute inset-0 origin-left bg-white" style={{ animation: "orra-fill 8s linear forwards", animationPlayState: paused ? "paused" : "running" }} onAnimationEnd={() => go(i + 1)} />
              </span>
              <div className="flex gap-2">
                <button onClick={() => go(i - 1)} aria-label="Previous destination" className="grid size-8 place-items-center rounded-full border border-white/30 hover:bg-white/10">
                  {Icon.left}
                </button>
                <button onClick={() => go(i + 1)} aria-label="Next destination" className="grid size-8 place-items-center rounded-full bg-white text-[#15140f]">
                  {Icon.right}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
