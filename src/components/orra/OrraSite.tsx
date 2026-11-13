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
import { orra, orraById, orraCats, orraOpt, orraSlides, type OrraProduct } from "@/data/orra";
import { Visit } from "./Visit";

const ease = [0.22, 1, 0.36, 1] as const;
const R = "/orra";

const catalog: Catalog = {
  price: (l) => {
    const p = orraById(l.id);
    return p ? p.price + (orraOpt(p, l.opt)?.add ?? 0) : 0;
  },
  name: (l) => orraById(l.id)?.name ?? l.id,
  img: (l) => orraById(l.id)?.img ?? "",
  optLabel: (l) => {
    const p = orraById(l.id);
    const o = p && orraOpt(p, l.opt);
    return o ? `${p!.optName}: ${o.label}` : undefined;
  },
  opts: (id) => orraById(id)?.opts?.map((o) => o.key) ?? [],
  max: (l) => orraById(l.id)?.stock ?? 10,
};

const items: Item[] = orra.map((p) => ({ id: p.id, name: p.name, cat: p.cat, price: p.price, img: p.img, href: `${R}/p/${p.id}` }));

const cfg: CheckoutConfig = {
  prefix: "ORA",
  home: R,
  shop: `${R}/shop`,
  account: `${R}/account`,
  payments: ["card", "promptpay"],
  delivery: (sub) => [
    {
      id: "white",
      label: "White glove delivery",
      detail: "Two people bring it in, unwrap it and take the packaging away",
      price: sub >= 30000 ? 0 : 1500,
      address: true,
      dates: { from: 5, count: 10, closed: [0] },
    },
    { id: "pickup", label: "Collect from the showroom", detail: "Charoen Krung 43, open Tuesday to Sunday, 10:00 to 19:00", price: 0, address: false, dates: { from: 3, count: 10, closed: [1] } },
  ],
  extras: () => [
    { id: "assembly", label: "Assembly and placement", detail: "We build it, level it and put it where you want it", price: 900 },
    { id: "removal", label: "Take away an old piece", detail: "One item of furniture, recycled or donated", price: 1200 },
  ],
};

export function OrraSite({ segs = [] }: { segs?: string[] }) {
  const [a, b] = segs;
  const path = segs.join("/");
  useEffect(resetScroll, [path]);
  const cat = a === "shop" && b ? orraCats.find((c) => c.slug === b) : undefined;
  const product = a === "p" && b ? orraById(b) : undefined;

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
  else if (a === "account" || a === "wishlist")
    view = <AccountPage key={a} items={items} shop={`${R}/shop`} tab={a === "wishlist" ? "wishlist" : "orders"} wishCta={(i) => <QuickAdd id={i.id} />} />;
  else if (a === "visit") view = <Visit />;
  else view = <Missing />;

  return (
    <StoreProvider brand="orra" catalog={catalog}>
      <Header overHero={!a} />
      <main>{view}</main>
      <Footer />
      <CartSheet checkout={`${R}/checkout`} shop={`${R}/shop`} freeOver={30000} note="White glove delivery is free in Bangkok on orders over ฿30,000." />
      <SearchSheet items={items} resultsHref={(q) => `${R}/shop?q=${encodeURIComponent(q)}`} placeholder="Search chairs, sofas, lighting" />
      <AuthSheet />
      <Menu />
    </StoreProvider>
  );
}

