"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { resetScroll } from "@/components/shared/motion";
import { btn } from "@/components/kit/panels";
import { baht, isEmail, isPhone, makeRef, usePersist } from "@/components/kit/persist";
import { Field, Icon, Img, Qty, Sheet, Toast } from "@/components/kit/ui";
import { byId, cats, products, projects, tr, type Lang, type SaanCat, type SaanProduct, type T } from "@/data/saan";

const R = "/saan";
const ease = [0.22, 1, 0.36, 1] as const;

type Line = { id: string; finish: number; qty: number };
type Ctx = {
  l: Lang;
  setL: (l: Lang) => void;
  t: (en: string, th: string) => string;
  lines: Line[];
  add: (l: Line) => void;
  setLines: (v: Line[]) => void;
  panel: null | "quote" | "menu";
  setPanel: (p: Ctx["panel"]) => void;
  toast: (m: string) => void;
};
const C = createContext<Ctx | null>(null);
const use = () => useContext(C)!;

export function SaanSite({ segs = [] }: { segs?: string[] }) {
  const [a, b] = segs;
  const path = segs.join("/");
  useEffect(resetScroll, [path]);
  const [l, setL] = usePersist<Lang>("saan:lang", "en");
  const [lines, setLines] = usePersist<Line[]>("saan:quote", []);
  const [panel, setPanel] = useState<Ctx["panel"]>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const ctx = useMemo<Ctx>(
    () => ({
      l,
      setL,
      t: (en, th) => (l === "th" ? th : en),
      lines,
      setLines,
      add: (x) => {
        setLines((p) => {
          const i = p.findIndex((y) => y.id === x.id && y.finish === x.finish);
          return i < 0 ? [...p, x] : p.map((y, j) => (j === i ? { ...y, qty: Math.min(99, y.qty + x.qty) } : y));
        });
        setPanel("quote");
      },
      panel,
      setPanel,
      toast: setMsg,
    }),
    [l, setL, lines, setLines, panel],
  );
  const cat = a === "collection" && b ? cats.find((c) => c.id === b) : undefined;
  const p = a === "p" && b ? byId(b) : undefined;
  let view: ReactNode;
  if (!a) view = <Home />;
  else if (a === "collection" && (!b || cat)) view = <Collection key={b ?? "all"} cat={cat?.id} />;
  else if (p) view = <Product key={p.id} p={p} />;
  else if (a === "projects") view = <Projects />;
  else if (a === "story") view = <Story />;
  else if (a === "catalogue") view = <Catalogue />;
  else if (a === "contact") view = <Contact />;
  else view = <Missing />;
  return (
    <C.Provider value={ctx}>
      <div lang={l} className={l === "th" ? "saan-th" : ""}>
        <Header over={false} />
        <main>{view}</main>
        <Footer />
        <QuoteSheet />
        <Menu />
        <Toast message={msg} onDone={() => setMsg(null)} />
      </div>
    </C.Provider>
  );
}

const links = (t: Ctx["t"]) => [
  [t("Collection", "สินค้า"), `${R}/collection`],
  [t("Projects", "ผลงาน"), `${R}/projects`],
  [t("Our story", "เรื่องราว"), `${R}/story`],
  [t("E-catalogue", "แคตตาล็อก"), `${R}/catalogue`],
  [t("Contact", "ติดต่อ"), `${R}/contact`],
];

function LangSwitch({ light }: { light?: boolean }) {
  const { l, setL } = use();
  return (
    <div className={`flex rounded-full p-0.5 text-[12.5px] ${light ? "bg-white/15" : "bg-ink/[0.06]"}`} role="group" aria-label="Language">
      {(["en", "th"] as const).map((x) => (
        <button key={x} onClick={() => setL(x)} aria-pressed={l === x} className={`h-8 rounded-full px-3 transition-colors ${l === x ? (light ? "bg-white text-ink" : "bg-ink text-bg") : ""}`}>
          {x === "en" ? "EN" : "ไทย"}
        </button>
      ))}
    </div>
  );
}

