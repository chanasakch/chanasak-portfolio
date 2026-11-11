"use client";

import Link from "next/link";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Photo } from "@/components/shared/Photo";
import { Drawer, HeroSlider, Lightbox, Modal, Rail, useScrolled } from "@/components/shared/ui";
import { photos } from "@/data/images";
import { rooms, spaces, type Room } from "@/data/hotel";
import { getProduct } from "@/data/products";
import { AvailabilityBar, EnquiryForm } from "./Booking";

const fmt = new Intl.NumberFormat("en-US");

const BookCtx = createContext<(v: boolean) => void>(() => {});
export const useBook = () => useContext(BookCtx);

export function RuenProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <BookCtx.Provider value={setOpen}>
      {children}
      <Drawer open={open} onClose={() => setOpen(false)} title="Request a stay" width="max-w-[560px]">
        <p className="mb-6 text-[15px] leading-relaxed text-muted">We hold a room while we confirm. Rates include breakfast, airport transfer and afternoon tea.</p>
        <EnquiryForm />
      </Drawer>
    </BookCtx.Provider>
  );
}

export function BookButton({ className = "", children = "Book a stay" }: { className?: string; children?: ReactNode }) {
  const setOpen = useBook();
  return (
    <button type="button" onClick={() => setOpen(true)} className={className}>
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
  const scrolled = useScrolled(80);
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${scrolled ? "bg-[var(--forest)]/95 text-white backdrop-blur-md" : "text-white"}`}>
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-8">
        <a href="#top" className="font-display text-[26px] italic leading-none">
          Ruen Doi
        </a>
        <nav className="hidden items-center gap-8 text-[14px] md:flex" aria-label="Main">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="opacity-85 transition-opacity hover:opacity-100">
              {n.label}
            </a>
          ))}
        </nav>
        <BookButton className="rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-accent-ink transition-transform hover:scale-[1.03]" />
      </div>
    </header>
  );
}

export function RuenHero() {
  return (
    <section id="top" className="relative">
      <HeroSlider
        className="h-[100svh] min-h-[640px]"
        overlay="bg-[linear-gradient(to_bottom,rgb(12_26_22/0.5)_0%,rgb(12_26_22/0)_25%,rgb(12_26_22/0.1)_50%,rgb(12_26_22/0.85)_100%)]"
        slides={[
          { photo: photos.balconyRattanPods, position: "50% 55%", label: "Lake Room balcony" },
          { photo: photos.lakeRoom, position: "50% 50%", label: "Lake Room" },
          { photo: photos.forestSuite, position: "50% 55%", label: "Forest Suite" },
          { photo: photos.mistyTerrace, position: "50% 50%", label: "Terrace, November" },
        ]}
      >
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-4 pb-36 text-white sm:px-8 sm:pb-28">
          <p className="text-[14px] opacity-85">Chiang Rai, 680 m above sea level</p>
          <h1 className="mt-3 max-w-[14ch] font-display text-[clamp(3rem,8vw,7.5rem)] font-[400] leading-[0.92]">A small hotel above the lake</h1>
        </div>
      </HeroSlider>
      <div className="relative z-20 mx-auto -mt-24 max-w-[1200px] px-4 sm:-mt-16 sm:px-8">
        <AvailabilityBar />
      </div>
    </section>
  );
}

export function RoomsRail() {
  const [open, setOpen] = useState<Room | null>(null);
  const book = useBook();
  return (
    <>
      <Rail label="Rooms">
        {rooms.map((r) => (
          <article key={r.slug} id={`room-${r.slug}`} className="group w-[86vw] shrink-0 snap-start scroll-mt-24 sm:w-[64vw] lg:w-[46vw]">
            <button type="button" onClick={() => setOpen(r)} className="block w-full overflow-hidden text-left" aria-label={`${r.name}, details`}>
              <Photo photo={r.photo} position={r.focus} className="aspect-[4/3] w-full" imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]" sizes="(min-width:1024px) 46vw, 86vw" />
            </button>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none">{r.name}</h3>
                <p className="mt-2 text-[14px] text-muted">
                  {r.size} m², {r.bed.toLowerCase()}, {r.view.toLowerCase()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="tabular text-[15px]">From ฿{fmt.format(r.fromThb)}</span>
                <button type="button" onClick={() => setOpen(r)} className="rounded-full border border-ink/25 px-4 py-2 text-[14px] transition-colors hover:border-ink">
                  View room
                </button>
              </div>
            </div>
          </article>
        ))}
      </Rail>

      <Modal open={!!open} onClose={() => setOpen(null)} label={open?.name ?? "Room"}>
        {open && (
          <div className="grid md:grid-cols-[1.2fr_1fr]">
            <Photo photo={open.photo} position={open.focus} className="aspect-[4/3] w-full md:aspect-auto md:h-full md:min-h-[600px]" sizes="(min-width:768px) 55vw, 100vw" />
            <div className="flex flex-col p-6 sm:p-10">
              <h2 className="font-display text-[clamp(2.2rem,4vw,3.2rem)] leading-none">{open.name}</h2>
              <p className="mt-5 text-[16px] leading-[1.7]">{open.text}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-[14px]">
                {[
                  ["Size", `${open.size} m²`],
                  ["Bed", open.bed],
                  ["Sleeps", String(open.sleeps)],
                  ["View", open.view],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-muted">{k}</dt>
                    <dd className="mt-0.5">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-[13px] text-muted">In the room</p>
              <ul className="mt-2 grid gap-2">
                {open.furniture.map((slug) => {
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
                <span className="tabular text-[15px]">From ฿{fmt.format(open.fromThb)} a night</span>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(null);
                    book(true);
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
  const layout = ["md:col-span-7 aspect-[4/3]", "md:col-span-5 aspect-[4/5] md:mt-24", "md:col-span-5 aspect-[4/5]", "md:col-span-7 aspect-[4/3] md:mt-24"];
  return (
    <>
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-12">
        {spaces.map((s, n) => (
          <figure key={s.name} className={layout[n % 4].split(" ").filter((c) => c.startsWith("md:")).join(" ")}>
            <button type="button" onClick={() => setI(n)} className="group block w-full cursor-zoom-in overflow-hidden" aria-label={`Open ${s.name} full screen`}>
              <Photo photo={s.photo} position={s.focus} className={`w-full ${layout[n % 4].split(" ").filter((c) => !c.startsWith("md:")).join(" ")}`} imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]" sizes="(min-width: 768px) 55vw, 100vw" />
            </button>
            <figcaption className="mt-4">
              <span className="block font-display text-[1.6rem] italic leading-tight">{s.name}</span>
              <span className="mt-1 block max-w-[44ch] text-[15px] leading-relaxed text-muted">{s.text}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <Lightbox items={items} index={i} onClose={() => setI(null)} onIndex={setI} />
    </>
  );
}
