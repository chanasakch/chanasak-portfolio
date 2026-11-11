"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Photo } from "@/components/shared/Photo";
import { Drawer } from "@/components/shared/ui";
import { FadeUp, RevealImage, SplitLines } from "@/components/shared/motion";
import { photos } from "@/data/images";

const FLOORS = 32;
type Room = [string, number, number, number, number]; // name, x, y, w, h in a 100 x 64 plan
const plans: Record<string, { label: string; sqm: number; base: number; rooms: Room[] }> = {
  "1BR": { label: "One bedroom", sqm: 58, base: 9.8, rooms: [["Living", 0, 0, 58, 40], ["Bedroom", 58, 0, 42, 40], ["Kitchen", 0, 40, 30, 24], ["Bath", 30, 40, 22, 24], ["Balcony", 52, 40, 48, 24]] },
  "2BR": { label: "Two bedrooms", sqm: 96, base: 16.2, rooms: [["Living and dining", 0, 0, 52, 38], ["Main bedroom", 52, 0, 48, 38], ["Kitchen", 0, 38, 26, 26], ["Bedroom", 26, 38, 30, 26], ["Bath", 56, 38, 18, 26], ["Balcony", 74, 38, 26, 26]] },
  "3BR": { label: "Three bedrooms", sqm: 142, base: 24.5, rooms: [["Living", 0, 0, 44, 36], ["Dining", 44, 0, 22, 36], ["Main suite", 66, 0, 34, 36], ["Kitchen", 0, 36, 24, 28], ["Bedroom", 24, 36, 24, 28], ["Bedroom", 48, 36, 22, 28], ["Bath", 70, 36, 14, 28], ["Terrace", 84, 36, 16, 28]] },
};
const units = [
  { id: "A", type: "3BR", faces: "River, north-west" },
  { id: "B", type: "2BR", faces: "River and the old town" },
  { id: "C", type: "1BR", faces: "City, east" },
  { id: "D", type: "2BR", faces: "City and sunrise" },
];
const status = (f: number, u: number) => {
  const v = (f * 7 + u * 13 + f * u) % 10;
  return v < 3 ? "sold" : v < 4 ? "reserved" : "available";
};
const priceOf = (type: string, f: number) => plans[type].base * (1 + (f - 1) * 0.012);
const interior = (f: number) => (f >= 29 ? { photo: photos.indoorPool, label: "Sky residences, floors 29 to 32" } : f >= 19 ? { photo: photos.lakeRoom, label: "High floors, 19 to 28" } : f >= 9 ? { photo: photos.readingCorner, label: "Middle floors, 9 to 18" } : { photo: photos.gardenRoom, label: "Garden floors, 1 to 8" });