function Header({ overHero }: { overHero: boolean }) {
  const s = useStore();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > window.innerHeight * 0.75);
    window.addEventListener("scroll", on, { passive: true });
    requestAnimationFrame(on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  const solid = !overHero || scrolled;
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-500 ${solid ? "border-b border-line bg-bg/90 backdrop-blur-xl" : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-6 px-5 sm:px-8">
        <Link href={R} className="text-[22px] font-light tracking-[0.32em]">
          ORRA
        </Link>
        <nav className="ml-6 hidden items-center gap-7 text-[14px] text-ink/80 lg:flex">
          {orraCats.map((c) => (
            <Link key={c.slug} href={`${R}/shop/${c.slug}`} className="hover:text-ink">
              {c.name}
            </Link>
          ))}
          <Link href={`${R}/visit`} className="hover:text-ink">
            Showroom
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button onClick={() => s.setPanel("search")} className="hidden h-10 w-56 items-center gap-2.5 rounded-full border border-ink/20 bg-ink/5 px-4 text-[14px] text-ink/60 backdrop-blur-md hover:border-ink/40 md:flex">
            {Icon.search}
            Search
          </button>
          <button onClick={() => s.setPanel("search")} aria-label="Search" className="grid size-10 place-items-center rounded-full hover:bg-ink/10 md:hidden">
            {Icon.search}
          </button>
          <Link href={`${R}/wishlist`} aria-label={`Wishlist, ${s.wish.length} saved`} className="relative hidden size-10 place-items-center rounded-full border border-ink/20 hover:bg-ink/10 sm:grid">
            <Heart on={false} />
            {s.wish.length > 0 && <Badge n={s.wish.length} />}
          </Link>
          <button onClick={() => s.setPanel("cart")} aria-label={`Bag, ${s.count} items`} className="relative grid size-10 place-items-center rounded-full border border-ink/20 hover:bg-ink/10">
            {Icon.bag}
            {s.count > 0 && <Badge n={s.count} />}
          </button>
          <Link href={`${R}/account`} aria-label="Account" className="hidden size-10 place-items-center rounded-full bg-ink text-[13px] font-medium text-bg sm:grid">
            {s.user ? s.user.name.slice(0, 1).toUpperCase() : Icon.user}
          </Link>
          <button onClick={() => s.setPanel("menu")} aria-label="Menu" className="grid size-10 place-items-center rounded-full hover:bg-ink/10 lg:hidden">
            {Icon.menu}
          </button>
        </div>
      </div>
    </header>
  );
}

const Badge = ({ n }: { n: number }) => <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10.5px] font-medium text-accent-ink">{n}</span>;

function Menu() {
  const s = useStore();
  const close = () => s.setPanel(null);
  const links = [...orraCats.map((c) => [c.name, `${R}/shop/${c.slug}`]), ["All pieces", `${R}/shop`], ["Book a showroom visit", `${R}/visit`], ["Wishlist", `${R}/wishlist`], ["Account and orders", `${R}/account`]];
  return (
    <Sheet open={s.panel === "menu"} onClose={close} title="ORRA">
      <nav className="grid">
        {links.map(([t, h]) => (
          <Link key={h} href={h} onClick={close} className="border-b border-line py-4 text-[20px] font-light">
            {t}
          </Link>
        ))}
      </nav>
    </Sheet>
  );
}

/* ---------------- home ---------------- */

