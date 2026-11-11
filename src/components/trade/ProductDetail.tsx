"use client";

import Link from "next/link";
import { useState } from "react";
import { Photo } from "@/components/shared/Photo";
import { ColorwayPreview } from "@/components/shared/ColorwayPreview";
import { materialLabels, products, type Product } from "@/data/products";
import { useTrade } from "./TradeProvider";
import { ProductCard } from "./ProductCard";

export function ProductDetail({ product }: { product: Product }) {
  const { t, lang, add } = useTrade();
  const [colorway, setColorway] = useState(product.colorways[0]);
  const [qty, setQty] = useState(product.moq);
  const [view, setView] = useState<number | "preview">(0);
  const [toast, setToast] = useState(false);

  const related = products.filter((p) => p.collection === product.collection && p.slug !== product.slug).slice(0, 3);
  const { w, d, h, sh } = product.dims;

  const specs: [string, string][] = [
    [t.dims, `W ${w} × D ${d} × H ${h} cm`],
    ...(sh ? ([[t.seatHeight, `${sh} cm`]] as [string, string][]) : []),
    [t.weight, `${product.weightKg} kg`],
    [t.materials, product.materials.map((m) => materialLabels[m][lang]).join(", ")],
    [t.rating, `${product.outdoor ? t.outdoorRated : t.indoorOnly}. ${product.contract ? t.contractYes : t.residential}`],
    [t.moqLabel, t.units(product.moq)],
    [t.lead, t.weeks(product.leadWeeks)],
    [t.packing, `${product.cbm} m³`],
  ];

  function addToQuote() {
    add({ slug: product.slug, colorway: colorway.id, qty });
    setToast(true);
    window.setTimeout(() => setToast(false), 3200);
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-24 pt-6 sm:px-8">
      <nav aria-label="Breadcrumb" className="no-print text-[13px] text-muted">
        <Link href="/furniture" className="hover:text-ink">
          {t.catalogue}
        </Link>
        <span className="px-2">/</span>
        <span>{product.collection}</span>
      </nav>

      {/* Header that only appears on the printed spec sheet */}
      <div className="mb-6 hidden border-b border-ink pb-3 print:block">
        <p className="text-[18px] font-[650]">Loom &amp; Tide, spec sheet</p>
        <p className="text-[12px]">trade@loomandtide.example</p>
      </div>

      <div className="mt-5 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-soft sm:aspect-[5/4]">
            {view === "preview" ? (
              <div className="flex h-full items-center justify-center bg-soft">
                <ColorwayPreview
                  kind={product.preview!}
                  frame={colorway.frame}
                  weaveA={colorway.weaveA}
                  weaveB={colorway.weaveB}
                  title={`${product.name} in ${colorway.name.en}`}
                  className="h-[82%]"
                />
                <p className="absolute bottom-3 left-4 right-4 text-[12px] text-muted">{t.previewNote}</p>
              </div>
            ) : (
              <Photo photo={product.photos[view]} className="h-full w-full" priority position={view === 0 ? product.focus : undefined} sizes="(min-width: 1024px) 55vw, 100vw" />
            )}
          </div>
          <div className="no-print mt-3 flex gap-3">
            {product.preview && (
              <button
                type="button"
                onClick={() => setView("preview")}
                aria-pressed={view === "preview"}
                aria-label="Colourway drawing"
                className={`flex size-20 items-center justify-center rounded-[4px] bg-soft ring-2 transition ${view === "preview" ? "ring-ink" : "ring-transparent"}`}
              >
                <ColorwayPreview kind={product.preview} frame={colorway.frame} weaveA={colorway.weaveA} weaveB={colorway.weaveB} className="h-16" />
              </button>
            )}
            {product.photos.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => setView(i)}
                aria-pressed={view === i}
                aria-label={`Photo ${i + 1}`}
                className={`overflow-hidden rounded-[4px] ring-2 transition ${view === i ? "ring-ink" : "ring-transparent"}`}
              >
                <Photo photo={p} className="size-20" sizes="80px" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[13px] text-muted">{product.collection}</p>
          <h1 className="mt-1 text-[clamp(1.9rem,3.4vw,2.75rem)] font-[650] leading-[1.05] tracking-[-0.02em]">
            {lang === "th" ? product.nameTh : product.name}
          </h1>
          <p className="mt-1 text-[14px] text-muted">
            {t.designedBy} {product.designer}, {product.year}
          </p>
          <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed">{product.summary[lang]}</p>

          <fieldset className="no-print mt-7">
            <legend className="text-[13px] text-muted">
              {t.colourway}: <span className="text-ink">{colorway.name[lang]}</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {product.colorways.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColorway(c)}
                  aria-pressed={c.id === colorway.id}
                  aria-label={c.name[lang]}
                  title={c.name[lang]}
                  className={`relative size-10 overflow-hidden rounded-full ring-offset-2 ring-offset-bg transition ${
                    c.id === colorway.id ? "ring-2 ring-ink" : "ring-1 ring-black/10 hover:ring-black/30"
                  }`}
                >
                  <span className="absolute inset-0" style={{ background: c.frame }} />
                  <span className="absolute inset-y-0 right-0 w-1/2" style={{ background: c.weaveA }} />
                  <span className="absolute bottom-0 right-0 h-1/3 w-1/2" style={{ background: c.weaveB }} />
                </button>
              ))}
            </div>
          </fieldset>

          <div className="no-print mt-7 flex flex-wrap items-end gap-3">
            <div>
              <label htmlFor="qty" className="text-[13px] text-muted">
                {t.quantity}
              </label>
              <div className="mt-2 flex items-center rounded-[4px] border border-line bg-white">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3.5 py-2.5 text-[18px] leading-none" aria-label="Decrease quantity">
                  −
                </button>
                <input
                  id="qty"
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="tabular w-14 bg-transparent text-center text-[15px] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button type="button" onClick={() => setQty((q) => q + 1)} className="px-3.5 py-2.5 text-[18px] leading-none" aria-label="Increase quantity">
                  +
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={addToQuote}
              className="rounded-[4px] bg-accent px-5 py-3 text-[15px] font-medium text-accent-ink transition-opacity hover:opacity-90"
            >
              {t.addWithQty(qty)}
            </button>
          </div>
          {qty < product.moq && (
            <p className="no-print mt-2 text-[13px] text-muted">
              {t.moqLabel}: {t.units(product.moq)}
            </p>
          )}

          <div role="status" aria-live="polite" className="no-print">
            {toast && (
              <p className="mt-4 flex flex-wrap items-center gap-3 rounded-[4px] bg-[var(--ok)] px-4 py-3 text-[14px] text-white">
                {t.updated}
                <Link href="/furniture/quote" className="underline underline-offset-4">
                  {t.view}
                </Link>
              </p>
            )}
          </div>

          <section className="mt-10">
            <h2 className="text-[15px] font-[600]">{t.specs}</h2>
            <dl className="mt-3 border-t border-line text-[14px]">
              {specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[150px_1fr] gap-4 border-b border-line py-2.5">
                  <dt className="text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="no-print mt-8">
            <h2 className="text-[15px] font-[600]">{t.files}</h2>
            {process.env.NEXT_PUBLIC_PREVIEW !== "1" && (
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-3 rounded-[4px] border border-ink px-4 py-2 text-[14px] transition-colors hover:bg-ink hover:text-bg"
            >
              {t.printSheet}
            </button>
            )}
            <p className="mt-2 text-[13px] text-muted">{t.cadNote}</p>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="no-print mt-20 border-t border-line pt-10">
          <h2 className="text-[20px] font-[650] tracking-[-0.01em]">{t.related}</h2>
          <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
