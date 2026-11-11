"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Photo } from "@/components/shared/Photo";
import { CloseButton, Drawer, Modal } from "@/components/shared/ui";
import { categoryLabels, getProduct, products } from "@/data/products";
import { useTrade } from "./TradeProvider";
import { SearchIcon } from "./TradeHeader";

export function TradeOverlays() {
  return (
    <>
      <SearchOverlay />
      <QuoteDrawer />
      <QuickView />
    </>
  );
}

function SearchOverlay() {
  const { t, lang, searchOpen, setSearchOpen, setQuery } = useTrade();
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const close = () => setSearchOpen(false);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    setTimeout(() => input.current?.focus(), 50);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, setSearchOpen]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return products.filter((p) =>
      `${p.name} ${p.nameTh} ${p.collection} ${p.designer} ${p.category} ${categoryLabels[p.category].en} ${categoryLabels[p.category].th} ${p.materials.join(" ")} ${p.outdoor ? "outdoor กลางแจ้ง" : ""}`
        .toLowerCase()
        .includes(s),
    );
  }, [q]);

  const suggestions = lang === "th" ? ["Kluen", "โคมไฟ", "กลางแจ้ง", "cane"] : ["Kluen", "pendant", "outdoor", "cane"];

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={t.search}>
          <motion.button type="button" aria-label="Close" onClick={close} className="absolute inset-0 cursor-default bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            className="relative max-h-[88dvh] overflow-y-auto bg-bg text-ink"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-5 sm:px-8">
              <div className="flex items-center gap-4 border-b border-ink pb-3">
                <SearchIcon />
                <label htmlFor="overlay-search" className="sr-only">
                  {t.search}
                </label>
                <input
                  ref={input}
                  id="overlay-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && q.trim()) {
                      setQuery(q);
                      close();
                      setTimeout(() => document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" }), 80);
                    }
                  }}
                  placeholder={t.searchHint}
                  className="min-w-0 flex-1 bg-transparent py-2 text-[clamp(1.4rem,3vw,2.4rem)] font-[500] tracking-[-0.02em] outline-none placeholder:text-muted/60"
                />
                <CloseButton onClick={close} />
              </div>

              {!q.trim() ? (
                <div className="mt-6 flex flex-wrap items-center gap-2 text-[14px]">
                  <span className="mr-2 text-muted">{t.suggestions}</span>
                  {suggestions.map((s) => (
                    <button key={s} type="button" onClick={() => setQ(s)} className="rounded-full border border-line px-3.5 py-1.5 hover:border-ink">
                      {s}
                    </button>
                  ))}
                </div>
              ) : results.length === 0 ? (
                <p className="mt-8 text-[16px] text-muted">{t.searchNone(q.trim())}</p>
              ) : (
                <>
                  <p className="tabular mt-6 text-[13px] text-muted">{t.results(results.length)}</p>
                  <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
                    {results.slice(0, 12).map((p) => (
                      <li key={p.slug}>
                        <Link href={`/furniture/${p.slug}`} onClick={close} className="group block">
                          <Photo photo={p.photos[0]} position={p.focus} className="aspect-square w-full" sizes="(min-width:1024px) 16vw, 45vw" imgClassName="transition-transform duration-700 group-hover:scale-[1.04]" />
                          <span className="mt-2 block text-[14px] font-[600]">{lang === "th" ? p.nameTh : p.name}</span>
                          <span className="block text-[12px] text-muted">{categoryLabels[p.category][lang]}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function QuoteDrawer() {
  const { t, lang, drawer, setDrawer, items, setQty, remove, count } = useTrade();
  const close = () => setDrawer(false);

  return (
    <Drawer
      open={drawer}
      onClose={close}
      title={`${t.quoteList} (${count})`}
      footer={
        items.length > 0 ? (
          <div className="grid gap-2">
            <p className="tabular text-[13px] text-muted">{t.totalUnits(count)}</p>
            <Link href="/furniture/quote" onClick={close} className="rounded-full bg-ink px-5 py-3.5 text-center text-[15px] font-medium text-bg hover:opacity-90">
              {t.review}
            </Link>
            <button type="button" onClick={close} className="py-2 text-[14px] underline underline-offset-4">
              {t.keepBrowsing}
            </button>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-start justify-center gap-5">
          <p className="max-w-[32ch] text-[16px] leading-relaxed text-muted">{t.drawerEmpty}</p>
          <button type="button" onClick={close} className="rounded-full border border-ink/25 px-5 py-2.5 text-[14px] hover:border-ink">
            {t.keepBrowsing}
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-line">
          <AnimatePresence initial={false}>
            {items.map((it) => {
              const p = getProduct(it.slug);
              if (!p) return null;
              const cw = p.colorways.find((c) => c.id === it.colorway) ?? p.colorways[0];
              return (
                <motion.li key={`${it.slug}-${it.colorway}`} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} className="flex gap-4 py-4 first:pt-0">
                  <Photo photo={p.photos[0]} position={p.focus} className="aspect-square w-24 shrink-0" sizes="96px" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link href={`/furniture/${p.slug}`} onClick={close} className="text-[15px] font-[600] hover:underline">
                      {lang === "th" ? p.nameTh : p.name}
                    </Link>
                    <span className="mt-0.5 flex items-center gap-2 text-[13px] text-muted">
                      <span className="size-3 rounded-full ring-1 ring-black/10" style={{ background: `linear-gradient(135deg, ${cw.frame} 50%, ${cw.weaveA} 50%)` }} />
                      {cw.name[lang]}
                    </span>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-line text-[14px]">
                        <button type="button" onClick={() => setQty(it.slug, it.colorway, it.qty - 1)} className="size-8" aria-label="Fewer">
                          −
                        </button>
                        <span className="tabular w-8 text-center">{it.qty}</span>
                        <button type="button" onClick={() => setQty(it.slug, it.colorway, it.qty + 1)} className="size-8" aria-label="More">
                          +
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(it.slug, it.colorway)} className="text-[13px] text-muted underline underline-offset-4 hover:text-ink">
                        {t.remove}
                      </button>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </Drawer>
  );
}

function QuickView() {
  const { t, lang, quick, setQuick, add } = useTrade();
  const p = quick ? getProduct(quick) : undefined;
  const [shot, setShot] = useState(0);
  const [cw, setCw] = useState(0);
  const [qty, setQtyLocal] = useState(1);

  useEffect(() => {
    queueMicrotask(() => {
      setShot(0);
      setCw(0);
      setQtyLocal(p?.moq ?? 1);
    });
  }, [p]);

  return (
    <Modal open={!!p} onClose={() => setQuick(null)} label={p ? p.name : t.quickView}>
      {p && (
        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <div className="relative bg-soft">
            <AnimatePresence mode="wait">
              <motion.div key={shot} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <Photo photo={p.photos[shot]} position={shot === 0 ? p.focus : undefined} className="aspect-[4/5] w-full md:aspect-auto md:h-[640px]" sizes="(min-width:768px) 50vw, 100vw" />
              </motion.div>
            </AnimatePresence>
            {p.photos.length > 1 && (
              <div className="absolute bottom-4 left-4 flex gap-2">
                {p.photos.map((ph, i) => (
                  <button key={ph.slug} type="button" onClick={() => setShot(i)} aria-label={`Photo ${i + 1}`} className={`overflow-hidden ring-2 ${i === shot ? "ring-white" : "ring-transparent opacity-75"}`}>
                    <Photo photo={ph} className="size-14" sizes="56px" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col p-6 sm:p-10">
            <p className="text-[13px] text-muted">
              {p.collection} / {categoryLabels[p.category][lang]}
            </p>
            <h2 className="mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-[600] leading-[1.05] tracking-[-0.03em]">{lang === "th" ? p.nameTh : p.name}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">{p.summary[lang]}</p>
            <dl className="tabular mt-6 grid grid-cols-3 gap-px border border-line bg-line text-[13px]">
              {[
                [t.dims, `${p.dims.w}×${p.dims.d}×${p.dims.h}`],
                [t.lead, t.weeks(p.leadWeeks)],
                [t.moqLabel, t.units(p.moq)],
              ].map(([k, v]) => (
                <div key={k} className="bg-bg px-3 py-2.5">
                  <dt className="text-muted">{k}</dt>
                  <dd className="mt-0.5 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[13px] text-muted">
              {t.colourway}: <span className="text-ink">{p.colorways[cw].name[lang]}</span>
            </p>
            <div className="mt-2 flex gap-2">
              {p.colorways.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCw(i)}
                  aria-label={c.name[lang]}
                  aria-pressed={i === cw}
                  className={`size-9 rounded-full ring-offset-2 ring-offset-bg transition-shadow ${i === cw ? "ring-1 ring-ink" : "ring-1 ring-black/10"}`}
                  style={{ background: `linear-gradient(135deg, ${c.frame} 50%, ${c.weaveA} 50%)` }}
                />
              ))}
            </div>
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
              <div className="flex items-center rounded-full border border-line text-[15px]">
                <button type="button" onClick={() => setQtyLocal(Math.max(1, qty - 1))} className="size-11" aria-label="Fewer">
                  −
                </button>
                <span className="tabular w-10 text-center">{qty}</span>
                <button type="button" onClick={() => setQtyLocal(qty + 1)} className="size-11" aria-label="More">
                  +
                </button>
              </div>
              <button type="button" onClick={() => add({ slug: p.slug, colorway: p.colorways[cw].id, qty })} className="flex-1 rounded-full bg-ink px-5 py-3 text-[15px] font-medium text-bg hover:opacity-90">
                {t.addWithQty(qty)}
              </button>
            </div>
            <Link href={`/furniture/${p.slug}`} onClick={() => setQuick(null)} className="mt-4 text-[14px] underline underline-offset-4">
              {t.viewDetails}
            </Link>
          </div>
        </div>
      )}
    </Modal>
  );
}
