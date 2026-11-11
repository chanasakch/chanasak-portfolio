"use client";

import { useMemo, useState } from "react";
import { categoryLabels, materialLabels, products, type Category, type Material } from "@/data/products";
import { useTrade } from "./TradeProvider";
import { ProductCard } from "./ProductCard";

type Sort = "new" | "lead" | "name";
type Lead = "any" | "6" | "8";

const categories = Object.keys(categoryLabels) as Category[];
const materials = Object.keys(materialLabels) as Material[];

export function Catalogue() {
  const { t, lang, query } = useTrade();
  const [cats, setCats] = useState<Category[]>([]);
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

  return (
    <div className="mx-auto grid max-w-[1440px] gap-8 px-4 pb-24 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)]">
      <button
        type="button"
        onClick={() => setShowFilters((v) => !v)}
        aria-expanded={showFilters}
        aria-controls="trade-filters"
        className="rounded-[6px] border border-line px-3 py-2 text-left text-[14px] lg:hidden"
      >
        {showFilters ? t.hideFilters : t.showFilters}
        {active > 0 && <span className="ml-2 text-muted">({active})</span>}
      </button>

      <aside id="trade-filters" className={`${showFilters ? "block" : "hidden"} lg:block`} aria-label={t.filters}>
        <div className="space-y-7 lg:sticky lg:top-24">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[15px] font-[600]">{t.filters}</h2>
            {active > 0 && (
              <button type="button" onClick={clearAll} className="text-[13px] text-muted underline underline-offset-4">
                {t.clear}
              </button>
            )}
          </div>

          <fieldset>
            <legend className="mb-2.5 text-[13px] text-muted">{t.category}</legend>
            <div className="space-y-2">
              {categories.map((c) => (
                <label key={c} className="flex cursor-pointer items-center gap-2.5 text-[14px]">
                  <input type="checkbox" className={check} checked={cats.includes(c)} onChange={() => setCats(toggle(cats, c))} />
                  <span className="flex-1">{categoryLabels[c][lang]}</span>
                  <span className="tabular text-[12px] text-muted">{countFor(c)}</span>
                </label>
              ))}
            </div>
          </fieldset>

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
      </aside>

      <section aria-label={t.catalogue}>
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-3">
          <p className="tabular text-[14px] text-muted" aria-live="polite">
            {t.results(results.length)}
          </p>
          <label className="flex items-center gap-2 text-[14px]">
            <span className="text-muted">{t.sort}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-[6px] border border-line bg-white px-2 py-1.5 text-[14px]"
            >
              <option value="new">{t.sortNew}</option>
              <option value="lead">{t.sortLead}</option>
              <option value="name">{t.sortName}</option>
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <div className="rounded-[6px] border border-dashed border-line p-10 text-center">
            <p className="text-[15px]">{t.empty}</p>
            <button type="button" onClick={clearAll} className="mt-4 text-[14px] underline underline-offset-4">
              {t.clear}
            </button>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