function Header({ over }: { over: boolean }) {
  const { t, lines, setPanel } = use();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", on, { passive: true });
    requestAnimationFrame(on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  const light = over && !scrolled;
  const n = lines.reduce((s, x) => s + x.qty, 0);
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className={`mx-auto flex h-14 max-w-[1400px] items-center gap-4 rounded-full pl-5 pr-2 transition-[background-color,box-shadow,color] duration-500 ${light ? "text-white" : "bg-bg/80 text-ink shadow-[0_8px_30px_rgb(20_24_20/0.08)] backdrop-blur-xl"}`}>
        <Link href={R} className="font-display flex items-baseline gap-2 text-[22px] font-bold tracking-[-0.04em]">
          SAAN <span className="font-th text-[13px] font-normal opacity-70">สาน</span>
        </Link>
        <nav className="mx-auto hidden items-center gap-1 text-[14px] lg:flex">
          {links(t).map(([x, h]) => (
            <Link key={h} href={h} className={`rounded-full px-3.5 py-2 transition-colors ${light ? "hover:bg-white/15" : "hover:bg-ink/[0.06]"}`}>
              {x}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <div>
            <LangSwitch light={light} />
          </div>
          <button onClick={() => setPanel("quote")} className={`flex h-10 items-center gap-2 rounded-full px-4 text-[14px] ${light ? "bg-white text-ink" : "bg-ink text-bg"}`}>
            <span className="whitespace-nowrap max-[380px]:hidden">{t("Quote", "ขอราคา")}</span>
            <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] ${light ? "bg-ink text-white" : "bg-bg text-ink"}`}>{n}</span>
          </button>
          <button onClick={() => setPanel("menu")} aria-label="Menu" className={`grid size-10 place-items-center rounded-full lg:hidden ${light ? "bg-white/15" : "bg-ink/[0.06]"}`}>
            {Icon.menu}
          </button>
        </div>
      </div>
    </header>
  );
}

function Menu() {
  const { t, panel, setPanel } = use();
  return (
    <Sheet open={panel === "menu"} onClose={() => setPanel(null)} title="SAAN">
      <nav className="grid">
        {links(t).map(([x, h]) => (
          <Link key={h} href={h} onClick={() => setPanel(null)} className="font-display border-b border-line py-4 text-[24px] font-semibold tracking-[-0.03em]">
            {x}
          </Link>
        ))}
      </nav>
      <div className="mt-6">
        <LangSwitch />
      </div>
    </Sheet>
  );
}

/* ---------------- home ---------------- */

function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Bento />
      <Rail title={["New this season", "คอลเลกชันใหม่"]} list={products.slice(0, 8)} />
      <Feature />
      <ProjectsStrip />
      <Band />
    </>
  );
}

function Hero() {
  const { t, l } = use();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.18]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const k = byId("kloud")!;
  return (
    <section ref={ref} className="px-2 pt-[88px] sm:px-3 sm:pt-[96px]">
      <div className="grid items-end gap-5 px-3 pb-5 sm:px-5 lg:grid-cols-[auto_1fr] lg:gap-12 lg:pb-7">
        <h1 aria-label="SAAN" className="saan-mark font-display flex overflow-hidden text-[34vw] font-bold leading-[0.76] tracking-[-0.065em] lg:text-[21vw]">
          {"SAAN".split("").map((ch, i) => (
            <motion.span key={i} className="block" initial={{ y: "70%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, delay: 0.05 + i * 0.07, ease }}>
              {ch}
            </motion.span>
          ))}
        </h1>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.35, ease }} className="grid max-w-[440px] gap-5 lg:justify-self-end lg:pb-[1.2vw]">
          <p className="text-[17px] leading-relaxed text-ink/80 sm:text-[19px]">
            {t("Rattan furniture for living rooms, terraces and hotels, woven by hand in Pathum Thani.", "เฟอร์นิเจอร์หวายสำหรับบ้าน ระเบียง และโรงแรม สานด้วยมือที่ปทุมธานี")}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href={`${R}/collection`} className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] text-bg transition-transform hover:-translate-y-0.5">
              {t("Explore the collection", "ดูสินค้าทั้งหมด")} {Icon.arrow}
            </Link>
            <Link href={`${R}/projects`} className="inline-flex h-12 items-center rounded-full bg-ink/[0.06] px-6 text-[15px] hover:bg-ink/10">
              {t("Hotel projects", "งานโรงแรม")}
            </Link>
          </div>
        </motion.div>
      </div>
      <div className="relative h-[62svh] min-h-[380px] overflow-hidden rounded-[28px] bg-[#b9c3b2] sm:rounded-[36px] lg:h-[calc(100svh-96px-21vw*0.76-28px)] lg:min-h-[460px]">
        <motion.div className="absolute inset-0 will-change-transform" style={{ scale, y }}>
          <Img src="saan/nest" alt={t("Two woven egg chairs on a balcony facing the hills", "เก้าอี้ทรงไข่สองตัวบนระเบียงหันหน้าสู่ภูเขา")} className="absolute inset-0 bg-transparent" priority sizes="100vw" position="50% 78%" />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(16_20_16/0.45),transparent_40%)]" />
        <p className="absolute bottom-5 left-5 max-w-[60%] text-[13.5px] text-white/90 sm:bottom-7 sm:left-7">
          {t("Nest egg chairs, outdoor rated", "เก้าอี้ Nest ใช้กลางแจ้งได้")}
        </p>
        <Link
          href={`${R}/p/${k.id}`}
          className="group absolute bottom-4 right-4 flex w-[290px] max-w-[calc(100%-32px)] items-center gap-3 rounded-[22px] bg-white/85 p-2.5 pr-4 text-ink shadow-[0_20px_50px_rgb(0_0_0/0.18)] backdrop-blur-xl transition-transform hover:-translate-y-1 max-sm:hidden sm:bottom-6 sm:right-6"
        >
          <span className="grid size-[68px] shrink-0 place-items-center rounded-[16px] bg-[#d5dccb]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/${k.cut!.img}-600.webp`} alt="" className="h-[58px] w-auto" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] text-muted">{t("New", "ใหม่")}</span>
            <span className="block truncate text-[15px] font-medium">
              {k.name} {tr(k.type, l).toLowerCase()}
            </span>
            <span className="block text-[13px] text-muted">{baht(k.price)}</span>
          </span>
          <span className="transition-transform group-hover:translate-x-0.5">{Icon.arrow}</span>
        </Link>
      </div>
    </section>
  );
}

