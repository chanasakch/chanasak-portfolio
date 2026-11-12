"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Drawer } from "@/components/shared/ui";
import {
  ease,
  RevealImage,
  SplitLines,
  useFinePointer,
} from "@/components/shared/motion";
import { Photo } from "@/components/shared/Photo";
import { photos } from "@/data/images";

type Coffee = {
  id: string;
  name: string;
  farm: string;
  place: string;
  alt: number;
  process: string;
  roast: string;
  notes: string;
  price: number;
  x: number;
  y: number;
  profile: [number, number, number, number, number, number];
};
const axes = ["Acidity", "Sweetness", "Body", "Fruit", "Floral", "Chocolate"];
const coffees: Coffee[] = [
  {
    id: "doi-chang",
    name: "Doi Chang",
    farm: "Akha cooperative",
    place: "Mae Suai, Chiang Rai",
    alt: 1450,
    process: "Natural",
    roast: "Light",
    notes: "Strawberry jam, cacao nib, long finish",
    price: 520,
    x: 34,
    y: 30,
    profile: [3, 4, 3, 5, 2, 3],
  },
  {
    id: "pang-khon",
    name: "Pang Khon",
    farm: "Ja Pae's terraces",
    place: "Mueang, Chiang Rai",
    alt: 1300,
    process: "Honey",
    roast: "Light medium",
    notes: "Brown sugar, apricot, black tea",
    price: 480,
    x: 56,
    y: 22,
    profile: [3, 5, 3, 3, 3, 2],
  },
  {
    id: "pha-hom-pok",
    name: "Doi Pha Hom Pok",
    farm: "Lahu growers, Fang",
    place: "Fang, Chiang Mai",
    alt: 1650,
    process: "Anaerobic washed",
    roast: "Light",
    notes: "Jasmine, lime zest, white grape",
    price: 690,
    x: 18,
    y: 52,
    profile: [5, 3, 2, 4, 5, 1],
  },
  {
    id: "mae-chan",
    name: "Mae Chan Tai",
    farm: "Lisu family farms",
    place: "Mae Suai, Chiang Rai",
    alt: 1200,
    process: "Washed",
    roast: "Medium",
    notes: "Milk chocolate, roasted almond, orange",
    price: 420,
    x: 44,
    y: 62,
    profile: [2, 4, 4, 2, 1, 5],
  },
  {
    id: "bo-kluea",
    name: "Bo Kluea",
    farm: "Hmong growers",
    place: "Bo Kluea, Nan",
    alt: 1100,
    process: "Washed",
    roast: "Medium dark",
    notes: "Dark chocolate, molasses, cedar",
    price: 390,
    x: 78,
    y: 70,
    profile: [1, 3, 5, 1, 1, 5],
  },
];

const methods = [
  {
    id: "pour",
    name: "Pour-over",
    ratio: 16,
    grind: "Medium fine, like table salt",
    grindPx: 3,
    secs: 180,
    steps: [
      [0, "Bloom with 2× the coffee weight in water"],
      [45, "Pour slowly to 60%"],
      [75, "Pour to the full weight"],
      [120, "Let it draw down"],
    ] as [number, string][],
  },
  {
    id: "aero",
    name: "AeroPress",
    ratio: 14,
    grind: "Fine, just coarser than espresso",
    grindPx: 2,
    secs: 120,
    steps: [
      [0, "Add all the water and stir 10 times"],
      [60, "Cap and flip onto the cup"],
      [90, "Press slowly for 30 seconds"],
    ] as [number, string][],
  },
  {
    id: "press",
    name: "French press",
    ratio: 15,
    grind: "Coarse, like sea salt",
    grindPx: 5,
    secs: 240,
    steps: [
      [0, "Add all the water"],
      [60, "Break the crust and skim"],
      [210, "Press gently and pour straight away"],
    ] as [number, string][],
  },
  {
    id: "cold",
    name: "Cold brew",
    ratio: 8,
    grind: "Coarse",
    grindPx: 5,
    secs: 0,
    steps: [] as [number, string][],
  },
];

const fmt = new Intl.NumberFormat("en-US");

