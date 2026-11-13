"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { resetScroll } from "@/components/shared/motion";
import { AuthSheet, Newsletter, btn } from "@/components/kit/panels";
import { baht, day, useNow } from "@/components/kit/persist";
import { StoreProvider, useStore, type Catalog } from "@/components/kit/store";
import { Heart, Icon, Img, Sheet } from "@/components/kit/ui";
import { departures, destById, dests, tripById, trips, tripsFor, type Trip } from "@/data/tera";
import { Hero } from "./Hero";
import { Book, MyTrips } from "./Book";

const R = "/tera";
const catalog: Catalog = { price: () => 0, name: (l) => l.id, img: () => "" };
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const tripImg = (t: Trip) => t.gallery[0];

export function TeraSite({ segs = [] }: { segs?: string[] }) {
  const [a, b] = segs;
  const path = segs.join("/");
  useEffect(resetScroll, [path]);
  const trip = a === "trip" && b ? tripById(b) : undefined;
  let view;
  if (!a) view = <Home />;
  else if (a === "destinations") view = <Destinations />;
  else if (a === "trips")
    view = (
      <Suspense fallback={<div className="min-h-screen" />}>
        <Trips />
      </Suspense>
    );
  else if (trip) view = <TripPage key={trip.id} t={trip} />;
  else if (a === "book")
    view = (
      <Suspense fallback={<div className="min-h-screen" />}>
        <Book />
      </Suspense>
    );
  else if (a === "account") view = <MyTrips />;
  else view = <Missing />;
  return (
    <StoreProvider brand="tera" catalog={catalog}>
      <Header overHero={!a || !!trip} />
      <main>{view}</main>
      <Footer />
      <AuthSheet />
      <Menu />
    </StoreProvider>
  );
}

