"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Drawer } from "@/components/shared/ui";
import {
  ease,
  FadeUp,
  RevealImage,
  SplitLines,
} from "@/components/shared/motion";
import { Photo } from "@/components/shared/Photo";
import { photos } from "@/data/images";

type Stop = {
  id: string;
  name: string;
  x: number;
  y: number;
  r: number;
  hours: number;
  fee: number;
  note: string;
};
const marina = { x: 27, y: 22 };
const stops: Stop[] = [
  {
    id: "jb",
    name: "Khao Phing Kan",
    x: 50,
    y: 9,
    r: 1.6,
    hours: 1,
    fee: 300,
    note: "The limestone needle from the Bond film. Go before 10 to beat the boats.",
  },
  {
    id: "yao",
    name: "Koh Yao Noi",
    x: 44,
    y: 25,
    r: 4.5,
    hours: 1.5,
    fee: 0,
    note: "Rubber farms and a fishing village. Bicycles wait at the pier.",
  },
  {
    id: "hong",
    name: "Koh Hong",
    x: 70,
    y: 30,
    r: 2.6,
    hours: 1.5,
    fee: 300,
    note: "Kayak into the lagoon at high tide. Our crew checks the table.",
  },
  {
    id: "naka",
    name: "Koh Naka Yai",
    x: 33,
    y: 33,
    r: 2.4,
    hours: 2,
    fee: 0,
    note: "A quiet beach for lunch, cooked on board.",
  },
  {
    id: "khai",
    name: "Koh Khai Nok",
    x: 42,
    y: 47,
    r: 1.3,
    hours: 1,
    fee: 0,
    note: "Shallow reef for snorkelling, good for children.",
  },
  {
    id: "phiphi",
    name: "Phi Phi Leh",
    x: 72,
    y: 64,
    r: 3,
    hours: 2.5,
    fee: 400,
    note: "Pileh lagoon by boat. Maya Bay is viewed from the water.",
  },
  {
    id: "racha",
    name: "Koh Racha Yai",
    x: 26,
    y: 74,
    r: 3.2,
    hours: 2,
    fee: 0,
    note: "Clear water in Batok Bay and a long swim off the stern.",
  },
];
// the days most guests ask for
const routes = [
  { name: "Limestone bay", ids: ["jb", "hong", "naka"] },
  { name: "Phi Phi", ids: ["khai", "phiphi"] },
  { name: "Snorkel Racha", ids: ["racha"] },
  { name: "Slow island day", ids: ["yao", "naka"] },
];

const boats = [
  {
    id: "lomkhai",
    name: "Lomkhai",
    type: "Sailing catamaran, 46 ft",
    guests: 12,
    knots: 7,
    day: 58000,
    fuelPerNm: 0,
    cabins: 4,
    desc: "Quiet under sail, with a wide net to lie on at anchor.",
  },
  {
    id: "duean",
    name: "Duean",
    type: "Power catamaran, 52 ft",
    guests: 14,
    knots: 18,
    day: 118000,
    fuelPerNm: 140,
    cabins: 3,
    desc: "Reaches Phi Phi and back in a day with time to swim.",
  },
  {
    id: "suea",
    name: "Suea Samut",
    type: "Teak motor junk, 70 ft",
    guests: 18,
    knots: 8,
    day: 95000,
    fuelPerNm: 60,
    cabins: 5,
    desc: "A 1980s junk rebuilt in Phang Nga, with a long shaded deck.",
  },
];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const monthsLong = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
// typical Andaman sea state off Phuket: wave height (m) and rainy days per month
const sea = [0.5, 0.5, 0.5, 0.7, 1.4, 1.8, 2, 2, 1.9, 1.6, 1, 0.6].map(
  (wave, i) => ({ wave, rain: [3, 2, 4, 9, 17, 16, 17, 17, 20, 19, 12, 5][i] }),
);
const extras = [
  {
    id: "photo",
    name: "Photographer on board",
    note: "Edited photos the same evening",
    price: 12000,
    per: false,
  },
  {
    id: "sunset",
    name: "Sunset at Koh Naka",
    note: "Champagne and canapés on the bow before heading in",
    price: 6500,
    per: false,
  },
  {
    id: "massage",
    name: "Thai massage on deck",
    note: "Thirty minutes each, therapist from Ao Po",
    price: 900,
    per: true,
  },
];
const NM = 0.42; // nautical miles per map unit
const fmt = new Intl.NumberFormat("en-US");

