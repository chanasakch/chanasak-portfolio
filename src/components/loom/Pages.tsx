"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ease, RevealImage, SplitLines, useFinePointer } from "@/components/shared/motion";
import { Photo } from "@/components/shared/Photo";
import { photos } from "@/data/images";
import { bySlug, categories, categoryPhoto, products, projects, thb, type Category, type Product } from "@/data/loom";
import { base } from "./Chrome";

const wrap = "mx-auto max-w-[1440px] px-[var(--gutter)]";
const btn = "inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] transition-opacity hover:opacity-85";

export function ProductCard({ product: p, sizes = "(min-width:1024px) 25vw, 50vw" }: { product: Product; sizes?: string }) {
  const alt = p.photos[1];
  return (
    <Link href={`${base}/products/${p.slug}`} className="group block min-w-0">
      <div className="relative">
        <Photo photo={p.photos[0]} className="aspect-[4/5]" sizes={sizes} position={p.pos} />
        {alt && (
          <Photo
            photo={alt}
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:hidden"
            sizes={sizes}
          />
        )}
        {p.isNew && <span className="absolute left-3 top-3 rounded-full bg-bg px-2.5 py-1 text-[12px]">New</span>}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3 text-[14px]">
        <span className="min-w-0">
          <span className="font-medium">{p.name}</span> <span className="text-muted">{p.type}</span>
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

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const fine = useFinePointer();
  return (
    <section ref={ref} className="relative h-[min(88svh,880px)] min-h-[540px] overflow-hidden">
      <motion.div className="absolute inset-0 will-change-transform" style={fine ? { y } : undefined}>
        <motion.div className="h-full w-full" initial={{ scale: 1.14 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease }}>
          <Photo photo={photos.archedTerraceChairs} className="h-full w-full" priority position="62% 60%" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.5),transparent_55%)]" />
      <motion.div style={fine ? { opacity: fade, y: lift } : undefined} className={`${wrap} relative flex h-full flex-col justify-end pb-24 text-white sm:pb-14`}>
        <SplitLines
          as="h1"
          lines={["Rattan furniture and lighting,", "woven by hand in Ayutthaya"]}
          delay={0.35}
          className="text-[clamp(2.1rem,4.6vw,3.9rem)] font-medium leading-[1.06] tracking-[-0.025em]"
        />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.9, ease }} className="mt-7 flex flex-wrap gap-3">
          <Link href={`${base}/shop`} className={`${btn} bg-white text-[#1d1c1a]`}>
            Shop the collection
          </Link>
          <Link href={`${base}/trade`} className={`${btn} border border-white/70 text-white backdrop-blur-sm`}>
            For hotels and restaurants
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function Home() {
  const fresh = ["krachao-pendant", "kanok-armchair", "khom-pendant", "talay-bistro-chair"].map((s) => bySlug(s)!);
  return (
    <>
      <Hero />

      <section className={`${wrap} pt-16`}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {categories.map((c) => (
            <Link key={c} href={`${base}/${c.toLowerCase()}`} className="group">
              <Photo photo={categoryPhoto[c]} className="aspect-[3/4]" sizes="(min-width:1024px) 25vw, 50vw" imgClassName="transition-transform duration-700 group-hover:scale-[1.03]" />
              <p className="mt-3 flex justify-between text-[15px]">
                {c}
                <span className="text-muted">{products.filter((p) => p.category === c).length}</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className={`${wrap} pt-24`}>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-[-0.02em]">New this season</h2>
          <Link href={`${base}/shop`} className="text-[14px] underline underline-offset-4">
            View all {products.length}
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {fresh.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className={`${wrap} grid items-center gap-10 pt-28 lg:grid-cols-2 lg:gap-20`}>
        <RevealImage photo={photos.balconyRattanPods} className="aspect-[4/3]" sizes="(min-width:1024px) 50vw, 100vw" />
        <div className="max-w-[46ch]">
          <h2 className="text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-tight tracking-[-0.02em]">Twenty-two weavers, one workshop</h2>
          <p className="mt-5 text-[15.5px] leading-relaxed text-muted">
            Every piece is made in Bang Pa-in, an hour north of Bangkok, by a team that has worked together for most of fifteen years. The rattan comes from managed forests in
            Kalimantan and is steamed, bent and bound by hand. A dining chair takes a weaver about two days.
          </p>
          <p className="mt-4 text-[15.5px] leading-relaxed text-muted">For outdoor pieces we use a UV-stable fibre over aluminium, woven the same way, so it lasts by a pool or the sea.</p>
          <Link href={`${base}/about`} className="mt-7 inline-block text-[14px] underline underline-offset-4">
            About the workshop
          </Link>
        </div>
      </section>

      <section className={`${wrap} pt-28`}>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-[-0.02em]">Recent projects</h2>
          <Link href={`${base}/projects`} className="text-[14px] underline underline-offset-4">
            All projects
          </Link>
        </div>
        <div className="mt-7 grid gap-x-4 gap-y-10 md:grid-cols-3">
          {projects.slice(0, 3).map((pr) => (
            <Link key={pr.name} href={`${base}/projects`} className="group">
              <Photo photo={pr.photo} className="aspect-[4/3]" sizes="(min-width:768px) 33vw, 100vw" imgClassName="transition-transform duration-700 group-hover:scale-[1.03]" />
              <p className="mt-3 text-[15px] font-medium">{pr.name}</p>
              <p className="text-[14px] text-muted">
                {pr.place}. {pr.scope}.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <TradeBand />
    </>
  );
}

function TradeBand() {
  return (
    <section className={`${wrap} pt-28`}>
      <div className="grid gap-8 bg-[var(--deep)] px-6 py-12 text-[#f4f2ee] sm:px-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-16">
        <div>
          <h2 className="text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-[-0.02em]">Furnishing a hotel or restaurant?</h2>
          <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-white/70">
            Our trade team handles projects from 20 chairs to 400 rooms. You get net pricing, CAD files, finish samples within a week, and a production schedule you can plan around.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link href={`${base}/trade`} className={`${btn} bg-[#f4f2ee] text-[#1d1c1a]`}>
            Join the trade programme
          </Link>
          <Link href={`${base}/contact`} className={`${btn} border border-white/40`}>
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
      <h1 className="text-[clamp(1.9rem,3.4vw,2.8rem)] font-medium tracking-[-0.025em]">{category ?? "All pieces"}</h1>
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
                <Link key={slug} href={`${base}/${slug}`} className={`shrink-0 rounded-full px-3.5 py-1.5 ${active ? "bg-ink text-bg" : "hover:bg-soft"}`}>
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
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
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
              <h2 className="mt-1 text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-[-0.02em]">{pr.name}</h2>
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
        <h2 className="text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-[-0.02em]">How a chair is made</h2>
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
        <h2 className="text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-[-0.02em]">Repairs and guarantee</h2>
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
            <button onClick={() => go(i - 1)} disabled={i === 0} className="rounded-full border border-line px-4 py-2 disabled:opacity-30">
              Previous
            </button>
            <span className="tabular text-muted">
              Page {i + 1} of {PAGES}
            </span>
            <button onClick={() => go(i + 1)} disabled={i === PAGES - 1} className="rounded-full border border-line px-4 py-2 disabled:opacity-30">
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
          <a href="/catalogue/loom-and-tide-collection-2027.pdf" download className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-[15px] text-bg hover:opacity-90">
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
      <h1 className="text-[2rem] font-medium tracking-[-0.02em]">We could not find that page</h1>
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
      <h1 className="text-[clamp(1.9rem,3.4vw,2.8rem)] font-medium tracking-[-0.025em]">{title}</h1>
      <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{text}</p>
    </header>
  );
}

const input = "w-full rounded-md border border-line bg-bg px-3 py-2.5 text-[15px] outline-none focus:border-ink";

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
      <h2 className="text-[20px] font-medium tracking-[-0.01em]">{title}</h2>
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
