"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Photo } from "@/components/shared/Photo";
import { getProduct, materialLabels } from "@/data/products";
import type { Project } from "@/data/projects";

type Props = {
  space: Project["space"];
  picked: string[];
  onPick: (slug: string) => void;
};

/**
 * The project photo with tappable markers on each piece. Selecting a marker
 * (or its row in the list) opens the piece beside the photo.
 *
 * Press "e" to switch on placement mode: clicking the photo then shows the
 * x and y percentages to paste into src/data/projects.ts.
 */
export function ShopTheSpace({ space, picked, onPick }: Props) {
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

  const spot = space.hotspots[active];
  const product = getProduct(spot.product);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
      <div>
        <div
          ref={frame}
          className={`relative ${placing ? "cursor-crosshair" : ""}`}
          onClick={(e) => {
            if (!placing || !frame.current) return;
            const r = frame.current.getBoundingClientRect();
            const x = Math.round(((e.clientX - r.left) / r.width) * 100);
            const y = Math.round(((e.clientY - r.top) / r.height) * 100);
            setLastPoint(`{ x: ${x}, y: ${y} }`);
          }}
        >
          <Photo photo={space.photo} className="aspect-[3/2] w-full rounded-[3px]" sizes="(min-width: 1024px) 62vw, 100vw" />
          {space.hotspots.map((h, i) => {
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
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-full border-2 border-white shadow-[0_4px_16px_rgb(0_0_0/0.35)] transition-transform duration-300 ${
                    isActive ? "scale-110 bg-accent" : "bg-white/30 backdrop-blur-sm group-hover:scale-110"
                  }`}
                >
                  <span className={`size-2.5 rounded-full ${isActive ? "bg-[var(--forest)]" : "bg-white"}`} />
                </span>
              </button>
            );
          })}
          {placing && (
            <p className="absolute left-3 top-3 rounded-[3px] bg-black/75 px-3 py-2 font-mono text-[12px] text-white">
              Placement mode. Click the photo. {lastPoint ?? ""}
            </p>
          )}
        </div>
        <p className="mt-3 text-[14px] text-white/70">{space.caption}</p>
      </div>

      <div className="lg:sticky lg:top-8">
        <ul className="border-t border-white/15">
          {space.hotspots.map((h, i) => (
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
              key={product.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-6 rounded-[3px] bg-[var(--bg)] p-4 text-ink"
              aria-live="polite"
            >
              <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-4">
                <Photo photo={product.photos[0]} className="aspect-square w-full rounded-[2px]" sizes="96px" showAlt={false} />
                <div>
                  <h3 className="font-display text-[1.35rem] leading-tight">{product.name}</h3>
                  <p className="mt-1 text-[13px] text-muted">
                    {product.materials.map((m) => materialLabels[m].en).join(", ")}
                  </p>
                  <p className="mt-2 text-[14px] leading-snug">{spot.note}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onPick(product.slug)}
                  disabled={picked.includes(product.slug)}
                  className="rounded-full bg-ink px-4 py-2 text-[14px] text-bg transition-opacity disabled:opacity-60"
                >
                  {picked.includes(product.slug) ? "Added to your inquiry" : "Add to my inquiry"}
                </button>
                <Link href={`/trade/${product.slug}`} className="rounded-full border border-ink/25 px-4 py-2 text-[14px] hover:border-ink">
                  Specs and lead time
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
