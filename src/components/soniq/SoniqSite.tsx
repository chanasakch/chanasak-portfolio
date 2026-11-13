"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { resetScroll } from "@/components/shared/motion";
import { AccountPage } from "@/components/kit/Account";
import { Checkout, type CheckoutConfig } from "@/components/kit/Checkout";
import { AuthSheet, CartSheet, Newsletter, SearchSheet, btn, type Item } from "@/components/kit/panels";
import { addDays, baht, day, useNow } from "@/components/kit/persist";
import { StoreProvider, useStore, type Catalog } from "@/components/kit/store";
import { Heart, Icon, Img, Qty, Sheet } from "@/components/kit/ui";
import { CARE, soniq, soniqById, soniqCats, soniqSlides, type SoniqProduct } from "@/data/soniq";
import { Support } from "./Support";

const ease = [0.22, 1, 0.36, 1] as const;
const R = "/soniq";

const catalog: Catalog = {
  price: (l) => (soniqById(l.id)?.price ?? 0) + (l.opt === "care" ? CARE : 0),
  name: (l) => soniqById(l.id)?.name ?? l.id,
  img: (l) => soniqById(l.id)?.img ?? "",
  optLabel: (l) => (l.opt === "care" ? "With Protect+ 2 year care" : undefined),
  opts: () => ["care"],
  max: (l) => Math.min(5, soniqById(l.id)?.stock ?? 5),
};

const items: Item[] = soniq.map((p) => ({ id: p.id, name: p.name, cat: p.cat, price: p.price, img: p.img, href: `${R}/p/${p.id}`, note: p.tag }));