export function RimSite() {
  const [floor, setFloor] = useState(24);
  const [hover, setHover] = useState<number | null>(null);
  const [unit, setUnit] = useState<(typeof units)[number] | null>(null);
  const [form, setForm] = useState(false);
  const shown = hover ?? floor;
  const free = (f: number) => units.filter((_, i) => status(f, i) === "available").length;
  const view = interior(floor);

  return (
    <div>
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between bg-bg/80 px-[var(--gutter)] text-[14px] backdrop-blur-md">
        <span className="text-[20px] font-[750] tracking-[-0.04em]">RIM NAM</span>
        <nav className="hidden gap-8 md:flex" aria-label="Main">
          <a href="#residences" className="opacity-70 hover:opacity-100">Residences</a>
          <a href="#life" className="opacity-70 hover:opacity-100">Living here</a>
        </nav>
        <button type="button" onClick={() => setForm(true)} className="rounded-full bg-ink px-5 py-2.5 text-bg">
          Register interest
        </button>
      </header>

      <section id="residences" className="grid min-h-[100svh] gap-10 px-[var(--gutter)] pb-16 pt-28 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col lg:col-span-5">
          <SplitLines lines={["Thirty-two floors", "on the Chao Phraya"]} delay={0.2} className="text-[clamp(2.4rem,4.3vw,4.8rem)] font-[600] leading-[0.92] tracking-[-0.05em]" />
          <p className="mt-6 max-w-[42ch] text-[16px] leading-relaxed text-muted">128 residences on Charoen Krung, completing in 2028. Pick a floor on the tower to see what is left on it.</p>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-ink pt-5 text-[14px]">
            {[["Residences", "128"], ["From", "฿9.8 m"], ["Handover", "Q2 2028"]].map(([k, v]) => (
              <div key={k}>
                <dt className="text-muted">{k}</dt>
                <dd className="mt-1 text-[clamp(1.4rem,2.2vw,2rem)] font-[600] tracking-[-0.03em]">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-auto pt-12">
            <AnimatePresence mode="wait">
              <motion.div key={floor} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <div className="flex items-end justify-between">
                  <p className="text-[clamp(4rem,8vw,7rem)] font-[650] leading-[0.8] tracking-[-0.06em]">
                    {String(floor).padStart(2, "0")}
                    <span className="ml-3 text-[16px] font-normal tracking-normal text-muted">floor</span>
                  </p>
                  <p className="text-[14px] text-muted">{free(floor)} of 4 available</p>
                </div>
                <ul className="mt-6 divide-y divide-ink/15 border-y border-ink/15">
                  {units.map((u, i) => {
                    const s = status(floor, i);
                    return (
                      <li key={u.id}>
                        <button type="button" disabled={s !== "available"} onClick={() => setUnit(u)} data-cursor="Plan" className="group grid w-full grid-cols-[44px_1fr_auto] items-center gap-4 py-3.5 text-left disabled:cursor-default disabled:opacity-40">
                          <span className="text-[15px] font-[600]">{floor}{u.id}</span>
                          <span className="text-[14px]">
                            {plans[u.type].label}, {plans[u.type].sqm} m²
                            <span className="block text-[12px] text-muted">{u.faces}</span>
                          </span>
                          <span className="tabular text-right text-[14px]">
                            {s === "available" ? `฿${priceOf(u.type, floor).toFixed(1)} m` : s === "sold" ? "Sold" : "Reserved"}
                            {s === "available" && <span className="block text-[12px] text-muted transition-colors group-hover:text-ink">View plan</span>}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="relative lg:col-span-3 lg:col-start-7">
          <p className="mb-3 text-[13px] text-muted" aria-live="polite">
            Floor {shown}, {free(shown)} available
          </p>
          <svg viewBox="0 0 120 400" className="h-[62svh] w-full lg:h-[74svh]" role="listbox" aria-label="Choose a floor">
            <path d="M18 400 L18 22 L60 4 L102 22 L102 400" fill="none" stroke="currentColor" strokeOpacity="0.25" />
            {Array.from({ length: FLOORS }, (_, i) => {
              const f = FLOORS - i;
              const y = 24 + i * 11.6;
              const sel = f === floor;
              const hov = f === hover;
              const n = free(f);
              return (
                <g key={f} role="option" aria-selected={sel} tabIndex={0} onMouseEnter={() => setHover(f)} onMouseLeave={() => setHover(null)} onClick={() => setFloor(f)} onKeyDown={(e) => e.key === "Enter" && setFloor(f)} className="cursor-pointer outline-none" data-cursor={`${f}`}>
                  <rect x="22" y={y} width="76" height="9.6" fill="currentColor" fillOpacity={sel ? 1 : hov ? 0.55 : n === 0 ? 0.06 : 0.12 + n * 0.05} style={{ transition: "fill-opacity .3s" }} />
                  {(sel || f % 4 === 0) && (
                    <text x="104" y={y + 7.4} fontSize="6.5" fill="currentColor" fillOpacity={sel ? 1 : 0.5}>
                      {f}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <p className="mt-3 flex items-center gap-3 text-[12px] text-muted">
            <span className="h-2 w-6 bg-ink/30" /> more units free
            <span className="h-2 w-6 bg-ink/[0.06]" /> sold out
          </p>
        </div>

        <div className="lg:col-span-3 lg:col-start-10">
          <div className="relative aspect-[3/4] overflow-hidden lg:sticky lg:top-24">
            <AnimatePresence initial={false}>
              <motion.div key={view.label} className="absolute inset-0" initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}>
                <Photo photo={view.photo} className="h-full w-full" sizes="25vw" />
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-3 text-[13px] text-muted">{view.label}. Show-unit interior.</p>
        </div>
      </section>

      <section id="life" className="border-t border-ink/10 px-[var(--gutter)] py-[16vh]">
        <SplitLines as="h2" inView lines={["A house on the river,", "with thirty-one above it"]} className="max-w-[20ch] text-[clamp(2.4rem,5vw,5rem)] font-[600] leading-[0.95] tracking-[-0.05em]" />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            [photos.indoorPool, "A 25 m pool under glass on the 30th floor"],
            [photos.terraceDining, "A residents' dining room on the river terrace"],
            [photos.courtyardHouse, "The restored shophouse at the gate, now a library"],
          ].map(([ph, cap], i) => (
            <FadeUp key={cap as string} delay={i * 0.1}>
              <RevealImage photo={ph as typeof photos.indoorPool} className={i === 1 ? "aspect-[3/4] w-full md:mt-20" : "aspect-[3/4] w-full"} sizes="33vw" />
              <p className="mt-3 text-[14px] text-muted">{cap as string}</p>
            </FadeUp>
          ))}
        </div>
      </section>

      <footer className="flex flex-col justify-between gap-3 border-t border-ink/10 px-[var(--gutter)] pb-24 pt-8 text-[13px] text-muted sm:flex-row sm:pb-8">
        <span>Sales gallery, 1610 Charoen Krung Road. Daily 10:00 to 19:00</span>
        <span>Concept site. The project is fictional. Interior photos from Pexels.</span>
      </footer>

      <Drawer open={!!unit} onClose={() => setUnit(null)} title={unit ? `Residence ${floor}${unit.id}` : ""} width="max-w-[620px]">
        {unit && <UnitPlan type={unit.type} floor={floor} faces={unit.faces} onReserve={() => { setUnit(null); setForm(true); }} />}
      </Drawer>

      <Drawer open={form} onClose={() => setForm(false)} title="Register interest">
        <RegisterForm />
      </Drawer>
    </div>
  );
}

function UnitPlan({ type, floor, faces, onReserve }: { type: string; floor: number; faces: string; onReserve: () => void }) {
  const p = plans[type];
  const [room, setRoom] = useState<string | null>(null);
  const [down, setDown] = useState(15);
  const price = priceOf(type, floor) * 1e6;
  const deposit = (price * down) / 100;
  const monthly = deposit / 24;
  const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  return (
    <div className="grid gap-8">
      <div>
        <p className="text-[clamp(1.8rem,3vw,2.4rem)] font-[600] leading-none tracking-[-0.04em]">{p.label}, {p.sqm} m²</p>
        <p className="mt-2 text-[14px] text-muted">Faces {faces.toLowerCase()}. Hover a room to see its size.</p>
      </div>
      <svg viewBox="-2 -2 104 68" className="w-full" aria-label={`${p.label} floor plan`}>
        {p.rooms.map(([name, x, y, w, h]) => {
          const on = room === name;
          return (
            <g key={name + x} onMouseEnter={() => setRoom(name)} onMouseLeave={() => setRoom(null)} className="cursor-default">
              <rect x={x} y={y} width={w} height={h} fill="currentColor" fillOpacity={on ? 0.14 : 0.03} stroke="currentColor" strokeWidth="0.8" style={{ transition: "fill-opacity .25s" }} />
              <text x={x + 2.5} y={y + 5.5} fontSize="3.1" fill="currentColor">
                {name}
              </text>
              <text x={x + 2.5} y={y + 9.5} fontSize="2.6" fill="currentColor" fillOpacity="0.55">
                {Math.round(((w * h) / 6400) * p.sqm)} m²
              </text>
            </g>
          );
        })}
      </svg>
      <div className="grid gap-4 border-t border-line pt-6">
        <div className="flex items-baseline justify-between">
          <span className="text-[14px] text-muted">Price</span>
          <span className="tabular text-[1.6rem] font-[600] tracking-[-0.03em]">฿{fmt.format(price)}</span>
        </div>
        <label className="grid gap-2 text-[14px]">
          <span className="flex justify-between text-muted">
            Down payment during construction <span className="tabular text-ink">{down}%</span>
          </span>
          <input type="range" min={10} max={30} step={5} value={down} onChange={(e) => setDown(Number(e.target.value))} className="accent-[var(--ink)]" />
        </label>
        <div className="grid grid-cols-2 gap-4 bg-soft p-4 text-[14px]">
          <div>
            <p className="text-muted">24 monthly payments</p>
            <p className="tabular mt-1 text-[1.2rem] font-[600]">฿{fmt.format(monthly)}</p>
          </div>
          <div>
            <p className="text-muted">On handover</p>
            <p className="tabular mt-1 text-[1.2rem] font-[600]">฿{fmt.format(price - deposit)}</p>
          </div>
        </div>
        <button type="button" onClick={onReserve} className="rounded-full bg-ink py-4 text-[15px] text-bg">
          Reserve this residence
        </button>
      </div>
    </div>
  );
}

function RegisterForm() {
  const [sent, setSent] = useState(false);
  if (sent) return <p className="py-8 text-[18px] leading-relaxed">Thank you. Our sales team will call you within a day to arrange a visit to the show units.</p>;
  return (
    <form className="grid gap-5" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      {[["Name", "text"], ["Email", "email"], ["Phone", "tel"]].map(([l, t]) => (
        <label key={l} className="grid gap-1.5 text-[13px] text-muted">
          {l}
          <input required type={t} className="border-b border-line bg-transparent py-2 text-[16px] text-ink outline-none focus:border-ink" />
        </label>
      ))}
      <button className="mt-2 rounded-full bg-ink py-4 text-[15px] text-bg">Send</button>
    </form>
  );
}
