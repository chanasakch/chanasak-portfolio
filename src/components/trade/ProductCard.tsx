"use client";

import Link from "next/link";
import { Photo } from "@/components/shared/Photo";
import type { Product } from "@/data/products";
import { useTrade } from "./TradeProvider";

export function ProductCard({ product }: { product: Product }) {
  const { t, lang, items, add } = useTrade();
  const inList = items.some((i) => i.slug === product.slug);
  const { w, d, h } = product.dims;

  return (
    <article className="group flex flex-col">
      <Link href={`/trade/${product.slug}`} className="block">
        <Photo
          photo={product.photos[0]}
          className="aspect-[4/3] w-full rounded-[6px]"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
        />
        <div className="mt-3 flex items-baseline justify-between gap-3">
          <h3 className="text-[16px] font-[600] leading-snug">{lang === "th" ? product.nameTh : product.name}</h3>
          <span className="shrink-0 text-[12px] text-muted">{product.collection}</span>
        </div>
      </Link>
      <p className="tabular mt-1 text-[13px] text-muted">
        W {w} × D {d} × H {h} cm
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5 text-[12px]">
        {product.outdoor && <span className="rounded-[4px] bg-soft px-2 py-0.5">{t.outdoor}</span>}
        {product.contract && <span className="rounded-[4px] bg-soft px-2 py-0.5">{t.contract}</span>}
        <span className="rounded-[4px] bg-soft px-2 py-0.5 tabular">{t.weeks(product.leadWeeks)}</span>
        <span className="rounded-[4px] bg-soft px-2 py-0.5 tabular">{t.moq(product.moq)}</span>
      </div>
      <div className="mt-3 flex items-center gap-1.5" aria-label={t.colourway}>
        {product.colorways.map((c) => (
          <span
            key={c.id}
            title={c.name[lang]}
            className="size-3.5 rounded-full ring-1 ring-black/10"
            style={{ background: `linear-gradient(135deg, ${c.frame} 50%, ${c.weaveA} 50%)` }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => add({ slug: product.slug, colorway: product.colorways[0].id, qty: product.moq })}
        className={`mt-4 rounded-[6px] border px-3 py-2 text-[14px] font-medium transition-colors ${
          inList ? "border-[var(--ok)] bg-[var(--ok)] text-white" : "border-ink hover:bg-ink hover:text-bg"
        }`}
        aria-live="polite"
      >
        {inList ? `${t.added} ✓` : t.add}
      </button>
    </article>
  );
}
