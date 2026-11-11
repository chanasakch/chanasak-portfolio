"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Photo } from "@/components/shared/Photo";
import { getProduct, materialLabels } from "@/data/products";
import type { Photo as PhotoType } from "@/data/images";

type Spot = { x: number; y: number; product: string; note: string };

type Props = {
  photo: PhotoType;
  spots: Spot[];
  caption: string;
};

/**
 * A photo with a marker on each piece of furniture. Selecting a marker (or its
 * row in the list) shows what the piece is and links to it in the catalogue.
 *
 * Press "e" to switch on placement mode: clicking the photo then shows the
 * x and y percentages to paste into the data file.
 */
export function ShopTheSpace({ photo, spots, caption }: Props) {
  const [active, setActive] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [lastPoint, setLastPoint] = useState<string | null>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select")) return;
      if (e.key === "e") setPlacing((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const spot = spots[active];
  const product = getProduct(spot.product);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">
      <figure>
        <div
          ref={frame}
          className={`relative ${placing ? "cursor-crosshair" : ""}`}
          style={{ aspectRatio: `${photo.w} / ${photo.h}` }}
          onClick={(e) => {
            if (!placing || !frame.current) return;
            const r = frame.current.getBoundingClientRect();
            const x = Math.round(((e.clientX - r.left) / r.width) * 100);
            const y = Math.round(((e.clientY - r.top) / r.height) * 100);
            setLastPoint(`{ x: ${x}, y: ${y} }`);
          }}
        >
          <Photo photo={photo} className="absolute inset-0 rounded-[2px]" sizes="(min-width: 1024px) 62vw, 100vw" />
          {spots.map((h, i) => {
            const isActive = i === active;
            const name = getProduct(h.product)?.name ?? h.product;
            return (
              <button
                key={h.product + i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(i);
                }}
                aria-pressed={isActive}
                aria-label={`Show ${name}`}
                className="group absolute -translate-x-1/2 -translate-y-1/2 p-2"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-full border-2 border-white shadow-[0_2px_12px_rgb(0_0_0/0.35)] transition-transform duration-200 ${
                    isActive ? "scale-110 bg-accent" : "bg-white/25 backdrop-blur-sm group-hover:scale-110"
                  }`}
                >
                  <span className={`size-2 rounded-full ${isActive ? "bg-[var(--forest)]" : "bg-white"}`} />
                </span>
              </button>
            );
          })}
          {placing && (
            <p className="absolute left-3 top-3 rounded-[2px] bg-black/75 px-3 py-2 font-mono text-[12px] text-white">
              Placement mode. Click the photo. {lastPoint ?? ""}
            </p>
          )}
        </div>
        <figcaption className="mt-3 text-[14px] text-white/70">{caption}</figcaption>
      </figure>

      <div className="lg:sticky lg:top-8">
        <ul className="border-t border-white/15">
          {spots.map((h, i) => (
            <li key={h.product + i} className="border-b border-white/15">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className="flex w-full items-center gap-3 py-3 text-left text-[15px]"
              >
                <span className={`size-2.5 shrink-0 rounded-full ${i === active ? "bg-accent" : "bg-white/35"}`} />
                <span className={i === active ? "text-white" : "text-white/65"}>{getProduct(h.product)?.name}</span>
              </button>
            </li>
          ))}
        </ul>

        <AnimatePresence mode="wait">
          {product && (
            <motion.div
              key={`${product.slug}-${active}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-6 rounded-[2px] bg-[var(--bg)] p-4 text-ink"
              aria-live="polite"
            >
              <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-4">
                <Photo photo={product.photos[0]} className="aspect-square w-full rounded-[2px]" sizes="96px" />
                <div className="min-w-0">
                  <h3 className="font-display text-[1.3rem] leading-tight">{product.name}</h3>
                  <p className="mt-1 text-[13px] text-muted">{product.materials.map((m) => materialLabels[m].en).join(", ")}</p>
                  <p className="mt-2 text-[14px] leading-snug">{spot.note}</p>
                </div>
              </div>
              <Link
                href={`/furniture/${product.slug}`}
                className="mt-4 inline-block rounded-full bg-ink px-4 py-2 text-[14px] text-bg"
              >
                See it in the Loom &amp; Tide catalogue
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