function Home() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-xl text-[34px] font-light leading-[1.05] sm:text-[48px]">Four rooms of the house, one hand behind them</h2>
          <Link href={`${R}/shop`} className="text-[14px] underline underline-offset-4">
            See all {orra.length} pieces
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {orraCats.map((c) => (
            <Link key={c.slug} href={`${R}/shop/${c.slug}`} className="group relative block overflow-hidden rounded-[var(--r-lg)]">
              <Img src={c.img} alt={c.name} ratio={3 / 4} sizes="(min-width:1024px) 25vw, 50vw" widths={[800]} imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(16_15_13/0.75),transparent_55%)]" />
              <div className="absolute inset-x-4 bottom-4 sm:inset-x-5 sm:bottom-5">
                <p className="text-[20px] font-light sm:text-[24px]">{c.name}</p>
                <p className="text-[13px] text-ink/70">
                  {c.line}, {orra.filter((p) => p.cat === c.name).length} pieces
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 lg:pb-32">
        <h2 className="mb-10 text-[34px] font-light leading-[1.05] sm:text-[48px]">In the showroom now</h2>
        <Grid list={[orra[0], orra[5], orra[4], orra[7]]} />
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <Img src="orra/dune-detail" alt="Linen sofa arm with a folded throw and a lamp" ratio={1600 / 1156} sizes="(min-width:1024px) 50vw, 100vw" />
          <div className="grid content-center gap-8 px-5 py-16 sm:px-12 lg:px-20">
            <h2 className="text-[34px] font-light leading-[1.05] sm:text-[44px]">Built forty minutes from the showroom</h2>
            <p className="max-w-md text-[16px] leading-relaxed text-muted">
              Every frame is cut, joined and upholstered by our team of eleven in Samut Sakhon. Because we make to order, you choose the fabric, the finish and often the size, and nothing sits in a warehouse.
            </p>
            <dl className="grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
              {[
                ["15 yr", "frame guarantee"],
                ["30 day", "returns on stock pieces"],
                ["Free", "delivery in Bangkok over ฿30,000"],
              ].map(([k, v]) => (
                <div key={v}>
                  <dt className="text-[24px] font-light">{k}</dt>
                  <dd className="text-[13px] text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <Img src="orra/room-suite" alt="Soft armchair by a window in a calm bedroom" className="absolute inset-0" sizes="100vw" position="50% 60%" />
        <div className="absolute inset-0 bg-[rgb(18_17_15/0.62)]" />
        <div className="relative mx-auto grid max-w-[1440px] justify-items-start gap-6 px-5 py-28 sm:px-8 lg:py-40">
          <h2 className="max-w-2xl text-[38px] font-light leading-[1.02] sm:text-[60px]">Sit on it before you buy it</h2>
          <p className="max-w-md text-[16px] text-ink/80">Book an hour in the showroom on Charoen Krung. We set out the pieces you are curious about and bring the swatch library to the table.</p>
          <Link href={`${R}/visit`} className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] text-bg hover:opacity-90">
            Book a visit {Icon.arrow}
          </Link>
        </div>
      </section>
    </>
  );
}

function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = orraSlides.length;
  const go = (d: number) => setI((v) => (v + d + n) % n);
  const sl = orraSlides[i];
  const inCat = orra.filter((p) => p.cat === sl.cat);
  const cat = orraCats.find((c) => c.name === sl.cat)!;
  return (
    <section
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-[#121110]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      {orraSlides.map((x, j) => (
        <div
          key={x.img}
          aria-hidden={j !== i}
          className="absolute inset-0 transition-[opacity,transform] ease-out will-change-transform"
          style={{ opacity: j === i ? 1 : 0, transform: `scale(${j === i ? 1 : 1.06})`, transitionDuration: `1.2s, ${j === i ? 8 : 1.2}s` }}
        >
          <Img src={x.img} alt="" className="absolute inset-0 bg-transparent" sizes="100vw" priority={j === 0} position={x.pos} />
        </div>
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(18_17_15/0.6),rgb(18_17_15/0.25)_45%,rgb(18_17_15/0.7))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(18_17_15/0.8),transparent_45%)]" />

      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-end gap-8 px-5 pb-20 pt-28 sm:px-8 lg:pb-16">
        <div className="lg:ml-auto lg:w-[46%] lg:pb-24">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial="a" animate="b" exit="c" className="grid gap-5">
              <h1 className="text-[clamp(46px,7.4vw,118px)] font-light leading-[0.94] tracking-[-0.02em]">
                {sl.title.map((t, k) => (
                  <span key={t} className="block overflow-hidden pb-[0.06em]">
                    <motion.span
                      className="block"
                      variants={{ a: { y: "105%" }, b: { y: 0, transition: { duration: 0.9, ease, delay: 0.08 * k } }, c: { y: "-105%", transition: { duration: 0.45, ease } } }}
                    >
                      {t}
                    </motion.span>
                  </span>
                ))}
              </h1>
              <motion.p
                className="max-w-sm text-[15px] leading-relaxed text-ink/75 sm:text-[16px]"
                variants={{ a: { opacity: 0, y: 12 }, b: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.25 } }, c: { opacity: 0, transition: { duration: 0.3 } } }}
              >
                {sl.line}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <Link
            href={`${R}/shop/${cat.slug}`}
            className="group flex w-full items-center gap-4 rounded-[22px] border border-white/15 bg-white/10 p-2.5 pr-5 backdrop-blur-xl transition-colors hover:bg-white/15 sm:w-[380px]"
          >
            <Img src={inCat[0].img} alt="" ratio={1} sizes="80px" widths={[800]} className="w-[76px] shrink-0 rounded-[16px]" />
            <span className="min-w-0 flex-1">
              <span className="block text-[16px]">{sl.card}</span>
              <span className="block text-[13px] text-ink/65">
                {inCat.length} pieces from {baht(Math.min(...inCat.map((p) => p.price)))}
              </span>
            </span>
            <span className="rounded-full bg-ink px-4 py-2 text-[13px] text-bg transition-transform group-hover:-translate-x-0.5">Shop now</span>
          </Link>

          <div className="flex items-center gap-5">
            <div className="flex flex-1 items-center gap-3 text-[13px] tabular-nums sm:w-64 sm:flex-none">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span className="relative h-px flex-1 overflow-hidden bg-white/25">
                <span
                  key={i}
                  className="absolute inset-0 origin-left bg-ink"
                  style={{ animation: `orra-fill 7s linear forwards`, animationPlayState: paused ? "paused" : "running" }}
                  onAnimationEnd={() => go(1)}
                />
              </span>
              <span className="text-ink/60">{String(n).padStart(2, "0")}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => go(-1)} aria-label="Previous collection" className="grid size-11 place-items-center rounded-full border border-white/25 backdrop-blur-md hover:bg-white/10">
                {Icon.left}
              </button>
              <button onClick={() => go(1)} aria-label="Next collection" className="grid size-11 place-items-center rounded-full bg-ink text-bg hover:opacity-90">
                {Icon.right}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- shop ---------------- */

