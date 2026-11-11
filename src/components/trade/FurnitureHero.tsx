"use client";

import Link from "next/link";
import { Photo } from "@/components/shared/Photo";
import { photos } from "@/data/images";
import { products, type Category } from "@/data/products";
import { useTrade } from "./TradeProvider";

export function FurnitureHero() {
  const { t, setCats } = useTrade();

  const tiles: { label: string; cats: Category[]; photo: typeof photos.caneDiningChairs; position?: string }[] = [
    { label: t.tileDining, cats: ["dining"], photo: photos.caneDiningChairs, position: "50% 75%" },
    { label: t.tileOutdoor, cats: ["outdoor"], photo: photos.archedTerraceChairs, position: "50% 70%" },
    { label: t.tileLighting, cats: ["lighting"], photo: photos.bellPendantsLiving, position: "50% 25%" },
  ];

  const count = (cats: Category[]) => products.filter((p) => cats.includes(p.category)).length;

  return (
    <>
      <section className="mx-auto grid max-w-[1440px] gap-10 px-4 pt-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16 lg:pt-12">
        <div className="flex flex-col justify-end gap-10 lg:py-6">
          <h1 className="max-w-[14ch] text-[clamp(2.4rem,5.2vw,4.6rem)] font-[600] leading-[1.02] tracking-[-0.035em]">
            {t.heroTitle}
          </h1>
          <div>
            <p className="max-w-[52ch] text-[17px] leading-relaxed text-muted">{t.heroBody}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#catalogue" className="rounded-[4px] bg-ink px-5 py-3 text-[15px] font-medium text-bg">
                {t.heroCta}
              </a>
              <Link href="/furniture/quote" className="rounded-[4px] border border-ink/25 px-5 py-3 text-[15px] hover:border-ink">
                {t.heroQuote}
              </Link>
            </div>
            <ul className="mt-10 grid gap-px overflow-hidden rounded-[4px] border border-line bg-line text-[14px] sm:grid-cols-3">
              {[t.perk1, t.perk2, t.perk3].map((perk) => (
                <li key={perk} className="bg-bg px-4 py-3.5 leading-snug">
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <figure>
          <Photo
            photo={photos.rattanArmchairStudio}
            priority
            className="aspect-[4/5] w-full rounded-[4px]"
            position="50% 60%"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
          <figcaption className="mt-2 text-[13px] text-muted">{t.heroCaption}</figcaption>
        </figure>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pt-16 sm:px-8" aria-labelledby="shop-by">
        <h2 id="shop-by" className="text-[15px] font-[600]">
          {t.shopBy}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {tiles.map((tile) => (
            <a
              key={tile.label}
              href="#catalogue"
              onClick={() => setCats(tile.cats)}
              className="group relative block overflow-hidden rounded-[4px]"
            >
              <Photo photo={tile.photo} className="aspect-[4/3] w-full" position={tile.position} sizes="(min-width: 640px) 33vw, 100vw" />
              <span className="absolute inset-x-0 bottom-0 flex items-baseline justify-between bg-gradient-to-t from-black/55 to-transparent px-4 pb-3 pt-12 text-white">
                <span className="text-[18px] font-[600] group-hover:underline group-hover:underline-offset-4">{tile.label}</span>
                <span className="text-[13px] opacity-85">{t.pieces(count(tile.cats))}</span>
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
