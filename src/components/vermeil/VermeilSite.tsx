"use client";

import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ease, scrollToId } from "@/components/shared/motion";
import { Drawer } from "@/components/shared/ui";
import { menu, pic, rooms, srcSet, thb, wines, type Room } from "./data";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const span = (v: number, a: number, b: number) => clamp((v - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function VermeilSite() {
  const [booking, setBooking] = useState<{ room?: string; party?: number } | null>(null);
  const [solid, setSolid] = useState(false);
  const book = useCallback((o: { room?: string; party?: number } = {}) => setBooking(o), []);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > window.innerHeight * 3.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="bg-bg text-ink">
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-500 ${solid ? "border-b border-line bg-bg" : "border-b border-transparent"}`}
      >
        <div className="mx-auto grid h-16 max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:h-[72px] sm:px-8">
          <nav aria-label="Sections" className="hidden gap-7 text-[13px] text-ink/80 md:flex">
            {[
              ["Menu", "menu"],
              ["Rooms", "rooms"],
              ["Story", "story"],
              ["Cellar", "cellar"],
            ].map(([l, id]) => (
              <button key={id} type="button" onClick={() => scrollToId(id)} className="transition-colors hover:text-ink">
                {l}
              </button>
            ))}
          </nav>
          <a href="#top" onClick={(e) => (e.preventDefault(), window.__lenis ? window.__lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" }))} className="col-start-1 font-display text-[24px] leading-none md:col-start-2">
            Vermeil
          </a>
          <div className="col-start-3 flex justify-end">
            <button type="button" onClick={() => book()} className="rounded-full bg-accent px-4 py-2 text-[13px] text-[#1c0b0d] transition-opacity hover:opacity-85 sm:px-5 sm:py-2.5">
              Book a table
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <WalkIn onBook={() => book()} />
        <Menu />
        <Rooms onBook={(room) => book(room === "private" ? { room, party: 8 } : { room })} />
        <Story />
        <Cellar />
        <Private onBook={() => book({ room: "private", party: 12 })} />
        <Footer onBook={() => book()} />
      </main>

      <Booking state={booking} onClose={() => setBooking(null)} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The walk in: a doorway that grows into the room as you scroll       */
/* ------------------------------------------------------------------ */

function WalkIn({ onBook }: { onBook: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // how small the doorway starts, worked out from the screen so it always reads as an arch
  const start = useMotionValue(0.3);
  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const boxW = Math.max(w, h * 0.72);
      const boxH = boxW / 0.72;
      start.set(Math.min((h * (w < 768 ? 0.42 : 0.6)) / boxH, (w * 0.62) / boxW));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [start]);

  const portal = useTransform(() => start.get() + (1 - start.get()) * easeIO(span(p.get(), 0.02, 0.24)));
  const radius = useTransform(p, (v) => `${(1 - easeIO(span(v, 0.1, 0.24))) * 50}% ${(1 - easeIO(span(v, 0.1, 0.24))) * 50}% 0 0 / ${(1 - easeIO(span(v, 0.1, 0.24))) * 36}% ${(1 - easeIO(span(v, 0.1, 0.24))) * 36}% 0 0`);
  const facadeS = useTransform(p, (v) => 1.12 - 0.12 * span(v, 0, 0.24) + 0.62 * easeIO(span(v, 0.26, 0.46)));
  const facadeO = useTransform(p, (v) => 1 - span(v, 0.38, 0.46));
  const doorO = useTransform(p, (v) => span(v, 0.38, 0.46) * (1 - span(v, 0.6, 0.68)));
  const doorS = useTransform(p, (v) => 1.05 + 0.5 * easeIO(span(v, 0.4, 0.68)));
  const hallO = useTransform(p, (v) => span(v, 0.6, 0.68));
  const hallS = useTransform(p, (v) => 1.28 - 0.28 * easeOut(span(v, 0.6, 0.9)));
  const dim = useTransform(p, (v) => 0.12 + 0.5 * span(v, 0.84, 0.96));
  const shade = useTransform(p, (v) => span(v, 0.24, 0.32));
  const wordX = useTransform(p, (v) => `${easeIO(span(v, 0.02, 0.2)) * 40}vw`);
  const wordXn = useTransform(p, (v) => `${-easeIO(span(v, 0.02, 0.2)) * 40}vw`);
  const wordO = useTransform(p, (v) => 1 - span(v, 0.06, 0.18));
  const hintO = useTransform(p, (v) => 1 - span(v, 0, 0.05));

  return (
    <section ref={ref} className="relative h-[480svh] md:h-[560svh]" aria-label="Walk into Vermeil">
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* the doorway, laid out at full size and scaled down so it stays sharp */}
        <div className="absolute inset-0 flex items-center justify-center max-md:translate-y-[5svh]">
          <motion.div
            className="relative aspect-[0.72] w-[max(100vw,72svh)] shrink-0 overflow-hidden will-change-transform"
            style={{ scale: portal, borderRadius: radius }}
          >
            <Layer slug="facade" o={facadeO} s={facadeS} origin="44% 50%" alt="The entrance to Vermeil, red velvet curtains behind a café table" eager />
            <Layer slug="door" o={doorO} s={doorS} origin="50% 60%" alt="Doors open onto a red-carpeted hall" />
            <Layer slug="hall" o={hallO} s={hallS} origin="50% 55%" alt="The dining hall with painted ceilings, mirrors and red banquettes" />
            <motion.div className="absolute inset-0 bg-[#140607]" style={{ opacity: dim }} />
            {/* a low shade under the words so they read over any part of the room */}
            <motion.div className="absolute inset-0 bg-gradient-to-t from-[#140607]/85 via-[#140607]/20 to-transparent" style={{ opacity: shade }} />
          </motion.div>
        </div>

        {/* the name either side of the door, parting as you step in */}
        <motion.p style={{ opacity: wordO }} className="pointer-events-none absolute inset-x-0 top-[17svh] text-center font-display text-[clamp(56px,17vw,96px)] leading-none md:hidden" aria-hidden>
          Vermeil
        </motion.p>
        <div className="pointer-events-none absolute inset-0 hidden items-center justify-between px-[3vw] md:flex" aria-hidden>
          <motion.span style={{ x: wordXn, opacity: wordO }} className="font-display text-[clamp(64px,13vw,220px)] leading-none">
            Ver
          </motion.span>
          <motion.span style={{ x: wordX, opacity: wordO }} className="font-display text-[clamp(64px,13vw,220px)] leading-none">
            meil
          </motion.span>
        </div>
        <motion.div style={{ opacity: wordO }} className="pointer-events-none absolute inset-x-0 bottom-[13svh] text-center text-[13px] text-ink/75 md:bottom-auto md:top-[12svh]">
          A brasserie on Charoen Krung, Bangkok
        </motion.div>
        <motion.p style={{ opacity: hintO }} className="pointer-events-none absolute inset-x-0 bottom-[6svh] text-center text-[12px] text-ink/60">
          Scroll to step inside
        </motion.p>

        <Caption p={p} range={[0.3, 0.36, 0.42, 0.47]} className="bottom-[16svh]">
          Through the velvet curtain
        </Caption>
        <Caption p={p} range={[0.5, 0.56, 0.62, 0.67]} className="bottom-[16svh]">
          down the red hall
        </Caption>
        <Caption p={p} range={[0.7, 0.76, 0.86, 0.9]} className="bottom-[14svh]" big>
          Dinner since 1964, in an old trading house on Charoen Krung.
        </Caption>
        <EndCard p={p} onBook={onBook} />
      </div>
    </section>
  );
}

function Layer({ slug, o, s, origin, alt, eager }: { slug: string; o: MotionValue<number>; s: MotionValue<number>; origin: string; alt: string; eager?: boolean }) {
  return (
    <motion.img
      src={pic(slug, 2000)}
      srcSet={srcSet(slug)}
      sizes="(max-width: 767px) 100vw, 100vw"
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      draggable={false}
      className="absolute inset-0 size-full object-cover will-change-transform"
      style={{ opacity: o, scale: s, transformOrigin: origin }}
    />
  );
}

function Caption({ p, range, children, className, big }: { p: MotionValue<number>; range: [number, number, number, number]; children: string; className: string; big?: boolean }) {
  const o = useTransform(p, range, [0, 1, 1, 0]);
  const y = useTransform(p, range, [24, 0, 0, -16]);
  return (
    <motion.p
      style={{ opacity: o, y }}
      className={`pointer-events-none absolute inset-x-0 mx-auto px-6 text-center font-display text-balance ${big ? "max-w-[18ch] text-[clamp(32px,5vw,72px)] leading-[1.04]" : "text-[clamp(26px,3.4vw,48px)] italic leading-tight"} ${className}`}
    >
      {children}
    </motion.p>
  );
}

function EndCard({ p, onBook }: { p: MotionValue<number>; onBook: () => void }) {
  const o = useTransform(p, [0.9, 0.96], [0, 1]);
  const y = useTransform(p, [0.9, 0.96], [30, 0]);
  const [live, setLive] = useState(false);
  useMotionValueEvent(o, "change", (v) => setLive(v > 0.5));
  return (
    <motion.div style={{ opacity: o, y }} className={`absolute inset-x-0 bottom-[12svh] flex flex-col items-center gap-5 px-6 text-center ${live ? "" : "pointer-events-none"}`}>
      <p className="font-display text-[clamp(30px,4.4vw,64px)] leading-[1.05]">Your table is through here.</p>
      <p className="text-[14px] text-ink/75">Tuesday to Sunday, from 6 pm. The bar opens at 5.</p>
      <div className="flex gap-3">
        <button type="button" onClick={onBook} tabIndex={live ? 0 : -1} className="rounded-full bg-accent px-6 py-3 text-[14px] text-[#1c0b0d] hover:opacity-90">
          Book a table
        </button>
        <button type="button" onClick={() => scrollToId("menu")} tabIndex={live ? 0 : -1} className="rounded-full border border-ink/30 px-6 py-3 text-[14px] hover:border-ink">
          See the menu
        </button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Menu: the plate changes as you move down the list                   */
/* ------------------------------------------------------------------ */

function Menu() {
  const [course, setCourse] = useState(menu[0].id);
  const c = menu.find((m) => m.id === course)!;
  const [photo, setPhoto] = useState(c.photo);
  const list = useRef<HTMLUListElement>(null);

  // on phones the dish in the middle of the screen is the one on the plate
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) return;
    let io: IntersectionObserver | null = null;
    // wait for the new course's list to finish swapping in
    const t = window.setTimeout(() => {
      const rows = [...(list.current?.querySelectorAll<HTMLElement>("[data-photo]") ?? [])];
      io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setPhoto(e.target.getAttribute("data-photo")!)), { rootMargin: "-45% 0px -45% 0px" });
      rows.forEach((r) => io!.observe(r));
    }, 450);
    return () => {
      window.clearTimeout(t);
      io?.disconnect();
    };
  }, [course]);

  const pick = (id: string) => {
    setCourse(id);
    setPhoto(menu.find((m) => m.id === id)!.photo);
  };

  return (
    <section id="menu" className="bg-paper text-paper-ink">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-24 sm:px-8 md:grid-cols-[1.05fr_1fr] md:gap-16 md:py-32">
        <div className="sticky top-16 z-10 -mx-5 h-[42svh] overflow-hidden sm:-mx-8 md:top-[14svh] md:mx-0 md:h-[72svh] md:rounded-[4px]">
          <AnimatePresence initial={false}>
            <motion.img
              key={photo}
              src={pic(photo, 1100)}
              srcSet={srcSet(photo)}
              sizes="(min-width: 768px) 52vw, 100vw"
              alt=""
              className="absolute inset-0 size-full object-cover will-change-transform"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease }}
            />
          </AnimatePresence>
        </div>
        <div className="md:py-[6svh]">
          <h2 className="font-display text-[clamp(40px,5vw,76px)] leading-[0.98]">The menu</h2>
          <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-paper-ink/70">
            French brasserie cooking with what comes up from the Gulf each morning. It changes a little every week; these are always on.
          </p>
          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Courses">
            {menu.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={m.id === course}
                onClick={() => pick(m.id)}
                className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${m.id === course ? "border-paper-ink bg-paper-ink text-paper" : "border-paper-ink/20 hover:border-paper-ink"}`}
              >
                {m.title}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.ul
              key={course}
              ref={list}
              className="mt-8 border-t border-paper-ink/15"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
            >
              {c.dishes.map((d) => (
                <li
                  key={d.name}
                  data-photo={d.photo ?? c.photo}
                  onPointerEnter={() => setPhoto(d.photo ?? c.photo)}
                  onFocus={() => setPhoto(d.photo ?? c.photo)}
                  tabIndex={0}
                  className={`group grid cursor-default grid-cols-[1fr_auto] gap-x-6 border-b border-paper-ink/15 py-6 outline-none transition-colors focus-visible:bg-paper-ink/5`}
                >
                  <p className="font-display text-[clamp(22px,2.2vw,30px)] leading-tight">
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">{d.name}</span>
                  </p>
                  <p className="text-[16px] tabular-nums">{thb(d.price)}</p>
                  <p className="col-span-2 mt-1.5 max-w-[52ch] text-[14px] leading-relaxed text-paper-ink/65">
                    {d.note}
                    {d.tags?.map((t) => (
                      <span key={t} className="ml-2 rounded-full border border-paper-ink/20 px-2 py-0.5 text-[11px]">
                        {t}
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
          <p className="mt-6 text-[13px] text-paper-ink/60">Tell us about allergies when you book and the kitchen will plan around them.</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Rooms: open one and step into it                                    */
/* ------------------------------------------------------------------ */

function Rooms({ onBook }: { onBook: (room: string) => void }) {
  const [open, setOpen] = useState<Room | null>(null);
  useEffect(() => {
    if (!open) return;
    const on = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", on);
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", on);
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <section id="rooms" className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 md:py-32">
      <div className="grid gap-4 md:grid-cols-2 md:items-end">
        <h2 className="font-display text-[clamp(40px,5vw,76px)] leading-[0.98]">Four rooms, one kitchen</h2>
        <p className="max-w-[44ch] text-[15px] leading-relaxed text-ink/70 md:justify-self-end">Open any room to look around before you choose where to sit.</p>
      </div>
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {rooms.map((r, i) => (
          <li key={r.id}>
            <button type="button" onClick={() => setOpen(r)} className="group block w-full text-left" data-cursor="Step in">
              <motion.div layoutId={`room-${r.id}`} className="relative aspect-[3/4] overflow-hidden rounded-[4px]" transition={{ duration: 0.7, ease }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pic(r.photo, 600)}
                  srcSet={srcSet(r.photo)}
                  sizes="(min-width: 1024px) 24vw, 48vw"
                  alt={r.name}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                />
                <span className="absolute left-3 top-3 font-display text-[13px] text-ink/80">0{i + 1}</span>
              </motion.div>
              <p className="mt-3 font-display text-[22px] leading-tight">{r.name}</p>
              <p className="text-[13px] text-ink/60">{r.seats}</p>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal
            aria-label={open.name}
            className="fixed inset-0 z-50 overflow-y-auto bg-bg"
            initial={{ backgroundColor: "rgba(28,11,13,0)" }}
            animate={{ backgroundColor: "rgba(28,11,13,1)" }}
            exit={{ backgroundColor: "rgba(28,11,13,0)", transition: { duration: 0.5, delay: 0.15 } }}
            data-lenis-prevent
          >
            <div className="grid min-h-svh md:grid-cols-[1.25fr_1fr]">
              <motion.div layoutId={`room-${open.id}`} className="relative h-[58svh] overflow-hidden md:sticky md:top-0 md:h-svh" transition={{ duration: 0.7, ease }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pic(open.photo, 2000)} srcSet={srcSet(open.photo)} sizes="(min-width: 768px) 56vw, 100vw" alt={open.name} className="size-full object-cover" />
              </motion.div>
              <motion.div
                className="flex flex-col px-5 pb-12 pt-8 sm:px-10 md:justify-center md:py-20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: 0.35 } }}
                exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
              >
                <p className="text-[13px] text-accent">{open.seats}</p>
                <h3 className="mt-2 font-display text-[clamp(40px,5vw,72px)] leading-none">{open.name}</h3>
                <p className="mt-5 max-w-[42ch] text-[16px] leading-relaxed text-ink/80">{open.blurb}</p>
                <ul className="mt-6 grid gap-2 text-[14px] text-ink/75">
                  {open.detail.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span className="mt-[9px] size-1 shrink-0 rounded-full bg-accent" />
                      {d}
                    </li>
                  ))}
                </ul>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pic(open.second, 1100)} alt="" className="mt-8 aspect-[4/3] w-full max-w-[460px] rounded-[4px] object-cover" />
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const id = open.id;
                      setOpen(null);
                      onBook(id);
                    }}
                    className="rounded-full bg-accent px-6 py-3 text-[14px] text-[#1c0b0d] hover:opacity-90"
                  >
                    Book {open.name.replace("The ", "the ")}
                  </button>
                  <button type="button" onClick={() => setOpen(null)} className="rounded-full border border-ink/30 px-6 py-3 text-[14px] hover:border-ink">
                    Back to the rooms
                  </button>
                </div>
              </motion.div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="fixed right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full bg-[#1c0b0d]/80 text-[20px] text-ink"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Story                                                               */
/* ------------------------------------------------------------------ */

function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const year = useTransform(scrollYProgress, [0.15, 0.5], [1900, 1964]);
  const [shown, setShown] = useState(1900);
  useMotionValueEvent(year, "change", (v) => setShown(Math.round(v)));
  return (
    <section id="story" ref={ref} className="relative overflow-hidden bg-[#140607] py-24 md:py-36">
      <div className="mx-auto grid max-w-[1500px] items-center gap-12 px-5 sm:px-8 md:grid-cols-2 md:gap-20">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] md:aspect-[3/4]">
          <motion.img
            src={pic("stairs", 1100)}
            srcSet={srcSet("stairs")}
            sizes="(min-width: 768px) 46vw, 100vw"
            alt="A tiled staircase up to the salon, a painting at the top"
            loading="lazy"
            style={{ y, scale: 1.18 }}
            className="size-full object-cover will-change-transform"
          />
        </div>
        <div>
          <p className="font-display text-[clamp(72px,11vw,170px)] leading-none tabular-nums text-accent" aria-label="1964">
            {shown}
          </p>
          <div className="mt-8 max-w-[46ch] space-y-5 text-[17px] leading-relaxed text-ink/80">
            <p>The building went up in 1905 for a family of silk traders, two storeys of teak and lime plaster a few doors from the river.</p>
            <p>In 1964 Madame Suda Phongsri turned the ground floor into the dining room she had loved in Lyon, with the mirrors, the banquettes and a cook from the Gulf who never wrote anything down.</p>
            <p>Her granddaughter runs it now. The painted ceiling was restored in 2019, the onion soup has not changed.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Cellar: a hand of wine cards that fans out                          */
/* ------------------------------------------------------------------ */

function Cellar() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "center 45%"] });
  const [count, setCount] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setCount(Math.round(1134 * easeOut(clamp(v)))));
  const [lift, setLift] = useState<number | null>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(max-width: 640px)");
    const on = () => setNarrow(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return (
    <section id="cellar" ref={ref} className="relative overflow-hidden py-24 md:py-36">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={pic("glasses", 2000)} srcSet={srcSet("glasses")} sizes="100vw" alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/60 to-bg" />
      <div className="relative mx-auto grid max-w-[1500px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-display text-[clamp(80px,12vw,190px)] leading-none tabular-nums">{count.toLocaleString("en-US")}</p>
          <p className="mt-3 text-[15px] text-ink/70">bottles in the cellar under the hall</p>
          <p className="mt-8 max-w-[42ch] text-[16px] leading-relaxed text-ink/80">
            Mostly French, some Italian, and a shelf of Thai wines from Khao Yai we are quietly proud of. Twelve are open by the glass each night.
          </p>
        </div>
        <div className="relative mx-auto h-[360px] w-full max-w-[560px] sm:h-[420px]">
          {wines.map((w, i) => (
            <WineCard key={w.name} w={w} i={i} n={wines.length} p={scrollYProgress} lifted={lift === i} onLift={setLift} spread={narrow ? 17 : 42} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WineCard({ w, i, n, p, lifted, onLift, spread }: { w: (typeof wines)[number]; i: number; n: number; p: MotionValue<number>; lifted: boolean; onLift: (i: number | null) => void; spread: number }) {
  const mid = (n - 1) / 2;
  const rotate = useTransform(p, [0.2, 1], [0, (i - mid) * (spread < 30 ? 7 : 9)]);
  const x = useTransform(p, [0.2, 1], ["0%", `${(i - mid) * spread}%`]);
  const y = useTransform(p, [0.2, 1], [0, Math.abs(i - mid) * 14]);
  return (
    <motion.button
      type="button"
      style={{ rotate, x, y, zIndex: lifted ? 10 : i }}
      onPointerEnter={() => onLift(i)}
      onPointerLeave={() => onLift(null)}
      onFocus={() => onLift(i)}
      onBlur={() => onLift(null)}
      className="absolute left-1/2 top-1/2 -ml-[80px] -mt-[120px] h-[240px] w-[160px] origin-bottom will-change-transform sm:-ml-[110px] sm:-mt-[155px] sm:h-[310px] sm:w-[220px]"
    >
      <motion.span
        animate={{ y: lifted ? -26 : 0 }}
        transition={{ duration: 0.35, ease }}
        className="flex h-full flex-col rounded-[6px] border border-[#d8c6a6] bg-[#f3ebdd] p-5 text-left text-[#2a1012] shadow-[0_24px_50px_-20px_rgb(0_0_0/0.6)]"
      >
        <span className="text-[11px] text-[#2a1012]/60">
          {w.from}, {w.year}
        </span>
        <span className="mt-2 font-display text-[22px] leading-tight sm:text-[24px]">{w.name}</span>
        <span className="mt-auto grid grid-cols-2 border-t border-[#2a1012]/15 pt-3 text-[12px]">
          <span>
            <span className="block text-[#2a1012]/55">Glass</span>
            {thb(w.glass)}
          </span>
          <span>
            <span className="block text-[#2a1012]/55">Bottle</span>
            {thb(w.bottle)}
          </span>
        </span>
      </motion.span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Private dining                                                      */
/* ------------------------------------------------------------------ */

function Private({ onBook }: { onBook: () => void }) {
  return (
    <section className="bg-paper px-5 py-24 text-paper-ink sm:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 overflow-hidden rounded-[6px] bg-[#5e1219] text-ink md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[520px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pic("private", 1100)} srcSet={srcSet("private")} sizes="(min-width: 768px) 50vw, 100vw" alt="A round table under a crystal chandelier in the private room" loading="lazy" className="absolute inset-0 size-full object-cover" />
        </div>
        <div className="px-6 pb-10 md:py-16 md:pl-4 md:pr-14">
          <p className="font-display text-[clamp(40px,5vw,68px)] leading-none">Up to 24 guests</p>
          <p className="mt-5 max-w-[40ch] text-[16px] leading-relaxed text-ink/80">
            Birthdays, rehearsal dinners, the kind of business dinner that needs a closed door. Your own room, your own waiter, a menu planned with the chef.
          </p>
          <button type="button" onClick={onBook} className="mt-8 rounded-full bg-accent px-6 py-3 text-[14px] text-[#1c0b0d] hover:opacity-90">
            Plan an evening
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer({ onBook }: { onBook: () => void }) {
  return (
    <footer className="relative overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={pic("wall", 2000)} srcSet={srcSet("wall")} sizes="100vw" alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" />
      <div className="relative mx-auto max-w-[1500px] px-5 pb-28 pt-40 sm:px-8 md:pb-20 md:pt-56">
        <p className="max-w-[12ch] font-display text-[clamp(52px,8vw,128px)] leading-[0.95]">See you on Charoen Krung.</p>
        <button type="button" onClick={onBook} className="mt-10 rounded-full bg-accent px-6 py-3 text-[14px] text-[#1c0b0d] hover:opacity-90">
          Book a table
        </button>
        <div className="mt-20 grid gap-8 border-t border-line pt-8 text-[14px] text-ink/75 sm:grid-cols-3">
          <p>
            1264 Charoen Krung Road
            <br />
            Bang Rak, Bangkok 10500
          </p>
          <p>
            Dinner, Tuesday to Sunday, 6 pm to 11 pm
            <br />
            Bar from 5 pm until 1 am
          </p>
          <p>
            Saphan Taksin BTS, exit 3, then seven minutes on foot.
            <br />
            Valet parking at the door.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Booking                                                             */
/* ------------------------------------------------------------------ */

const times = ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
const roomNames: Record<string, string> = { any: "Wherever is free", hall: "The Hall", salon: "The Salon", bar: "The Bar", private: "The Private Room" };

function nextDays() {
  const out: Date[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (out.length < 10) {
    if (d.getDay() !== 1) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

/** slots that start within the hour, or have gone, cannot be booked for today */
const gone = (day: Date, t: string) => {
  const now = new Date();
  if (day.toDateString() !== now.toDateString()) return false;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m < now.getHours() * 60 + now.getMinutes() + 60;
};

/** a stable handful of slots that are already taken, so the grid looks like a real evening */
const taken = (day: Date, t: string, party: number) => {
  const h = (day.getDate() * 7 + times.indexOf(t) * 13 + party * 3) % 11;
  return h < (party > 6 ? 5 : 3);
};

function Booking({ state, onClose }: { state: { room?: string; party?: number } | null; onClose: () => void }) {
  // a fresh form each time the drawer opens, starting from wherever it was opened
  const [opened, setOpened] = useState(0);
  const [last, setLast] = useState(state);
  if (state !== last) {
    setLast(state);
    if (state) setOpened(opened + 1);
  }
  return (
    <Drawer open={!!state} onClose={onClose} title="Book a table">
      <BookingForm key={opened} init={state ?? last ?? {}} onClose={onClose} />
    </Drawer>
  );
}

function BookingForm({ init, onClose }: { init: { room?: string; party?: number }; onClose: () => void }) {
  const [days] = useState(nextDays);
  const [party, setParty] = useState(init.party ?? 2);
  // late in the evening, start on the next day that still has tables
  const [day, setDay] = useState(() => (times.every((t) => gone(days[0], t)) ? 1 : 0));
  const [time, setTime] = useState<string | null>(null);
  const [room, setRoom] = useState(init.room ?? "any");
  const [done, setDone] = useState<{ ref: string } | null>(null);

  const d = days[day];
  const dateLabel = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  const ics = () => {
    if (!time) return "";
    const [hh, mm] = time.split(":").map(Number);
    const s = new Date(d);
    s.setHours(hh, mm, 0, 0);
    const e = new Date(s.getTime() + 2 * 3600 * 1000);
    const f = (x: Date) => x.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", `DTSTART:${f(s)}`, `DTEND:${f(e)}`, `SUMMARY:Dinner at Vermeil, table for ${party}`, "LOCATION:1264 Charoen Krung Road, Bang Rak, Bangkok", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(body);
  };

  return (
    <>
      {done ? (
        <div className="pt-2">
          <p className="text-[13px] text-accent">Your table is booked</p>
          <p className="mt-2 font-display text-[30px] leading-tight">
            {dateLabel}, {time}
          </p>
          <p className="mt-2 text-[15px] text-muted">
            {party} {party === 1 ? "guest" : "guests"}, {roomNames[room]}. Booking {done.ref}.
          </p>
          <p className="mt-5 text-[14px] leading-relaxed text-muted">We hold the table for fifteen minutes. If your plans change, reply to the confirmation message and we will move it.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={ics()} download="vermeil.ics" className="rounded-full bg-ink px-5 py-2.5 text-[13px] text-bg hover:opacity-90">
              Add to calendar
            </a>
            <button type="button" onClick={onClose} className="rounded-full border border-line px-5 py-2.5 text-[13px] hover:border-ink">
              Done
            </button>
          </div>
        </div>
      ) : (
        <form
          className="grid min-w-0 gap-6 [&>*]:min-w-0"
          onSubmit={(e) => {
            e.preventDefault();
            if (!time) return;
            setDone({ ref: "VM-" + Math.floor(1000 + Math.random() * 8999) });
          }}
        >
          <div className="flex items-center justify-between">
            <p className="text-[14px]">Guests</p>
            <div className="flex items-center rounded-full border border-line">
              <button type="button" aria-label="One fewer guest" onClick={() => (setParty(Math.max(1, party - 1)), setTime(null))} className="size-10 text-[18px] text-muted hover:text-ink">
                −
              </button>
              <span className="w-6 text-center tabular-nums" aria-live="polite">
                {party}
              </span>
              <button type="button" aria-label="One more guest" onClick={() => (setParty(Math.min(24, party + 1)), setTime(null))} className="size-10 text-[18px] text-muted hover:text-ink">
                +
              </button>
            </div>
          </div>
          <div>
            <p className="text-[14px]">Day</p>
            <div className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pb-1" data-lenis-prevent>
              {days.map((x, i) => (
                <button
                  key={i}
                  type="button"
                  aria-pressed={i === day}
                  onClick={() => (setDay(i), setTime(null))}
                  className={`w-16 shrink-0 rounded-xl border py-2.5 text-center text-[12px] transition-colors ${i === day ? "border-ink bg-ink text-bg" : "border-line hover:border-ink"}`}
                >
                  {x.toDateString() === new Date().toDateString() ? "Today" : x.toLocaleDateString("en-GB", { weekday: "short" })}
                  <span className="block text-[16px] tabular-nums">{x.getDate()}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[14px]">Time</p>
            {times.every((t) => gone(d, t)) && <p className="mt-1 text-[13px] text-muted">The kitchen has stopped taking tables for tonight. Pick another day.</p>}
            <div className="mt-2 grid grid-cols-3 gap-2">
              {times.map((t) => {
                const past = gone(d, t);
                const full = past || taken(d, t, party);
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={full}
                    aria-pressed={time === t}
                    aria-label={past ? `${t}, too late to book` : full ? `${t}, fully booked` : t}
                    onClick={() => setTime(t)}
                    className={`rounded-xl border py-2.5 text-[13px] tabular-nums transition-colors ${time === t ? "border-ink bg-ink text-bg" : full ? "cursor-not-allowed border-line text-muted/50 line-through" : "border-line hover:border-ink"}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
          <label className="grid gap-1.5 text-[14px]">
            Where would you like to sit
            <select value={room} onChange={(e) => setRoom(e.target.value)} className="h-11 rounded-xl border border-line bg-transparent px-3 text-[14px]">
              {Object.entries(roomNames).map(([k, v]) => (
                <option key={k} value={k} className="bg-bg">
                  {v}
                </option>
              ))}
            </select>
          </label>
          {room === "private" && party < 8 && <p className="-mt-3 text-[13px] text-accent">The private room is for eight guests or more.</p>}
          <label className="grid gap-1.5 text-[14px]">
            Name
            <input required name="name" autoComplete="name" className="h-11 rounded-xl border border-line bg-transparent px-3 text-[14px] outline-none focus:border-ink" />
          </label>
          <label className="grid gap-1.5 text-[14px]">
            Phone
            <input required name="tel" type="tel" inputMode="tel" autoComplete="tel" className="h-11 rounded-xl border border-line bg-transparent px-3 text-[14px] outline-none focus:border-ink" />
          </label>
          <label className="grid gap-1.5 text-[14px]">
            Anything we should know
            <textarea name="notes" rows={2} placeholder="An allergy, a birthday, a high chair" className="rounded-xl border border-line bg-transparent px-3 py-2.5 text-[14px] outline-none placeholder:text-muted/60 focus:border-ink" />
          </label>
          <button
            type="submit"
            disabled={!time || (room === "private" && party < 8)}
            className="h-12 rounded-full bg-accent text-[14px] text-[#1c0b0d] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {time ? `Book ${d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}, ${time}` : "Choose a time"}
          </button>
        </form>
      )}
    </>
  );
}
