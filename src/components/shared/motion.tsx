"use client";

import Lenis from "lenis";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { Photo } from "./Photo";
import type { Photo as PhotoType } from "@/data/images";

export const ease = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.76, 0, 0.24, 1] as const;

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Inertia scrolling for the whole page. Dialogs keep native scrolling. */
export function SmoothScroll() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      anchors: { offset: -64 },
      prevent: (node) => !!node.closest?.('[role="dialog"]'),
    });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, [reduce]);
  return null;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -64, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/**
 * A small dot that follows the pointer and grows into a labelled disc over
 * anything marked with data-cursor="View" (or Drag, Open...). Fine pointers only.
 */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [label, setLabel] = useState<string | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    queueMicrotask(() => setOn(true));
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(t ? t.dataset.cursor ?? "" : null);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!on) return null;
  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100]" style={{ x: sx, y: sy }}>
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--cursor,#141413)] text-[12px] font-medium text-[var(--cursor-ink,#fff)]"
        animate={{ width: label !== null ? 84 : 8, height: label !== null ? 84 : 8 }}
        transition={{ duration: 0.35, ease }}
      >
        <AnimatePresence>
          {label && (
            <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/** Opening curtain with a counting number. Runs once per visit to a site. */
export function Preloader({ name, id, className = "bg-[#141413] text-white" }: { name: ReactNode; id: string; className?: string }) {
  const [done, setDone] = useState(false);
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(`pre.${id}`) === "1";
      sessionStorage.setItem(`pre.${id}`, "1");
    } catch {}
    if (seen || reduce) {
      queueMicrotask(() => setDone(true));
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1500);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [id, reduce]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          aria-hidden
          className={`fixed inset-0 z-[90] flex flex-col justify-between p-5 sm:p-8 ${className}`}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1, ease: easeInOut }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            {name}
          </motion.div>
          <div className="flex items-end justify-between gap-6">
            <div className="h-px flex-1 bg-current/20">
              <div className="h-px bg-current" style={{ width: `${n}%` }} />
            </div>
            <span className="tabular text-[clamp(3rem,10vw,9rem)] font-light leading-[0.8]">{n}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Lines slide up from behind a mask, one after another. */
export function SplitLines({
  lines,
  className = "",
  delay = 0,
  inView = false,
  as: Tag = "h1",
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  inView?: boolean;
  as?: "h1" | "h2" | "p";
}) {
  const M = motion[Tag];
  return (
    <M className={className} initial="hide" {...(inView ? { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } } : { animate: "show" })}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block"
            variants={{ hide: { y: "110%" }, show: { y: "0%", transition: { duration: 1.1, ease, delay: delay + i * 0.09 } } }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </M>
  );
}

/** A paragraph whose words light up as it scrolls through the screen. */
export function ScrollText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} p={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ p, range, children }: { p: MotionValue<number>; range: [number, number]; children: string }) {
  const o = useTransform(p, range, [0.16, 1]);
  return (
    <>
      <motion.span style={{ opacity: o }}>{children}</motion.span>{" "}
    </>
  );
}

/** Photo that unveils from the bottom when it enters, then drifts slightly inside its frame. */
export function RevealImage({
  photo,
  className = "",
  position,
  sizes,
  priority,
  parallax = 8,
}: {
  photo: PhotoType;
  className?: string;
  position?: string;
  sizes?: string;
  priority?: boolean;
  parallax?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);
  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden bg-soft ${className}`}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1.3, ease: easeInOut }}
    >
      <motion.div className="absolute inset-x-0" style={{ y, top: `-${parallax}%`, bottom: `-${parallax}%` }}>
        <Photo photo={photo} position={position} sizes={sizes} priority={priority} className="h-full w-full" />
      </motion.div>
    </motion.div>
  );
}

/**
 * A section pinned to the screen while its row of children slides sideways.
 * Below 1024px it becomes an ordinary swipeable row.
 */
export function HorizontalPin({ children, header, className = "" }: { children: ReactNode; header?: ReactNode; className?: string }) {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [wide, setWide] = useState(false);

  useIso(() => {
    const measure = () => {
      const w = window.innerWidth >= 1024;
      setWide(w);
      if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={wrap} className={`relative ${className}`} style={wide ? { height: `calc(100vh + ${dist}px)` } : undefined}>
      <div className={wide ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : ""}>
        {header}
        <motion.div
          ref={track}
          style={wide ? { x } : undefined}
          className={`flex gap-6 px-[var(--gutter)] ${wide ? "w-max" : "snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:none]"}`}
          data-cursor={wide ? undefined : "Drag"}
        >
          {children}
        </motion.div>
        {wide && (
          <div className="mx-[var(--gutter)] mt-10 h-px bg-current/15">
            <motion.div className="h-px bg-current" style={{ width: bar }} />
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Index list: rows of names. On a fine pointer a photo floats beside the cursor
 * for the row under it; on touch each row shows a thumbnail instead.
 */
export function HoverIndex({
  items,
  className = "",
}: {
  items: { key: string; title: ReactNode; meta?: ReactNode; aside?: ReactNode; photo: PhotoType; position?: string; onClick: () => void; cursor?: string }[];
  className?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22 });
  const sy = useSpring(y, { stiffness: 180, damping: 22 });

  return (
    <div
      className={`relative ${className}`}
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t border-current/15">
        {items.map((it, i) => (
          <li key={it.key} className="border-b border-current/15">
            <button
              type="button"
              onClick={it.onClick}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              data-cursor={it.cursor ?? "View"}
              className="group grid w-full grid-cols-[64px_1fr_auto] items-center gap-4 py-5 text-left md:grid-cols-[1fr_auto_auto] md:gap-10 md:py-7"
            >
              <Photo photo={it.photo} position={it.position} className="aspect-square w-16 md:hidden" sizes="64px" />
              <span className={`transition-[opacity,transform] duration-500 ease-out md:group-hover:translate-x-3 ${active !== null && active !== i ? "md:opacity-30" : ""}`}>{it.title}</span>
              {it.meta && <span className={`hidden text-[14px] transition-opacity duration-500 md:block ${active !== null && active !== i ? "opacity-30" : "opacity-70"}`}>{it.meta}</span>}
              <span className={`tabular text-[14px] transition-opacity duration-500 ${active !== null && active !== i ? "md:opacity-30" : ""}`}>{it.aside}</span>
            </button>
          </li>
        ))}
      </ul>
      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block" style={{ x: sx, y: sy }}>
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key="frame"
              className="relative -translate-x-1/2 -translate-y-[60%] overflow-hidden"
              style={{ width: 300, height: 380 }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease }}
            >
              <AnimatePresence initial={false}>
                <motion.div key={active} className="absolute inset-0" initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 0.5, ease: easeInOut }}>
                  <Photo photo={items[active].photo} position={items[active].position} className="h-full w-full" sizes="300px" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/** Fades and lifts children once as they enter the screen. */
export function FadeUp({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 1, ease, delay }}>
      {children}
    </motion.div>
  );
}

/** Header that slides away while reading down and returns on the way up. */
export function useSmartHeader(threshold = 120) {
  const [state, setState] = useState({ hidden: false, top: true });
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      const hidden = y > threshold && y > last + 2 ? true : y < last - 2 ? false : null;
      setState((s) => ({ hidden: hidden ?? s.hidden, top: y < 24 }));
      last = y;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [threshold]);
  return state;
}
