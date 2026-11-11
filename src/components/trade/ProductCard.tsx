"use client";

import Link from "next/link";
import { Photo } from "@/components/shared/Photo";
import type { Product } from "@/data/products";
import { useTrade } from "./TradeProvider";

export function ProductCard({ product }: { product: Product }) {
  const { t, lang, items, setQuick } = useTrade();
  const inList = items.some((i) => i.slug === product.slug);
  const { w, d, h } = product.dims;
  const alt = product.photos[1];

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden bg-soft">
        <Link href={`/furniture/${product.slug}`} className="block" aria-label={product.name} data-cursor={lang === "th" ? "ดู" : "View"}>
          <Photo
            photo={product.photos[0]}
            className="aspect-[4/5] w-full"
            position={product.focus}
            imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
            sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
          />
          {alt && (
            <Photo
              photo={alt}
              className="!absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
            />
          )}
        </Link>
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-3 text-[12px]">
          <span className="flex gap-1.5">
            {product.outdoor && <span className="rounded-full bg-bg/90 px-2.5 py-1 backdrop-blur">{t.outdoor}</span>}
            {inList && <span className="rounded-full bg-[var(--ok)] px-2.5 py-1 text-white">{t.added}</span>}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setQuick(product.slug)}
          className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-bg/95 py-2.5 text-[14px] font-medium opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 max-lg:translate-y-0 max-lg:opacity-100"
        >
          {t.quickView}
        </button>
      </div>
      <Link href={`/furniture/${product.slug}`} className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="text-[16px] font-[600] leading-snug">{lang === "th" ? product.nameTh : product.name}</h3>
        <span className="shrink-0 text-[13px] text-muted">{product.collection}</span>
      </Link>
      <div className="mt-1 flex items-center justify-between gap-3 text-[13px] text-muted">
        <span className="tabular flex gap-3">
          <span>
            {w} × {d} × {h} cm
          </span>
          <span>{t.weeks(product.leadWeeks)}</span>
        </span>
        <span className="flex gap-1" aria-label={t.colourway}>
          {product.colorways.map((c) => (
            <span key={c.id} title={c.name[lang]} className="size-3 rounded-full ring-1 ring-black/10" style={{ background: `linear-gradient(135deg, ${c.frame} 50%, ${c.weaveA} 50%)` }} />
          ))}
        </span>
      </div>
    </article>
  );
}
