"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Photo } from "@/components/shared/Photo";
import { photoUrl, type Photo as PhotoType } from "@/data/images";
import { finishSwatch, products, projects, thb, type Product } from "@/data/loom";
import { base, Stepper } from "./Chrome";
import { ProductCard } from "./Pages";
import { useQuote } from "./store";

export function ProductPage({ product: p }: { product: Product }) {
  const { add } = useQuote();
  const [finish, setFinish] = useState(p.finishes[0]);
  const [size, setSize] = useState(p.sizes?.[0].label);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const rail = useRef<HTMLDivElement>(null);

  const sizeInfo = p.sizes?.find((s) => s.label === size);
  const price = p.price + (sizeInfo?.add ?? 0);
  const seenIn = projects.filter((pr) => pr.pieces.includes(p.slug));
  const related = products
    .filter((x) => x.slug !== p.slug)
    .sort((x, y) => Number(y.category === p.category) - Number(x.category === p.category) || Number(y.setting === p.setting) - Number(x.setting === p.setting))
    .slice(0, 4);
  const wide = (i: number) => i === 0 || (i === p.photos.length - 1 && i % 2 === 1);

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pt-5 text-[13px] text-muted">
        <Link href={`${base}/shop`} className="hover:text-ink">
          Shop
        </Link>
        <span className="px-2">/</span>
        <Link href={`${base}/${p.category.toLowerCase()}`} className="hover:text-ink">
          {p.category}
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink">{p.name}</span>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-[var(--gutter)] pt-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
        {/* Gallery: stacked on desktop, swipe on phones */}
        <div className="min-w-0">
          <div
            ref={rail}
            onScroll={(e) => {
              const el = e.currentTarget;
              setSlide(Math.round(el.scrollLeft / el.clientWidth));
            }}
            className="-mx-[var(--gutter)] flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-3 lg:overflow-visible"
          >
            {p.photos.map((ph, i) => (
              <button
                key={ph.slug}
                type="button"
                onClick={() => setZoom(i)}
                aria-label={`Enlarge photo ${i + 1}`}
                className={`w-full shrink-0 snap-center lg:w-auto ${wide(i) ? "lg:col-span-2" : ""}`}
                style={{ cursor: "zoom-in" }}
              >
                <Photo photo={ph} className={wide(i) ? "aspect-[4/5] lg:aspect-[5/4]" : "aspect-[4/5]"} sizes="(min-width:1024px) 55vw, 100vw" priority={i === 0} position={i === 0 ? p.pos : undefined} />
              </button>
            ))}
          </div>
          {p.photos.length > 1 && (
            <div className="mt-3 flex justify-center gap-1.5 lg:hidden">
              {p.photos.map((ph, i) => (
                <span key={ph.slug} className={`h-1 rounded-full transition-all ${i === slide ? "w-5 bg-ink" : "w-1.5 bg-line"}`} />
              ))}
            </div>
          )}
        </div>

        {/* Buy box */}
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-[clamp(1.8rem,3vw,2.4rem)] font-medium leading-tight tracking-[-0.02em]">{p.name}</h1>
            <p className="tabular text-[18px]">{thb(price)}</p>
          </div>
          <p className="mt-1 text-[15px] text-muted">{p.type}</p>
          <p className="mt-5 max-w-[52ch] text-[15.5px] leading-relaxed">{p.blurb}</p>

          <fieldset className="mt-7">
            <legend className="text-[14px]">
              Finish <span className="text-muted">{finish}</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {p.finishes.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFinish(f)}
                  aria-label={f}
                  aria-pressed={f === finish}
                  className={`size-9 rounded-full p-[3px] ring-1 transition ${f === finish ? "ring-ink" : "ring-transparent hover:ring-line"}`}
                >
                  <span className="block size-full rounded-full border border-black/10" style={{ background: finishSwatch[f] }} />
                </button>
              ))}
            </div>
            {finish !== p.finishes[0] && <p className="mt-2 text-[13px] text-muted">Photos show {p.finishes[0].toLowerCase()}. We post a finish sample on request.</p>}
          </fieldset>

          {p.sizes && (
            <fieldset className="mt-6">
              <legend className="text-[14px]">
                Size <span className="text-muted">{sizeInfo?.dims}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setSize(s.label)}
                    aria-pressed={s.label === size}
                    className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${s.label === size ? "border-ink bg-ink text-bg" : "border-line hover:border-ink"}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-8 flex gap-3">
            <Stepper value={qty} onChange={(n) => setQty(Math.max(1, Math.min(99, n)))} />
            <button
              type="button"
              onClick={() => {
                add({ slug: p.slug, finish, size, qty });
                setQty(1);
              }}
              className="flex-1 rounded-full bg-ink py-3 text-[15px] text-bg transition-opacity hover:opacity-90"
            >
              Add to quote
            </button>
          </div>
          <p className="mt-3 text-[13px] text-muted">
            Made to order in {p.leadWeeks} weeks. Ordering 20 or more for a hotel or restaurant?{" "}
            <Link href={`${base}/trade`} className="text-ink underline underline-offset-4">
              Trade pricing
            </Link>
          </p>

          <div className="mt-8 border-t border-line">
            <Fold title="Dimensions" defaultOpen>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                <dt className="text-muted">Size</dt>
                <dd>{sizeInfo?.dims ?? p.dims}</dd>
                <dt className="text-muted">Weight</dt>
                <dd>{p.weight}</dd>
                <dt className="text-muted">Use</dt>
                <dd>{p.setting}</dd>
              </dl>
            </Fold>
            <Fold title="Materials and care">
              <p>{p.material}.</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {p.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p className="mt-3 text-muted">
                {p.setting === "Indoor"
                  ? "Dust with a soft brush. Keep out of direct sun and away from air-con vents, which dry the cane."
                  : "Rinse with fresh water after salt air or chlorine. Store cushions in the dry season shed or under cover during monsoon."}
              </p>
            </Fold>
            <Fold title="Delivery and returns">
              <p>
                Free delivery and placement in Bangkok on orders over ฿40,000. Elsewhere in Thailand we quote by region. Lighting is installed by your electrician; we send a wiring sheet with
                each pendant.
              </p>
              <p className="mt-3 text-muted">Stock pieces can be returned within 14 days. Made-to-order finishes and sizes cannot.</p>
            </Fold>
          </div>
        </div>
      </div>

      {seenIn.length > 0 && (
        <section className="mx-auto mt-20 max-w-[1440px] px-[var(--gutter)]">
          <h2 className="text-[22px] font-medium tracking-[-0.01em]">In use</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {seenIn.map((pr) => (
              <Link key={pr.name} href={`${base}/projects`} className="group grid grid-cols-[120px_1fr] items-center gap-5 sm:grid-cols-[160px_1fr]">
                <Photo photo={pr.photo} className="aspect-square" sizes="160px" />
                <div className="text-[14px]">
                  <p className="text-[16px] font-medium group-hover:underline group-hover:underline-offset-4">{pr.name}</p>
                  <p className="text-muted">
                    {pr.place}, {pr.year}
                  </p>
                  <p className="mt-2 text-muted">{pr.scope}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-20 max-w-[1440px] px-[var(--gutter)]">
        <h2 className="text-[22px] font-medium tracking-[-0.01em]">Goes well with</h2>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {related.map((r) => (
            <ProductCard key={r.slug} product={r} />
          ))}
        </div>
      </section>

      <ZoomViewer photos={p.photos} index={zoom} onIndex={setZoom} title={`${p.name} ${p.type.toLowerCase()}`} />
    </>
  );
}

function Fold({ title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-b border-line">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between py-4 text-left text-[15px]">
        {title}
        <span className={`text-[18px] leading-none transition-transform duration-300 ${open ? "rotate-45" : ""}`} aria-hidden>
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="pb-5 text-[14px] leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Full-screen photo viewer. Click or tap to zoom to 2.5x, then move to look around. */
function ZoomViewer({ photos, index, onIndex, title }: { photos: PhotoType[]; index: number | null; onIndex: (n: number | null) => void; title: string }) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onIndex(null);
      if (e.key === "ArrowRight") onIndex((index! + 1) % photos.length);
      if (e.key === "ArrowLeft") onIndex((index! - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, index, photos.length, onIndex]);

  const go = (n: number | null) => {
    setZoomed(false);
    onIndex(n);
  };
  // offsetX is measured in the image's own, unscaled box, so the origin stays put while zoomed.
  const track = (e: React.PointerEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    setOrigin({ x: (e.nativeEvent.offsetX / el.offsetWidth) * 100, y: (e.nativeEvent.offsetY / el.offsetHeight) * 100 });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photos`}
          className="fixed inset-0 z-[70] flex flex-col bg-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between px-[var(--gutter)] py-3 text-[14px]">
            <span>
              {title} <span className="tabular text-muted">{index! + 1} of {photos.length}</span>
            </span>
            <button type="button" onClick={() => go(null)} className="rounded-full border border-line px-4 py-2 hover:border-ink" autoFocus>
              Close
            </button>
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={index}
                src={photoUrl(photos[index!], 1600)}
                alt={photos[index!].alt}
                draggable={false}
                onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                ref={(el) => {
                  if (el?.complete) el.style.opacity = "1";
                }}
                onPointerDown={(e) => {
                  track(e);
                  setZoomed((z) => !z);
                }}
                onPointerMove={(e) => zoomed && track(e)}
                className="max-h-full max-w-full touch-none select-none object-contain opacity-0 transition-[transform,opacity] duration-300 ease-out"
                style={{ cursor: zoomed ? "zoom-out" : "zoom-in", transform: zoomed ? "scale(2.5)" : "none", transformOrigin: `${origin.x}% ${origin.y}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 px-[var(--gutter)] py-4">
            {photos.map((ph, i) => (
              <button
                key={ph.slug}
                type="button"
                onClick={() => go(i)}
                aria-label={`Photo ${i + 1}`}
                className={`ring-offset-2 ring-offset-bg transition ${i === index ? "ring-1 ring-ink" : "opacity-60 hover:opacity-100"}`}
              >
                <Photo photo={ph} className="size-14" sizes="56px" />
              </button>
            ))}
          </div>
          <p className="pb-4 text-center text-[12.5px] text-muted">{zoomed ? "Move to look around. Tap again to zoom out." : "Tap the photo to zoom in."}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
