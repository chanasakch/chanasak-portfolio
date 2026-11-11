"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Photo } from "@/components/shared/Photo";
import { Arrow, HeroSlider, Marquee, Rail } from "@/components/shared/ui";
import { photos } from "@/data/images";
import { categoryLabels, products, type Category } from "@/data/products";
import { useTrade } from "./TradeProvider";

const newIn = ["kluen-dining-chair", "prang-outdoor-armchair", "wan-lounge-pod", "saeng-pendant", "sala-terrace-chair", "phai-lounge-chair", "rakang-pendant"];

export function FurnitureHero() {
  const { t, lang, setCats, setQuick } = useTrade();
  const [room, setRoom] = useState(0);

  const rooms: { label: string; cats: Category[]; photo: typeof photos.caneDiningChairs; position?: string; note: { en: string; th: string } }[] = [
    { label: t.tileDining, cats: ["dining"], photo: photos.caneDiningChairs, position: "50% 70%", note: { en: "Stackable cane for full service", th: "เก้าอี้หวายซ้อนได้ สำหรับห้องอาหาร" } },
    { label: t.tileOutdoor, cats: ["outdoor"], photo: photos.outdoorSofaPergola, position: "50% 60%", note: { en: "Synthetic weave, rated for monsoon", th: "เส้นสานสังเคราะห์ ทนฝนมรสุม" } },
    { label: categoryLabels.lounge[lang], cats: ["lounge"], photo: photos.balconyRattanPods, position: "50% 70%", note: { en: "Pods and low chairs for slow mornings", th: "เก้าอี้ทรงพ็อดและเก้าอี้เตี้ยสำหรับนั่งพัก" } },
    { label: t.tileLighting, cats: ["lighting"], photo: photos.bellPendantsLiving, position: "50% 25%", note: { en: "Hand-wrapped shades, E27 fitted", th: "โป๊ะสานมือ ขั้ว E27" } },
  ];

  const pick = (cats: Category[]) => {
    setCats(cats);
    document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <HeroSlider
        className="h-[100svh] min-h-[600px]"
        slides={[
          { photo: photos.archedTerraceChairs, position: "50% 65%", label: "Sala terrace chair" },
          { photo: photos.caneDiningChairs, position: "50% 60%", label: "Kluen dining chair" },
          { photo: photos.bellPendantsLiving, position: "50% 40%", label: "Rakang pendant" },
          { photo: photos.loungeTeakCane, position: "50% 60%", label: "Phai lounge chair" },
        ]}
      >
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1600px] px-4 pb-20 text-white sm:px-8 sm:pb-24">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="max-w-[13ch] text-[clamp(2.8rem,7vw,6.8rem)] font-[600] leading-[0.95] tracking-[-0.045em]"
          >
            {t.heroTitle}
          </motion.h1>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#catalogue" className="rounded-full bg-white px-6 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-white/85">
              {t.heroCta}
            </a>
            <a href="#rooms" className="rounded-full border border-white/50 px-6 py-3 text-[15px] backdrop-blur-sm transition-colors hover:bg-white/10">
              {t.shopBy}
            </a>
          </div>
        </div>
      </HeroSlider>

      <Marquee
        className="border-b border-line py-4 text-[14px] text-muted"
        items={[t.perk1, t.perk2, t.perk3, t.workshop, lang === "th" ? "ทดสอบตามมาตรฐาน EN 16139" : "Tested to EN 16139", lang === "th" ? "ส่งออกกว่า 30 ประเทศ" : "Shipped to 30 countries"]}
      />

      <section className="mx-auto grid max-w-[1600px] gap-10 px-4 py-24 sm:px-8 lg:grid-cols-[1fr_2fr] lg:py-36">
        <p className="text-[14px] text-muted">{t.workshop}</p>
        <div>
          <p className="max-w-[30ch] text-[clamp(1.6rem,3.2vw,2.9rem)] font-[500] leading-[1.12] tracking-[-0.025em]">{t.statement}</p>
          <div className="mt-10 grid max-w-[640px] grid-cols-2 gap-4">
            <Photo photo={photos.rattanArmchairStudio} className="aspect-[3/4] w-full" position="50% 60%" sizes="320px" />
            <Photo photo={photos.wovenPendantStudio} className="mt-16 aspect-[3/4] w-full" sizes="320px" />
          </div>
        </div>
      </section>

      <section id="new" className="scroll-mt-16 overflow-hidden pb-24">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-8">
          <div className="mb-8 flex items-end justify-between gap-6">
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-[600] leading-none tracking-[-0.035em]">{t.newSeason}</h2>
            <a href="#catalogue" className="shrink-0 text-[14px] underline underline-offset-4">
              {t.viewAll}
            </a>
          </div>
          <Rail label={t.newSeason}>
            {newIn.map((slug) => {
              const p = products.find((x) => x.slug === slug)!;
              return (
                <article key={slug} className="group w-[78vw] shrink-0 snap-start sm:w-[42vw] lg:w-[30vw] xl:w-[25vw]">
                  <div className="relative overflow-hidden">
                    <Link href={`/furniture/${p.slug}`} draggable={false}>
                      <Photo photo={p.photos[0]} position={p.focus} className="aspect-[3/4] w-full" sizes="(min-width:1024px) 30vw, 78vw" imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setQuick(p.slug)}
                      className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-bg/95 py-2.5 text-[14px] font-medium opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 max-lg:translate-y-0 max-lg:opacity-100"
                    >
                      {t.quickView}
                    </button>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-3">
                    <h3 className="text-[16px] font-[600]">{lang === "th" ? p.nameTh : p.name}</h3>
                    <span className="text-[13px] text-muted">{p.collection}</span>
                  </div>
                </article>
              );
            })}
          </Rail>
        </div>
      </section>

      <section id="rooms" className="scroll-mt-16 bg-ink text-bg">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-20 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <div className="flex flex-col">
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-[600] leading-none tracking-[-0.035em]">{t.shopBy}</h2>
            <p className="mt-5 max-w-[40ch] text-[16px] leading-relaxed opacity-70">{t.roomsBody}</p>
            <ul className="mt-12 border-t border-bg/20 lg:mt-auto">
              {rooms.map((r, i) => (
                <li key={r.label} className="border-b border-bg/20">
                  <button
                    type="button"
                    onMouseEnter={() => setRoom(i)}
                    onFocus={() => setRoom(i)}
                    onClick={() => pick(r.cats)}
                    className="group flex w-full items-center gap-6 py-5 text-left"
                  >
                    <span className={`text-[clamp(1.6rem,3vw,2.6rem)] font-[500] tracking-[-0.03em] transition-opacity duration-300 ${room === i ? "opacity-100" : "opacity-40"}`}>{r.label}</span>
                    <span className={`hidden text-[14px] transition-opacity duration-300 sm:block ${room === i ? "opacity-70" : "opacity-0"}`}>{r.note[lang]}</span>
                    <span className={`ml-auto transition-transform duration-300 ${room === i ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}>
                      <Arrow />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div key={room} className="absolute inset-0" initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: "inset(0% 0 0 0)" }} exit={{ opacity: 1 }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
                <Photo photo={rooms[room].photo} position={rooms[room].position} className="h-full w-full" sizes="(min-width:1024px) 50vw, 100vw" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