function blob(cx: number, cy: number, r: number, seed: number, sx = 1, sy = 1) {
  const p: string[] = [];
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    const k =
      1 + 0.22 * Math.sin(3 * a + seed) + 0.12 * Math.sin(7 * a + seed * 1.7);
    p.push(
      `${(cx + Math.cos(a) * r * k * sx).toFixed(2)},${(cy + Math.sin(a) * r * k * sy).toFixed(2)}`,
    );
  }
  return `M${p.join("L")}Z`;
}
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y) * NM;

/** Visit the chosen islands in nearest-first order and come home. */
function plan(sel: Stop[]) {
  const left = [...sel];
  const order: Stop[] = [];
  let at: { x: number; y: number } = marina;
  while (left.length) {
    const from = at;
    left.sort((a, b) => dist(from, a) - dist(from, b));
    const next = left.shift()!;
    order.push(next);
    at = next;
  }
  return order;
}
function smooth(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const bend = i % 2 ? 4 : -4;
    const mx =
      (a.x + b.x) / 2 +
      ((b.y - a.y) / Math.hypot(b.x - a.x, b.y - a.y || 1)) * bend;
    const my =
      (a.y + b.y) / 2 -
      ((b.x - a.x) / Math.hypot(b.x - a.x || 1, b.y - a.y)) * bend;
    d += ` Q${mx.toFixed(2)},${my.toFixed(2)} ${b.x},${b.y}`;
  }
  return d;
}
const clock = (h: number) =>
  `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

function Chart({
  chosen,
  toggle,
  route,
}: {
  chosen: Set<string>;
  toggle: (id: string) => void;
  route: string;
}) {
  const path = useRef<SVGPathElement>(null);
  const boat = useRef<SVGGElement>(null);
  useEffect(() => {
    const p = path.current;
    const b = boat.current;
    if (!p || !b || !route) return;
    let raf = 0;
    const len = p.getTotalLength();
    const t0 = performance.now();
    const dur = Math.max(6000, len * 120);
    const tick = (now: number) => {
      const k = ((now - t0) % dur) / dur;
      const pt = p.getPointAtLength(k * len);
      const ah = p.getPointAtLength(Math.min(len, k * len + 0.5));
      const ang = (Math.atan2(ah.y - pt.y, ah.x - pt.x) * 180) / Math.PI;
      b.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${ang})`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [route]);

  return (
    <svg
      viewBox="0 0 100 84"
      className="h-auto w-full select-none"
      role="group"
      aria-label="Chart of Phang Nga Bay. Tap an island to add or remove it."
    >
      <defs>
        <pattern id="swell" width="3" height="3" patternUnits="userSpaceOnUse">
          <path
            d="M0 1.5 Q0.75 1 1.5 1.5 T3 1.5"
            fill="none"
            stroke="var(--ink)"
            strokeOpacity="0.06"
            strokeWidth="0.15"
          />
        </pattern>
      </defs>
      <rect width="100" height="84" fill="var(--soft)" />
      <rect width="100" height="84" fill="url(#swell)" />
      {/* depth lines */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={blob(48, 45, 30 + i * 9, 2 + i, 1.3, 1)}
          fill="none"
          stroke="var(--ink)"
          strokeOpacity="0.07"
          strokeWidth="0.2"
          strokeDasharray="0.6 0.8"
        />
      ))}
      {/* Phuket and the mainland */}
      <path
        d={blob(16, 52, 12, 0.6, 0.62, 2.3)}
        fill="var(--land)"
        stroke="var(--ink)"
        strokeOpacity="0.25"
        strokeWidth="0.2"
      />
      <path
        d="M0 0 H100 V18 C 92 16, 88 22, 80 14 C 72 6, 64 2, 56 3 C 46 4, 40 0, 30 6 C 24 9, 18 4, 10 8 C 6 10, 3 9, 0 10 Z"
        fill="var(--land)"
        stroke="var(--ink)"
        strokeOpacity="0.25"
        strokeWidth="0.2"
      />
      <path
        d="M100 18 C 94 26, 90 34, 94 44 C 97 52, 92 58, 100 62 Z"
        fill="var(--land)"
        stroke="var(--ink)"
        strokeOpacity="0.25"
        strokeWidth="0.2"
      />
      <text
        x="9"
        y="56"
        fontSize="2.6"
        fill="var(--muted)"
        transform="rotate(-80 9 56)"
      >
        PHUKET
      </text>
      <text x="92" y="10" fontSize="2.4" fill="var(--muted)">
        KRABI
      </text>
      <text x="38" y="4.5" fontSize="2.4" fill="var(--muted)">
        PHANG NGA
      </text>

      {route && (
        <>
          <motion.path
            key={route}
            d={route}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.45"
            strokeDasharray="1.2 0.9"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease }}
          />
          <path ref={path} d={route} fill="none" stroke="none" />
          <g ref={boat}>
            <path
              d="M-1.4 -0.7 L1.2 -0.7 L2 0 L1.2 0.7 L-1.4 0.7 Z"
              fill="var(--accent)"
            />
          </g>
        </>
      )}

      <g>
        <circle cx={marina.x} cy={marina.y} r="1.1" fill="var(--ink)" />
        <text
          x={marina.x - 1.5}
          y={marina.y - 2}
          fontSize="2.3"
          fill="var(--ink)"
          textAnchor="end"
        >
          Ao Po marina
        </text>
      </g>
      {stops.map((s, i) => {
        const on = chosen.has(s.id);
        return (
          <g
            key={s.id}
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={`${s.name}${on ? ", on the route" : ""}`}
            onClick={() => toggle(s.id)}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && toggle(s.id)
            }
            className="cursor-pointer outline-none"
          >
            <circle cx={s.x} cy={s.y} r={s.r + 4} fill="transparent" />
            <path
              d={blob(s.x, s.y, s.r, i * 1.3)}
              fill={on ? "var(--land-on)" : "var(--land)"}
              stroke="var(--ink)"
              strokeOpacity={on ? 0.6 : 0.25}
              strokeWidth="0.2"
              style={{ transition: "fill 0.4s" }}
            />
            <text
              x={s.x}
              y={s.y + s.r + 3.4}
              fontSize="2.3"
              textAnchor="middle"
              fill="var(--ink)"
              fontWeight={on ? 700 : 400}
            >
              {s.name}
            </text>
            {on && (
              <circle
                cx={s.x + s.r}
                cy={s.y - s.r}
                r="1.1"
                fill="var(--accent)"
              />
            )}
          </g>
        );
      })}
      {/* compass */}
      <g transform="translate(90 76)" opacity="0.5">
        <circle r="3.6" fill="none" stroke="var(--ink)" strokeWidth="0.15" />
        <path
          d="M0 -3.2 L0.8 0 L0 3.2 L-0.8 0 Z"
          fill="var(--ink)"
          fillOpacity="0.5"
        />
        <text y="-4.3" fontSize="2" textAnchor="middle" fill="var(--ink)">
          N
        </text>
      </g>
    </svg>
  );
}