/** Contour rings around a few peaks, wobbled so they read like a survey map. */
function ring(cx: number, cy: number, r: number, seed: number) {
  const pts: string[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const k =
      1 +
      0.16 * Math.sin(3 * a + seed) +
      0.08 * Math.sin(5 * a + seed * 2.3) +
      0.05 * Math.sin(9 * a + seed * 0.7);
    pts.push(
      `${(cx + Math.cos(a) * r * k * 1.25).toFixed(1)},${(cy + Math.sin(a) * r * k).toFixed(1)}`,
    );
  }
  return `M${pts.join("L")}Z`;
}
const peaks = [
  [34, 30, 7, 1.1],
  [56, 22, 5, 2.4],
  [18, 52, 8, 0.4],
  [44, 64, 5, 3.3],
  [78, 70, 6, 5.1],
  [72, 34, 4, 4.2],
  [90, 18, 3, 1.9],
];

function FarmMap({
  active,
  onPick,
}: {
  active: Coffee;
  onPick: (c: Coffee) => void;
}) {
  const lines = useMemo(
    () =>
      peaks.flatMap(([x, y, n, s], p) =>
        Array.from({ length: n }, (_, i) => ({
          d: ring(x, y, 2.2 + i * 2.3, s + i * 0.35),
          k: `${p}-${i}`,
          major: i % 3 === 0,
          delay: p * 0.12 + i * 0.05,
        })),
      ),
    [],
  );
  return (
    <svg
      viewBox="0 0 100 86"
      className="h-auto w-full touch-manipulation"
      role="img"
      aria-label="Map of the farms across northern Thailand"
    >
      <rect width="100" height="86" fill="var(--soft)" />
      {lines.map((l) => (
        <motion.path
          key={l.k}
          d={l.d}
          fill="none"
          stroke="var(--ink)"
          strokeOpacity={l.major ? 0.38 : 0.18}
          strokeWidth={l.major ? 0.22 : 0.14}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: l.delay, ease }}
        />
      ))}
      <path
        d="M2 80 C 20 70, 30 78, 46 74 S 70 82, 98 76"
        fill="none"
        stroke="#5b8aa6"
        strokeWidth="0.5"
        strokeOpacity="0.7"
      />
      <text x="70" y="83" fontSize="2.2" fill="#5b8aa6">
        Mekong
      </text>
      {coffees.map((c) => {
        const on = c.id === active.id;
        return (
          <g
            key={c.id}
            onClick={() => onPick(c)}
            className="cursor-pointer"
            role="button"
            aria-label={`${c.name}, ${c.alt} metres`}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onPick(c)}
          >
            <circle cx={c.x} cy={c.y} r="4.5" fill="transparent" />
            {on && (
              <motion.circle
                cx={c.x}
                cy={c.y}
                r="1.6"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="0.3"
                initial={{ r: 1.6, opacity: 1 }}
                animate={{ r: 5, opacity: 0 }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            )}
            <circle
              cx={c.x}
              cy={c.y}
              r={on ? 1.5 : 1.1}
              fill={on ? "var(--accent)" : "var(--ink)"}
            />
            <text
              x={c.x + 2.4}
              y={c.y - 1.2}
              fontSize="2.6"
              fill="var(--ink)"
              fontWeight={on ? 600 : 400}
            >
              {c.name}
            </text>
            <text x={c.x + 2.4} y={c.y + 1.9} fontSize="2" fill="var(--muted)">
              {fmt.format(c.alt)} m
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Radar({ profile, color }: { profile: number[]; color: string }) {
  const pt = (v: number, i: number) => {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return `${(50 + Math.cos(a) * v * 8).toFixed(2)},${(50 + Math.sin(a) * v * 8).toFixed(2)}`;
  };
  return (
    <svg
      viewBox="-12 -4 124 108"
      className="h-auto w-full max-w-[340px]"
      role="img"
      aria-label={axes.map((a, i) => `${a} ${profile[i]} of 5`).join(", ")}
    >
      {[1, 2, 3, 4, 5].map((r) => (
        <polygon
          key={r}
          points={axes.map((_, i) => pt(r, i)).join(" ")}
          fill="none"
          stroke="var(--ink)"
          strokeOpacity={r === 5 ? 0.25 : 0.1}
          strokeWidth="0.4"
        />
      ))}
      {axes.map((a, i) => {
        const [x, y] = pt(6.1, i).split(",").map(Number);
        return (
          <text
            key={a}
            x={x}
            y={y + 1.2}
            fontSize="4.2"
            textAnchor="middle"
            fill="var(--muted)"
          >
            {a}
          </text>
        );
      })}
      <motion.polygon
        initial={false}
        animate={{ points: profile.map(pt).join(" ") }}
        transition={{ duration: 0.8, ease }}
        fill={color}
        fillOpacity="0.22"
        stroke={color}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Brew() {
  const [m, setM] = useState(methods[0]);
  const [cups, setCups] = useState(2);
  const [t, setT] = useState<number | null>(null);
  const timer = useRef<number | null>(null);
  const water = cups * 240;
  const grams = Math.round((water / m.ratio) * 10) / 10;

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );
  const start = () => {
    if (timer.current) clearInterval(timer.current);
    const t0 = Date.now();
    setT(0);
    timer.current = window.setInterval(() => {
      const s = (Date.now() - t0) / 1000;
      if (s >= m.secs) {
        setT(m.secs);
        clearInterval(timer.current!);
        timer.current = null;
      } else setT(s);
    }, 200);
  };
  const reset = (nm: (typeof methods)[number]) => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setT(null);
    setM(nm);
  };
  const step =
    t === null ? null : [...m.steps].reverse().find(([at]) => t >= at);
  const p = t === null || !m.secs ? 0 : t / m.secs;
  const mmss = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
      <div>
        <div className="flex flex-wrap gap-2">
          {methods.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => reset(x)}
              aria-pressed={m.id === x.id}
              className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${m.id === x.id ? "border-ink bg-ink text-bg" : "border-line hover:border-ink/40"}`}
            >
              {x.name}
            </button>
          ))}
        </div>
        <label className="mt-8 block text-[14px] text-muted">
          Cups <span className="text-ink">{cups}</span>
          <input
            type="range"
            min={1}
            max={6}
            value={cups}
            onChange={(e) => setCups(Number(e.target.value))}
            className="mt-3 block w-full accent-[var(--ink)]"
          />
        </label>
        <dl className="mt-8 grid grid-cols-3 border-y border-line text-[14px]">
          {[
            ["Coffee", `${grams} g`],
            ["Water", `${water} ml`],
            ["Ratio", `1 : ${m.ratio}`],
          ].map(([k, v]) => (
            <div
              key={k}
              className="border-r border-line py-4 pr-3 last:border-r-0 [&:not(:first-child)]:pl-4"
            >
              <dt className="text-muted">{k}</dt>
              <dd className="tabular mt-1 text-[22px] tracking-[-0.01em]">
                {v}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-6 flex items-center gap-4 text-[14px]">
          <div className="flex items-end gap-[3px]" aria-hidden>
            {Array.from({ length: 9 }, (_, i) => (
              <span
                key={i}
                className="rounded-full bg-ink/80"
                style={{
                  width: m.grindPx + (i % 3),
                  height: m.grindPx + ((i * 7) % 3),
                }}
              />
            ))}
          </div>
          <span className="text-muted">{m.grind}</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-sm bg-soft p-8 text-center">
        {m.secs ? (
          <>
            <div className="relative size-52">
              <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="var(--ink)"
                  strokeOpacity="0.1"
                  strokeWidth="3"
                />
                {m.steps.map(([at]) => {
                  const a = (at / m.secs) * Math.PI * 2;
                  return (
                    <circle
                      key={at}
                      cx={50 + Math.cos(a) * 44}
                      cy={50 + Math.sin(a) * 44}
                      r="1.6"
                      fill="var(--ink)"
                      fillOpacity="0.4"
                    />
                  );
                })}
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - p}
                  style={{ transition: "stroke-dashoffset 0.2s linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="tabular text-[40px] tracking-[-0.02em]">
                  {mmss(t ?? 0)}
                </span>
                <span className="text-[13px] text-muted">
                  of {mmss(m.secs)}
                </span>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={step ? step[1] : "idle"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="mt-6 min-h-[3em] max-w-[30ch] text-[16px]"
              >
                {t === null
                  ? `Heat ${water} ml of water to 93°C, then start.`
                  : t >= m.secs
                    ? "Done. Swirl and pour."
                    : step?.[1]}
              </motion.p>
            </AnimatePresence>
            <button
              type="button"
              onClick={start}
              className="mt-4 rounded-full bg-accent px-6 py-3 text-[14px] text-[#15100d]"
            >
              {t === null ? "Start the timer" : "Start again"}
            </button>
          </>
        ) : (
          <p className="max-w-[32ch] text-[17px] leading-relaxed">
            Stir {grams} g of coffee into {water} ml of cold water, cover, and
            leave in the fridge for 14 hours. Strain and dilute 1 : 1 with water
            or milk.
          </p>
        )}
      </div>
    </div>
  );
}

function Hero() {
  const fine = useFinePointer();
  return (
    <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 3, ease }}
      >
        <Photo
          photo={photos.mistyTerrace}
          className="h-full w-full"
          priority
          position="50% 40%"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#15100d_2%,rgb(21_16_13/0.55)_45%,rgb(21_16_13/0.2))]" />
      <div className="absolute inset-x-0 bottom-0 px-[var(--gutter)] pb-24 sm:pb-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-[13px] tracking-[0.04em] text-accent"
        >
          Chiang Rai, Chiang Mai and Nan
        </motion.p>
        <SplitLines
          lines={["Grown above", "1,100 metres"]}
          delay={0.4}
          className="mt-4 font-display text-[clamp(3rem,8vw,8rem)] font-light leading-[0.9] tracking-[-0.03em]"
        />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease }}
          className="mt-8 flex flex-wrap items-center gap-6"
        >
          <a
            href="#coffees"
            className="rounded-full bg-accent px-7 py-3.5 text-[14px] text-[#15100d] transition-transform hover:scale-[1.03]"
          >
            Shop this harvest
          </a>
          <p className="max-w-[40ch] text-[14px] leading-relaxed text-ink/75">
            Roasted every Monday in Chiang Rai and shipped the same week.
          </p>
        </motion.div>
      </div>
      {fine && (
        <span className="absolute bottom-6 right-[var(--gutter)] text-[12px] text-ink/50">
          Scroll
        </span>
      )}
    </section>
  );
}

export function CoffeeSite() {
  const [coffee, setCoffee] = useState(coffees[0]);
  const [cart, setCart] = useState<
    { id: string; qty: number; grind: string }[]
  >([]);
  const [grind, setGrind] = useState("Whole bean");
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState({ size: 1, weeks: 2 });
  const [done, setDone] = useState(false);
  const count = cart.reduce((n, l) => n + l.qty, 0);
  const total = cart.reduce(
    (n, l) => n + l.qty * coffees.find((c) => c.id === l.id)!.price,
    0,
  );
  const subPrice = Math.round(coffee.price * [1, 1.9, 3.6][sub.size - 1] * 0.9);

  const add = () => {
    setCart((c) => {
      const i = c.findIndex((l) => l.id === coffee.id && l.grind === grind);
      return i < 0
        ? [...c, { id: coffee.id, qty: 1, grind }]
        : c.map((l, j) => (j === i ? { ...l, qty: l.qty + 1 } : l));
    });
    setOpen(true);
  };

  return (
    <div>
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-bg/70 px-[var(--gutter)] text-[14px] backdrop-blur-md">
        <span className="font-display text-[22px] tracking-[-0.01em]">
          Sung Coffee
        </span>
        <nav className="hidden gap-7 md:flex">
          <a href="#farms" className="text-muted hover:text-ink">
            Farms
          </a>
          <a href="#brew" className="text-muted hover:text-ink">
            Brew guide
          </a>
          <a href="#subscribe" className="text-muted hover:text-ink">
            Subscribe
          </a>
        </nav>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2"
        >
          Cart{" "}
          <span className="tabular flex size-6 items-center justify-center rounded-full bg-accent text-[12px] text-[#15100d]">
            {count}
          </span>
        </button>
      </header>

      <Hero />

      <section
        id="farms"
        className="grid gap-10 px-[var(--gutter)] pb-20 pt-24 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-14 lg:pt-16"
      >
        <div className="min-w-0">
          <SplitLines
            as="h2"
            inView
            lines={["Five farms,", "one ridge of hills"]}
            className="font-display text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-[0.98] tracking-[-0.02em]"
          />
          <p className="mt-6 max-w-[44ch] text-[16px] leading-relaxed text-muted">
            Five farms in the hills of Chiang Rai, Chiang Mai and Nan. We buy
            the whole harvest at a fixed price, roast on Mondays in Chiang Rai
            and ship the same week.
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={coffee.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease }}
              className="mt-10 border-t border-line pt-6"
            >
              <p className="text-[13px] text-muted">
                {coffee.place}, {fmt.format(coffee.alt)} m
              </p>
              <h3 className="mt-1 font-display text-[32px] tracking-[-0.01em]">
                {coffee.name}
              </h3>
              <p className="mt-1 text-[15px]">{coffee.notes}</p>
              <p className="mt-1 text-[14px] text-muted">
                {coffee.process}, {coffee.roast.toLowerCase()} roast.{" "}
                {coffee.farm}.
              </p>
              <a
                href="#coffees"
                className="mt-4 inline-block text-[14px] underline underline-offset-4"
              >
                Taste profile and price
              </a>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="min-w-0 overflow-hidden rounded-sm">
          <FarmMap active={coffee} onPick={setCoffee} />
        </div>
      </section>

      <section
        id="coffees"
        className="border-t border-line px-[var(--gutter)] py-20"
      >
        <h2 className="font-display text-[clamp(2.2rem,4.4vw,4rem)] font-light tracking-[-0.02em]">
          This harvest
        </h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <ul className="divide-y divide-line border-y border-line">
            {coffees.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setCoffee(c)}
                  aria-pressed={coffee.id === c.id}
                  className="grid w-full grid-cols-[1fr_auto] items-baseline gap-x-4 py-4 text-left"
                >
                  <span
                    className={`font-display text-[24px] transition-colors ${coffee.id === c.id ? "text-ink" : "text-ink/55"}`}
                  >
                    {coffee.id === c.id && (
                      <motion.span
                        layoutId="dot"
                        className="mr-2 inline-block size-2 -translate-y-1 rounded-full bg-accent"
                      />
                    )}
                    {c.name}
                  </span>
                  <span className="tabular text-[15px]">฿{c.price}</span>
                  <span className="col-span-2 text-[14px] text-muted">
                    {c.process}, {fmt.format(c.alt)} m. {c.notes}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center gap-6 lg:items-start">
            <Radar profile={coffee.profile} color="var(--accent)" />
            <div className="w-full max-w-[420px]">
              <div className="flex flex-wrap gap-2">
                {["Whole bean", "Filter grind", "Espresso grind"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrind(g)}
                    aria-pressed={grind === g}
                    className={`rounded-full border px-3.5 py-1.5 text-[13px] ${grind === g ? "border-ink bg-ink text-bg" : "border-line"}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={add}
                className="mt-5 w-full rounded-full bg-accent py-3.5 text-[15px] text-[#15100d] transition-opacity hover:opacity-90"
              >
                Add {coffee.name}, 250 g, ฿{coffee.price}
              </button>
              <p className="mt-2 text-[13px] text-muted">
                Roasted on Monday, shipped by Wednesday. Free delivery over
                ฿1,000.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="brew"
        className="border-t border-line px-[var(--gutter)] py-20"
      >
        <h2 className="mb-10 font-display text-[clamp(2.2rem,4.4vw,4rem)] font-light tracking-[-0.02em]">
          Brew guide
        </h2>
        <Brew />
      </section>

      <section
        id="subscribe"
        className="bg-ink px-[var(--gutter)] py-20 text-bg"
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr_0.8fr] lg:items-center lg:gap-14">
          <RevealImage
            photo={photos.mugsPair}
            className="aspect-[4/3] lg:order-3"
            sizes="(min-width:1024px) 28vw, 100vw"
          />
          <div>
            <h2 className="font-display text-[clamp(2.2rem,4.4vw,4rem)] font-light leading-[1] tracking-[-0.02em]">
              Never run out
            </h2>
            <p className="mt-4 max-w-[42ch] text-[16px] leading-relaxed text-bg/70">
              Fresh {coffee.name} on your doorstep, 10% under the shop price.
              Skip or change coffee any time from the email we send before each
              roast.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {["250 g", "500 g", "1 kg"].map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSub((x) => ({ ...x, size: i + 1 }))}
                  aria-pressed={sub.size === i + 1}
                  className={`rounded-full border px-4 py-2 text-[14px] ${sub.size === i + 1 ? "border-bg bg-bg text-ink" : "border-bg/25"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {[2, 4].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setSub((x) => ({ ...x, weeks: w }))}
                  aria-pressed={sub.weeks === w}
                  className={`rounded-full border px-4 py-2 text-[14px] ${sub.weeks === w ? "border-bg bg-bg text-ink" : "border-bg/25"}`}
                >
                  Every {w} weeks
                </button>
              ))}
            </div>
            <p className="tabular text-[15px] text-bg/70">
              <span className="text-[30px] tracking-[-0.02em] text-bg">
                ฿{fmt.format(subPrice)}
              </span>{" "}
              a delivery, about ฿
              {fmt.format(Math.round((subPrice * 52) / sub.weeks / 12))} a month
            </p>
            <button
              type="button"
              onClick={() => setDone(true)}
              className="rounded-full bg-[#15100d] px-6 py-3.5 text-[14px] text-[#efe4d2]"
            >
              {done
                ? "Subscribed. First roast ships next Wednesday"
                : "Start the subscription"}
            </button>
          </div>
        </div>
      </section>

      <footer className="flex flex-col justify-between gap-3 px-[var(--gutter)] pb-24 pt-8 text-[13px] text-muted sm:flex-row sm:pb-8">
        <span>
          Roastery at 41 Phahonyothin Road, Mueang Chiang Rai. Open daily, 8:00
          to 17:00
        </span>
        <span>© 2026 Sung Coffee</span>
      </footer>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Your cart"
        footer={
          cart.length ? (
            <div className="space-y-3">
              <div className="flex justify-between text-[15px]">
                <span>Total</span>
                <span className="tabular">฿{fmt.format(total)}</span>
              </div>
              <p className="text-[13px] text-muted">
                {total >= 1000
                  ? "Free delivery."
                  : `฿${fmt.format(1000 - total)} more for free delivery.`}
              </p>
              <button
                type="button"
                className="w-full rounded-full bg-accent py-3.5 text-[15px] text-[#15100d]"
              >
                Check out
              </button>
            </div>
          ) : null
        }
      >
        {cart.length === 0 ? (
          <p className="text-[15px] text-muted">
            Nothing here yet. Pick a coffee from this harvest.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {cart.map((l, i) => {
              const c = coffees.find((x) => x.id === l.id)!;
              return (
                <li
                  key={`${l.id}-${l.grind}`}
                  className="flex items-center justify-between gap-4 py-4 text-[14px]"
                >
                  <div>
                    <p className="font-semibold">{c.name}, 250 g</p>
                    <p className="text-muted">{l.grind}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="One fewer"
                      onClick={() =>
                        setCart((x) =>
                          x.flatMap((y, j) =>
                            j === i
                              ? y.qty > 1
                                ? [{ ...y, qty: y.qty - 1 }]
                                : []
                              : [y],
                          ),
                        )
                      }
                      className="size-8 rounded-full border border-line"
                    >
                      −
                    </button>
                    <span className="tabular w-4 text-center">{l.qty}</span>
                    <button
                      type="button"
                      aria-label="One more"
                      onClick={() =>
                        setCart((x) =>
                          x.map((y, j) =>
                            j === i ? { ...y, qty: y.qty + 1 } : y,
                          ),
                        )
                      }
                      className="size-8 rounded-full border border-line"
                    >
                      +
                    </button>
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
