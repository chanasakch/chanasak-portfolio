"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Photo } from "./Photo";
import type { Photo as PhotoType } from "@/data/images";

const ease = [0.22, 1, 0.36, 1] as const;

/** True once the page has scrolled past `offset` pixels. */
export function useScrolled(offset = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > offset);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [offset]);
  return scrolled;
}

/** Locks page scroll and closes on Escape while an overlay is open. */
function useOverlay(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
}

export type Slide = { photo: PhotoType; position?: string; label?: ReactNode };

/**
 * Full-bleed slideshow. Each slide drifts slowly while it is on screen, then
 * crossfades to the next. Pauses on hover and for reduced motion.
 */
export function HeroSlider({
  slides,
  interval = 6500,
  className = "",
  children,
  overlay = "bg-[linear-gradient(to_bottom,rgb(0_0_0/0.35),rgb(0_0_0/0)_30%,rgb(0_0_0/0)_50%,rgb(0_0_0/0.6))]",
}: {
  slides: Slide[];
  interval?: number;
  className?: string;
  children?: ReactNode;
  overlay?: string;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (paused || reduce) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % slides.length), interval);
    return () => window.clearTimeout(t);
  }, [i, paused, reduce, interval, slides.length]);

  const s = slides[i];
  return (
    <section
      className={`relative overflow-hidden bg-black ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: reduce ? 1 : 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: interval / 1000 + 1.5, ease: "linear" }}
          >
            <Photo photo={s.photo} priority={i === 0} position={s.position} className="absolute inset-0 h-full w-full" sizes="100vw" />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div className={`pointer-events-none absolute inset-0 ${overlay}`} />
      {children}
      <div className="absolute bottom-5 right-4 z-10 flex items-center gap-4 text-white sm:right-8">
        {s.label && <span className="hidden text-[13px] opacity-85 sm:inline">{s.label}</span>}
        <div className="flex gap-1.5">
          {slides.map((_, n) => (
            <button
              key={n}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Show slide ${n + 1}`}
              aria-current={n === i}
              className="relative h-[3px] w-8 overflow-hidden rounded-full bg-white/35"
            >
              {n === i && (
                <motion.span
                  key={`${i}-${paused}`}
                  className="absolute inset-y-0 left-0 bg-white"
                  initial={{ width: paused || reduce ? "100%" : "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: paused || reduce ? 0 : interval / 1000, ease: "linear" }}
                />
              )}
              {n < i && <span className="absolute inset-0 bg-white/80" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Horizontal rail with scroll snap, mouse drag, arrow buttons and a progress line. */
export function Rail({ children, label, className = "", tone = "dark" }: { children: ReactNode; label: string; className?: string; tone?: "dark" | "light" }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft > max - 4 });
  };
  useEffect(update, []);

  const by = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  const btn = `flex size-11 items-center justify-center rounded-full border transition-opacity disabled:opacity-30 ${
    tone === "dark" ? "border-current/25 hover:border-current" : "border-white/40 text-white hover:border-white"
  }`;

  return (
    <div className={className}>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={update}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !ref.current) return;
          drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || !ref.current) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 4 && !d.moved) {
            d.moved = true;
            setDragging(true);
          }
          ref.current.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          setDragging(false);
          setTimeout(() => (drag.current = null), 0);
        }}
        onPointerLeave={() => {
          drag.current = null;
          setDragging(false);
        }}
        onClickCapture={(e) => {
          if (drag.current?.moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={`flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden ${
          dragging ? "cursor-grabbing select-none" : "snap-x snap-mandatory cursor-grab"
        }`}
      >
        {children}
      </div>
      <div className="mt-6 flex items-center gap-6">
        <div className={`relative h-px flex-1 ${tone === "dark" ? "bg-current/15" : "bg-white/25"}`}>
          <span
            className={`absolute inset-y-[-1px] left-0 ${tone === "dark" ? "bg-current" : "bg-white"}`}
            style={{ width: `${Math.max(12, progress * 100)}%` }}
          />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => by(-1)} disabled={edges.start} className={btn} aria-label="Previous">
            <Arrow dir={-1} />
          </button>
          <button type="button" onClick={() => by(1)} disabled={edges.end} className={btn} aria-label="Next">
            <Arrow dir={1} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Arrow({ dir = 1 }: { dir?: 1 | -1 }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden style={{ transform: dir < 0 ? "scaleX(-1)" : undefined }}>
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** Side panel that slides in from the right. */
export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  width = "max-w-[480px]",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}) {
  useOverlay(open, onClose);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={title}>
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className={`absolute inset-y-0 right-0 flex w-full ${width} flex-col bg-bg text-ink shadow-[-20px_0_60px_rgb(0_0_0/0.15)]`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="text-[17px] font-medium">{title}</h2>
              <CloseButton onClick={onClose} />
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
            {footer && <div className="border-t border-line px-6 py-4">{footer}</div>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

export function CloseButton({ onClick, light }: { onClick: () => void; light?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      autoFocus
      className={`flex size-10 items-center justify-center rounded-full border transition-colors ${
        light ? "border-white/30 text-white hover:border-white" : "border-line hover:border-ink"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
        <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </button>
  );
}

/** Centered dialog for quick views. */
export function Modal({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  useOverlay(open, onClose);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={label}>
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative max-h-[92dvh] w-full max-w-[980px] overflow-y-auto bg-bg text-ink shadow-[0_30px_80px_rgb(0_0_0/0.3)]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease }}
          >
            <div className="absolute right-3 top-3 z-10">
              <CloseButton onClick={onClose} />
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Full-screen photo viewer with arrows, keyboard and captions. */
export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: { photo: PhotoType; caption?: string }[];
  index: number | null;
  onClose: () => void;
  onIndex: (n: number) => void;
}) {
  const open = index !== null;
  useOverlay(open, onClose);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onIndex(((index ?? 0) + 1) % items.length);
      if (e.key === "ArrowLeft") onIndex(((index ?? 0) - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, items.length, onIndex]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col bg-[#0d0f0e] text-white"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between px-4 py-4 sm:px-8">
            <span className="tabular text-[13px] opacity-70">
              {index! + 1} / {items.length}
            </span>
            <CloseButton onClick={onClose} light />
          </div>
          <div className="relative flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className="absolute inset-0 px-4 sm:px-20"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Photo photo={items[index!].photo} className="h-full w-full !bg-transparent" imgClassName="!object-contain" sizes="100vw" />
              </motion.div>
            </AnimatePresence>
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() => onIndex((index! - 1 + items.length) % items.length)}
                  className="absolute left-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 hover:border-white sm:left-6"
                >
                  <Arrow dir={-1} />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() => onIndex((index! + 1) % items.length)}
                  className="absolute right-2 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 hover:border-white sm:right-6"
                >
                  <Arrow />
                </button>
              </>
            )}
          </div>
          <p className="min-h-[52px] px-4 py-4 text-center text-[14px] opacity-80 sm:px-8">{items[index!].caption}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * A pinned photo that changes as the reader scrolls through the steps beside it.
 * On narrow screens each step shows its own photo instead.
 */
export function StickyStory({
  steps,
  numbered = true,
}: {
  steps: { title: string; text: string; photo: PhotoType }[];
  numbered?: boolean;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
      <div className="hidden lg:block">
        <div className="sticky top-[12vh] aspect-[4/5] max-h-[76vh] w-full overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease }}
            >
              <Photo photo={steps[active].photo} className="h-full w-full" sizes="50vw" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <ol>
        {steps.map((s, i) => (
          <li
            key={s.title}
            data-i={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="flex min-h-[60vh] flex-col justify-center border-t border-line py-10 first:border-t-0 lg:py-0"
          >
            <Photo photo={s.photo} className="mb-6 aspect-[4/3] w-full lg:hidden" sizes="100vw" />
            {numbered && <p className={`text-[13px] transition-colors ${i === active ? "text-ink" : "text-muted"}`}>Step {i + 1} of {steps.length}</p>}
            <h3 className={`mt-2 font-display text-[clamp(2rem,3.4vw,3.2rem)] leading-none transition-opacity duration-500 ${i === active ? "lg:opacity-100" : "lg:opacity-35"}`}>
              {s.title}
            </h3>
            <p className="mt-5 max-w-[42ch] text-[17px] leading-[1.7]">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Text that scrolls sideways forever. Static for reduced motion. */
export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden>
      {items.map((t) => (
        <span key={t} className="flex items-center gap-10 whitespace-nowrap">
          {t}
          <span className="size-1.5 rounded-full bg-current opacity-40" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`flex overflow-hidden ${className}`}>
      <span className="sr-only">{items.join(", ")}</span>
      <div className="flex animate-[marquee_38s_linear_infinite] motion-reduce:animate-none">
        {row}
        {row}
      </div>
    </div>
  );
}