/** Same day in Bangkok when ordered before 14:00, otherwise tomorrow. */
const cutoff = (now: Date) => now.getHours() < 14;
const left = (now: Date) => {
  const m = 14 * 60 - (now.getHours() * 60 + now.getMinutes());
  return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`;
};

const cfg: CheckoutConfig = {
  prefix: "SNQ",
  home: R,
  shop: `${R}/shop`,
  account: `${R}/account`,
  payments: ["card", "promptpay", "cod"],
  codLimit: 10000,
  delivery: (sub, now) => [
    { id: "std", label: "Standard delivery", detail: `Arrives ${day(addDays(now, 2))} to ${day(addDays(now, 3))}, anywhere in Thailand`, price: sub >= 1500 ? 0 : 60, address: true },
    { id: "exp", label: "Bangkok express", detail: cutoff(now) ? "Today by 20:00 by motorbike courier" : "Tomorrow by 13:00 by motorbike courier", price: 120, address: true },
    { id: "pick", label: "Pick up at SONIQ Siam", detail: "Ready in two hours. Siam Square Soi 3, 10:00 to 21:00", price: 0, address: false },
  ],
};

export function SoniqSite({ segs = [] }: { segs?: string[] }) {
  const [a, b] = segs;
  const path = segs.join("/");
  useEffect(resetScroll, [path]);
  const cat = a === "shop" && b ? soniqCats.find((c) => c.slug === b) : undefined;
  const product = a === "p" && b ? soniqById(b) : undefined;
  let view;
  if (!a) view = <Home />;
  else if (a === "shop" && (!b || cat))
    view = (
      <Suspense fallback={<div className="min-h-screen" />}>
        <Shop key={b ?? "all"} cat={cat?.name} />
      </Suspense>
    );
  else if (product) view = <Product key={product.id} p={product} />;
  else if (a === "checkout") view = <Checkout cfg={cfg} />;
  else if (a === "account" || a === "wishlist") view = <AccountPage key={a} items={items} shop={`${R}/shop`} tab={a === "wishlist" ? "wishlist" : "orders"} wishCta={(i) => <QuickAdd id={i.id} />} />;
  else if (a === "support") view = <Support />;
  else view = <Missing />;

  return (
    <StoreProvider brand="soniq" catalog={catalog}>
      <Header />
      <main>{view}</main>
      <Footer />
      <CartSheet checkout={`${R}/checkout`} shop={`${R}/shop`} freeOver={1500} note="Free standard delivery over ฿1,500. Bangkok express available." />
      <SearchSheet items={items} resultsHref={(q) => `${R}/shop?q=${encodeURIComponent(q)}`} placeholder="Search headphones, watches" />
      <AuthSheet />
      <Menu />
    </StoreProvider>
  );
}

function Header() {
  const s = useStore();
  return (
    <header className="sticky top-0 z-40 bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-6 px-4 sm:px-6">
        <Link href={R} className="flex items-center gap-2 text-[20px] font-extrabold tracking-[-0.04em]">
          <span className="grid size-7 place-items-center rounded-full bg-ink">
            <span className="size-2.5 rounded-full bg-accent" />
          </span>
          SONIQ
        </Link>
        <nav className="mx-auto hidden items-center gap-1 rounded-full bg-white/70 p-1 text-[14px] lg:flex">
          {[["Shop all", `${R}/shop`], ...soniqCats.slice(0, 4).map((c) => [c.name, `${R}/shop/${c.slug}`]), ["Support", `${R}/support`]].map(([t, h]) => (
            <Link key={h} href={h} className="rounded-full px-4 py-2 hover:bg-bg">
              {t}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
          <button onClick={() => s.setPanel("search")} aria-label="Search" className="grid size-11 place-items-center rounded-full bg-white/70 hover:bg-white">
            {Icon.search}
          </button>
          <Link href={`${R}/wishlist`} aria-label={`Wishlist, ${s.wish.length} saved`} className="relative hidden size-11 place-items-center rounded-full bg-white/70 hover:bg-white sm:grid">
            <Heart on={false} />
            {s.wish.length > 0 && <Badge n={s.wish.length} />}
          </Link>
          <button onClick={() => s.setPanel("cart")} aria-label={`Bag, ${s.count} items`} className="relative grid size-11 place-items-center rounded-full bg-white/70 hover:bg-white">
            {Icon.bag}
            {s.count > 0 && <Badge n={s.count} />}
          </button>
          <Link href={`${R}/account`} aria-label="Account" className="hidden size-11 place-items-center rounded-full bg-ink text-[14px] font-bold text-bg sm:grid">
            {s.user ? s.user.name.slice(0, 1).toUpperCase() : Icon.user}
          </Link>
          <button onClick={() => s.setPanel("menu")} aria-label="Menu" className="grid size-11 place-items-center rounded-full bg-white/70 lg:hidden">
            {Icon.menu}
          </button>
        </div>
      </div>
    </header>
  );
}

const Badge = ({ n }: { n: number }) => <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10.5px] font-bold text-white">{n}</span>;

function Menu() {
  const s = useStore();
  const close = () => s.setPanel(null);
  const links = [["Shop all", `${R}/shop`], ...soniqCats.map((c) => [c.name, `${R}/shop/${c.slug}`]), ["Support and repairs", `${R}/support`], ["Wishlist", `${R}/wishlist`], ["Account and orders", `${R}/account`]];
  return (
    <Sheet open={s.panel === "menu"} onClose={close} title="Menu">
      <nav className="grid">
        {links.map(([t, h]) => (
          <Link key={h} href={h} onClick={close} className="border-b border-line py-4 text-[20px] font-semibold tracking-[-0.02em]">
            {t}
          </Link>
        ))}
      </nav>
    </Sheet>
  );
}

/* ---------------- home ---------------- */

function Home() {
  const [tab, setTab] = useState<string>("All");
  const list = tab === "All" ? soniq.slice(0, 8) : soniq.filter((p) => p.cat === tab);
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:py-28">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <h2 className="font-display max-w-lg text-[36px] leading-[1.02] sm:text-[52px]">Bestsellers this month</h2>
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1" role="tablist">
            {["All", ...soniqCats.map((c) => c.name)].map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`shrink-0 rounded-full px-4 py-2 text-[14px] ${tab === t ? "bg-ink text-bg" : "bg-white/70 hover:bg-white"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <Grid list={list} />
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-4 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:pb-28">
        {[soniqById("vela")!, soniqById("tidal")!].map((p) => (
          <Link key={p.id} href={`${R}/p/${p.id}`} className="group relative block overflow-hidden rounded-[var(--r-lg)]">
            <Img src={p.img} alt={p.alt} ratio={1.45} sizes="(min-width:1024px) 50vw, 100vw" imgClassName="transition-transform duration-[1.2s] group-hover:scale-[1.03]" />
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 rounded-[20px] bg-white/80 p-4 backdrop-blur-xl sm:inset-x-5 sm:bottom-5 sm:p-5">
              <div>
                <p className="text-[13px] text-muted">{p.cat}</p>
                <p className="text-[20px] font-bold tracking-[-0.02em]">{p.name}</p>
                <p className="text-[14px] text-muted">{p.tag}</p>
              </div>
              <span className="shrink-0 rounded-full bg-ink px-4 py-2 text-[14px] text-bg">{baht(p.price)}</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pb-24 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-[var(--r-lg)] bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Bangkok express", "Order before 14:00, at your door by 20:00."],
            ["Two year warranty", "Every product. Add Protect+ for accidents too."],
            ["30 day returns", "Unopened or not, if it is not right, send it back."],
            ["Repairs at Siam", "Book a bench slot or post it to us."],
          ].map(([t, d]) => (
            <div key={t} className="grid gap-2 bg-bg p-6">
              <p className="text-[17px] font-bold tracking-[-0.02em]">{t}</p>
              <p className="text-[14px] text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Hero() {
  const s = useStore();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tip, setTip] = useState(true);
  const n = soniqSlides.length;
  const sl = soniqSlides[i];
  const p = soniqById(sl.id)!;
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((v) => (v + 1) % n), 7000);
    return () => clearTimeout(t);
  }, [i, paused, n]);
  return (
    <section className="px-4 pb-4 sm:px-6" aria-roledescription="carousel" aria-label="Featured products">
      <div
        className="relative mx-auto h-[calc(100svh-88px)] min-h-[600px] max-w-[1440px] overflow-hidden rounded-[var(--r-lg)] transition-colors duration-700 lg:max-h-[860px]"
        style={{ background: sl.bg }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <AnimatePresence initial={false}>
          <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            {/* the photo keeps its own shape and sits to the right; the card colour continues its backdrop */}
            <div className="absolute bottom-0 right-0 h-[62%] sm:h-full" style={{ aspectRatio: sl.ratio }}>
              <Img src={sl.img} alt={p.alt} className="absolute inset-0 bg-transparent" sizes="(min-width:640px) 60vw, 100vw" priority={i === 0} />
              <div className="absolute inset-y-0 left-0 w-1/3" style={{ background: `linear-gradient(90deg, ${sl.bg}, transparent)` }} />
              <div className="absolute inset-x-0 top-0 h-1/4 sm:hidden" style={{ background: `linear-gradient(${sl.bg}, transparent)` }} />
              <button
                onClick={() => setTip((t) => !t)}
                aria-label={`About ${p.name}`}
                aria-expanded={tip}
                className="absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center"
                style={{ left: `${sl.spot.x * 100}%`, top: `${sl.spot.y * 100}%` }}
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-white/60" />
                <span className="relative size-4 rounded-full border-[3px] border-white bg-ink shadow-md" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none relative flex h-full flex-col justify-between p-5 pb-16 sm:p-10 lg:p-14">
          <AnimatePresence mode="wait">
            <motion.div key={i} className="pointer-events-auto grid max-w-[620px] gap-5" initial="a" animate="b" exit="c">
              <h1 className="font-display text-[clamp(44px,7vw,104px)] leading-[0.92]">
                {sl.title.map((t, k) => (
                  <motion.span key={t} className="block" variants={{ a: { opacity: 0, y: 24 }, b: { opacity: 1, y: 0, transition: { duration: 0.7, ease, delay: 0.07 * k } }, c: { opacity: 0, y: -12, transition: { duration: 0.3 } } }}>
                    {t}
                  </motion.span>
                ))}
              </h1>
              <motion.p className="max-w-sm text-[15px] leading-relaxed text-ink/70 sm:text-[17px]" variants={{ a: { opacity: 0 }, b: { opacity: 1, transition: { delay: 0.2, duration: 0.6 } }, c: { opacity: 0 } }}>
                {sl.line}
              </motion.p>
              <motion.div variants={{ a: { opacity: 0 }, b: { opacity: 1, transition: { delay: 0.3 } }, c: { opacity: 0 } }}>
                <Link href={`${R}/shop`} className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-bg hover:opacity-90">
                  Shop now {Icon.arrow}
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-auto flex items-end justify-between gap-4">
            <div className="flex items-center gap-2" role="tablist" aria-label="Slides">
              {soniqSlides.map((x, k) => (
                <button key={x.id} role="tab" aria-selected={k === i} aria-label={`Slide ${k + 1}`} onClick={() => setI(k)} className="grid h-6 place-items-center">
                  <span className={`block h-2 rounded-full transition-all duration-500 ${k === i ? "w-8 bg-ink" : "w-2 bg-ink/25"}`} />
                </button>
              ))}
            </div>
            <AnimatePresence>
              {tip && (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.45, ease }}
                  className="flex w-[300px] max-w-[calc(100vw-72px)] items-center gap-3 rounded-[22px] bg-white/85 p-2.5 shadow-[0_20px_50px_rgb(0_0_0/0.12)] backdrop-blur-xl"
                >
                  <Link href={`${R}/p/${p.id}`} className="shrink-0">
                    <Img src={p.img} alt="" ratio={1} sizes="72px" widths={[800]} className="w-[68px] rounded-[16px]" />
                  </Link>
                  <Link href={`${R}/p/${p.id}`} className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold tracking-[-0.02em]">{p.name}</span>
                    <span className="block text-[14px]">
                      {baht(p.price)} {p.was && <s className="text-[12.5px] text-muted">{baht(p.was)}</s>}
                    </span>
                  </Link>
                  <button onClick={() => s.add({ id: p.id, qty: 1 })} aria-label={`Add ${p.name} to bag`} className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-white hover:opacity-90">
                    {Icon.bag}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- shop ---------------- */

function Grid({ list }: { list: SoniqProduct[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {list.map((p) => (
        <Card key={p.id} p={p} />
      ))}
    </ul>
  );
}

function Card({ p }: { p: SoniqProduct }) {
  const s = useStore();
  const on = s.wish.includes(p.id);
  return (
    <li className="group grid content-start gap-3 rounded-[var(--r-lg)] bg-white/60 p-2.5 transition-colors hover:bg-white">
      <div className="relative">
        <Link href={`${R}/p/${p.id}`} className="block">
          <Img src={p.img} alt={p.alt} ratio={1} sizes="(min-width:1024px) 25vw, 50vw" widths={[800]} className="rounded-[20px]" imgClassName="transition-transform duration-[1s] group-hover:scale-[1.04]" />
        </Link>
        {p.was && <span className="absolute left-2.5 top-2.5 rounded-full bg-accent px-2.5 py-1 text-[11.5px] font-bold text-white">Save {baht(p.was - p.price)}</span>}
        <button onClick={() => s.toggleWish(p.id)} aria-pressed={on} aria-label={on ? `Remove ${p.name} from wishlist` : `Save ${p.name}`} className="absolute right-2.5 top-2.5 grid size-9 place-items-center rounded-full bg-white/85">
          <Heart on={on} size={16} />
        </button>
      </div>
      <div className="grid gap-1 px-1.5 pb-1.5">
        <Link href={`${R}/p/${p.id}`} className="grid">
          <span className="text-[12.5px] text-muted">{p.cat}</span>
          <span className="text-[16px] font-bold tracking-[-0.02em]">{p.name}</span>
        </Link>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-[15px]">{baht(p.price)}</span>
          <button onClick={() => s.add({ id: p.id, qty: 1 })} aria-label={`Add ${p.name} to bag`} className="grid size-10 place-items-center rounded-full bg-ink text-bg hover:bg-accent">
            {Icon.bag}
          </button>
        </div>
      </div>
    </li>
  );
}

function QuickAdd({ id }: { id: string }) {
  const s = useStore();
  return (
    <button className="h-10 rounded-full bg-ink text-[13px] font-semibold text-bg" onClick={() => s.add({ id, qty: 1 })}>
      Add to bag
    </button>
  );
}

function Shop({ cat }: { cat?: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const q = (params.get("q") ?? "").trim();
  const [sort, setSort] = useState("featured");
  const [maxP, setMaxP] = useState(0);
  const list = useMemo(() => {
    let l = soniq.filter((p) => (!cat || p.cat === cat) && (!q || `${p.name} ${p.cat} ${p.tag} ${p.blurb}`.toLowerCase().includes(q.toLowerCase())) && (!maxP || p.price <= maxP));
    if (sort === "low") l = [...l].sort((x, y) => x.price - y.price);
    if (sort === "high") l = [...l].sort((x, y) => y.price - x.price);
    return l;
  }, [cat, q, sort, maxP]);
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-8 sm:px-6 lg:pt-14">
      <h1 className="font-display text-[44px] leading-none sm:text-[72px]">{q ? `"${q}"` : (cat ?? "Shop all")}</h1>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <nav className="-mx-1 flex gap-1.5 overflow-x-auto px-1" aria-label="Categories">
          {[{ name: "All", slug: "" }, ...soniqCats].map((c) => {
            const on = (c.name === "All" && !cat) || c.name === cat;
            return (
              <Link key={c.name} href={`${R}/shop${c.slug ? `/${c.slug}` : ""}`} aria-current={on ? "page" : undefined} className={`shrink-0 rounded-full px-4 py-2 text-[14px] ${on ? "bg-ink text-bg" : "bg-white/70 hover:bg-white"}`}>
                {c.name}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-wrap items-center gap-3 text-[14px]">
          {q && (
            <button className="underline underline-offset-4" onClick={() => router.push(`${R}/shop`)}>
              Clear search
            </button>
          )}
          <select aria-label="Price" value={maxP} onChange={(e) => setMaxP(+e.target.value)} className="rounded-full bg-white/70 px-3 py-2 outline-none">
            <option value={0}>Any price</option>
            <option value={3000}>Under ฿3,000</option>
            <option value={6000}>Under ฿6,000</option>
            <option value={10000}>Under ฿10,000</option>
          </select>
          <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full bg-white/70 px-3 py-2 outline-none">
            <option value="featured">Featured</option>
            <option value="low">Price, low to high</option>
            <option value="high">Price, high to low</option>
          </select>
        </div>
      </div>
      <p className="mb-6 mt-4 text-[14px] text-muted">{list.length} products</p>
      {list.length ? (
        <Grid list={list} />
      ) : (
        <div className="grid justify-items-start gap-4 py-8">
          <p className="text-muted">Nothing matches these filters.</p>
          <Link href={`${R}/shop`} className={`${btn.ghost} w-auto`}>
            Show everything
          </Link>
        </div>
      )}
    </div>
  );
}

function Product({ p }: { p: SoniqProduct }) {
  const s = useStore();
  const [care, setCare] = useState(false);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const now = useNow();
  const on = s.wish.includes(p.id);
  const price = p.price + (care ? CARE : 0);
  const pic = p.gallery[shot] ?? p.gallery[0];
  const related = soniq.filter((x) => x.id !== p.id && x.cat === p.cat).concat(soniq.filter((x) => x.cat !== p.cat)).slice(0, 4);
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-6 sm:px-6 lg:pt-10">
      <nav className="mb-5 text-[13px] text-muted" aria-label="Breadcrumb">
        <Link href={`${R}/shop`} className="hover:text-ink">
          Shop
        </Link>{" "}
        /{" "}
        <Link href={`${R}/shop/${soniqCats.find((c) => c.name === p.cat)!.slug}`} className="hover:text-ink">
          {p.cat}
        </Link>
      </nav>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <div className="grid min-w-0 content-start gap-3">
          <Img key={pic.img} src={pic.img} alt={pic.alt} ratio={Math.max(0.85, Math.min(1.45, pic.ratio))} priority sizes="(min-width:1024px) 55vw, 100vw" className="rounded-[var(--r-lg)]" />
          {p.gallery.length > 1 && (
            <div className="flex gap-2.5">
              {p.gallery.map((x, k) => (
                <button key={x.img} onClick={() => setShot(k)} aria-pressed={k === shot} aria-label={`Show photo ${k + 1}`} className={`w-20 overflow-hidden rounded-[14px] border-2 ${k === shot ? "border-ink" : "border-transparent opacity-70"}`}>
                  <Img src={x.img} alt="" ratio={1} sizes="80px" widths={[800]} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="grid content-start gap-6 lg:sticky lg:top-24 lg:self-start">
          <div className="grid gap-2">
            <p className="text-[14px] text-muted">{p.tag}</p>
            <h1 className="font-display text-[42px] leading-none sm:text-[60px]">{p.name}</h1>
            <p className="flex items-baseline gap-3 text-[22px] font-semibold">
              {baht(price)} {p.was && <s className="text-[15px] font-normal text-muted">{baht(p.was + (care ? CARE : 0))}</s>}
            </p>
            <p className="flex items-center gap-2 text-[14px]">
              <span className="size-3.5 rounded-full border border-line" style={{ background: p.swatch }} /> {p.color}
            </p>
          </div>
          <p className="max-w-lg text-[15.5px] leading-relaxed text-ink/75">{p.blurb}</p>

          <button
            role="checkbox"
            aria-checked={care}
            onClick={() => setCare(!care)}
            className={`flex items-start gap-3 rounded-[var(--r-sm)] border p-4 text-left ${care ? "border-ink bg-white" : "border-line bg-white/50"}`}
          >
            <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-[6px] border ${care ? "border-ink bg-ink text-bg" : "border-line"}`}>{care && Icon.check}</span>
            <span className="flex-1">
              <span className="block text-[15px] font-semibold">Add Protect+ care, {baht(CARE)}</span>
              <span className="block text-[13px] text-muted">Two years of cover for drops and spills, with a replacement in 48 hours.</span>
            </span>
          </button>

          <div className="flex items-center gap-3">
            <Qty value={qty} onChange={setQty} max={Math.min(5, p.stock)} />
            <button className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-bg hover:bg-accent" onClick={() => s.add({ id: p.id, opt: care ? "care" : undefined, qty })}>
              Add to bag
            </button>
            <button onClick={() => s.toggleWish(p.id)} aria-pressed={on} aria-label={on ? "Remove from wishlist" : "Save to wishlist"} className="grid size-12 shrink-0 place-items-center rounded-full bg-white/70 hover:bg-white">
              <Heart on={on} />
            </button>
          </div>

          <div className="grid min-h-[96px] gap-1.5 rounded-[var(--r-sm)] bg-white/60 p-4 text-[14px]">
            <p className="font-semibold">{p.stock <= 8 ? `Only ${p.stock} left in stock` : "In stock"}</p>
            {now && (
              <>
                <p className="text-muted">Bangkok express: {cutoff(now) ? `order within ${left(now)} for delivery today by 20:00` : "order now for delivery tomorrow by 13:00"}.</p>
                <p className="text-muted">
                  Standard delivery {day(addDays(now, 2))} to {day(addDays(now, 3))}, free over ฿1,500.
                </p>
              </>
            )}
          </div>

          <div className="grid gap-px overflow-hidden rounded-[var(--r-sm)] bg-line">
            {p.specs.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[130px_1fr] gap-4 bg-bg px-4 py-3 text-[14px]">
                <span className="text-muted">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <div className="grid gap-2">
            <p className="text-[15px] font-semibold">In the box</p>
            <ul className="grid gap-1 text-[14px] text-muted">
              {p.box.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <section className="mt-20">
        <h2 className="font-display mb-6 text-[32px] sm:text-[40px]">Goes well with</h2>
        <Grid list={related} />
      </section>
    </div>
  );
}

function Missing() {
  return (
    <div className="mx-auto grid max-w-md justify-items-center gap-5 px-5 py-40 text-center">
      <h1 className="font-display text-[44px]">Page not found</h1>
      <Link href={`${R}/shop`} className={`${btn.primary} w-auto`}>
        Go to the shop
      </Link>
    </div>
  );
}

function Footer() {
  return (
    <footer className="px-4 pb-4 sm:px-6">
      <div className="mx-auto grid max-w-[1440px] gap-10 rounded-[var(--r-lg)] bg-ink p-8 text-bg sm:p-12 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="grid content-start gap-4">
          <p className="text-[28px] font-extrabold tracking-[-0.04em]">SONIQ</p>
          <p className="max-w-sm text-[14px] text-bg/60">New releases and member prices, twice a month.</p>
          <Newsletter className="max-w-sm" buttonClass="bg-accent text-white" inputClass="text-bg placeholder:text-bg/50" />
        </div>
        <div className="grid content-start gap-3 text-[14px]">
          <p className="text-bg/50">Shop</p>
          {soniqCats.map((c) => (
            <Link key={c.slug} href={`${R}/shop/${c.slug}`} className="hover:text-accent">
              {c.name}
            </Link>
          ))}
        </div>
        <div className="grid content-start gap-3 text-[14px]">
          <p className="text-bg/50">Help</p>
          <Link href={`${R}/support`} className="hover:text-accent">
            Warranty and repairs
          </Link>
          <Link href={`${R}/account`} className="hover:text-accent">
            Track an order
          </Link>
          <p className="text-bg/60">SONIQ Siam, Siam Square Soi 3, Bangkok, daily 10:00 to 21:00</p>
        </div>
      </div>
    </footer>
  );
}