function Header({ overHero }: { overHero: boolean }) {
  const s = useStore();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", on, { passive: true });
    requestAnimationFrame(on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  const light = overHero && !scrolled;
  const nav = [
    ["Home", R],
    ["Destinations", `${R}/destinations`],
    ["Trips", `${R}/trips`],
    ["My trips", `${R}/account`],
  ];
  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${light ? "text-white" : "bg-bg/85 text-ink backdrop-blur-xl"}`}>
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-4 px-5 sm:px-8">
        <Link href={R} className="font-display flex items-center gap-2 text-[22px] font-extrabold tracking-[-0.02em]" style={{ fontStretch: "125%" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 3l9 16H3z" />
          </svg>
          Tera
        </Link>
        <nav className={`mx-auto hidden items-center gap-1 rounded-full border p-1 text-[14px] backdrop-blur-xl md:flex ${light ? "border-white/25 bg-white/10" : "border-line bg-white/60"}`}>
          {nav.map(([t, h]) => (
            <Link key={h} href={h} className={`rounded-full px-4 py-2 ${light ? "hover:bg-white/15" : "hover:bg-soft"}`}>
              {t}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {s.user ? (
            <Link href={`${R}/account`} className={`hidden h-10 items-center gap-2 rounded-full pl-1 pr-4 text-[14px] sm:flex ${light ? "bg-white/15" : "bg-soft"}`}>
              <span className="grid size-8 place-items-center rounded-full bg-accent text-[13px] font-semibold text-accent-ink">{s.user.name.slice(0, 1).toUpperCase()}</span>
              {s.user.name.split(" ")[0]}
            </Link>
          ) : (
            <>
              <button onClick={() => s.setPanel("login")} className="hidden h-10 rounded-full px-4 text-[14px] sm:block">
                Log in
              </button>
              <button onClick={() => s.setPanel("signup")} className={`hidden h-10 rounded-full px-5 text-[14px] font-medium sm:block ${light ? "bg-white text-[#15140f]" : "bg-ink text-bg"}`}>
                Sign up
              </button>
            </>
          )}
          <button onClick={() => s.setPanel("menu")} aria-label="Menu" className={`grid size-10 place-items-center rounded-full md:hidden ${light ? "bg-white/15" : "bg-soft"}`}>
            {Icon.menu}
          </button>
        </div>
      </div>
    </header>
  );
}

function Menu() {
  const s = useStore();
  const close = () => s.setPanel(null);
  return (
    <Sheet open={s.panel === "menu"} onClose={close} title="Tera">
      <nav className="grid">
        {[
          ["Home", R],
          ["Destinations", `${R}/destinations`],
          ["All trips", `${R}/trips`],
          ["My trips", `${R}/account`],
        ].map(([t, h]) => (
          <Link key={h} href={h} onClick={close} className="border-b border-line py-4 text-[20px]">
            {t}
          </Link>
        ))}
      </nav>
      {!s.user && (
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button className={btn.ghost} onClick={() => s.setPanel("login")}>
            Log in
          </button>
          <button className={btn.primary} onClick={() => s.setPanel("signup")}>
            Sign up
          </button>
        </div>
      )}
    </Sheet>
  );
}

/* ---------------- home ---------------- */

function Home() {
  return (
    <>
      <Hero />
      <SearchBar />
      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display max-w-2xl text-[36px] leading-[1] sm:text-[54px]">Eight places we know by heart</h2>
          <Link href={`${R}/destinations`} className="text-[14px] underline underline-offset-4">
            All destinations
          </Link>
        </div>
        <DestGrid />
      </section>
      <section className="bg-ink text-bg">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:py-28">
          <h2 className="font-display text-[36px] leading-[1] sm:text-[54px]">Small groups, real leaders, no rushing</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              ["Twelve at most", "Small enough for a family run guesthouse, a dahabiya or a mountain hut."],
              ["Leaders who live there", "Every trip is led by someone who grew up in the region and speaks the language."],
              ["Pay a deposit", "Hold your place with 30%. The balance is due 60 days before you fly."],
            ].map(([t, d]) => (
              <div key={t} className="grid content-start gap-2 border-t border-bg/20 pt-5">
                <p className="text-[18px] font-medium">{t}</p>
                <p className="text-[14.5px] leading-relaxed text-bg/65">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:py-28">
        <h2 className="font-display mb-10 text-[36px] leading-[1] sm:text-[54px]">Leaving soon</h2>
        <TripGrid list={trips.slice(0, 4)} />
      </section>
    </>
  );
}

function SearchBar() {
  const router = useRouter();
  const now = useNow();
  const [d, setD] = useState("");
  const [m, setM] = useState("");
  const [n, setN] = useState(2);
  const months = useMemo(() => (now ? Array.from({ length: 12 }, (_, k) => new Date(now.getFullYear(), now.getMonth() + 1 + k, 1)) : []), [now]);
  return (
    <section className="relative z-10 mx-auto -mt-px max-w-[1440px] px-5 sm:px-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const q = new URLSearchParams();
          if (d) q.set("d", d);
          if (m) q.set("m", m);
          q.set("n", String(n));
          router.push(`${R}/trips?${q}`);
        }}
        className="grid gap-2 rounded-[var(--r-lg)] border border-line bg-white p-2 shadow-[0_24px_60px_rgb(21_20_15/0.08)] sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center lg:mt-[-44px]"
      >
        <label className="grid gap-0.5 rounded-[18px] px-4 py-2.5 hover:bg-soft">
          <span className="text-[12px] text-muted">Where to</span>
          <select value={d} onChange={(e) => setD(e.target.value)} className="bg-transparent text-[15px] outline-none">
            <option value="">Anywhere</option>
            {dests.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}, {x.place}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-0.5 rounded-[18px] px-4 py-2.5 hover:bg-soft">
          <span className="text-[12px] text-muted">When</span>
          <select value={m} onChange={(e) => setM(e.target.value)} className="bg-transparent text-[15px] outline-none">
            <option value="">Any month</option>
            {months.map((x) => (
              <option key={x.toISOString()} value={`${x.getFullYear()}-${x.getMonth() + 1}`}>
                {x.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center justify-between gap-3 rounded-[18px] px-4 py-2.5">
          <span className="grid gap-0.5">
            <span className="text-[12px] text-muted">Travellers</span>
            <span className="text-[15px] tabular-nums">{n}</span>
          </span>
          <span className="flex gap-1">
            <button type="button" aria-label="Fewer travellers" disabled={n <= 1} onClick={() => setN(n - 1)} className="grid size-9 place-items-center rounded-full border border-line disabled:opacity-30">
              -
            </button>
            <button type="button" aria-label="More travellers" disabled={n >= 6} onClick={() => setN(n + 1)} className="grid size-9 place-items-center rounded-full border border-line disabled:opacity-30">
              +
            </button>
          </span>
        </div>
        <button className="inline-flex h-14 items-center justify-center gap-2 rounded-[18px] bg-ink px-7 text-[15px] text-bg hover:opacity-90">
          {Icon.search} Find trips
        </button>
      </form>
    </section>
  );
}

function DestGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {dests.map((d) => (
        <li key={d.id}>
          <Link href={`${R}/trips?d=${d.id}`} className="group relative block overflow-hidden rounded-[var(--r-lg)]">
            <Img src={d.img} alt={`${d.place}, ${d.name}`} ratio={3 / 4} widths={[960]} sizes="(min-width:1024px) 25vw, 50vw" position={`${d.fx * 100}% ${d.fy * 100}%`} imgClassName="transition-transform duration-[1.2s] group-hover:scale-[1.05]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_12_16/0.7),transparent_55%)]" />
            <div className="absolute inset-x-4 bottom-4 text-white">
              <p className="font-display text-[22px] font-bold sm:text-[26px]">{d.name}</p>
              <p className="text-[13px] text-white/75">
                {d.place}, from {baht(Math.min(...tripsFor(d.id).map((t) => t.price)))}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Destinations() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-32 sm:px-8 lg:pt-40">
      <h1 className="font-display mb-4 text-[44px] leading-none sm:text-[72px]">Destinations</h1>
      <p className="mb-10 max-w-xl text-[16px] text-muted">Every place we go, with the best months to travel. Choose one to see its trips and departure dates.</p>
      <div className="grid gap-4">
        {dests.map((d) => (
          <Link key={d.id} href={`${R}/trips?d=${d.id}`} className="group grid gap-5 rounded-[var(--r-lg)] border border-line p-3 hover:bg-white sm:grid-cols-[260px_1fr_auto] sm:items-center">
            <Img src={d.img} alt={`${d.place}, ${d.name}`} ratio={16 / 10} widths={[960]} sizes="260px" position={`${d.fx * 100}% ${d.fy * 100}%`} className="rounded-[18px]" />
            <div className="grid gap-1.5 px-2 sm:px-0">
              <p className="font-display text-[26px] font-bold leading-tight">
                {d.name} <span className="font-normal text-muted">{d.place}</span>
              </p>
              <p className="max-w-xl text-[14.5px] text-muted">{d.blurb}</p>
              <p className="text-[13px]">Best {d.season}</p>
            </div>
            <span className="mx-2 mb-2 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] text-bg sm:m-0 sm:mr-3">
              {tripsFor(d.id).length} trip{tripsFor(d.id).length > 1 ? "s" : ""}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------------- trips ---------------- */

export function TripGrid({ list }: { list: Trip[] }) {
  const s = useStore();
  return (
    <ul className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {list.map((t) => {
        const d = destById(t.dest)!;
        const on = s.wish.includes(t.id);
        return (
          <li key={t.id} className="group grid content-start gap-3">
            <div className="relative">
              <Link href={`${R}/trip/${t.id}`} className="block">
                <Img src={tripImg(t)} alt={`${d.place}, ${d.name}`} ratio={4 / 3} widths={t.gallery[0] === d.img ? [960] : [800]} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" position={t.gallery[0] === d.img ? `${d.fx * 100}% ${d.fy * 100}%` : undefined} className="rounded-[var(--r-lg)]" imgClassName="transition-transform duration-[1.2s] group-hover:scale-[1.04]" />
              </Link>
              <button onClick={() => s.toggleWish(t.id)} aria-pressed={on} aria-label={on ? `Remove ${t.title} from saved trips` : `Save ${t.title}`} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/85 text-ink backdrop-blur">
                <Heart on={on} size={16} />
              </button>
              <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-[12px] backdrop-blur">{t.level}</span>
            </div>
            <Link href={`${R}/trip/${t.id}`} className="grid gap-1">
              <span className="text-[13px] text-muted">
                {d.name}, {t.days} days
              </span>
              <span className="text-[17px] font-medium leading-snug">{t.title}</span>
              <span className="text-[14px]">From {baht(t.price)}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Trips() {
  const params = useSearchParams();
  const router = useRouter();
  const now = useNow();
  const d = params.get("d") ?? "";
  const m = params.get("m") ?? "";
  const n = Math.max(1, Math.min(6, +(params.get("n") ?? 1) || 1));
  const [len, setLen] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("soon");
  const set = (k: string, v: string) => {
    const q = new URLSearchParams(params.toString());
    if (v) q.set(k, v);
    else q.delete(k);
    router.replace(`${R}/trips${q.size ? `?${q}` : ""}`, { scroll: false });
  };
  const list = useMemo(() => {
    let l = trips.filter((t) => (!d || t.dest === d) && (!level || t.level === level) && (!len || (len === "s" ? t.days <= 7 : len === "m" ? t.days > 7 && t.days <= 10 : t.days > 10)));
    if (m && now) {
      const [y, mo] = m.split("-").map(Number);
      l = l.filter((t) => departures(t, now).some((x) => x.date.getFullYear() === y && x.date.getMonth() + 1 === mo && x.seats >= n));
    }
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    else if (sort === "short") l = [...l].sort((a, b) => a.days - b.days);
    else if (now) l = [...l].sort((a, b) => departures(a, now, 1)[0].date.getTime() - departures(b, now, 1)[0].date.getTime());
    return l;
  }, [d, m, n, len, level, sort, now]);
  const dest = destById(d);
  const monthLabel = m ? new Date(+m.split("-")[0], +m.split("-")[1] - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "";
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-32 sm:px-8 lg:pt-40">
      <h1 className="font-display text-[44px] leading-none sm:text-[72px]">{dest ? dest.name : "All trips"}</h1>
      <p className="mt-3 text-[15px] text-muted">
        {list.length} trip{list.length === 1 ? "" : "s"}
        {monthLabel && ` departing in ${monthLabel}`}
        {n > 1 && ` with room for ${n}`}
      </p>
      <div className="mt-8 grid gap-4 border-b border-line pb-6">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1">
          {[{ id: "", name: "Everywhere" }, ...dests].map((x) => (
            <button key={x.id} onClick={() => set("d", x.id)} aria-pressed={d === x.id} className={`shrink-0 rounded-full border px-4 py-2 text-[14px] ${d === x.id ? "border-ink bg-ink text-bg" : "border-line hover:border-ink/40"}`}>
              {x.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 text-[14px]">
          <select aria-label="Length" value={len} onChange={(e) => setLen(e.target.value)} className="rounded-full border border-line bg-bg px-4 py-2">
            <option value="">Any length</option>
            <option value="s">Up to a week</option>
            <option value="m">8 to 10 days</option>
            <option value="l">11 days or more</option>
          </select>
          <select aria-label="Activity level" value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-full border border-line bg-bg px-4 py-2">
            <option value="">Any level</option>
            <option>Easy</option>
            <option>Moderate</option>
            <option>Challenging</option>
          </select>
          <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-line bg-bg px-4 py-2">
            <option value="soon">Leaving soonest</option>
            <option value="low">Lowest price</option>
            <option value="short">Shortest</option>
          </select>
          {(m || n > 1) && (
            <button onClick={() => router.replace(`${R}/trips${d ? `?d=${d}` : ""}`, { scroll: false })} className="rounded-full px-3 py-2 underline underline-offset-4">
              Clear dates and travellers
            </button>
          )}
        </div>
      </div>
      <div className="mt-10">
        {list.length ? (
          <TripGrid list={list} />
        ) : (
          <div className="grid justify-items-start gap-4 py-6">
            <p className="text-muted">No trip matches all of these. Try another month or fewer filters.</p>
            <Link href={`${R}/trips`} className={`${btn.ghost} w-auto`}>
              See every trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function TripPage({ t }: { t: Trip }) {
  const s = useStore();
  const router = useRouter();
  const now = useNow();
  const d = destById(t.dest)!;
  const deps = useMemo(() => (now ? departures(t, now) : []), [t, now]);
  const [pick, setPick] = useState(-1);
  const sel = pick >= 0 ? deps[pick] : deps.find((x) => x.seats > 0);
  const [n, setN] = useState(2);
  const [own, setOwn] = useState(false);
  const [shot, setShot] = useState(0);
  const on = s.wish.includes(t.id);
  const maxN = Math.min(6, sel?.seats ?? 6);
  const people = Math.min(n, Math.max(1, maxN));
  const total = sel ? people * (sel.price + (own ? t.single : 0)) : 0;
  const hero = t.gallery[shot] ?? t.gallery[0];
  const isDest = hero === d.img;
  return (
    <div className="pb-24">
      <section className="relative h-[70svh] min-h-[460px] overflow-hidden bg-[#0d0f12] text-white">
        <Img key={hero} src={hero} alt={`${d.place}, ${d.name}`} widths={isDest ? [960, 1920] : [800, 1600]} className="absolute inset-0" priority position={isDest ? `${d.fx * 100}% ${d.fy * 100}%` : undefined} />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_12_16/0.75),transparent_55%),linear-gradient(to_bottom,rgb(10_12_16/0.4),transparent_25%)]" />
        <div className="absolute inset-x-0 bottom-0 mx-auto grid max-w-[1440px] gap-4 px-5 pb-8 sm:px-8 lg:pb-12">
          <p className="text-[14px] text-white/80">
            <Link href={`${R}/trips?d=${d.id}`} className="underline underline-offset-4">
              {d.name}
            </Link>
            , {d.place}
          </p>
          <h1 className="font-display max-w-4xl text-[38px] leading-[1] sm:text-[64px]">{t.title}</h1>
          {t.gallery.length > 1 && (
            <div className="flex gap-2">
              {t.gallery.map((g, k) => (
                <button key={g} onClick={() => setShot(k)} aria-label={`Show photo ${k + 1}`} aria-pressed={k === shot} className={`h-12 w-16 overflow-hidden rounded-[10px] border-2 ${k === shot ? "border-white" : "border-transparent opacity-70"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/${g}-${g === d.img ? 960 : 800}.webp`} alt="" className="size-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pt-10 sm:px-8 lg:grid-cols-[1fr_420px] lg:gap-16">
        <div className="grid min-w-0 content-start gap-12">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--r-lg)] bg-line sm:grid-cols-4">
            {[
              ["Length", `${t.days} days`],
              ["Group", `Up to ${t.group}`],
              ["Activity", t.level],
              ["From", baht(t.price)],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-1 bg-bg p-4">
                <dt className="text-[12.5px] text-muted">{k}</dt>
                <dd className="text-[17px]">{v}</dd>
              </div>
            ))}
          </dl>
          <section className="grid gap-4">
            <h2 className="font-display text-[28px]">Highlights</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {t.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-[15px]">
                  <span className="mt-0.5 text-accent">{Icon.check}</span>
                  {h}
                </li>
              ))}
            </ul>
          </section>
          <section className="grid gap-2">
            <h2 className="font-display mb-2 text-[28px]">Day by day</h2>
            {t.plan.map(([title, body], k) => (
              <details key={k} className="group border-b border-line" open={k < 2}>
                <summary className="flex cursor-pointer list-none items-baseline gap-4 py-4">
                  <span className="w-14 shrink-0 text-[13px] text-muted">Day {k + 1}</span>
                  <span className="flex-1 text-[16px]">{title}</span>
                  <span className="text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-4 pl-[72px] text-[14.5px] leading-relaxed text-muted">{body}</p>
              </details>
            ))}
          </section>
          <section className="grid gap-8 sm:grid-cols-2">
            <div className="grid content-start gap-3">
              <h2 className="text-[18px] font-medium">Included</h2>
              <ul className="grid gap-2 text-[14.5px] text-muted">
                {t.includes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="grid content-start gap-3">
              <h2 className="text-[18px] font-medium">Not included</h2>
              <ul className="grid gap-2 text-[14.5px] text-muted">
                {t.excludes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </section>
          <section className="grid gap-4" id="dates">
            <h2 className="font-display text-[28px]">Departures</h2>
            <div className="overflow-hidden rounded-[var(--r-lg)] border border-line">
              {deps.length === 0 && <div className="h-80 animate-pulse bg-soft" />}
              {deps.map((x, k) => {
                const end = new Date(x.date);
                end.setDate(end.getDate() + t.days - 1);
                const chosen = sel === x;
                return (
                  <button
                    key={x.date.toISOString()}
                    disabled={x.seats === 0}
                    onClick={() => setPick(k)}
                    aria-pressed={chosen}
                    className={`grid w-full grid-cols-[1fr_auto] items-center gap-3 border-b border-line px-4 py-4 text-left last:border-0 disabled:cursor-not-allowed disabled:opacity-45 sm:grid-cols-[1fr_140px_120px] ${chosen ? "bg-white" : "hover:bg-white/60"}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`size-[18px] shrink-0 rounded-full border ${chosen ? "border-[6px] border-ink" : "border-line"}`} />
                      <span>
                        <span className="block text-[15px]">
                          {day(x.date)} to {day(end)}
                        </span>
                        <span className="block text-[13px] text-muted sm:hidden">{x.seats === 0 ? "Full" : `${x.seats} places left`}</span>
                      </span>
                    </span>
                    <span className={`hidden text-[14px] sm:block ${x.seats > 0 && x.seats <= 3 ? "text-[var(--bad)]" : "text-muted"}`}>{x.seats === 0 ? "Full, join the waitlist" : x.seats <= 3 ? `Only ${x.seats} left` : `${x.seats} places left`}</span>
                    <span className="text-right text-[15px] tabular-nums">{baht(x.price)}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="grid gap-5 rounded-[var(--r-lg)] border border-line bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[13px] text-muted">{sel ? `${day(sel.date)}, ${t.days} days` : "Choose a departure"}</p>
                <p className="text-[24px]">
                  {baht(sel?.price ?? t.price)} <span className="text-[14px] text-muted">per person</span>
                </p>
              </div>
              <button onClick={() => s.toggleWish(t.id)} aria-pressed={on} aria-label={on ? "Remove from saved trips" : "Save trip"} className="grid size-11 shrink-0 place-items-center rounded-full border border-line hover:border-ink">
                <Heart on={on} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px]">Travellers</span>
              <span className="flex items-center gap-3">
                <button aria-label="Fewer travellers" disabled={people <= 1} onClick={() => setN(people - 1)} className="grid size-9 place-items-center rounded-full border border-line disabled:opacity-30">
                  -
                </button>
                <span className="w-4 text-center tabular-nums">{people}</span>
                <button aria-label="More travellers" disabled={people >= maxN} onClick={() => setN(people + 1)} className="grid size-9 place-items-center rounded-full border border-line disabled:opacity-30">
                  +
                </button>
              </span>
            </div>
            <div className="grid gap-2" role="radiogroup" aria-label="Room">
              {[
                [false, "Share a room", people === 1 ? "We pair you with a traveller of the same gender" : "Twin or double rooms"],
                [true, `Own room, +${baht(t.single)} each`, "A private room every night"],
              ].map(([v, title, sub]) => (
                <button key={String(v)} role="radio" aria-checked={own === v} onClick={() => setOwn(v as boolean)} className={`rounded-[var(--r-sm)] border px-4 py-3 text-left ${own === v ? "border-ink bg-soft" : "border-line"}`}>
                  <span className="block text-[14.5px]">{title as string}</span>
                  <span className="block text-[12.5px] text-muted">{sub as string}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between border-t border-line pt-4 text-[16px]">
              <span>Total</span>
              <span className="tabular-nums">{baht(total)}</span>
            </div>
            <button
              className={btn.primary}
              disabled={!sel}
              onClick={() => sel && router.push(`${R}/book?trip=${t.id}&dep=${iso(sel.date)}&n=${people}&room=${own ? "own" : "share"}`)}
            >
              Continue to booking
            </button>
            <p className="text-center text-[12.5px] text-muted">Hold your place with a 30% deposit, {baht(Math.round(total * 0.3))} today.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Missing() {
  return (
    <div className="mx-auto grid max-w-md justify-items-center gap-5 px-5 py-40 text-center">
      <h1 className="font-display text-[40px]">We could not find that page</h1>
      <Link href={`${R}/trips`} className={`${btn.primary} w-auto`}>
        See all trips
      </Link>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="grid content-start gap-4">
          <p className="font-display text-[26px] font-extrabold" style={{ fontStretch: "125%" }}>
            Tera
          </p>
          <p className="max-w-sm text-[14px] text-muted">New departures and early booking prices, once a month.</p>
          <Newsletter className="max-w-sm" />
        </div>
        <div className="grid content-start gap-3 text-[14px]">
          <p className="text-muted">Travel</p>
          <Link href={`${R}/destinations`}>Destinations</Link>
          <Link href={`${R}/trips`}>All trips</Link>
          <Link href={`${R}/account`}>My trips</Link>
        </div>
        <div className="grid content-start gap-2 text-[14px] text-muted">
          <p>Tera Journeys Co., Ltd.</p>
          <p className="text-ink">88 Sathorn Soi 10, Bangkok 10500</p>
          <a href="tel:+6620009876" className="text-ink">
            02 000 9876
          </a>
        </div>
      </div>
    </footer>
  );
}
