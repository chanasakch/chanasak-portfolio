"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
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

export function Home() {
  const fresh = ["krachao-pendant", "kanok-armchair", "khom-pendant", "talay-bistro-chair"].map((s) => bySlug(s)!);
  return (
    <>
      <section className="relative h-[min(86svh,860px)] min-h-[520px]">
        <Photo photo={photos.archedTerraceChairs} className="absolute inset-0" priority position="62% 60%" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.45),transparent_55%)]" />
        <div className={`${wrap} relative flex h-full flex-col justify-end pb-20 text-white sm:pb-12`}>
          <h1 className="max-w-[18ch] text-[clamp(2.1rem,4.6vw,3.9rem)] font-medium leading-[1.04] tracking-[-0.025em] [text-wrap:balance]">
            Rattan furniture and lighting, woven by hand in Ayutthaya
          </h1>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`${base}/shop`} className={`${btn} bg-white text-[#1d1c1a]`}>
              Shop the collection
            </Link>
            <Link href={`${base}/trade`} className={`${btn} border border-white/70 text-white`}>
              For hotels and restaurants
            </Link>
          </div>
        </div>
      </section>

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
        <Photo photo={photos.balconyRattanPods} className="aspect-[4/3]" sizes="(min-width:1024px) 50vw, 100vw" />
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

      <div className="sticky top-16 z-30 -mx-[var(--gutter)] mt-8 border-y border-line bg-bg/95 px-[var(--gutter)] backdrop-blur">
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
            <Photo photo={pr.photo} className="aspect-[4/3]" sizes="(min-width:1024px) 50vw, 100vw" />
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
        <Photo photo={photos.courtyardHouse} className="aspect-[16/9] max-h-[640px] w-full" sizes="100vw" position="50% 70%" />
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
      <section className={`${wrap} grid gap-6 pt-20 sm:grid-cols-3`}>
        {[
          ["22", "weavers and joiners on staff"],
          ["2 days", "to weave one dining chair"],
          ["10 years", "frame guarantee on indoor pieces"],
        ].map(([n, l]) => (
          <div key={l} className="border-t border-ink pt-4">
            <p className="text-[clamp(1.8rem,3vw,2.4rem)] font-medium tracking-[-0.02em]">{n}</p>
            <p className="text-[14px] text-muted">{l}</p>
          </div>
        ))}
      </section>
      <section className={`${wrap} grid gap-4 pt-20 sm:grid-cols-2`}>
        <Photo photo={photos.readingCorner} className="aspect-[4/5]" sizes="50vw" />
        <Photo photo={photos.trioPendants} className="aspect-[4/5]" sizes="50vw" />
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
