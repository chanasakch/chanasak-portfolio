"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Photo } from "@/components/shared/Photo";
import { CloseButton } from "@/components/shared/ui";
import { RevealImage, SplitLines, useFinePointer } from "@/components/shared/motion";
import { photos } from "@/data/images";
import { QuickCheckout } from "@/components/kit/QuickCheckout";

const hours = [
  { time: "06:10", title: "Mist on the water", text: "The lake is hidden until the sun clears the ridge. Tea is already on the terrace, and nobody talks much.", photo: photos.mistyTerrace, bg: "#dcdbd5", ink: "#1e2a25" },
  { time: "07:30", title: "A window full of hills", text: "Every Lake Room faces east. Leave the curtains open and the room wakes you on its own.", photo: photos.lakeRoom, bg: "#ece6da", ink: "#1e2a25" },
  { time: "11:00", title: "The old teak house", text: "A seventy-year-old house moved here plank by plank. It holds the library, the bar and the long table.", photo: photos.courtyardHouse, bg: "#e3e5da", ink: "#1e2a25" },
  { time: "14:30", title: "Nothing planned", text: "Books, a cane chair and the sound of the fan. We keep the afternoon free on purpose.", photo: photos.readingCorner, bg: "#e8dfcf", ink: "#1e2a25" },
  { time: "17:40", title: "Last light in the pool", text: "Twenty-five metres among the palms, warm enough after dark. Towels and lime soda at the sala.", photo: photos.resortPool, bg: "#d9b99a", ink: "#24180f" },
  { time: "21:00", title: "The valley goes quiet", text: "Lanterns along the path to the Forest Suites, an outdoor shower among ferns, and very little else.", photo: photos.forestSuite, bg: "#17221e", ink: "#e9e4d8" },
];

const rooms = [
  { id: "lake", name: "Lake Room", photo: photos.lakeRoom, rate: 7400 },
  { id: "garden", name: "Garden Room", photo: photos.gardenRoom, rate: 6200 },
  { id: "forest", name: "Forest Suite", photo: photos.forestSuite, rate: 12800 },
];
const fmt = new Intl.NumberFormat("en-US");

export function StaySite() {
  const [active, setActive] = useState(0);
  const [book, setBook] = useState(false);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const fine = useFinePointer();

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))), { rootMargin: "-45% 0px -45% 0px" });
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  const h = hours[active];
  const night = active === hours.length - 1;

  return (
    <div className="transition-colors duration-[1400ms]" style={{ backgroundColor: h.bg, color: h.ink }}>
      <header className="fixed inset-x-0 top-0 z-30 flex h-[72px] items-center justify-between px-[var(--gutter)] text-[14px] mix-blend-difference text-white">
        <span className="font-display text-[26px] italic">Ruen Doi</span>
        <span className="hidden md:block">Chiang Rai, 680 m above sea level</span>
        <button type="button" onClick={() => setBook(true)} className="rounded-full border border-white/50 px-5 py-2.5 hover:bg-white hover:text-black">
          Book a stay
        </button>
      </header>

      <Clock index={active} time={h.time} />

      <section ref={hero} className="relative h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0 will-change-transform" style={fine ? { scale } : undefined}>
          <Photo photo={photos.balconyRattanPods} priority position="50% 55%" className="h-full w-full" sizes="100vw" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        <motion.div style={fine ? { opacity: fade } : undefined} className="absolute inset-x-[var(--gutter)] bottom-[12vh] text-white">
          <SplitLines lines={["A day above", "the lake"]} delay={0.3} className="font-display text-[clamp(3.4rem,10vw,10rem)] italic leading-[0.9]" />
          <p className="mt-6 max-w-[40ch] text-[16px] opacity-85">Twenty-four rooms in the hills above Mae Suai, Chiang Rai.</p>
        </motion.div>
      </section>

      {hours.map((x, i) => (
        <section
          key={x.time}
          data-i={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="grid min-h-[110vh] items-center gap-10 px-[var(--gutter)] py-[12vh] lg:grid-cols-12 lg:gap-6"
        >
          <div className={`lg:col-span-5 ${i % 2 ? "lg:order-2 lg:col-start-8" : ""}`}>
            <p className="tabular font-display text-[clamp(4.5rem,12vw,11rem)] leading-[0.85] tracking-[-0.03em]">{x.time}</p>
            <h2 className="mt-6 font-display text-[clamp(1.8rem,3vw,2.8rem)] italic leading-[1.05]">{x.title}</h2>
            <p className="mt-4 max-w-[38ch] text-[16px] leading-[1.7] opacity-75">{x.text}</p>
          </div>
          <div className={`lg:col-span-6 ${i % 2 ? "lg:order-1" : "lg:col-start-7"}`}>
            <RevealImage photo={x.photo} className={i % 3 === 1 ? "aspect-[4/5] w-full" : "aspect-[5/4] w-full"} sizes="(min-width:1024px) 50vw, 100vw" />
          </div>
        </section>
      ))}

      <section className="px-[var(--gutter)] py-[16vh] text-center">
        <SplitLines as="h2" inView lines={["Come for", "a few days"]} className="font-display text-[clamp(3rem,8vw,8rem)] italic leading-[0.9]" />
        <button type="button" onClick={() => setBook(true)} className={`mt-10 rounded-full px-8 py-4 text-[15px] font-medium ${night ? "bg-[#e9e4d8] text-[#17221e]" : "bg-[#1e2a25] text-[#f1efe9]"}`}>
          See dates and rates
        </button>
      </section>

      <footer className="flex flex-col justify-between gap-3 border-t border-current/15 px-[var(--gutter)] pb-24 pt-8 text-[13px] opacity-60 sm:flex-row sm:pb-8">
        <span>Ruen Doi, Mae Suai, Chiang Rai. stay@ruendoi.example</span>
        <span>© 2026 Ruen Doi</span>
      </footer>

      <AnimatePresence>{book && <Booking onClose={() => setBook(false)} />}</AnimatePresence>
    </div>
  );
}

