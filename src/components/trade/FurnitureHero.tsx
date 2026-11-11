"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Photo } from "@/components/shared/Photo";
import { FadeUp, HorizontalPin, HoverIndex, RevealImage, ScrollText, SplitLines, scrollToId } from "@/components/shared/motion";
import { photos } from "@/data/images";
import { categoryLabels, products, type Category } from "@/data/products";
import { useTrade } from "./TradeProvider";

const newIn = ["kluen-dining-chair", "prang-outdoor-armchair", "wan-lounge-pod", "saeng-pendant", "sala-terrace-chair", "phai-lounge-chair", "rakang-pendant"];

export function FurnitureHero() {
  const { t, lang, setCats, setQuick } = useTrade();
  const hero = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end end"] });
  const clip = useTransform(scrollYProgress, [0, 0.7], ["inset(46% 28% 4% 28%)", "inset(0% 0% 0% 0%)"]);
  const clipMobile = useTransform(scrollYProgress, [0, 0.7], ["inset(48% 4% 4% 4%)", "inset(0% 0% 0% 0%)"]);
  const scale = useTransform(scrollYProgress, [0, 0.7], [1.25, 1]);
  const capOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);

  const rooms: { label: string; cats: Category[]; photo: typeof photos.caneDiningChairs; position?: string; note: { en: string; th: string } }[] = [
    { label: t.tileDining, cats: ["dining"], photo: photos.caneDiningChairs, position: "50% 70%", note: { en: "Stackable cane for full service", th: "เก้าอี้หวายซ้อนได้ สำหรับห้องอาหาร" } },
    { label: t.tileOutdoor, cats: ["outdoor"], photo: photos.outdoorSofaPergola, position: "50% 60%", note: { en: "Synthetic weave rated for monsoon", th: "เส้นสานสังเคราะห์ ทนฝนมรสุม" } },
    { label: categoryLabels.lounge[lang], cats: ["lounge"], photo: photos.balconyRattanPods, position: "50% 70%", note: { en: "Pods and low chairs for slow mornings", th: "เก้าอี้ทรงพ็อดและเก้าอี้เตี้ย" } },
    { label: categoryLabels.tables[lang], cats: ["tables"], photo: photos.wanTable, note: { en: "Side and dining tables in teak", th: "โต๊ะข้างและโต๊ะอาหารไม้สัก" } },
    { label: t.tileLighting, cats: ["lighting"], photo: photos.bellPendantsLiving, position: "50% 25%", note: { en: "Hand-wrapped shades, E27 fitted", th: "โป๊ะสานมือ ขั้ว E27" } },
  ];

  const pick = (cats: Category[]) => {
    setCats(cats);
    scrollToId("catalogue");
  };

  const titleLines = lang === "th" ? ["สานด้วยมือ", "ในกรุงเทพฯ"] : ["Woven by hand", "in Bangkok"];

  return (
    <>
      <section ref={hero} className="relative h-[220vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="grid gap-6 px-[var(--gutter)] pt-[16vh] lg:grid-cols-12 lg:pt-[14vh]">
            <SplitLines
              key={lang}
              lines={titleLines}
              delay={0.15}
              className="text-[clamp(3rem,9.2vw,10.5rem)] font-[600] leading-[0.88] tracking-[-0.055em] lg:col-span-9"
            />
            <motion.div
              className="max-w-[34ch] self-end text-[15px] leading-relaxed text-muted lg:col-span-3 lg:pb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              <p>{t.heroBody}</p>
              <button type="button" onClick={() => scrollToId("catalogue")} className="mt-5 text-ink underline decoration-1 underline-offset-[6px] hover:decoration-2">
                {t.heroCta}
              </button>
            </motion.div>
          </div>

          <motion.div className="absolute inset-0 hidden sm:block" style={{ clipPath: clip }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.5 }}>
            <motion.div className="h-full w-full" style={{ scale }}>
              <Photo photo={photos.archedTerraceChairs} priority position="50% 65%" className="h-full w-full" sizes="100vw" />
            </motion.div>
          </motion.div>
          <motion.div className="absolute inset-0 sm:hidden" style={{ clipPath: clipMobile }}>
            <motion.div className="h-full w-full" style={{ scale }}>
              <Photo photo={photos.archedTerraceChairs} priority position="50% 65%" className="h-full w-full" sizes="100vw" />
            </motion.div>
          </motion.div>
          <motion.div style={{ opacity: capOpacity }} className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 bg-gradient-to-t from-black/50 to-transparent px-[var(--gutter)] pb-8 pt-24 text-white">
            <p className="max-w-[18ch] text-[clamp(1.6rem,3vw,2.6rem)] font-[500] leading-[1.05] tracking-[-0.03em]">Sala terrace chair, on a terrace in Hua Hin</p>
            <button type="button" onClick={() => setQuick("sala-terrace-chair")} className="shrink-0 rounded-full bg-white px-5 py-2.5 text-[14px] font-medium text-ink">
              {t.quickView}
            </button>
          </motion.div>
        </div>
      </section>

      <section className="grid gap-12 px-[var(--gutter)] py-[18vh] lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-3">
          <p className="text-[14px] text-muted">{t.workshop}</p>
          <RevealImage photo={photos.rattanArmchairStudio} position="50% 60%" className="mt-6 aspect-[3/4] w-[60%] lg:w-full" sizes="25vw" />
        </div>
        <div className="lg:col-span-8 lg:col-start-5">
          <ScrollText text={t.statement} className="text-[clamp(1.7rem,3.3vw,3.4rem)] font-[500] leading-[1.1] tracking-[-0.03em]" />
          <ul className="mt-16 grid gap-6 text-[14px] sm:grid-cols-3">
            {[t.perk1, t.perk2, t.perk3].map((perk, i) => (
              <FadeUp key={perk} delay={i * 0.08}>
                <li className="border-t border-ink pt-4 leading-snug">{perk}</li>
              </FadeUp>
            ))}
          </ul>
        </div>
      </section>

      <HorizontalPin
        className="scroll-mt-0"
        header={
          <div id="new" className="mb-10 flex items-end justify-between gap-6 px-[var(--gutter)]">
            <h2 className="text-[clamp(2.4rem,5vw,4.6rem)] font-[600] leading-[0.9] tracking-[-0.045em]">{t.newSeason}</h2>
            <p className="tabular text-[14px] text-muted">{t.pieces(newIn.length)}</p>
          </div>
        }
      >
        {newIn.map((slug) => {
          const p = products.find((x) => x.slug === slug)!;
          return (
            <article key={slug} className="group w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[26vw]">
              <button type="button" onClick={() => setQuick(p.slug)} data-cursor={t.quickView} className="block w-full overflow-hidden" aria-label={`${p.name}, ${t.quickView}`}>
                <Photo photo={p.photos[0]} position={p.focus} className="aspect-[3/4] w-full lg:aspect-auto lg:h-[56vh]" sizes="(min-width:1024px) 26vw, 78vw" imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]" />
              </button>
              <div className="mt-4 flex items-baseline justify-between gap-3">
                <h3 className="text-[17px] font-[600] tracking-[-0.01em]">{lang === "th" ? p.nameTh : p.name}</h3>
                <span className="text-[13px] text-muted">{categoryLabels[p.category][lang]}</span>
              </div>
            </article>
          );
        })}
      </HorizontalPin>

      <section id="rooms" className="scroll-mt-16 bg-ink px-[var(--gutter)] py-[16vh] text-bg [--cursor-ink:#141413] [--cursor:#f4f4f2]">
        <div className="mb-14 grid gap-6 lg:grid-cols-12">
          <SplitLines as="h2" inView lines={[t.shopBy]} className="text-[clamp(2.4rem,5vw,4.6rem)] font-[600] leading-[0.9] tracking-[-0.045em] lg:col-span-6" />
          <p className="max-w-[40ch] self-end text-[15px] leading-relaxed opacity-60 lg:col-span-4 lg:col-start-9">{t.roomsBody}</p>
        </div>
        <HoverIndex
          items={rooms.map((r) => ({
            key: r.label,
            title: <span className="text-[clamp(1.8rem,4.4vw,4.2rem)] font-[500] leading-none tracking-[-0.04em]">{r.label}</span>,
            meta: r.note[lang],
            aside: t.pieces(products.filter((p) => r.cats.includes(p.category)).length),
            photo: r.photo,
            position: r.position,
            onClick: () => pick(r.cats),
            cursor: lang === "th" ? "ดู" : "Shop",
          }))}
        />
      </section>
    </>
  );
}