function Grid({ list }: { list: OrraProduct[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 lg:grid-cols-4">
      {list.map((p) => (
        <Card key={p.id} p={p} />
      ))}
    </ul>
  );
}

function Card({ p }: { p: OrraProduct }) {
  const s = useStore();
  const on = s.wish.includes(p.id);
  return (
    <li className="group grid content-start gap-3">
      <div className="relative">
        <Link href={`${R}/p/${p.id}`} className="block">
          <Img src={p.img} alt={p.alt} ratio={4 / 5} sizes="(min-width:1024px) 25vw, 50vw" widths={[800]} className="rounded-[var(--r-lg)]" imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
        </Link>
        <button
          onClick={() => s.toggleWish(p.id)}
          aria-label={on ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
          aria-pressed={on}
          className="absolute right-2.5 top-2.5 grid size-9 place-items-center rounded-full bg-black/30 backdrop-blur-md"
        >
          <Heart on={on} size={16} />
        </button>
      </div>
      <Link href={`${R}/p/${p.id}`} className="grid gap-0.5">
        <span className="text-[15px]">{p.name}</span>
        <span className="text-[14px] text-muted">
          {p.opts && p.opts.some((o) => o.add) ? "From " : ""}
          {baht(p.price)}
        </span>
      </Link>
    </li>
  );
}

function QuickAdd({ id }: { id: string }) {
  const s = useStore();
  const p = orraById(id)!;
  return (
    <button className="h-10 rounded-full border border-line text-[13px] hover:border-ink" onClick={() => s.add({ id, opt: p.opts?.[0].key, qty: 1 })}>
      Add to bag{p.opts ? `, ${p.opts[0].label}` : ""}
    </button>
  );
}

function Shop({ cat }: { cat?: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const q = (params.get("q") ?? "").trim();
  const [sort, setSort] = useState("featured");
  const list = useMemo(() => {
    let l = orra.filter((p) => (!cat || p.cat === cat) && (!q || `${p.name} ${p.cat} ${p.blurb}`.toLowerCase().includes(q.toLowerCase())));
    if (sort === "low") l = [...l].sort((x, y) => x.price - y.price);
    if (sort === "high") l = [...l].sort((x, y) => y.price - x.price);
    return l;
  }, [cat, q, sort]);
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-28 sm:px-8 lg:pt-36">
      <h1 className="text-[40px] font-light leading-none sm:text-[64px]">{q ? `Results for "${q}"` : (cat ?? "All pieces")}</h1>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <nav className="-mx-1 flex gap-2 overflow-x-auto px-1" aria-label="Categories">
          {[{ name: "All", slug: "" }, ...orraCats].map((c) => {
            const on = (c.name === "All" && !cat) || c.name === cat;
            return (
              <Link key={c.name} href={`${R}/shop${c.slug ? `/${c.slug}` : ""}`} aria-current={on ? "page" : undefined} className={`shrink-0 rounded-full border px-4 py-2 text-[14px] ${on ? "border-ink bg-ink text-bg" : "border-line hover:border-ink/50"}`}>
                {c.name}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4 text-[14px]">
          {q && (
            <button className="underline underline-offset-4" onClick={() => router.push(`${R}/shop${cat ? `/${orraCats.find((c) => c.name === cat)!.slug}` : ""}`)}>
              Clear search
            </button>
          )}
          <span className="text-muted">{list.length} pieces</span>
          <label className="flex items-center gap-2">
            <span className="text-muted">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-line bg-bg px-3 py-2 outline-none">
              <option value="featured">Featured</option>
              <option value="low">Price, low to high</option>
              <option value="high">Price, high to low</option>
            </select>
          </label>
        </div>
      </div>
      <div className="mt-10">
        {list.length ? (
          <Grid list={list} />
        ) : (
          <div className="grid justify-items-start gap-4 py-10">
            <p className="text-muted">No pieces match that search.</p>
            <Link href={`${R}/shop`} className={`${btn.ghost} w-auto`}>
              See every piece
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Product({ p }: { p: OrraProduct }) {
  const s = useStore();
  const [opt, setOpt] = useState(p.opts?.[0].key);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const now = useNow();
  const o = orraOpt(p, opt);
  const price = p.price + (o?.add ?? 0);
  const on = s.wish.includes(p.id);
  const made = p.lead.startsWith("Made");
  const weeks = made ? +(p.lead.match(/(\d+) weeks/)?.[1] ?? 6) : 0;
  const eta = !now ? "" : made ? `about ${day(addDays(now, weeks * 7))}` : `${day(addDays(now, 5))} to ${day(addDays(now, 7))}`;
  const related = orra.filter((x) => x.cat === p.cat && x.id !== p.id).concat(orra.filter((x) => x.cat !== p.cat)).slice(0, 4);
  const pic = p.gallery[shot] ?? p.gallery[0];
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-24 sm:px-8 lg:pt-32">
      <nav className="mb-6 text-[13px] text-muted" aria-label="Breadcrumb">
        <Link href={`${R}/shop`} className="hover:text-ink">
          Shop
        </Link>{" "}
        /{" "}
        <Link href={`${R}/shop/${orraCats.find((c) => c.name === p.cat)!.slug}`} className="hover:text-ink">
          {p.cat}
        </Link>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div className="grid min-w-0 content-start gap-3">
          <Img key={pic.img} src={pic.img} alt={pic.alt} ratio={Math.max(0.8, Math.min(1.4, pic.ratio))} sizes="(min-width:1024px) 55vw, 100vw" priority className="rounded-[var(--r-lg)]" />
          {p.gallery.length > 1 && (
            <div className="flex gap-3">
              {p.gallery.map((x, k) => (
                <button key={x.img} onClick={() => setShot(k)} aria-label={`Show photo ${k + 1}`} aria-pressed={k === shot} className={`w-24 overflow-hidden rounded-[12px] border-2 ${k === shot ? "border-ink" : "border-transparent opacity-70"}`}>
                  <Img src={x.img} alt="" ratio={1} sizes="96px" widths={[800]} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid content-start gap-7 lg:sticky lg:top-28 lg:self-start">
          <div className="grid gap-3">
            <h1 className="text-[36px] font-light leading-[1.02] sm:text-[52px]">{p.name}</h1>
            <p className="text-[20px] tabular-nums">{baht(price)}</p>
            <p className="max-w-md text-[15px] leading-relaxed text-muted">{p.blurb}</p>
          </div>

          {p.opts && (
            <div className="grid gap-3">
              <p className="text-[14px]">
                {p.optName}: <span className="text-muted">{o?.label}</span>
              </p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={p.optName}>
                {p.opts.map((x) => (
                  <button
                    key={x.key}
                    role="radio"
                    aria-checked={x.key === opt}
                    onClick={() => setOpt(x.key)}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-[14px] ${x.key === opt ? "border-ink" : "border-line hover:border-ink/50"}`}
                  >
                    {x.swatch && <span className="size-4 rounded-full border border-white/20" style={{ background: x.swatch }} />}
                    {x.label}
                    {x.add ? <span className="text-muted">+{baht(x.add)}</span> : null}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Qty value={qty} onChange={setQty} max={p.stock} />
            <button className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-ink text-[15px] text-bg hover:opacity-90" onClick={() => s.add({ id: p.id, opt, qty })}>
              Add to bag, {baht(price * qty)}
            </button>
            <button onClick={() => s.toggleWish(p.id)} aria-pressed={on} aria-label={on ? "Remove from wishlist" : "Save to wishlist"} className="grid size-12 shrink-0 place-items-center rounded-full border border-line hover:border-ink">
              <Heart on={on} />
            </button>
          </div>

          <div className="grid gap-1 rounded-[var(--r-sm)] bg-soft p-4 text-[14px]">
            <p>{p.lead}</p>
            <p className="min-h-[1.5em] text-muted">{eta && `Order today and it reaches you ${eta}. `}Free white glove delivery in Bangkok over ฿30,000.</p>
          </div>

          <div className="border-t border-line">
            {[
              ["Details", <ul key="d" className="grid list-disc gap-1 pl-5">{p.details.map((d) => <li key={d}>{d}</li>)}</ul>],
              ["Size", <p key="s">{p.size}</p>],
              ["Delivery and returns", <p key="r">White glove delivery across Bangkok and nearby provinces, with assembly on request. Pieces from stock can be returned within 30 days. Made to order pieces are final once production begins, which we confirm by phone.</p>],
            ].map(([t, body], k) => (
              <details key={t as string} className="group border-b border-line" open={k === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[15px]">
                  {t}
                  <span className="text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="pb-5 text-[14px] leading-relaxed text-muted">{body}</div>
              </details>
            ))}
          </div>
          <Link href={`${R}/visit?piece=${p.id}`} className="text-[14px] underline underline-offset-4">
            See it in the showroom first
          </Link>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="mb-8 text-[28px] font-light sm:text-[36px]">You may also like</h2>
        <Grid list={related} />
      </section>
    </div>
  );
}

function Missing() {
  return (
    <div className="mx-auto grid max-w-md justify-items-center gap-5 px-5 py-40 text-center">
      <h1 className="text-[40px] font-light">This page has moved</h1>
      <Link href={`${R}/shop`} className={`${btn.primary} w-auto`}>
        Go to the shop
      </Link>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="grid content-start gap-5">
          <p className="text-[22px] font-light tracking-[0.32em]">ORRA</p>
          <p className="max-w-sm text-[14px] text-muted">Letters on new pieces and the occasional workshop open day. About once a month.</p>
          <Newsletter className="max-w-sm" />
        </div>
        <div className="grid content-start gap-3 text-[14px]">
          <p className="text-muted">Shop</p>
          {orraCats.map((c) => (
            <Link key={c.slug} href={`${R}/shop/${c.slug}`} className="hover:text-accent">
              {c.name}
            </Link>
          ))}
        </div>
        <div className="grid content-start gap-3 text-[14px]">
          <p className="text-muted">Help</p>
          <Link href={`${R}/account`} className="hover:text-accent">
            Track an order
          </Link>
          <Link href={`${R}/visit`} className="hover:text-accent">
            Book a visit
          </Link>
          <Link href={`${R}/wishlist`} className="hover:text-accent">
            Wishlist
          </Link>
        </div>
        <div className="grid content-start gap-2 text-[14px] text-muted">
          <p>Showroom</p>
          <p className="text-ink">1247 Charoen Krung 43, Bang Rak, Bangkok 10500</p>
          <p>Tuesday to Sunday, 10:00 to 19:00</p>
          <a href="tel:+6621234567" className="text-ink hover:text-accent">
            02 123 4567
          </a>
        </div>
      </div>
    </footer>
  );
}
