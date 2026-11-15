"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ease, RevealImage, ScrollText, SplitLines } from "@/components/shared/motion";
import { Photo } from "@/components/shared/Photo";
import { photos } from "@/data/images";
import { bySlug, categories, categoryPhoto, finishSwatch, products, projects, thb, type Category, type Product } from "@/data/loom";
import { useQuote } from "./store";
import { base } from "./Chrome";

const wrap = "mx-auto max-w-[1440px] px-[var(--gutter)]";
const btn = "inline-flex items-center justify-center px-6 py-3 text-[14px] transition-[opacity,border-color] hover:opacity-90";

export function ProductCard({ product: p, sizes = "(min-width:1024px) 25vw, 50vw" }: { product: Product; sizes?: string }) {
  const alt = p.photos[1];
  return (
    <Link href={`${base}/products/${p.slug}`} className="group block min-w-0">
      <div className="relative overflow-hidden bg-soft">
        <Photo photo={p.photos[0]} className="aspect-[4/5]" sizes={sizes} position={p.pos} imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
        {alt && (
          <Photo
            photo={alt}
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:hidden"
            sizes={sizes}
          />
        )}
        {p.isNew && <span className="absolute left-0 top-3 bg-[var(--amber)] px-2.5 py-1 text-[12px] font-semibold text-[#16110d]">New</span>}
        <span className="absolute inset-x-0 bottom-0 translate-y-full bg-[var(--amber)] px-3 py-2 text-[13px] font-semibold text-[#16110d] transition-transform duration-300 group-hover:translate-y-0 [@media(hover:none)]:hidden">
          View {p.name}
        </span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3 text-[14px]">
        <span className="min-w-0">
          <span className="font-display font-semibold">{p.name}</span> <span className="text-muted">{p.type}</span>
        </span>
        <span className="tabular shrink-0">{thb(p.price)}</span>
      </div>
      <p className="mt-0.5 text-[13px] text-muted">
        {p.finishes.length} finishes{p.sizes ? `, ${p.sizes.length} sizes` : ""}
      </p>
    </Link>
  );
}

/* ---------------- Home ---------------- */

const blurbFor: Record<Category, string> = {
  Seating: "Dining, desk and lounge chairs in cane and teak",
  Tables: "Side and lounge tables to sit beside them",
  Lighting: "Bell, globe and drum pendants in peeled rattan",
  Outdoor: "UV-stable fibre over aluminium, for pools and terraces",
};

/**
 * The opening is the showroom floor: four rooms side by side. Pointing at one (or tapping it on a phone)
 * opens it up, so the page starts by asking what you came to look at.
 */
