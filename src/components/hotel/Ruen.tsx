"use client";

import Link from "next/link";
import { createContext, useContext, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Photo } from "@/components/shared/Photo";
import { Drawer, HeroSlider, Lightbox, Modal } from "@/components/shared/ui";
import { HorizontalPin, RevealImage, SplitLines, ease, useSmartHeader } from "@/components/shared/motion";
import { photos } from "@/data/images";
import { rooms, spaces, type Room } from "@/data/hotel";
import { getProduct } from "@/data/products";
import { EnquiryForm } from "./Booking";

const fmt = new Intl.NumberFormat("en-US");
const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

type Stay = { checkIn: string; checkOut: string; guests: number };
type Ctx = { stay: Stay; setStay: (s: Stay) => void; open: (withRates?: boolean) => void };
const BookCtx = createContext<Ctx | null>(null);
const useBook = () => useContext(BookCtx)!;

const nightsOf = (s: Stay) => Math.round((Date.parse(s.checkOut) - Date.parse(s.checkIn)) / 86400000) || 0;

export function RuenProvider({ children }: { children: ReactNode }) {
  const [stay, setStay] = useState<Stay>({ checkIn: "2027-01-15", checkOut: "2027-01-18", guests: 2 });
  const [isOpen, setOpen] = useState(false);
  const [rates, setRates] = useState(false);
  const nights = nightsOf(stay);

  return (
    <BookCtx.Provider
      value={{
        stay,
        setStay,
        open: (withRates = false) => {
          setRates(withRates);
          setOpen(true);
        },
      }}
    >
      {children}
      <Drawer open={isOpen} onClose={() => setOpen(false)} title={rates ? "Rooms for your dates" : "Request a stay"} width="max-w-[560px]">
        {rates && (
          <div className="mb-10">
            <p className="text-[15px] text-muted">
              {dateFmt.format(new Date(stay.checkIn))} to {dateFmt.format(new Date(stay.checkOut))}, {nights} {nights === 1 ? "night" : "nights"}, {stay.guests} {stay.guests === 1 ? "guest" : "guests"}
            </p>
            {nights < 1 ? (
              <p className="mt-4 text-[15px]">Choose a leaving date after your arrival date.</p>
            ) : (
              <ul className="mt-5 grid gap-3">
                {rooms
                  .filter((r) => r.sleeps >= stay.guests)
                  .map((r, i) => (
                    <motion.li key={r.slug} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease }} className="flex items-center gap-4 border-b border-line pb-3">
                      <Photo photo={r.photo} position={r.focus} className="aspect-[4/3] w-24 shrink-0" sizes="96px" />
                      <div className="flex-1">
                        <p className="font-display text-[1.35rem] leading-tight">{r.name}</p>
                        <p className="text-[13px] text-muted">{r.count} rooms, breakfast included</p>
                      </div>
                      <p className="tabular text-right text-[15px]">
                        ฿{fmt.format(r.fromThb * nights)}
                        <span className="block text-[12px] text-muted">in total</span>
                      </p>
                    </motion.li>
                  ))}
              </ul>
            )}
            <p className="mt-8 text-[15px] leading-relaxed">Send the form below and we will hold a room while we confirm. Nothing is charged until then.</p>
          </div>
        )}
        {!rates && <p className="mb-6 text-[15px] leading-relaxed text-muted">We hold a room while we confirm. Rates include breakfast, airport transfer and afternoon tea.</p>}
        <EnquiryForm />
      </Drawer>
    </BookCtx.Provider>
  );
}

export function BookButton({ className = "", children = "Book a stay" }: { className?: string; children?: ReactNode }) {
  const { open } = useBook();
  return (
    <button type="button" onClick={() => open()} className={className}>
      {children}
    </button>
  );
}

const nav = [
  { href: "#rooms", label: "Rooms" },
  { href: "#house", label: "The house" },
  { href: "#dining", label: "Dining" },
  { href: "#getting-here", label: "Getting here" },
];