function BoatSide({ id }: { id: string }) {
  const hull =
    id === "suea"
      ? "M4 30 Q20 38 60 38 L92 34 L98 26 L2 26 Z"
      : id === "duean"
        ? "M4 30 L90 32 L98 24 L6 24 Z"
        : "M6 30 L88 30 L96 24 L8 24 Z";
  return (
    <svg viewBox="0 0 100 44" className="h-auto w-full" aria-hidden>
      <path
        d="M0 40 Q12 38 25 40 T50 40 T75 40 T100 40"
        fill="none"
        stroke="var(--ink)"
        strokeOpacity="0.25"
        strokeWidth="0.6"
      />
      <path d={hull} fill="var(--ink)" />
      {id === "lomkhai" && (
        <path
          d="M44 23 L44 1 L72 22 Z M42 23 L42 4 L24 22 Z"
          fill="var(--ink)"
          fillOpacity="0.15"
          stroke="var(--ink)"
          strokeWidth="0.5"
        />
      )}
      {id === "duean" && (
        <path
          d="M28 24 L34 15 L72 15 L80 24 Z M40 15 L44 10 L62 10 L64 15"
          fill="var(--ink)"
          fillOpacity="0.2"
          stroke="var(--ink)"
          strokeWidth="0.5"
        />
      )}
      {id === "suea" && (
        <path
          d="M30 26 L30 4 M30 6 Q42 12 30 20 M62 26 L62 8 M62 10 Q72 15 62 21 M18 26 L22 18 L80 18 L84 26"
          fill="var(--accent)"
          fillOpacity="0.2"
          stroke="var(--ink)"
          strokeWidth="0.5"
        />
      )}
    </svg>
  );
}