function Hero() {
  const [open, setOpen] = useState(0);
  return (
    <section className="px-[var(--gutter)] pb-6 pt-10 sm:pt-14">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-end">
          <SplitLines
            as="h1"
            lines={["Rattan and teak,", "made to order"]}
            delay={0.15}
            className="font-display text-[clamp(2.4rem,4.4vw,4.6rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em] lg:whitespace-nowrap"
          />
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.6, ease }} className="max-w-[40ch] space-y-5 lg:pb-3">
            <p className="text-[15.5px] leading-relaxed text-muted">
              Chairs, tables and pendants from our workshop in Bang Pa-in. Every piece is on the floor of the Charoen Krung showroom, lit the way it will be at home.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={`${base}/shop`} className={`${btn} bg-[var(--amber)] font-semibold text-[#16110d]`}>
                Shop the collection
              </Link>
              <Link href={`${base}/trade`} className={`${btn} border border-line hover:border-ink`}>
                For hotels and restaurants
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-8 flex h-[min(70svh,700px)] min-h-[480px] flex-col gap-2 lg:flex-row" role="list">
          {categories.map((c, i) => {
            const active = open === i;
            const count = products.filter((p) => p.category === c).length;
            return (
              <motion.div
                key={c}
                role="listitem"
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                transition={{ duration: 1.1, delay: 0.25 + i * 0.1, ease }}
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                onClick={() => setOpen(i)}
                className="relative min-h-0 min-w-0 overflow-hidden bg-soft transition-[flex-grow] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
                style={{ flexGrow: active ? 5 : 1, flexBasis: 0 }}
              >
                <Photo photo={categoryPhoto[c]} className="absolute inset-0 h-full w-full" sizes="(min-width:1024px) 60vw, 100vw" priority={i === 0} imgClassName={`transition-transform duration-[1.4s] ${active ? "scale-100" : "scale-110"}`} />
                <div className={`absolute inset-0 transition-colors duration-700 ${active ? "bg-[linear-gradient(to_top,rgb(16_12_9/0.82),rgb(16_12_9/0.1)_60%)]" : "bg-[rgb(16_12_9/0.62)]"}`} />
                <span
                  aria-hidden
                  className={`font-display absolute left-4 top-4 text-[20px] font-bold uppercase tracking-[0.02em] text-[#efe6d6] transition-opacity duration-300 lg:left-1/2 lg:top-6 lg:-translate-x-1/2 lg:[writing-mode:vertical-rl] ${active ? "opacity-0" : "opacity-100"}`}
                >
                  {c}
                </span>
                <div className={`absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-5 text-[#efe6d6] transition-[opacity,transform] duration-500 sm:p-7 ${active ? "translate-y-0 opacity-100 delay-200" : "pointer-events-none translate-y-4 opacity-0"}`}>
                  <div className="min-w-0">
                    <p className="font-display text-[clamp(1.8rem,4vw,3.4rem)] font-bold uppercase leading-none">{c}</p>
                    <p className="mt-2 text-[14px] text-[#efe6d6]/75">
                      {blurbFor[c]}. {count} pieces.
                    </p>
                  </div>
                  <Link href={`${base}/${c.toLowerCase()}`} tabIndex={active ? 0 : -1} className={`${btn} bg-[#efe6d6] font-semibold text-[#16110d]`}>
                    Browse {c.toLowerCase()}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** A slow band of what the workshop works in. */
function Materials() {
  const words = ["Manau rattan", "Peeled cane", "Teak", "Seagrass", "Outdoor fibre", "Linen", "Bamboo"];
  return (
    <div className="overflow-hidden border-y border-line py-5" aria-hidden>
      <div className="font-display flex w-max animate-[wall_44s_linear_infinite] gap-10 whitespace-nowrap pl-10 text-[clamp(1.3rem,2.2vw,2rem)] font-semibold uppercase tracking-[0.01em] text-ink/70">
        {[...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            {w}
            <svg width="16" height="16" viewBox="0 0 16 16" className="text-[var(--amber)]">
              <path d="M8 0v16M0 8h16M2.3 2.3l11.4 11.4M13.7 2.3 2.3 13.7" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

/** New pieces arrive one at a time: each sheet sticks and the next slides over it, pushing it back. */
function NewPieces() {
  const fresh = ["krachao-pendant", "kanok-armchair", "khom-pendant", "talay-bistro-chair"].map((s) => bySlug(s)!);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section className={`${wrap} pt-24`}>
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-[clamp(1.8rem,3.4vw,3rem)] font-bold uppercase leading-none">New this season</h2>
        <Link href={`${base}/shop`} className="text-[14px] underline underline-offset-4">
          View all {products.length}
        </Link>
      </div>
      <div ref={ref} className="mt-8">
        {fresh.map((p, i) => (
          <StackCard key={p.slug} p={p} i={i} n={fresh.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

function StackCard({ p, i, n, progress }: { p: Product; i: number; n: number; progress: MotionValue<number> }) {
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.04]);
  const dim = useTransform(progress, [i / n, Math.min(1, (i + 1) / n)], [0, i === n - 1 ? 0 : 0.45]);
  const { add } = useQuote();
  return (
    <div className="sticky mb-6 h-[min(84svh,640px)]" style={{ top: `calc(5rem + ${i * 18}px)` }}>
      <motion.article style={{ scale }} className="relative grid h-full origin-top grid-rows-[minmax(0,1fr)_auto] overflow-hidden border border-line bg-soft md:grid-cols-[1.15fr_1fr] md:grid-rows-1">
        <Link href={`${base}/products/${p.slug}`} className="relative min-h-0 overflow-hidden" aria-label={`${p.name} ${p.type}`}>
          <Photo photo={p.photos[0]} className="absolute inset-0 h-full w-full" sizes="(min-width:768px) 55vw, 100vw" position={p.pos} />
        </Link>
        <div className="flex min-w-0 flex-col justify-end gap-4 p-5 sm:p-8 md:justify-between">
          <p className="hidden text-[13px] text-muted md:block">
            {p.category}, {p.setting.toLowerCase()}
          </p>
          <div className="space-y-3">
            <h3 className="font-display text-[clamp(2rem,5vw,4.4rem)] font-bold uppercase leading-[0.9]">{p.name}</h3>
            <p className="text-[15px] text-muted">
              {p.type}. {p.material}.
            </p>
            <p className="hidden max-w-[44ch] text-[15px] leading-relaxed text-ink/85 sm:block">{p.blurb}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {p.finishes.map((f) => (
                <span key={f} className="flex items-center gap-1.5 border border-line px-2.5 py-1 text-[12.5px]">
                  <span className="size-3 rounded-full" style={{ background: finishSwatch[f] }} />
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <span className="tabular text-[18px]">From {thb(p.price)}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => add({ slug: p.slug, finish: p.finishes[0], size: p.sizes?.[0]?.label, qty: 1 })} className={`${btn} border border-line hover:border-ink`}>
                Add to quote
              </button>
              <Link href={`${base}/products/${p.slug}`} className={`${btn} bg-[var(--amber)] font-semibold text-[#16110d]`}>
                See the piece
              </Link>
            </div>
          </div>
        </div>
        <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-[#0d0a07]" />
      </motion.article>
    </div>
  );
}

export function Home() {
  return (
    <>
      <Hero />
      <Materials />
      <NewPieces />

      <section className={`${wrap} grid gap-10 pt-28 lg:grid-cols-[1fr_1.2fr] lg:gap-20`}>
        <RevealImage photo={photos.balconyRattanPods} className="aspect-[4/5] overflow-hidden lg:sticky lg:top-24 lg:self-start" sizes="(min-width:1024px) 40vw, 100vw" />
        <div className="space-y-8">
          <ScrollText
            className="font-display text-[clamp(1.6rem,3vw,2.7rem)] font-semibold leading-[1.12]"
            text="Twenty-two weavers in one workshop in Bang Pa-in, most of them together for fifteen years. The rattan is steamed, bent and bound by hand. A dining chair takes about two days."
          />
          <p className="max-w-[52ch] text-[15.5px] leading-relaxed text-muted">
            The cane comes from managed forests in Kalimantan. For outdoor pieces we weave a UV-stable fibre over aluminium the same way, so a chair can live by a pool or the sea.
          </p>
          <dl className="grid grid-cols-3 border-t border-line pt-6">
            {[
              ["2009", "Workshop opened"],
              ["22", "Weavers"],
              ["2 days", "For one dining chair"],
            ].map(([k, v]) => (
              <div key={v}>
                <dt className="sr-only">{v}</dt>
                <dd className="font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-bold">{k}</dd>
                <dd className="mt-1 text-[13px] text-muted">{v}</dd>
              </div>
            ))}
          </dl>
          <Link href={`${base}/about`} className="inline-block text-[14px] underline underline-offset-4">
            About the workshop
          </Link>
        </div>
      </section>

      <section className={`${wrap} pt-28`}>
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-[clamp(1.8rem,3.4vw,3rem)] font-bold uppercase leading-none">Recent projects</h2>
          <Link href={`${base}/projects`} className="text-[14px] underline underline-offset-4">
            All projects
          </Link>
        </div>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {projects.slice(0, 3).map((pr) => (
            <ProjectRow key={pr.name} pr={pr} />
          ))}
        </div>
      </section>

      <TradeBand />
    </>
  );
}

/** Each project is a row; opening it unrolls the photo, so the list stays short until you ask. */
function ProjectRow({ pr }: { pr: (typeof projects)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="group flex w-full items-center gap-4 py-5 text-left sm:gap-8">
        <span className="font-display min-w-0 flex-1 text-[clamp(1.3rem,2.6vw,2.2rem)] font-bold uppercase leading-tight transition-colors group-hover:text-[var(--amber)]">{pr.name}</span>
        <span className="hidden w-[30%] text-[14px] text-muted md:block">{pr.place}</span>
        <span className={`grid size-10 shrink-0 place-items-center border border-line transition-transform duration-500 ${open ? "rotate-45 bg-[var(--amber)] text-[#16110d]" : ""}`} aria-hidden>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" /></svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.6, ease }} className="overflow-hidden">
            <div className="grid gap-5 pb-6 md:grid-cols-[1.4fr_1fr] md:items-end">
              <motion.div initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} transition={{ duration: 0.9, ease }}>
                <Photo photo={pr.photo} className="aspect-[16/9]" sizes="(min-width:768px) 58vw, 100vw" />
              </motion.div>
              <p className="max-w-[40ch] text-[15px] leading-relaxed text-muted">
                {pr.place}. {pr.scope}.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TradeBand() {
  return (
    <section className={`${wrap} pt-28`}>
      <div className="grid gap-8 bg-[var(--amber)] px-6 py-12 text-[#16110d] sm:px-12 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:py-16">
        <div>
          <h2 className="font-display text-[clamp(1.7rem,3.2vw,2.8rem)] font-bold uppercase leading-[0.95]">Furnishing a hotel or restaurant?</h2>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[#16110d]/75">
            Our trade team handles projects from 20 chairs to 400 rooms. You get net pricing, CAD files, finish samples within a week, and a production schedule you can plan around.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link href={`${base}/trade`} className={`${btn} bg-[#16110d] font-semibold text-[#efe6d6]`}>
            Join the trade programme
          </Link>
          <Link href={`${base}/contact`} className={`${btn} border border-[#16110d]/40 hover:border-[#16110d]`}>
            Book a showroom visit
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Shop ---------------- */

const sorts = { featured: "Featured", low: "Price, low to high", high: "Price, high to low" } as const;

export function Shop({ category }: { category?: Category }) {
  const [setting, setSetting] = useState<"All" | "Indoor" | "Outdoor">("All");
  const [sort, setSort] = useState<keyof typeof sorts>("featured");

  const list = useMemo(() => {
    let l = products.filter((p) => !category || p.category === category);
    if (setting !== "All") l = l.filter((p) => p.setting === setting || p.setting === "Indoor and outdoor");
    if (sort !== "featured") l = [...l].sort((a, b) => (sort === "low" ? a.price - b.price : b.price - a.price));
    return l;
  }, [category, setting, sort]);

  const tabs: [string, string][] = [["All", "shop"], ...categories.map((c) => [c, c.toLowerCase()] as [string, string])];

  return (
    <div className={`${wrap} pt-10`}>
      <h1 className="font-display text-[clamp(2.2rem,5vw,4.4rem)] font-bold uppercase leading-[0.95]">{category ?? "All pieces"}</h1>
      <p className="mt-2 max-w-[60ch] text-[15px] text-muted">
        {category === "Lighting"
          ? "Pendants in peeled and flat rattan, wired for E27 LED lamps and supplied with a ceiling rose."
          : category === "Outdoor"
            ? "Woven in UV-stable fibre over aluminium. Made for pool decks, terraces and salt air."
            : category === "Seating"
              ? "Chairs in teak, cane and rattan, for dining rooms, desks and reading corners."
              : category === "Tables"
                ? "Side and lounge tables to go with our chairs."
                : "Everything we make, priced including VAT. Each piece is made to order in our workshop."}
      </p>

      <div className="sticky top-16 z-30 -mx-[var(--gutter)] mt-8 border-y border-line bg-bg/[0.97] px-[var(--gutter)]">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 text-[14px]">
          <nav className="-my-1 flex gap-1 overflow-x-auto [scrollbar-width:none]" aria-label="Categories">
            {tabs.map(([label, slug]) => {
              const active = (category ?? "All") === label;
              return (
                <Link key={slug} href={`${base}/${slug}`} className={`shrink-0 px-3.5 py-1.5 ${active ? "bg-ink text-bg" : "hover:bg-soft"}`}>
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <label className="flex items-center gap-2 text-muted">
              Use
              <select value={setting} onChange={(e) => setSetting(e.target.value as typeof setting)} className="bg-transparent text-ink outline-none">
                <option>All</option>
                <option>Indoor</option>
                <option>Outdoor</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-muted">
              Sort
              <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof sorts)} className="bg-transparent text-ink outline-none">
                {Object.entries(sorts).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <p className="mt-6 text-[13px] text-muted">{list.length === 1 ? "1 piece" : `${list.length} pieces`}</p>
      {list.length ? (
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: Math.min(i, 8) * 0.04, ease } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                transition={{ layout: { duration: 0.6, ease } }}
                className="min-w-0"
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className="mt-10 text-[15px]">
          Nothing in {category?.toLowerCase()} for {setting.toLowerCase()} use yet.{" "}
          <button type="button" onClick={() => setSetting("All")} className="underline underline-offset-4">
            Show all
          </button>
        </p>
      )}
    </div>
  );
}

/* ---------------- Projects ---------------- */

export function Projects() {
  return (
    <div className={`${wrap} pt-10`}>
      <PageHead title="Projects" text="Hotels, villas and restaurants we have furnished. Most started with a showroom visit and a box of samples." />
      <div className="mt-12 space-y-20">
        {projects.map((pr, i) => (
          <article key={pr.name} className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <RevealImage photo={pr.photo} className="aspect-[4/3]" sizes="(min-width:1024px) 50vw, 100vw" />
            <div>
              <p className="text-[14px] text-muted">
                {pr.place}, {pr.year}
              </p>
              <h2 className="font-display uppercase leading-[0.98] mt-1 text-[clamp(1.5rem,2.4vw,2rem)] font-bold">{pr.name}</h2>
              <p className="mt-3 text-[15.5px] text-muted">{pr.scope}.</p>
              <p className="mt-6 text-[14px]">Pieces used</p>
              <ul className="mt-2 divide-y divide-line border-y border-line text-[14px]">
                {pr.pieces.map((s) => {
                  const p = bySlug(s)!;
                  return (
                    <li key={s}>
                      <Link href={`${base}/products/${s}`} className="flex justify-between py-3 hover:underline hover:underline-offset-4">
                        <span>
                          {p.name} {p.type.toLowerCase()}
                        </span>
                        <span className="text-muted">View</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </article>
        ))}
      </div>
      <TradeBand />
    </div>
  );
}

/* ---------------- About ---------------- */

const steps = [
  ["Sorting", "Canes arrive in bundles of 100. About a third are set aside for being too thin, too curved or marked."],
  ["Steaming and bending", "Each cane is steamed for 20 minutes and bent over a jig while hot. It holds the shape once it dries."],
  ["Framing", "Joints are pinned and bound with peeled rattan. No staples are used on any piece you can see."],
  ["Weaving", "Seats, backs and shades are woven by hand. A Thong dining chair back takes about six hours."],
  ["Finishing", "Pieces are sanded, stained if ordered, and given three coats of water-based lacquer."],
];

export function About() {
  return (
    <>
      <div className={`${wrap} pt-10`}>
        <PageHead
          title="About the workshop"
          text="Loom & Tide started in 2009 as a repair shop for old rattan chairs in Bang Pa-in. We began making our own pieces when customers kept asking for more of the ones we fixed."
        />
      </div>
      <div className={`${wrap} mt-10`}>
        <RevealImage photo={photos.courtyardHouse} className="aspect-[16/9] max-h-[640px] w-full" sizes="100vw" position="50% 70%" parallax={10} />
      </div>
      <section className={`${wrap} grid gap-10 pt-20 lg:grid-cols-[1fr_1.4fr] lg:gap-20`}>
        <h2 className="font-display uppercase leading-[0.98] text-[clamp(1.5rem,2.4vw,2rem)] font-bold">How a chair is made</h2>
        <ol className="divide-y divide-line border-y border-line">
          {steps.map(([t, d], i) => (
            <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5 text-[15px]">
              <span className="tabular text-muted">{i + 1}</span>
              <div>
                <p className="font-medium">{t}</p>
                <p className="mt-1 leading-relaxed text-muted">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className={`${wrap} grid gap-10 pt-20 lg:grid-cols-[1fr_1.4fr] lg:gap-20`}>
        <h2 className="font-display uppercase leading-[0.98] text-[clamp(1.5rem,2.4vw,2rem)] font-bold">Repairs and guarantee</h2>
        <div className="max-w-[60ch] space-y-4 text-[15.5px] leading-relaxed text-muted">
          <p>Indoor frames carry a ten-year guarantee. If a joint loosens, we collect the piece in Bangkok and fix it at the workshop.</p>
          <p>Cane seats wear over time. We reweave any Loom &amp; Tide seat or back for the cost of the cane, however old the chair is.</p>
        </div>
      </section>
      <section className={`${wrap} grid gap-4 pt-20 sm:grid-cols-2`}>
        <RevealImage photo={photos.readingCorner} className="aspect-[4/5]" sizes="50vw" />
        <RevealImage photo={photos.trioPendants} className="aspect-[4/5]" sizes="50vw" />
      </section>
    </>
  );
}

/* ---------------- Trade ---------------- */

export function Trade() {
  const [sent, setSent] = useState(false);
  return (
    <div className={`${wrap} pt-10`}>
      <PageHead title="Trade programme" text="For interior designers, architects, hotel groups and restaurant owners. Free to join, with a reply from our trade team within one working day." />
      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <ul className="divide-y divide-line border-y border-line text-[15px]">
            {[
              ["Net pricing", "15% off list on any order, more on volume from 40 pieces."],
              ["Samples in five days", "Cane, rattan and fabric samples sent anywhere in Thailand."],
              ["Drawings", "CAD and 3D files for every piece, plus spec sheets for tenders."],
              ["Custom work", "Sizes, finishes and fabrics changed for projects over 20 pieces."],
              ["Planned production", "A weekly production report and one contact from quote to delivery."],
            ].map(([t, d]) => (
              <li key={t} className="py-4">
                <p className="font-medium">{t}</p>
                <p className="mt-1 text-muted">{d}</p>
              </li>
            ))}
          </ul>
          <Photo photo={photos.mistyTerrace} className="mt-10 aspect-[4/3]" sizes="(min-width:1024px) 50vw, 100vw" />
        </div>
        <FormCard sent={sent} onSent={() => setSent(true)} title="Apply for a trade account" done="Thanks. Our trade team will email you within one working day.">
          <Field label="Name" auto="name" required />
          <Field label="Work email" type="email" auto="email" required />
          <Field label="Company" auto="organization" required />
          <Select label="You are" options={["Interior designer", "Architect", "Hotel or resort", "Restaurant or café", "Developer", "Other"]} />
          <Field label="Current project, if any" area />
        </FormCard>
      </div>
    </div>
  );
}

/* ---------------- Catalogue ---------------- */

const PAGES = 17;
const pageSrc = (i: number) => `/catalogue/page-${String(i + 1).padStart(2, "0")}.webp`;

export function Catalogue() {
  const [i, setI] = useState(0);
  const go = (n: number) => setI(Math.max(0, Math.min(PAGES - 1, n)));
  return (
    <div className={`${wrap} pt-10`}>
      <PageHead title="E-catalogue" text="The 2027 collection in one file: every piece with its sizes, materials, finishes, lead time and price. Flip through it here or download the PDF for your team." />
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_300px] lg:gap-16">
        <div
          className="grid min-w-0 gap-4"
          tabIndex={0}
          aria-label="Catalogue viewer, use the arrow keys to turn pages"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(i + 1);
            if (e.key === "ArrowLeft") go(i - 1);
          }}
        >
          <div className="relative overflow-hidden rounded-[4px] bg-soft shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)]" style={{ aspectRatio: "1754 / 1240" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={i} src={pageSrc(i)} alt={`Catalogue page ${i + 1} of ${PAGES}`} className="absolute inset-0 size-full animate-[fadein_.35s_ease] object-cover" />
            <button onClick={() => go(i - 1)} disabled={i === 0} aria-label="Previous page" className="absolute inset-y-0 left-0 w-1/4 cursor-w-resize disabled:cursor-default" />
            <button onClick={() => go(i + 1)} disabled={i === PAGES - 1} aria-label="Next page" className="absolute inset-y-0 right-0 w-1/4 cursor-e-resize disabled:cursor-default" />
          </div>
          <div className="flex items-center justify-between gap-4 text-[14px]">
            <button onClick={() => go(i - 1)} disabled={i === 0} className="border border-line px-4 py-2 disabled:opacity-30">
              Previous
            </button>
            <span className="tabular text-muted">
              Page {i + 1} of {PAGES}
            </span>
            <button onClick={() => go(i + 1)} disabled={i === PAGES - 1} className="border border-line px-4 py-2 disabled:opacity-30">
              Next
            </button>
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" data-lenis-prevent>
            {Array.from({ length: PAGES }, (_, k) => (
              <button key={k} onClick={() => go(k)} aria-label={`Go to page ${k + 1}`} aria-current={k === i} className={`w-24 shrink-0 overflow-hidden rounded-[3px] border-2 transition-opacity ${k === i ? "border-ink" : "border-transparent opacity-60 hover:opacity-100"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pageSrc(k)} alt="" loading="lazy" className="aspect-[1754/1240] w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <aside className="grid content-start gap-5 lg:sticky lg:top-28 lg:self-start">
          <a href="/catalogue/loom-and-tide-collection-2027.pdf" download className="inline-flex h-12 items-center justify-center bg-ink px-6 text-[15px] text-bg hover:opacity-90">
            Download PDF, 3.7 MB
          </a>
          <p className="text-[14px] leading-relaxed text-muted">17 pages, A4 landscape. Prices include VAT. Trade prices for hotels, restaurants and designers are on the trade programme.</p>
          <Link href={`${base}/trade`} className="text-[14px] underline underline-offset-4">
            Trade programme
          </Link>
          <Link href={`${base}/contact`} className="text-[14px] underline underline-offset-4">
            Ask for a printed copy
          </Link>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- Contact ---------------- */

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className={`${wrap} pt-10`}>
      <PageHead title="Contact and showroom" text="Come and sit in the chairs. The showroom has every piece on display and a table of samples." />
      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="space-y-8 text-[15px]">
          <Photo photo={photos.cafeCaneChairs} className="aspect-[4/3]" sizes="(min-width:1024px) 50vw, 100vw" position="50% 65%" />
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="font-medium">Showroom</p>
              <p className="mt-2 leading-relaxed text-muted">
                1218 Charoen Krung Road
                <br />
                Bang Rak, Bangkok 10500
                <br />
                Five minutes from Saphan Taksin BTS
              </p>
            </div>
            <div>
              <p className="font-medium">Opening hours</p>
              <p className="mt-2 leading-relaxed text-muted">
                Tuesday to Sunday, 10:00 to 19:00
                <br />
                Closed Mondays and public holidays
              </p>
            </div>
            <div>
              <p className="font-medium">Phone and LINE</p>
              <p className="mt-2 leading-relaxed text-muted">
                +66 2 234 4310
                <br />
                LINE @loomandtide
              </p>
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="mt-2 leading-relaxed text-muted">
                hello@loomandtide.co
                <br />
                trade@loomandtide.co
              </p>
            </div>
          </div>
        </div>
        <FormCard sent={sent} onSent={() => setSent(true)} title="Send us a message" done="Thanks. We reply within one working day, usually sooner.">
          <Field label="Name" auto="name" required />
          <Field label="Email" type="email" auto="email" required />
          <Select label="About" options={["An order or quote", "A showroom visit", "A hotel or restaurant project", "Repairs and care", "Press", "Something else"]} />
          <Field label="Message" area required />
        </FormCard>
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <div className={`${wrap} py-32`}>
      <h1 className="font-display uppercase leading-[0.98] text-[2rem] font-bold">We could not find that page</h1>
      <p className="mt-3 text-muted">It may have moved when we updated the collection.</p>
      <Link href={`${base}/shop`} className={`${btn} mt-8 bg-ink text-bg`}>
        Go to the shop
      </Link>
    </div>
  );
}

/* ---------------- Small parts ---------------- */

function PageHead({ title, text }: { title: string; text: string }) {
  return (
    <header className="max-w-[60ch]">
      <h1 className="font-display uppercase leading-[0.98] text-[clamp(1.9rem,3.4vw,2.8rem)] font-bold">{title}</h1>
      <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{text}</p>
    </header>
  );
}

const input = "w-full border border-line bg-bg px-3 py-2.5 text-[15px] outline-none focus:border-ink";

function Field({ label, type = "text", auto, required, area }: { label: string; type?: string; auto?: string; required?: boolean; area?: boolean }) {
  return (
    <label className="block space-y-1.5 text-[14px]">
      <span>
        {label}
        {!required && !area ? <span className="text-muted"> (optional)</span> : null}
      </span>
      {area ? <textarea rows={5} required={required} className={input} /> : <input type={type} required={required} autoComplete={auto} className={input} />}
    </label>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block space-y-1.5 text-[14px]">
      <span>{label}</span>
      <select className={input}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function FormCard({ title, done, sent, onSent, children }: { title: string; done: string; sent: boolean; onSent: () => void; children: ReactNode }) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSent();
  };
  return (
    <div className="self-start bg-soft p-6 sm:p-10">
      <h2 className="font-display uppercase leading-[0.98] text-[20px] font-bold">{title}</h2>
      {sent ? (
        <p className="mt-4 text-[15px]">{done}</p>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          {children}
          <button type="submit" className={`${btn} w-full bg-ink text-bg`}>
            Send
          </button>
        </form>
      )}
    </div>
  );
}