export function RuenHeader() {
  const { hidden, top } = useSmartHeader();
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 text-white transition-[transform,background-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${top ? "" : "bg-[var(--forest)]/92 backdrop-blur-md"} ${
        hidden ? "-translate-y-full" : ""
      }`}
    >
      <div className="grid h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-[var(--gutter)]">
        <nav className="hidden items-center gap-8 text-[14px] md:flex" aria-label="Main">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="opacity-80 transition-opacity hover:opacity-100">
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#top" className="col-start-2 font-display text-[28px] italic leading-none">
          Ruen Doi
        </a>
        <div className="flex justify-end">
          <BookButton className="whitespace-nowrap rounded-full border border-white/40 px-4 py-2 text-[14px] sm:px-5 sm:py-2.5 backdrop-blur-sm transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink" />
        </div>
      </div>
    </header>
  );
}

/** Slow slideshow, title rising in, and a one-line booking bar sitting on the photo. */
export function RuenHero() {
  const { stay, setStay, open } = useBook();
  const input = "w-full bg-transparent text-[16px] text-white outline-none [color-scheme:dark]";

  return (
    <section id="top" className="relative">
      <HeroSlider
        interval={7000}
        className="h-[100svh] min-h-[640px]"
        overlay="bg-[linear-gradient(to_bottom,rgb(12_26_22/0.45)_0%,rgb(12_26_22/0)_28%,rgb(12_26_22/0.05)_55%,rgb(12_26_22/0.8)_100%)]"
        slides={[
          { photo: photos.balconyRattanPods, position: "50% 55%", label: "Lake Room balcony" },
          { photo: photos.lakeRoom, position: "50% 50%", label: "Lake Room" },
          { photo: photos.forestSuite, position: "50% 55%", label: "Forest Suite" },
          { photo: photos.mistyTerrace, position: "50% 50%", label: "Terrace, November" },
        ]}
      >
        <div className="absolute inset-x-0 bottom-0 z-10 px-[var(--gutter)] pb-24 text-white sm:pb-20">
          <motion.p className="text-[14px] opacity-85" initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.9, duration: 1 }}>
            Chiang Rai, 680 metres above sea level
          </motion.p>
          <SplitLines lines={["A small hotel", "above the lake"]} delay={0.3} className="mt-6 font-display text-[clamp(3.2rem,9vw,9.5rem)] font-[400] leading-[0.95] tracking-[-0.02em]" />

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1, ease }}
            onSubmit={(e) => {
              e.preventDefault();
              open(true);
            }}
            className="mt-10 hidden max-w-[980px] grid-cols-[1fr_1fr_0.8fr_auto] items-stretch border border-white/25 bg-white/10 backdrop-blur-md md:grid"
          >
            <label className="grid gap-1 border-r border-white/20 px-5 py-3 text-[12px] text-white/70">
              Arrive
              <input type="date" value={stay.checkIn} onChange={(e) => setStay({ ...stay, checkIn: e.target.value })} className={input} />
            </label>
            <label className="grid gap-1 border-r border-white/20 px-5 py-3 text-[12px] text-white/70">
              Leave
              <input type="date" value={stay.checkOut} min={stay.checkIn} onChange={(e) => setStay({ ...stay, checkOut: e.target.value })} className={input} />
            </label>
            <label className="grid gap-1 px-5 py-3 text-[12px] text-white/70">
              Guests
              <select value={stay.guests} onChange={(e) => setStay({ ...stay, guests: Number(e.target.value) })} className={`${input} [&>option]:text-ink`}>
                {[1, 2, 3].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="bg-accent px-8 text-[15px] font-medium text-accent-ink transition-colors hover:bg-[#ecb658]">
              Check availability
            </button>
          </motion.form>
          <button type="button" onClick={() => open(true)} className="mt-8 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-accent-ink md:hidden">
            Check availability
          </button>
        </div>
      </HeroSlider>
    </section>
  );
}

export function RoomsRail() {
  const [active, setActive] = useState<Room | null>(null);
  const { open } = useBook();
  return (
    <>
      <HorizontalPin
        header={
          <div className="mb-10 grid gap-6 px-[var(--gutter)] lg:grid-cols-12">
            <SplitLines as="h2" inView lines={["Rooms"]} className="font-display text-[clamp(3rem,7vw,7rem)] leading-[0.9] lg:col-span-6" />
            <p className="max-w-[40ch] self-end text-[15px] leading-relaxed text-muted lg:col-span-4 lg:col-start-9">Twenty-four rooms in three kinds. Open one to see the floor plan details and the furniture in it.</p>
          </div>
        }
      >
        {rooms.map((r) => (
          <article key={r.slug} id={`room-${r.slug}`} className="group w-[86vw] shrink-0 snap-start sm:w-[62vw] lg:w-[52vw]">
            <button type="button" onClick={() => setActive(r)} data-cursor="Open" className="block w-full overflow-hidden" aria-label={`${r.name}, details`}>
              <Photo photo={r.photo} position={r.focus} className="aspect-[4/3] w-full lg:aspect-auto lg:h-[54vh]" imgClassName="transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]" sizes="(min-width:1024px) 52vw, 86vw" />
            </button>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-none">{r.name}</h3>
                <p className="mt-2 text-[14px] text-muted">
                  {r.size} m², {r.view.toLowerCase()}
                </p>
              </div>
              <p className="tabular text-[15px]">From ฿{fmt.format(r.fromThb)}</p>
            </div>
          </article>
        ))}
      </HorizontalPin>

      <Modal open={!!active} onClose={() => setActive(null)} label={active?.name ?? "Room"}>
        {active && (
          <div className="grid md:grid-cols-[1.2fr_1fr]">
            <Photo photo={active.photo} position={active.focus} className="aspect-[4/3] w-full md:aspect-auto md:h-full md:min-h-[600px]" sizes="(min-width:768px) 55vw, 100vw" />
            <div className="flex flex-col p-6 sm:p-10">
              <h2 className="font-display text-[clamp(2.2rem,4vw,3.2rem)] leading-none">{active.name}</h2>
              <p className="mt-5 text-[16px] leading-[1.7]">{active.text}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-[14px]">
                {[
                  ["Size", `${active.size} m²`],
                  ["Bed", active.bed],
                  ["Sleeps", String(active.sleeps)],
                  ["View", active.view],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-muted">{k}</dt>
                    <dd className="mt-0.5">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-[13px] text-muted">In the room</p>
              <ul className="mt-2 grid gap-2">
                {active.furniture.map((slug) => {
                  const p = getProduct(slug);
                  return p ? (
                    <li key={slug}>
                      <Link href={`/furniture/${slug}`} className="flex items-center gap-3 text-[14px] hover:underline">
                        <Photo photo={p.photos[0]} position={p.focus} className="size-11 shrink-0" sizes="44px" />
                        {p.name}, Loom &amp; Tide
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
              <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                <span className="tabular text-[15px]">From ฿{fmt.format(active.fromThb)} a night</span>
                <button
                  type="button"
                  onClick={() => {
                    setActive(null);
                    open();
                  }}
                  className="rounded-full bg-[var(--forest)] px-5 py-3 text-[15px] font-medium text-white"
                >
                  Request this room
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export function SpacesGallery() {
  const [i, setI] = useState<number | null>(null);
  const items = spaces.map((s) => ({ photo: s.photo, caption: `${s.name}. ${s.text}` }));
  const frame = ["lg:col-span-7 aspect-[4/3]", "lg:col-span-4 lg:col-start-9 aspect-[4/5] lg:mt-[20vh]", "lg:col-span-5 lg:col-start-2 aspect-[4/5]", "lg:col-span-6 lg:col-start-7 aspect-[4/3] lg:mt-[16vh]"];
  return (
    <>
      <div className="grid gap-y-16 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-24">
        {spaces.map((s, n) => {
          const cls = frame[n % 4].split(" ");
          return (
            <figure key={s.name} className={cls.filter((c) => c.startsWith("lg:")).join(" ")}>
              <button type="button" onClick={() => setI(n)} data-cursor="Expand" className="block w-full" aria-label={`Open ${s.name} full screen`}>
                <RevealImage photo={s.photo} position={s.focus} className={`w-full ${cls.filter((c) => !c.startsWith("lg:")).join(" ")}`} sizes="(min-width: 1024px) 55vw, 100vw" />
              </button>
              <figcaption className="mt-5 grid gap-1 sm:grid-cols-[1fr_1.4fr] sm:gap-6">
                <span className="font-display text-[1.6rem] italic leading-tight">{s.name}</span>
                <span className="max-w-[44ch] text-[15px] leading-relaxed text-muted">{s.text}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <Lightbox items={items} index={i} onClose={() => setI(null)} onIndex={setI} />
    </>
  );
}