export function NavaSite() {
  const [chosen, setChosen] = useState<Set<string>>(new Set(["jb", "naka"]));
  const [boat, setBoat] = useState(boats[0]);
  const [guests, setGuests] = useState(6);
  const [month, setMonth] = useState(0);
  const [addons, setAddons] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const toggle = (id: string) =>
    setChosen((c) => {
      const n = new Set(c);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const order = useMemo(
    () => plan(stops.filter((s) => chosen.has(s.id))),
    [chosen],
  );
  const route = useMemo(
    () => (order.length ? smooth([marina, ...order, marina]) : ""),
    [order],
  );
  const legs = [marina, ...order, marina]
    .slice(1)
    .map((s, i, arr) => dist(i ? arr[i - 1] : marina, s));
  const nm = legs.reduce((a, b) => a + b, 0);

  // timeline from a 9:00 departure
  const timeline = order.reduce<{ s: Stop; arrive: number }[]>((acc, s, i) => {
    const prev = acc.length
      ? acc[acc.length - 1].arrive + acc[acc.length - 1].s.hours
      : 9;
    return [...acc, { s, arrive: prev + legs[i] / boat.knots }];
  }, []);
  const lastOut = timeline.length
    ? timeline[timeline.length - 1].arrive +
      timeline[timeline.length - 1].s.hours
    : 9;
  const back =
    lastOut + (order.length ? legs[legs.length - 1] / boat.knots : 0);
  const late = back > 18.33;
  const monsoon = month >= 4 && month <= 9;
  const exposed = order.some((s) => s.id === "phiphi" || s.id === "racha");
  const fees = order.reduce((a, s) => a + s.fee, 0) * guests;
  const fuel = Math.round(nm * boat.fuelPerNm);
  const extraCost = extras
    .filter((x) => addons.has(x.id))
    .reduce(
      (n, x) => n + (x.per ? x.price * Math.min(guests, boat.guests) : x.price),
      0,
    );
  const total = boat.day + fuel + fees + extraCost;
  const g = Math.min(guests, boat.guests);

  return (
    <div>
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between bg-gradient-to-b from-bg/80 to-transparent px-[var(--gutter)] text-[14px]">
        <span className="font-display text-[22px] tracking-[0.32em]">NAVA</span>
        <nav className="hidden gap-7 md:flex">
          <a href="#plan" className="text-muted hover:text-ink">
            Plan a day
          </a>
          <a href="#boats" className="text-muted hover:text-ink">
            Boats
          </a>
          <a href="#aboard" className="text-muted hover:text-ink">
            On board
          </a>
        </nav>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-ink/40 px-4 py-2 transition-colors lg:backdrop-blur hover:bg-ink hover:text-bg"
        >
          Enquire
        </button>
      </header>

      <section className="relative h-[100svh] min-h-[620px] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 3.2, ease }}
        >
          <Photo
            photo={photos.sunbedsSand}
            className="h-full w-full"
            priority
            position="50% 60%"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#0b1d27_4%,rgb(11_29_39/0.45)_50%,rgb(11_29_39/0.25))]" />
        <div className="absolute inset-x-0 bottom-0 px-[var(--gutter)] pb-24 sm:pb-14">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-[13px] tracking-[0.06em] text-accent"
          >
            Private charters from Ao Po, Phuket
          </motion.p>
          <SplitLines
            lines={["A day on", "Phang Nga Bay"]}
            delay={0.35}
            className="mt-4 font-display text-[clamp(3rem,8.4vw,8.4rem)] leading-[0.9]"
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease }}
            className="mt-10 grid max-w-[760px] grid-cols-2 overflow-hidden rounded-2xl border border-ink/15 bg-bg/40 text-[14px] backdrop-blur-md sm:grid-cols-4"
          >
            {[
              ["Boat", boat.name],
              ["Guests", String(g)],
              ["Stops", order.length ? String(order.length) : "None yet"],
            ].map(([k, v]) => (
              <a
                key={k}
                href="#plan"
                className="border-b border-r border-ink/10 px-5 py-4 sm:border-b-0"
              >
                <span className="block text-[12px] text-muted">{k}</span>
                {v}
              </a>
            ))}
            <a
              href="#plan"
              className="flex items-center justify-center bg-accent px-5 py-4 font-semibold text-[#0b1d27]"
            >
              Plan the day
            </a>
          </motion.div>
        </div>
      </section>

      <section
        id="plan"
        className="grid gap-8 px-[var(--gutter)] pb-20 pt-20 lg:grid-cols-[1.35fr_1fr] lg:gap-12"
      >
        <div className="min-w-0 lg:sticky lg:top-20 lg:self-start">
          <div className="overflow-hidden rounded-xl shadow-[0_30px_60px_-40px_rgb(11_53_64/0.6)]">
            <Chart chosen={chosen} toggle={toggle} route={route} />
          </div>
          <p className="mt-3 text-[13px] text-muted">
            {order.length
              ? `${order.length} ${order.length === 1 ? "stop" : "stops"}, ${nm.toFixed(0)} nautical miles round trip`
              : "Tap an island to start a route"}
          </p>
        </div>

        <div className="min-w-0">
          <div className="mb-8 flex flex-wrap gap-2 text-[13px]">
            {routes.map((r) => {
              const on =
                r.ids.length === chosen.size &&
                r.ids.every((id) => chosen.has(id));
              return (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => setChosen(new Set(r.ids))}
                  aria-pressed={on}
                  className={`rounded-full border px-3.5 py-1.5 transition-colors ${on ? "border-accent bg-accent text-[#0b1d27]" : "border-line text-muted hover:text-ink"}`}
                >
                  {r.name}
                </button>
              );
            })}
          </div>
          <ol className="relative border-l border-line pl-6">
            <li className="relative pb-5">
              <span className="absolute -left-[29px] top-1.5 size-2.5 rounded-full bg-ink" />
              <p className="tabular text-[13px] text-muted">9:00</p>
              <p className="text-[16px] font-semibold">Leave Ao Po marina</p>
            </li>
            <AnimatePresence initial={false}>
              {timeline.map(({ s, arrive }) => (
                <motion.li
                  key={s.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="relative overflow-hidden"
                >
                  <div className="pb-5">
                    <span className="absolute -left-[29px] top-1.5 size-2.5 rounded-full bg-accent" />
                    <p className="tabular text-[13px] text-muted">
                      {clock(arrive)} to {clock(arrive + s.hours)}
                    </p>
                    <p className="text-[16px] font-semibold">{s.name}</p>
                    <p className="mt-0.5 max-w-[46ch] text-[14px] leading-relaxed text-muted">
                      {s.note}
                    </p>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
            <motion.li layout className="relative">
              <span className="absolute -left-[29px] top-1.5 size-2.5 rounded-full border-2 border-ink bg-bg" />
              <p
                className={`tabular text-[13px] ${late ? "text-accent" : "text-muted"}`}
              >
                {clock(back)}
              </p>
              <p className="text-[16px] font-semibold">Back at the marina</p>
              {late && (
                <p className="mt-1 text-[14px] text-accent">
                  That is after sunset at 18:20. Drop a stop or take Duean,
                  which is twice as fast.
                </p>
              )}
            </motion.li>
          </ol>

          <fieldset className="mt-10">
            <legend className="text-[13px] text-muted">Boat</legend>
            <div className="mt-3 grid gap-2">
              {boats.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBoat(b)}
                  aria-pressed={boat.id === b.id}
                  className={`grid grid-cols-[1fr_auto] gap-x-4 rounded-lg border px-4 py-3 text-left transition-colors ${boat.id === b.id ? "border-ink bg-ink text-bg" : "border-line hover:border-ink/40"}`}
                >
                  <span className="font-display text-[20px]">{b.name}</span>
                  <span className="tabular text-[14px]">
                    ฿{fmt.format(b.day)} a day
                  </span>
                  <span
                    className={`text-[13px] ${boat.id === b.id ? "text-bg/70" : "text-muted"}`}
                  >
                    {b.type}, up to {b.guests} guests, {b.knots} knots
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <label className="mt-6 block text-[13px] text-muted">
            Guests <span className="text-ink">{g}</span>
            <input
              type="range"
              min={1}
              max={boat.guests}
              value={g}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="mt-3 block w-full accent-[var(--accent)]"
            />
          </label>

          <fieldset className="mt-7">
            <legend className="text-[13px] text-muted">
              Month <span className="text-ink">{monthsLong[month]}</span>, waves
              around {sea[month].wave} m, {sea[month].rain} rainy days
            </legend>
            <div
              className="mt-3 grid grid-cols-12 items-end gap-1"
              role="radiogroup"
              aria-label="Month"
            >
              {months.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={month === i}
                  aria-label={monthsLong[i]}
                  onClick={() => setMonth(i)}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <span className="flex h-14 w-full items-end">
                    <motion.span
                      className={`w-full rounded-t-sm ${month === i ? "bg-accent" : i >= 4 && i <= 9 ? "bg-ink/25 group-hover:bg-ink/40" : "bg-ink/50 group-hover:bg-ink/70"}`}
                      initial={false}
                      animate={{ height: `${(sea[i].wave / 2.1) * 100}%` }}
                    />
                  </span>
                  <span
                    className={`text-[11px] ${month === i ? "text-ink" : "text-muted"}`}
                  >
                    {m[0]}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-7">
            <legend className="text-[13px] text-muted">Add to the day</legend>
            <div className="mt-3 grid gap-2">
              {extras.map((x) => (
                <label
                  key={x.id}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border px-4 py-3 text-[14px] transition-colors ${addons.has(x.id) ? "border-accent" : "border-line hover:border-ink/40"}`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={addons.has(x.id)}
                      onChange={() =>
                        setAddons((a) => {
                          const n = new Set(a);
                          if (n.has(x.id)) n.delete(x.id);
                          else n.add(x.id);
                          return n;
                        })
                      }
                      className="size-4 accent-[var(--accent)]"
                    />
                    <span>
                      {x.name}
                      <span className="block text-[12.5px] text-muted">
                        {x.note}
                      </span>
                    </span>
                  </span>
                  <span className="tabular shrink-0">
                    ฿{fmt.format(x.per ? x.price * g : x.price)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <p
            className={`mt-3 text-[14px] ${monsoon && exposed ? "text-accent" : "text-muted"}`}
          >
            {monsoon
              ? exposed
                ? "Southwest monsoon. Phi Phi and Racha depend on the swell on the day, so we keep a sheltered route in the bay ready."
                : "Southwest monsoon, but the bay stays sheltered. Expect a passing shower."
              : "Dry season. Flat water and 1 m swell at most."}
          </p>

          <dl className="mt-8 space-y-2 border-t border-line pt-5 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-muted">{boat.name}, one day</dt>
              <dd className="tabular">฿{fmt.format(boat.day)}</dd>
            </div>
            {fuel > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Fuel, {nm.toFixed(0)} nm</dt>
                <dd className="tabular">฿{fmt.format(fuel)}</dd>
              </div>
            )}
            {extraCost > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Extras</dt>
                <dd className="tabular">฿{fmt.format(extraCost)}</dd>
              </div>
            )}
            {fees > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">National park fees, {g} guests</dt>
                <dd className="tabular">฿{fmt.format(fees)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-3 text-[16px]">
              <dt>Total for the boat</dt>
              <dd className="tabular font-semibold">฿{fmt.format(total)}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={!order.length}
            className="mt-6 w-full rounded-full bg-accent py-4 text-[15px] font-semibold text-[#0b1d27] transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Ask for this day
          </button>
        </div>
      </section>

      <section
        id="boats"
        className="border-y border-line bg-soft px-[var(--gutter)] py-20"
      >
        <div>
          <h2 className="font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95]">
            Three boats, one crew
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {boats.map((b, i) => (
              <FadeUp key={b.id} delay={i * 0.08}>
                <BoatSide id={b.id} />
                <p className="mt-5 font-display text-[30px]">{b.name}</p>
                <p className="text-[14px] opacity-70">{b.type}</p>
                <p className="mt-3 text-[15px] leading-relaxed opacity-85">
                  {b.desc}
                </p>
                <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-white/15 pt-3 text-[13px]">
                  <div>
                    <dt className="opacity-60">Guests</dt>
                    <dd>{b.guests}</dd>
                  </div>
                  <div>
                    <dt className="opacity-60">Speed</dt>
                    <dd>{b.knots} kn</dd>
                  </div>
                  <div>
                    <dt className="opacity-60">Cabins</dt>
                    <dd>{b.cabins}</dd>
                  </div>
                </dl>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section
        id="aboard"
        className="grid gap-10 px-[var(--gutter)] py-20 lg:grid-cols-[1fr_1.4fr]"
      >
        <div>
          <h2 className="font-display text-[clamp(2.2rem,4.4vw,4rem)] leading-[0.95]">
            Included on every day
          </h2>
          <RevealImage
            photo={photos.resortPool}
            className="mt-10 hidden aspect-[4/5] max-w-[420px] lg:block"
            sizes="30vw"
          />
        </div>
        <ul className="grid gap-x-10 self-start border-t border-line sm:grid-cols-2">
          {[
            [
              "Captain, deckhand and cook",
              "All licensed by the Marine Department and with us for years.",
            ],
            [
              "Lunch on board",
              "Southern Thai dishes cooked fresh. Tell us about allergies when you book.",
            ],
            [
              "Kayaks and paddle boards",
              "Two kayaks and two boards, plus snorkel sets in every size.",
            ],
            [
              "Transfers",
              "Pick-up from anywhere on Phuket and a cold towel at the pier.",
            ],
          ].map(([t, d]) => (
            <li key={t} className="border-b border-line py-5">
              <p className="text-[16px] font-semibold">{t}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="flex flex-col justify-between gap-3 border-t border-line px-[var(--gutter)] pb-24 pt-8 text-[13px] text-muted sm:flex-row sm:pb-8">
        <span>
          Nava Charters, Ao Po Grand Marina, Phuket. TAT licence 34/02415
        </span>
        <span>© 2026 Nava Charters</span>
      </footer>

      <Drawer
        open={open}
        onClose={() => {
          setOpen(false);
          setSent(false);
        }}
        title="Ask for this day"
      >
        {sent ? (
          <p className="py-8 font-display text-[1.9rem] leading-tight">
            Sent. The captain checks the tide and weather for your date and
            replies within a few hours.
          </p>
        ) : (
          <form
            className="grid gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div className="rounded-lg bg-soft p-4 text-[14px]">
              <p className="font-display text-[1.4rem]">
                {boat.name}, {g} guests
              </p>
              <p className="text-muted">
                {order.length
                  ? order.map((s) => s.name).join(", ")
                  : "No stops yet"}
                . Back {clock(back)}.
              </p>
              <p className="tabular mt-1">฿{fmt.format(total)}</p>
            </div>
            {[
              ["Name", "text"],
              ["Email or WhatsApp", "text"],
              ["Date", "date"],
            ].map(([l, t]) => (
              <label key={l} className="grid gap-1.5 text-[13px] text-muted">
                {l}
                <input
                  required
                  type={t}
                  className="border-b border-line bg-transparent py-2 text-[16px] text-ink outline-none focus:border-ink"
                />
              </label>
            ))}
            <button className="mt-2 rounded-full bg-accent py-4 text-[15px] font-semibold text-[#0b1d27]">
              Send
            </button>
          </form>
        )}
      </Drawer>
    </div>
  );
}