function Intro() {
  const { t } = use();
  return (
    <section className="mx-auto grid max-w-[1400px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:gap-20 lg:py-32">
      <h2 className="font-display text-[clamp(30px,4.4vw,58px)] font-semibold leading-[1.04] tracking-[-0.035em] [text-wrap:balance]">
        {t("Every piece starts as a pole of rattan and ends in someone's favourite corner.", "ทุกชิ้นเริ่มจากหวายหนึ่งลำ และจบที่มุมโปรดของใครสักคน")}
      </h2>
      <dl className="grid content-end gap-6 sm:grid-cols-3 lg:grid-cols-1">
        {[
          ["20", t("years weaving in Pathum Thani", "ปีที่สานเฟอร์นิเจอร์ที่ปทุมธานี")],
          ["14", t("countries our hotel work ships to", "ประเทศที่งานโรงแรมของเราส่งไป")],
          ["4", t("weeks from order to your door, for most pieces", "สัปดาห์ จากสั่งถึงหน้าบ้าน สำหรับสินค้าส่วนใหญ่")],
        ].map(([k, v]) => (
          <div key={v} className="flex items-baseline gap-4 border-t border-line pt-4">
            <dt className="font-display w-16 shrink-0 text-[34px] font-semibold tracking-[-0.04em]">{k}</dt>
            <dd className="text-[15px] text-muted">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Bento() {
  const { t, l } = use();
  const span = ["lg:col-span-2 lg:row-span-2", "lg:col-span-2", "", ""];
  return (
    <section className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="font-display text-[clamp(28px,3.4vw,44px)] font-semibold tracking-[-0.035em]">{t("Shop by room", "เลือกตามห้อง")}</h2>
        <Link href={`${R}/collection`} className="text-[14px] underline underline-offset-4">
          {t("All pieces", "สินค้าทั้งหมด")}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-[300px_300px]">
        {[cats[0], cats[2], cats[1], cats[3]].map((c, i) => {
          const n = products.filter((p) => p.cat === c.id).length;
          return (
            <Link key={c.id} href={`${R}/collection/${c.id}`} className={`group relative block min-h-[220px] overflow-hidden rounded-[24px] ${i === 0 ? "col-span-2 min-h-[340px]" : i === 1 ? "col-span-2" : ""} ${span[i]}`}>
              <Img src={c.img} alt="" className="absolute inset-0" sizes="(min-width:1024px) 50vw, 100vw" imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(16_20_16/0.55),transparent_50%)]" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white sm:inset-x-5 sm:bottom-5">
                <span>
                  <span className="font-display block text-[22px] font-semibold tracking-[-0.03em] sm:text-[28px]">{tr(c.name, l)}</span>
                  <span className="text-[13px] text-white/80">
                    {n} {t("pieces", "รายการ")}
                  </span>
                </span>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-500 group-hover:-rotate-45">{Icon.arrow}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Card({ p, wide }: { p: SaanProduct; wide?: boolean }) {
  const { l, t } = use();
  const tone = cats.find((c) => c.id === p.cat)!.tone;
  return (
    <Link href={`${R}/p/${p.id}`} className={`group grid content-start gap-3 ${wide ? "w-[72vw] shrink-0 snap-start sm:w-[340px]" : ""}`}>
      <div className="relative overflow-hidden rounded-[22px]" style={{ background: tone }}>
        <Img src={p.img} alt={`${p.name} ${tr(p.type, l)}`} ratio={4 / 5} sizes="(min-width:1024px) 25vw, 70vw" widths={[800]} className="bg-transparent" imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]" />
        <span className="absolute left-3 top-3 flex gap-1 rounded-full bg-white/85 p-1.5 backdrop-blur">
          {p.finishes.map((f) => (
            <span key={f.hex} className="size-3.5 rounded-full border border-black/10" style={{ background: f.hex }} title={tr(f.name, l)} />
          ))}
        </span>
        {p.outdoor && <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11.5px] backdrop-blur">{t("Outdoor rated", "ใช้กลางแจ้งได้")}</span>}
      </div>
      <div className="flex items-baseline justify-between gap-3 px-1">
        <span>
          <span className="font-display block text-[18px] font-semibold tracking-[-0.02em]">{p.name}</span>
          <span className="block text-[13.5px] text-muted">{tr(p.type, l)}</span>
        </span>
        <span className="shrink-0 text-[14px]">
          {t("From", "เริ่มต้น")} {baht(p.price)}
        </span>
      </div>
    </Link>
  );
}

/** Horizontal rail: native scroll with snap, plus drag to scroll with a mouse. */
function Rail({ title, list }: { title: [string, string]; list: SaanProduct[] }) {
  const { t } = use();
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; s: number; moved: boolean } | null>(null);
  const by = (d: number) => box.current?.scrollBy({ left: d * Math.min(700, box.current.clientWidth * 0.8), behavior: "smooth" });
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto mb-8 flex max-w-[1400px] items-end justify-between gap-4 px-5 sm:px-8">
        <h2 className="font-display text-[clamp(28px,3.4vw,44px)] font-semibold tracking-[-0.035em]">{t(title[0], title[1])}</h2>
        <div className="flex gap-2">
          <button onClick={() => by(-1)} aria-label={t("Scroll left", "เลื่อนซ้าย")} className="grid size-11 place-items-center rounded-full border border-line hover:border-ink">
            {Icon.left}
          </button>
          <button onClick={() => by(1)} aria-label={t("Scroll right", "เลื่อนขวา")} className="grid size-11 place-items-center rounded-full bg-ink text-bg">
            {Icon.right}
          </button>
        </div>
      </div>
      <div
        ref={box}
        data-lenis-prevent
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 [scrollbar-width:none] sm:scroll-px-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          drag.current = { x: e.clientX, s: box.current!.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 4) {
            d.moved = true;
            box.current!.style.scrollSnapType = "none";
            box.current!.scrollLeft = d.s - dx;
          }
        }}
        onPointerUp={() => {
          if (box.current) box.current.style.scrollSnapType = "";
          setTimeout(() => (drag.current = null));
        }}
        onPointerLeave={() => {
          if (box.current) box.current.style.scrollSnapType = "";
          drag.current = null;
        }}
        onClickCapture={(e) => {
          if (drag.current?.moved) e.preventDefault();
        }}
      >
        {list.map((p) => (
          <Card key={p.id} p={p} wide />
        ))}
        <Link href={`${R}/collection`} className="grid w-[60vw] shrink-0 snap-start place-items-center rounded-[22px] border border-line text-[15px] hover:bg-soft sm:w-[260px]">
          <span className="flex items-center gap-2">
            {t("See all pieces", "ดูสินค้าทั้งหมด")} {Icon.arrow}
          </span>
        </Link>
      </div>
    </section>
  );
}

/** One piece up close: tap the dots on the chair to read how it is made. */
function Feature() {
  const { t, l } = use();
  const k = byId("kloud")!;
  const spots = [
    { x: 0.52, y: 0.12, h: t("Whole pole back", "พนักหวายทั้งลำ"), d: t("Bent over steam from one 3 m pole of manau rattan, so the curve has no joints.", "ดัดด้วยไอน้ำจากหวายมะนาวยาว 3 เมตร เส้นโค้งจึงไม่มีรอยต่อ") },
    { x: 0.2, y: 0.42, h: t("Cane wrapped joints", "ข้อต่อพันผิวหวาย"), d: t("Each joint is pinned, glued and wrapped in peeled cane by hand.", "ทุกข้อต่อยึดหมุด ทากาว และพันด้วยผิวหวายด้วยมือ") },
    { x: 0.55, y: 0.6, h: t("Washable cushion", "เบาะถอดซักได้"), d: t("Linen cover with a zip, filled with feather wrapped foam.", "ผ้าลินินมีซิป ไส้โฟมหุ้มขนเป็ด") },
    { x: 0.17, y: 0.93, h: t("Felt feet", "ปุ่มรองขาสักหลาด"), d: t("Protect wooden floors and keep the chair quiet when you move it.", "ถนอมพื้นไม้ และไม่มีเสียงเวลาลากเก้าอี้") },
  ];
  const [on, setOn] = useState(0);
  return (
    <section className="mx-auto max-w-[1400px] px-5 sm:px-8">
      <div className="grid overflow-hidden rounded-[32px] bg-[#d5dccb] lg:grid-cols-2">
        <div className="relative grid min-h-[440px] place-items-center p-8 sm:p-14">
          <div className="relative w-full max-w-[420px]" style={{ aspectRatio: k.cut!.ratio }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/${k.cut!.img}-1200.webp`} alt={`${k.name} ${tr(k.type, l)}`} loading="lazy" className="absolute inset-0 size-full object-contain drop-shadow-[0_30px_30px_rgb(40_50_30/0.25)]" />
            {spots.map((s, i) => (
              <button
                key={i}
                onClick={() => setOn(i)}
                onMouseEnter={() => setOn(i)}
                aria-label={s.h}
                aria-pressed={on === i}
                className="absolute grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center"
                style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%` }}
              >
                {on === i && <span className="absolute inset-0 animate-ping rounded-full bg-white/70" />}
                <span className={`relative grid size-6 place-items-center rounded-full text-[11px] shadow-md transition-colors ${on === i ? "bg-ink text-bg" : "bg-white text-ink"}`}>{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="grid content-center gap-6 bg-[#c9d2bd] p-8 sm:p-14">
          <p className="text-[14px] text-ink/70">{t("Up close", "ดูใกล้ๆ")}</p>
          <h2 className="font-display text-[clamp(30px,4vw,52px)] font-semibold leading-[1.02] tracking-[-0.035em]">
            {k.name} {tr(k.type, l).toLowerCase()}
          </h2>
          <ol className="grid gap-1">
            {spots.map((s, i) => (
              <li key={i}>
                <button onClick={() => setOn(i)} className={`grid w-full grid-cols-[28px_1fr] gap-3 rounded-[16px] p-3 text-left transition-colors ${on === i ? "bg-white/60" : "hover:bg-white/30"}`}>
                  <span className="text-[14px] text-ink/60">{i + 1}</span>
                  <span>
                    <span className="block text-[16px] font-medium">{s.h}</span>
                    <motion.span initial={false} animate={{ height: on === i ? "auto" : 0, opacity: on === i ? 1 : 0 }} className="block overflow-hidden text-[14.5px] text-ink/70">
                      {s.d}
                    </motion.span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <Link href={`${R}/p/${k.id}`} className="inline-flex h-12 w-fit items-center gap-2 rounded-full bg-ink px-6 text-[15px] text-bg">
            {t("See the Kloud armchair", "ดูอาร์มแชร์ Kloud")} {Icon.arrow}
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectsStrip() {
  const { t, l } = use();
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:py-32">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display max-w-xl text-[clamp(28px,3.4vw,44px)] font-semibold leading-[1.05] tracking-[-0.035em]">{t("Furnishing hotels, resorts and cafes", "งานตกแต่งโรงแรม รีสอร์ท และคาเฟ่")}</h2>
        <Link href={`${R}/projects`} className="text-[14px] underline underline-offset-4">
          {t("All projects", "ดูผลงานทั้งหมด")}
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {projects.slice(0, 3).map((p) => (
          <Link key={p.id} href={`${R}/projects#${p.id}`} className="group relative block overflow-hidden rounded-[24px]">
            <Img src={p.img} alt={tr(p.name, l)} ratio={0.85} sizes="(min-width:768px) 33vw, 100vw" imgClassName="transition-transform duration-[1.4s] group-hover:scale-[1.05]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(16_20_16/0.6),transparent_50%)]" />
            <div className="absolute inset-x-5 bottom-5 text-white">
              <p className="text-[16px] font-medium">{tr(p.name, l)}</p>
              <p className="text-[13px] text-white/80">{tr(p.scope, l)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Band() {
  const { t } = use();
  return (
    <section className="mx-auto grid max-w-[1400px] gap-4 px-5 pb-24 sm:px-8 md:grid-cols-2">
      <Link href={`${R}/catalogue`} className="group grid content-between gap-10 rounded-[28px] bg-[#efd2c2] p-8 sm:p-10">
        <p className="font-display text-[clamp(26px,3vw,40px)] font-semibold leading-[1.05] tracking-[-0.035em]">{t("The 2027 e-catalogue", "แคตตาล็อกปี 2027")}</p>
        <span className="flex items-center justify-between text-[15px]">
          {t("Flip through or download the PDF", "เปิดดูหรือดาวน์โหลด PDF")}
          <span className="grid size-11 place-items-center rounded-full bg-ink text-bg transition-transform group-hover:-rotate-45">{Icon.arrow}</span>
        </span>
      </Link>
      <Link href={`${R}/contact`} className="group grid content-between gap-10 rounded-[28px] bg-ink p-8 text-bg sm:p-10">
        <p className="font-display text-[clamp(26px,3vw,40px)] font-semibold leading-[1.05] tracking-[-0.035em]">{t("Planning a hotel or a home?", "กำลังวางแผนตกแต่งโรงแรมหรือบ้าน?")}</p>
        <span className="flex items-center justify-between text-[15px] text-bg/80">
          {t("Send your list, get prices in one working day", "ส่งรายการมา รับใบเสนอราคาภายใน 1 วันทำการ")}
          <span className="grid size-11 place-items-center rounded-full bg-bg text-ink transition-transform group-hover:-rotate-45">{Icon.arrow}</span>
        </span>
      </Link>
    </section>
  );
}

/* ---------------- collection and product ---------------- */

function Collection({ cat }: { cat?: SaanCat }) {
  const { t, l } = use();
  const [outdoor, setOutdoor] = useState(false);
  const [sort, setSort] = useState("new");
  const list = useMemo(() => {
    let x = products.filter((p) => (!cat || p.cat === cat) && (!outdoor || p.outdoor));
    if (sort === "low") x = [...x].sort((a, b) => a.price - b.price);
    if (sort === "high") x = [...x].sort((a, b) => b.price - a.price);
    return x;
  }, [cat, outdoor, sort]);
  const c = cats.find((x) => x.id === cat);
  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 lg:pt-40">
      <h1 className="font-display text-[clamp(44px,7vw,96px)] font-semibold leading-[0.95] tracking-[-0.045em]">{c ? tr(c.name, l) : t("The collection", "สินค้าทั้งหมด")}</h1>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <nav className="-mx-1 flex gap-2 overflow-x-auto px-1" aria-label={t("Rooms", "หมวดหมู่")}>
          {[{ id: "", name: { en: "All", th: "ทั้งหมด" } as T }, ...cats].map((x) => {
            const active = (x.id || undefined) === cat;
            return (
              <Link key={x.id || "all"} href={`${R}/collection${x.id ? `/${x.id}` : ""}`} aria-current={active ? "page" : undefined} className={`shrink-0 rounded-full px-4 py-2 text-[14px] ${active ? "bg-ink text-bg" : "bg-ink/[0.05] hover:bg-ink/10"}`}>
                {tr(x.name, l)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3 text-[14px]">
          <button role="switch" aria-checked={outdoor} onClick={() => setOutdoor(!outdoor)} className="flex items-center gap-2">
            <span className={`relative h-6 w-10 rounded-full transition-colors ${outdoor ? "bg-ink" : "bg-ink/15"}`}>
              <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${outdoor ? "translate-x-[18px]" : "translate-x-0.5"}`} />
            </span>
            {t("Outdoor rated", "ใช้กลางแจ้งได้")}
          </button>
          <select aria-label={t("Sort", "เรียง")} value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full bg-ink/[0.05] px-3 py-2 outline-none">
            <option value="new">{t("Newest", "ใหม่ล่าสุด")}</option>
            <option value="low">{t("Price, low to high", "ราคา น้อยไปมาก")}</option>
            <option value="high">{t("Price, high to low", "ราคา มากไปน้อย")}</option>
          </select>
        </div>
      </div>
      <p className="mb-8 mt-4 text-[14px] text-muted">
        {list.length} {t("pieces", "รายการ")}
      </p>
      {list.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {list.map((p) => (
            <Card key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-muted">{t("Nothing here is outdoor rated yet. Switch the filter off to see everything.", "หมวดนี้ยังไม่มีสินค้าสำหรับกลางแจ้ง ปิดตัวกรองเพื่อดูทั้งหมด")}</p>
      )}
    </div>
  );
}

function Product({ p }: { p: SaanProduct }) {
  const { t, l, add, toast } = use();
  const [fin, setFin] = useState(0);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const c = cats.find((x) => x.id === p.cat)!;
  const shots = [{ img: p.img, ratio: p.ratio, cut: false }, ...(p.cut ? [{ img: p.cut.img, ratio: p.cut.ratio, cut: true }] : [])];
  const s = shots[shot];
  const related = products.filter((x) => x.cat === p.cat && x.id !== p.id).concat(products.filter((x) => x.cat !== p.cat)).slice(0, 4);
  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-28 sm:px-8 lg:pt-32">
      <nav className="mb-6 text-[13px] text-muted">
        <Link href={`${R}/collection`} className="hover:text-ink">
          {t("Collection", "สินค้า")}
        </Link>{" "}
        /{" "}
        <Link href={`${R}/collection/${c.id}`} className="hover:text-ink">
          {tr(c.name, l)}
        </Link>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div className="grid min-w-0 content-start gap-3">
          <div className="relative overflow-hidden rounded-[28px]" style={{ background: c.tone, aspectRatio: "4 / 4.4" }}>
            {s.cut ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/images/${s.img}-1200.webp`} alt={p.name} className="absolute inset-[8%] size-[84%] object-contain drop-shadow-[0_30px_30px_rgb(40_50_30/0.25)]" />
            ) : (
              <Img src={s.img} alt={`${p.name} ${tr(p.type, l)}`} className="absolute inset-0 bg-transparent" priority sizes="(min-width:1024px) 55vw, 100vw" />
            )}
          </div>
          {shots.length > 1 && (
            <div className="flex gap-2">
              {shots.map((x, i) => (
                <button key={x.img} onClick={() => setShot(i)} aria-label={t(`Photo ${i + 1}`, `รูปที่ ${i + 1}`)} aria-pressed={shot === i} className={`size-20 overflow-hidden rounded-[14px] border-2 ${shot === i ? "border-ink" : "border-transparent opacity-70"}`} style={{ background: c.tone }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/images/${x.img}-${x.cut ? 600 : 800}.webp`} alt="" className={`size-full ${x.cut ? "object-contain p-1.5" : "object-cover"}`} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="grid content-start gap-7 lg:sticky lg:top-28 lg:self-start">
          <div className="grid gap-2">
            <p className="text-[14px] text-muted">{tr(p.type, l)}</p>
            <h1 className="font-display text-[clamp(44px,6vw,80px)] font-semibold leading-[0.95] tracking-[-0.045em]">{p.name}</h1>
            <p className="text-[20px]">
              {t("From", "เริ่มต้น")} {baht(p.price)}
            </p>
          </div>
          <p className="max-w-md text-[16px] leading-relaxed text-ink/75">{tr(p.blurb, l)}</p>
          <div className="grid gap-3">
            <p className="text-[14px]">
              {t("Finish", "สี")}: <span className="text-muted">{tr(p.finishes[fin].name, l)}</span>
            </p>
            <div className="flex gap-2" role="radiogroup" aria-label={t("Finish", "สี")}>
              {p.finishes.map((f, i) => (
                <button key={f.hex} role="radio" aria-checked={fin === i} aria-label={tr(f.name, l)} onClick={() => setFin(i)} className={`grid size-11 place-items-center rounded-full border-2 ${fin === i ? "border-ink" : "border-transparent"}`}>
                  <span className="size-8 rounded-full border border-black/10" style={{ background: f.hex }} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Qty value={qty} onChange={setQty} max={99} />
            <button
              className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-ink text-[15px] text-bg hover:opacity-90"
              onClick={() => {
                add({ id: p.id, finish: fin, qty });
                toast(t("Added to your quote list", "เพิ่มในรายการขอราคาแล้ว"));
              }}
            >
              {t("Add to quote list", "เพิ่มในรายการขอราคา")}
            </button>
          </div>
          <dl className="grid gap-px overflow-hidden rounded-[18px] bg-line text-[14px]">
            {[
              [t("Size", "ขนาด"), p.size],
              [t("Material", "วัสดุ"), tr(p.material, l)],
              [t("Use", "การใช้งาน"), p.outdoor ? t("Indoor and outdoor", "ใช้ได้ทั้งในและนอกบ้าน") : t("Indoor, or covered terraces", "ในบ้าน หรือระเบียงที่มีหลังคา")],
              [t("Lead time", "ระยะเวลาผลิต"), t(`Made to order in ${p.weeks} weeks`, `ผลิตตามสั่งภายใน ${p.weeks} สัปดาห์`)],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] gap-4 bg-bg px-4 py-3">
                <dt className="text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="text-[13.5px] text-muted">{t("Hotel and trade orders get project pricing. Add pieces to your list and send it in one go.", "งานโรงแรมและโครงการมีราคาพิเศษ เพิ่มสินค้าลงรายการแล้วส่งขอราคาได้ในครั้งเดียว")}</p>
        </div>
      </div>
      <section className="mt-24">
        <h2 className="font-display mb-8 text-[clamp(26px,3vw,40px)] font-semibold tracking-[-0.035em]">{t("Pairs well with", "เข้าชุดกับ")}</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {related.map((x) => (
            <Card key={x.id} p={x} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------- quote list ---------------- */

function QuoteSheet() {
  const { t, l, lines, setLines, panel, setPanel } = use();
  const close = () => setPanel(null);
  return (
    <Sheet
      open={panel === "quote"}
      onClose={close}
      title={t("Your quote list", "รายการขอราคา")}
      footer={
        lines.length > 0 && (
          <Link href={`${R}/contact`} onClick={close} className={btn.primary}>
            {t("Request prices", "ส่งขอใบเสนอราคา")}
          </Link>
        )
      }
    >
      {lines.length === 0 ? (
        <div className="grid gap-4 py-10 text-center">
          <p className="text-muted">{t("Your list is empty. Add pieces from any product page.", "ยังไม่มีสินค้าในรายการ เพิ่มได้จากหน้าสินค้า")}</p>
          <Link href={`${R}/collection`} onClick={close} className={btn.ghost}>
            {t("Browse the collection", "ดูสินค้า")}
          </Link>
        </div>
      ) : (
        <ul className="grid gap-5">
          {lines.map((x, i) => {
            const p = byId(x.id);
            if (!p) return null;
            return (
              <li key={`${x.id}-${x.finish}`} className="grid grid-cols-[76px_1fr] gap-4">
                <Img src={p.img} alt="" ratio={1} sizes="76px" widths={[800]} className="rounded-[14px]" />
                <div className="grid gap-1">
                  <p className="text-[15px]">
                    {p.name} <span className="text-muted">{tr(p.type, l).toLowerCase()}</span>
                  </p>
                  <p className="text-[13px] text-muted">
                    {tr(p.finishes[x.finish]?.name ?? p.finishes[0].name, l)}, {t("from", "เริ่มต้น")} {baht(p.price)}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <Qty value={x.qty} max={99} onChange={(n) => setLines(lines.map((y, j) => (j === i ? { ...y, qty: n } : y)))} />
                    <button className="text-[13px] text-muted underline underline-offset-4 hover:text-ink" onClick={() => setLines(lines.filter((_, j) => j !== i))}>
                      {t("Remove", "ลบ")}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Sheet>
  );
}

function Contact() {
  const { t, l, lines, setLines } = use();
  const [f, setF] = useState({ name: "", company: "", email: "", phone: "", kind: "home", note: "" });
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState<{ ref: string; n: number } | null>(null);
  const e = {
    name: f.name.trim().length < 2 && t("Enter your name", "กรุณากรอกชื่อ"),
    email: !isEmail(f.email) && t("Enter a valid email", "กรุณากรอกอีเมลให้ถูกต้อง"),
    phone: !isPhone(f.phone) && t("Enter a Thai phone number, for example 081 234 5678", "กรุณากรอกเบอร์โทร เช่น 081 234 5678"),
    note: lines.length === 0 && f.note.trim().length < 5 && t("Tell us what you need, or add pieces to your list", "บอกเราว่าต้องการอะไร หรือเพิ่มสินค้าลงรายการ"),
  };
  if (done)
    return (
      <div className="mx-auto grid max-w-[640px] gap-6 px-5 pb-24 pt-36 sm:px-8 lg:pt-44">
        <span className="grid size-12 place-items-center rounded-full bg-ink text-bg">{Icon.check}</span>
        <h1 className="font-display text-[clamp(36px,5vw,56px)] font-semibold leading-[1] tracking-[-0.04em]">{t("Thank you, we have your list", "ได้รับรายการของคุณแล้ว")}</h1>
        <p className="text-[16px] text-muted">
          {t(
            `Reference ${done.ref}. Our sales team will email prices${done.n ? ` for ${done.n} pieces` : ""} to ${f.email} within one working day.`,
            `เลขอ้างอิง ${done.ref} ทีมขายจะส่งใบเสนอราคา${done.n ? ` ${done.n} รายการ` : ""} ไปที่ ${f.email} ภายใน 1 วันทำการ`,
          )}
        </p>
        <Link href={`${R}/collection`} className={`${btn.ghost} w-auto justify-self-start`}>
          {t("Back to the collection", "กลับไปดูสินค้า")}
        </Link>
      </div>
    );
  return (
    <div className="mx-auto grid max-w-[1400px] gap-12 px-5 pb-24 pt-32 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:pt-40">
      <div className="grid content-start gap-6">
        <h1 className="font-display text-[clamp(44px,6vw,84px)] font-semibold leading-[0.95] tracking-[-0.045em]">{t("Get prices", "ขอใบเสนอราคา")}</h1>
        <p className="max-w-md text-[16px] leading-relaxed text-muted">{t("For homes, hotels, restaurants and designers. Send your list and we reply with prices and lead times within one working day.", "สำหรับบ้าน โรงแรม ร้านอาหาร และนักออกแบบ ส่งรายการมา เราตอบกลับพร้อมราคาและระยะเวลาผลิตภายใน 1 วันทำการ")}</p>
        <div className="grid gap-1 rounded-[20px] bg-soft p-5 text-[14.5px]">
          <p className="font-medium">{t("Showroom and workshop", "โชว์รูมและโรงงาน")}</p>
          <p className="text-muted">{t("Sam Khok, Pathum Thani. Monday to Saturday, 9:00 to 17:00", "อำเภอสามโคก ปทุมธานี เปิดจันทร์ถึงเสาร์ 9:00 ถึง 17:00")}</p>
          <a href="tel:020000000" className="mt-2 underline underline-offset-4">
            02 000 0000
          </a>
        </div>
      </div>
      <div className="grid content-start gap-6 rounded-[28px] border border-line p-5 sm:p-8">
        <div className="grid gap-3">
          <p className="text-[15px] font-medium">{t("Your list", "รายการของคุณ")}</p>
          {lines.length ? (
            <ul className="grid gap-2 text-[14px]">
              {lines.map((x) => {
                const p = byId(x.id)!;
                return (
                  <li key={`${x.id}-${x.finish}`} className="flex justify-between gap-4 rounded-[12px] bg-soft px-3 py-2">
                    <span>
                      {x.qty} x {p.name} {tr(p.type, l).toLowerCase()}
                    </span>
                    <span className="text-muted">{tr(p.finishes[x.finish]?.name ?? p.finishes[0].name, l)}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-[14px] text-muted">
              {t("No pieces yet. ", "ยังไม่มีสินค้า ")}
              <Link href={`${R}/collection`} className="underline underline-offset-4">
                {t("Add from the collection", "เลือกจากหน้าสินค้า")}
              </Link>
              {t(", or describe what you need below.", " หรือเขียนสิ่งที่ต้องการด้านล่าง")}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t("Project type", "ประเภทงาน")}>
          {[
            ["home", t("Home", "บ้าน")],
            ["hotel", t("Hotel or resort", "โรงแรม รีสอร์ท")],
            ["fnb", t("Restaurant or cafe", "ร้านอาหาร คาเฟ่")],
            ["design", t("Designer or architect", "นักออกแบบ สถาปนิก")],
          ].map(([k, v]) => (
            <button key={k} role="radio" aria-checked={f.kind === k} onClick={() => setF({ ...f, kind: k })} className={`rounded-full px-4 py-2 text-[14px] ${f.kind === k ? "bg-ink text-bg" : "bg-ink/[0.05]"}`}>
              {v}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("Name", "ชื่อ")} autoComplete="name" value={f.name} onValue={(v) => setF({ ...f, name: v })} error={tried && e.name} />
          <Field label={t("Company (optional)", "บริษัท (ไม่บังคับ)")} autoComplete="organization" value={f.company} onValue={(v) => setF({ ...f, company: v })} />
          <Field label={t("Email", "อีเมล")} type="email" autoComplete="email" value={f.email} onValue={(v) => setF({ ...f, email: v })} error={tried && e.email} />
          <Field label={t("Phone", "เบอร์โทร")} type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onValue={(v) => setF({ ...f, phone: v })} error={tried && e.phone} />
          <Field label={t("Project details", "รายละเอียดงาน")} as="textarea" value={f.note} onValue={(v) => setF({ ...f, note: v })} error={tried && e.note} className="sm:col-span-2" />
        </div>
        <button
          className={`${btn.primary} sm:max-w-xs`}
          onClick={() => {
            setTried(true);
            if (Object.values(e).some(Boolean)) {
              requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid=true]")?.scrollIntoView({ block: "center", behavior: "smooth" }));
              return;
            }
            setDone({ ref: makeRef("SAN"), n: lines.reduce((s, x) => s + x.qty, 0) });
            setLines([]);
            window.scrollTo({ top: 0 });
            window.__lenis?.scrollTo(0, { immediate: true });
          }}
        >
          {t("Send request", "ส่งคำขอ")}
        </button>
      </div>
    </div>
  );
}

/* ---------------- projects, story, catalogue ---------------- */

function Projects() {
  const { t, l } = use();
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.slice(1);
      if (projects.some((p) => p.id === h)) setOpen(h);
    };
    const id = requestAnimationFrame(read);
    window.addEventListener("hashchange", read);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("hashchange", read);
    };
  }, []);
  const p = projects.find((x) => x.id === open);
  const used: Record<string, string[]> = { villa: ["tide", "cove", "nest"], overwater: ["nest", "deck", "lantern"], garden: ["tide", "bistro", "terrace-set"], rooftop: ["bistro", "cove", "lantern"], cafe: ["bistro", "sunroom", "drum"] };
  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 lg:pt-40">
      <h1 className="font-display text-[clamp(44px,7vw,96px)] font-semibold leading-[0.95] tracking-[-0.045em]">{t("Projects", "ผลงาน")}</h1>
      <p className="mt-4 max-w-xl text-[16px] text-muted">{t("Hotels, resorts and restaurants furnished from our workshop. Open one to see the pieces used.", "โรงแรม รีสอร์ท และร้านอาหารที่ตกแต่งด้วยงานจากโรงงานของเรา กดเพื่อดูสินค้าที่ใช้")}</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {projects.map((x, i) => (
          <button key={x.id} onClick={() => setOpen(x.id)} className={`group relative block overflow-hidden rounded-[24px] text-left ${i === 0 ? "md:col-span-2" : ""}`}>
            <Img src={x.img} alt={tr(x.name, l)} ratio={i === 0 ? 2.2 : 1.4} sizes="(min-width:768px) 50vw, 100vw" imgClassName="transition-transform duration-[1.4s] group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(16_20_16/0.6),transparent_50%)]" />
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white">
              <span>
                <span className="font-display block text-[22px] font-semibold tracking-[-0.03em]">{tr(x.name, l)}</span>
                <span className="text-[13.5px] text-white/80">
                  {tr(x.scope, l)}, {x.year}
                </span>
              </span>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform group-hover:-rotate-45">{Icon.arrow}</span>
            </div>
          </button>
        ))}
      </div>
      <Sheet open={!!p} onClose={() => setOpen(null)} title={p ? tr(p.name, l) : ""}>
        {p && (
          <div className="grid gap-5">
            <Img src={p.img} alt={tr(p.name, l)} ratio={1.5} sizes="460px" className="rounded-[18px]" />
            <p className="text-[15px]">
              {tr(p.scope, l)}, {p.year}
            </p>
            <p className="text-[14px] font-medium">{t("Pieces used", "สินค้าที่ใช้")}</p>
            <ul className="grid gap-3">
              {used[p.id].map((id) => {
                const x = byId(id)!;
                return (
                  <li key={id}>
                    <Link href={`${R}/p/${id}`} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-[14px] p-1.5 hover:bg-soft">
                      <Img src={x.img} alt="" ratio={1} sizes="56px" widths={[800]} className="rounded-[10px]" />
                      <span>
                        {x.name} <span className="text-muted">{tr(x.type, l).toLowerCase()}</span>
                      </span>
                      {Icon.arrow}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Sheet>
    </div>
  );
}

function Story() {
  const { t } = use();
  const steps = [
    [t("Sourcing", "คัดหวาย"), t("Manau rattan from certified growers in the south, dried for three weeks.", "หวายมะนาวจากผู้ปลูกที่ได้รับการรับรองในภาคใต้ ตากแห้ง 3 สัปดาห์")],
    [t("Bending", "ดัดโครง"), t("Poles are steamed and bent over wooden moulds made for each design.", "นำหวายมาอบไอน้ำแล้วดัดบนแม่แบบไม้ที่ทำเฉพาะแต่ละแบบ")],
    [t("Weaving", "สาน"), t("Our weavers wrap and weave every joint and seat by hand.", "ช่างของเราพันข้อต่อและสานที่นั่งทุกชิ้นด้วยมือ")],
    [t("Finishing", "ทำสี"), t("Sanded, stained and sealed with a water based lacquer.", "ขัด ย้อมสี และเคลือบด้วยแลคเกอร์สูตรน้ำ")],
  ];
  return (
    <div className="pb-24">
      <section className="relative h-[70svh] min-h-[440px] p-2 sm:p-3">
        <div className="relative h-full overflow-hidden rounded-[28px] sm:rounded-[36px]">
          <Img src="saan/sunroom" alt="" className="absolute inset-0" priority sizes="100vw" position="50% 60%" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(16_20_16/0.6),transparent_55%)]" />
          <h1 className="font-display absolute inset-x-6 bottom-6 max-w-3xl text-[clamp(38px,6vw,84px)] font-semibold leading-[0.98] tracking-[-0.045em] text-white sm:inset-x-10 sm:bottom-10">
            {t("Woven by hand, twenty years and counting", "สานด้วยมือ มากว่ายี่สิบปี")}
          </h1>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1400px] gap-12 px-5 pt-20 sm:px-8 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <p className="text-[18px] leading-relaxed">
          {t(
            "We started as a small workshop repairing rattan chairs for neighbours in Sam Khok. Today a team of weavers makes furniture for homes across Thailand and for resorts from Phuket to the Maldives, still on the same street.",
            "เราเริ่มจากร้านซ่อมเก้าอี้หวายเล็กๆ ให้เพื่อนบ้านในสามโคก วันนี้ช่างสานของเราทำเฟอร์นิเจอร์ให้บ้านทั่วประเทศ และรีสอร์ทตั้งแต่ภูเก็ตจนถึงมัลดีฟส์ บนถนนเส้นเดิม",
          )}
        </p>
        <ol className="grid gap-4 sm:grid-cols-2">
          {steps.map(([h, d], i) => (
            <li key={h} className="grid content-start gap-2 rounded-[22px] bg-soft p-6">
              <span className="font-display text-[34px] font-semibold tracking-[-0.04em] text-ink/30">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[17px] font-medium">{h}</span>
              <span className="text-[14.5px] text-muted">{d}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

const PAGES = 15;
function Catalogue() {
  const { t } = use();
  const [i, setI] = useState(0);
  const go = (n: number) => setI(Math.max(0, Math.min(PAGES - 1, n)));
  const src = (k: number) => `/catalogue/saan/page-${String(k + 1).padStart(2, "0")}.webp`;
  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8 lg:pt-40">
      <h1 className="font-display text-[clamp(44px,7vw,96px)] font-semibold leading-[0.95] tracking-[-0.045em]">{t("E-catalogue", "แคตตาล็อก")}</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="grid min-w-0 gap-4" tabIndex={0} aria-label={t("Catalogue viewer, use the arrow keys", "ใช้ปุ่มลูกศรเพื่อพลิกหน้า")} onKeyDown={(e) => (e.key === "ArrowRight" ? go(i + 1) : e.key === "ArrowLeft" ? go(i - 1) : null)}>
          <div className="relative overflow-hidden rounded-[18px] bg-soft shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)]" style={{ aspectRatio: "1754 / 1240" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={i} src={src(i)} alt={t(`Page ${i + 1}`, `หน้า ${i + 1}`)} className="absolute inset-0 size-full animate-[fadein_.35s_ease] object-cover" />
            <button onClick={() => go(i - 1)} disabled={i === 0} aria-label={t("Previous page", "หน้าก่อน")} className="absolute inset-y-0 left-0 w-1/4 cursor-w-resize disabled:cursor-default" />
            <button onClick={() => go(i + 1)} disabled={i === PAGES - 1} aria-label={t("Next page", "หน้าถัดไป")} className="absolute inset-y-0 right-0 w-1/4 cursor-e-resize disabled:cursor-default" />
          </div>
          <div className="flex items-center justify-between text-[14px]">
            <button onClick={() => go(i - 1)} disabled={i === 0} className="rounded-full bg-ink/[0.05] px-4 py-2 disabled:opacity-30">
              {t("Previous", "ก่อนหน้า")}
            </button>
            <span className="text-muted">
              {i + 1} / {PAGES}
            </span>
            <button onClick={() => go(i + 1)} disabled={i === PAGES - 1} className="rounded-full bg-ink/[0.05] px-4 py-2 disabled:opacity-30">
              {t("Next", "ถัดไป")}
            </button>
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" data-lenis-prevent>
            {Array.from({ length: PAGES }, (_, k) => (
              <button key={k} onClick={() => go(k)} aria-label={t(`Go to page ${k + 1}`, `ไปหน้า ${k + 1}`)} aria-current={k === i} className={`w-24 shrink-0 overflow-hidden rounded-[8px] border-2 ${k === i ? "border-ink" : "border-transparent opacity-60 hover:opacity-100"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src(k)} alt="" loading="lazy" className="aspect-[1754/1240] w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <aside className="grid content-start gap-4 lg:sticky lg:top-28 lg:self-start">
          <a href="/catalogue/saan/saan-collection-2027.pdf" download className={btn.primary}>
            {t("Download PDF", "ดาวน์โหลด PDF")}
          </a>
          <p className="text-[14px] text-muted">{t("15 pages, A4 landscape, English. Prices include VAT.", "15 หน้า แนวนอน A4 ภาษาอังกฤษ ราคารวม VAT")}</p>
          <Link href={`${R}/contact`} className="text-[14px] underline underline-offset-4">
            {t("Ask for project pricing", "ขอราคาสำหรับโครงการ")}
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Missing() {
  const { t } = use();
  return (
    <div className="mx-auto grid max-w-md justify-items-center gap-5 px-5 py-40 text-center">
      <h1 className="font-display text-[40px] font-semibold">{t("Page not found", "ไม่พบหน้านี้")}</h1>
      <Link href={`${R}/collection`} className={`${btn.primary} w-auto`}>
        {t("Go to the collection", "ไปหน้าสินค้า")}
      </Link>
    </div>
  );
}

function Footer() {
  const { t, l } = use();
  const [v, setV] = useState("");
  const [st, setSt] = useState<"idle" | "bad" | "ok">("idle");
  return (
    <footer className="p-2 sm:p-3">
      <div className="overflow-hidden rounded-[28px] bg-ink px-6 pb-6 pt-14 text-bg sm:rounded-[36px] sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="grid content-start gap-4">
            <p className="text-[18px]">{t("New pieces and open days at the workshop, about once a month.", "สินค้าใหม่และวันเปิดโรงงาน ส่งให้ประมาณเดือนละครั้ง")}</p>
            {st === "ok" ? (
              <p className="text-bg/80" role="status">
                {t(`Thanks. The next letter goes to ${v}.`, `ขอบคุณ ฉบับถัดไปจะส่งไปที่ ${v}`)}
              </p>
            ) : (
              <form
                noValidate
                className="grid max-w-md gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSt(isEmail(v) ? "ok" : "bad");
                }}
              >
                <div className="flex gap-2">
                  <input value={v} onChange={(e) => setV(e.target.value)} type="email" aria-label={t("Email for the newsletter", "อีเมลสำหรับรับข่าวสาร")} aria-invalid={st === "bad"} placeholder={t("Your email", "อีเมลของคุณ")} className="h-12 min-w-0 flex-1 rounded-full bg-bg/10 px-5 text-[15px] outline-none placeholder:text-bg/50 focus:bg-bg/15" />
                  <button className="h-12 shrink-0 rounded-full bg-bg px-5 text-[15px] text-ink">{t("Sign up", "สมัคร")}</button>
                </div>
                {st === "bad" && <p className="text-[13px] text-[#f0a58f]">{t("Enter a valid email.", "กรุณากรอกอีเมลให้ถูกต้อง")}</p>}
              </form>
            )}
          </div>
          <div className="grid content-start gap-3 text-[14.5px]">
            {cats.map((c) => (
              <Link key={c.id} href={`${R}/collection/${c.id}`} className="text-bg/75 hover:text-bg">
                {tr(c.name, l)}
              </Link>
            ))}
          </div>
          <div className="grid content-start gap-3 text-[14.5px]">
            {links(t)
              .slice(1)
              .map(([x, h]) => (
                <Link key={h} href={h} className="text-bg/75 hover:text-bg">
                  {x}
                </Link>
              ))}
          </div>
        </div>
        <p className="font-display mt-16 select-none text-[24vw] font-bold leading-[0.74] tracking-[-0.06em] text-bg/[0.08]" aria-hidden>
          SAAN
        </p>
        <p className="mt-6 text-[12.5px] text-bg/50">{t("A concept site by Chanasak Choonuch. SAAN is a fictional brand.", "เว็บตัวอย่างโดย ชนาศักดิ์ ชูนุช SAAN เป็นแบรนด์สมมติ")}</p>
      </div>
    </footer>
  );
}