/** The hour of the chapter on screen, with a small sun or moon on an arc. */
function Clock({ index, time }: { index: number; time: string }) {
  const t = index / (hours.length - 1);
  const a = Math.PI * (1 - t);
  const x = 40 + Math.cos(a) * 32;
  const y = 40 - Math.sin(a) * 26;
  return (
    <div className="pointer-events-none fixed bottom-6 right-[var(--gutter)] z-30 flex items-end gap-3 mix-blend-difference text-white" aria-live="polite">
      <svg width="80" height="44" viewBox="0 0 80 44" aria-hidden>
        <path d="M8 40 A32 26 0 0 1 72 40" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeDasharray="2 3" />
        <circle cx={x} cy={y} r="4" fill="currentColor" style={{ transition: "cx 1s, cy 1s" }} />
        <line x1="2" y1="40.5" x2="78" y2="40.5" stroke="currentColor" strokeOpacity="0.4" />
      </svg>
      <span className="tabular w-14 font-display text-[22px] leading-none">{time}</span>
    </div>
  );
}

/** Date range picker with nightly rates, room choice and a request step. */
function Booking({ onClose }: { onClose: () => void }) {
  const [range, setRange] = useState<[number | null, number | null]>([15, 18]);
  const [room, setRoom] = useState(rooms[0]);
  const [sent, setSent] = useState(false);
  const [guest, setGuest] = useState(false);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const startPad = 4; // 1 January 2027 is a Friday; weeks start Monday
  const rate = (d: number) => {
    const dow = (d + startPad - 1) % 7;
    return Math.round(room.rate * (dow >= 4 ? 1.18 : 1));
  };
  const full = new Set([8, 9, 23, 24]);
  const [a, b] = range;
  const nights = a && b ? b - a : 0;
  const total = a && b ? days.filter((d) => d >= a && d < b).reduce((n, d) => n + rate(d), 0) : 0;

  const pick = (d: number) => {
    if (full.has(d)) return;
    if (!a || (a && b) || d <= a) setRange([d, null]);
    else if ([...full].some((f) => f > a && f < d)) setRange([d, null]);
    else setRange([a, d]);
  };

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    window.__lenis?.stop();
    return () => {
      window.removeEventListener("keydown", k);
      window.__lenis?.start();
    };
  }, [onClose]);

  return (
    <motion.div role="dialog" aria-modal="true" aria-label="Book a stay" className="fixed inset-0 z-50 overflow-y-auto bg-[#f1efe9] text-[#1e2a25]" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>
      <div className="flex items-center justify-between px-[var(--gutter)] py-5">
        <span className="font-display text-[26px] italic">Ruen Doi</span>
        <CloseButton onClick={onClose} />
      </div>
      {sent ? (
        <div className="mx-auto max-w-[640px] px-[var(--gutter)] py-[14vh] text-center">
          <p className="font-display text-[clamp(2.6rem,6vw,4.4rem)] italic leading-none">Your room is on hold</p>
          <p className="mt-6 text-[16px] leading-relaxed opacity-75">
            {room.name}, {a} to {b} January. We confirm by email within a few hours. Nothing is charged until then.
          </p>
        </div>
      ) : (
        <div className="grid gap-12 px-[var(--gutter)] pb-16 pt-4 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] italic leading-none">January 2027</h2>
              <p className="text-[13px] opacity-60">Rates per night, breakfast included</p>
            </div>
            <div className="mt-8 grid grid-cols-7 gap-1 text-center text-[12px] opacity-60">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {Array.from({ length: startPad }, (_, i) => (
                <span key={`p${i}`} />
              ))}
              {days.map((d) => {
                const sel = a === d || b === d;
                const inside = a && b && d > a && d < b;
                const off = full.has(d);
                return (
                  <button
                    key={d}
                    type="button"
                    disabled={off}
                    onClick={() => pick(d)}
                    className={`flex aspect-square flex-col items-center justify-center rounded-[2px] text-[15px] transition-colors sm:aspect-[1.1] ${sel ? "bg-[#1e2a25] text-[#f1efe9]" : inside ? "bg-[#1e2a25]/10" : off ? "text-current/25 line-through" : "hover:bg-[#1e2a25]/5"}`}
                  >
                    <span className="tabular">{d}</span>
                    {!off && <span className={`tabular hidden text-[10px] sm:block ${sel ? "opacity-70" : "opacity-45"}`}>{fmt.format(rate(d) / 1000)}k</span>}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-[13px] opacity-60">Struck-through dates are full. Friday and Saturday nights cost a little more.</p>
          </div>

          <div className="flex flex-col">
            <h3 className="text-[13px] opacity-60">Room</h3>
            <ul className="mt-3 grid gap-2">
              {rooms.map((r) => (
                <li key={r.id}>
                  <button type="button" onClick={() => setRoom(r)} aria-pressed={room.id === r.id} className={`flex w-full items-center gap-4 border p-2 text-left transition-colors ${room.id === r.id ? "border-[#1e2a25]" : "border-[#1e2a25]/15 hover:border-[#1e2a25]/40"}`}>
                    <Photo photo={r.photo} className="aspect-[4/3] w-24 shrink-0" sizes="96px" />
                    <span className="flex-1 font-display text-[1.4rem] italic leading-tight">{r.name}</span>
                    <span className="tabular pr-2 text-[14px] opacity-70">from ฿{fmt.format(r.rate)}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-auto border-t border-[#1e2a25]/15 pt-6">
              <p className="text-[15px] opacity-75">{nights > 0 ? `${a} to ${b} January, ${nights} ${nights === 1 ? "night" : "nights"}` : "Choose a leaving date"}</p>
              <div className="mt-3 flex flex-wrap items-center gap-5">
                <p className="tabular font-display text-[2.4rem] leading-none">฿{fmt.format(total)}</p>
                <button type="button" disabled={nights < 1} onClick={() => setGuest(true)} className="flex-1 rounded-full bg-[#1e2a25] px-6 py-4 text-[15px] font-medium text-[#f1efe9] disabled:opacity-40">
                  Hold this room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <QuickCheckout
        open={guest}
        onClose={() => setGuest(false)}
        prefix="RHN"
        request="Hold this room"
        lines={[{ name: room.name, detail: `${a} to ${b} January 2027, ${nights} ${nights === 1 ? "night" : "nights"}`, qty: 1, price: total }]}
        done={(ref, email) => `Your room is on hold under ${ref}. We confirm by email to ${email} within a few hours. Nothing is charged until then.`}
        onDone={() => setSent(true)}
      />
    </motion.div>
  );
}
