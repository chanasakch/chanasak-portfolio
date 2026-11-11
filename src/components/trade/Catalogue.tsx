"use client";

import { useMemo, useState } from "react";
import { categoryLabels, materialLabels, products, type Category, type Material } from "@/data/products";
import { motion } from "motion/react";
import { Drawer } from "@/components/shared/ui";
import { useTrade } from "./TradeProvider";
import { ProductCard } from "./ProductCard";

type Sort = "new" | "lead" | "name";
type Lead = "any" | "6" | "8";

const categories = Object.keys(categoryLabels) as Category[];
const materials = Object.keys(materialLabels) as Material[];

export function Catalogue() {
  const { t, lang, query, setQuery, cats, setCats } = useTrade();
  const [mats, setMats] = useState<Material[]>([]);
  const [outdoor, setOutdoor] = useState(false);
  const [contract, setContract] = useState(false);
  const [lead, setLead] = useState<Lead>("any");
  const [sort, setSort] = useState<Sort>("new");
  const [showFilters, setShowFilters] = useState(false);

  const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      if (cats.length && !cats.includes(p.category)) return false;
      if (mats.length && !mats.some((m) => p.materials.includes(m))) return false;
      if (outdoor && !p.outdoor) return false;
      if (contract && !p.contract) return false;
      if (lead !== "any" && p.leadWeeks > Number(lead)) return false;
      if (q) {
        const hay = `${p.name} ${p.nameTh} ${p.collection} ${p.designer}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    return [...list].sort((a, b) => {
      if (sort === "lead") return a.leadWeeks - b.leadWeeks;
      if (sort === "name") return a.name.localeCompare(b.name);
      return b.year - a.year;
    });
  }, [cats, mats, outdoor, contract, lead, sort, query]);

  const countFor = (cat: Category) => products.filter((p) => p.category === cat).length;
  const active = cats.length + mats.length + (outdoor ? 1 : 0) + (contract ? 1 : 0) + (lead !== "any" ? 1 : 0);

  const clearAll = () => {
    setCats([]);
    setMats([]);
    setOutdoor(false);
    setContract(false);
    setLead("any");
  };

  const check = "size-4 accent-[var(--ink)]";

  const pill = (on: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-[14px] transition-colors ${on ? "border-ink bg-ink text-bg" : "border-line hover:border-ink"}`;

  return (
    <div id="catalogue" className="mx-auto max-w-[1600px] scroll-mt-16 px-4 pb-28 pt-24 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-[600] leading-none tracking-[-0.035em]">{t.catalogue}</h2>
        <p className="max-w-[46ch] text-[15px] leading-relaxed text-muted">{t.introBody}</p>
      </div>

      <div className="sticky top-16 z-20 -mx-4 mt-10 flex items-center gap-3 border-b border-line bg-bg/90 px-4 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none]">
          <button type="button" onClick={() => setCats([])} className={pill(cats.length === 0)}>
            {t.any}
          </button>
          {categories.map((c) => (
            <button key={c} type="button" aria-pressed={cats.includes(c)} onClick={() => setCats(toggle(cats, c))} className={pill(cats.includes(c))}>
              {categoryLabels[c][lang]} <span className="tabular opacity-50">{countFor(c)}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setShowFilters(true)} className="flex shrink-0 items-center gap-2 rounded-full border border-line px-4 py-2 text-[14px] hover:border-ink">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
            <path d="M0 3h14M0 11h14" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="4" cy="3" r="2" fill="var(--bg)" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="10" cy="11" r="2" fill="var(--bg)" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          {t.filters}
          {active - cats.length > 0 && <span className="tabular">({active - cats.length})</span>}
        </button>
      </div>

      <Drawer
        open={showFilters}
        onClose={() => setShowFilters(false)}
        title={t.filters}
        width="max-w-[400px]"
        footer={
          <div className="flex items-center gap-3">
            <button type="button" onClick={clearAll} className="px-2 py-3 text-[14px] underline underline-offset-4">
              {t.clear}
            </button>
            <button type="button" onClick={() => setShowFilters(false)} className="flex-1 rounded-full bg-ink py-3 text-[15px] font-medium text-bg">
              {t.results(results.length)}
            </button>
          </div>
        }
      >
        <div className="space-y-8">
          <label className="grid gap-2 text-[14px]">
            <span className="text-[13px] text-muted">{t.sort}</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-[4px] border border-line bg-white px-3 py-2.5 text-[14px]">
              <option value="new">{t.sortNew}</option>
              <option value="lead">{t.sortLead}</option>
              <option value="name">{t.sortName}</option>
            </select>
          </label>
          <fieldset>
            <legend className="mb-2.5 text-[13px] text-muted">{t.material}</legend>
            <div className="space-y-2">
              {materials.map((m) => (
                <label key={m} className="flex cursor-pointer items-center gap-2.5 text-[14px]">
                  <input type="checkbox" className={check} checked={mats.includes(m)} onChange={() => setMats(toggle(mats, m))} />
                  {materialLabels[m][lang]}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2.5 text-[13px] text-muted">{t.use}</legend>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-2.5 text-[14px]">
                <input type="checkbox" className={check} checked={outdoor} onChange={() => setOutdoor(!outdoor)} />
                {t.outdoor}
              </label>
              <label className="flex cursor-pointer items-center gap-2.5 text-[14px]">
                <input type="checkbox" className={check} checked={contract} onChange={() => setContract(!contract)} />
                {t.contract}
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2.5 text-[13px] text-muted">{t.leadTime}</legend>
            <div className="space-y-2">
              {(
                [
                  ["any", t.any],
                  ["6", t.upTo6],
                  ["8", t.upTo8],
                ] as const
              ).map(([v, label]) => (
                <label key={v} className="flex cursor-pointer items-center gap-2.5 text-[14px]">
                  <input type="radio" name="lead" className={check} checked={lead === v} onChange={() => setLead(v)} />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </Drawer>

      <section aria-label={t.catalogue} className="pt-8">
        <p className="tabular mb-6 text-[14px] text-muted" aria-live="polite">
          {t.results(results.length)}
          {query.trim() && <><span className="ml-3">&ldquo;{query.trim()}&rdquo;</span> <button type="button" onClick={() => setQuery("")} className="underline underline-offset-4">{t.clear}</button></>}
        </p>
        {results.length === 0 ? (
          <div className="border border-dashed border-line p-10 text-center">
            <p className="text-[15px]">{t.empty}</p>
            <button type="button" onClick={clearAll} className="mt-4 text-[14px] underline underline-offset-4">
              {t.clear}
            </button>
          </div>
        ) : (
          <motion.div layout className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => (
              <motion.div key={p.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
