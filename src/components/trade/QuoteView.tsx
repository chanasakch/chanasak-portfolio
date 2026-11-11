"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Photo } from "@/components/shared/Photo";
import { getProduct } from "@/data/products";
import { useTrade } from "./TradeProvider";

type Errors = Partial<Record<"name" | "company" | "email" | "country", string>>;

const field =
  "w-full rounded-[4px] border bg-white px-3.5 py-2.5 text-[15px] outline-none transition-colors focus:border-ink";

export function QuoteView() {
  const { t, lang, items, setQty, remove, clear, count } = useTrade();
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<{ ref: string; email: string } | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Errors = {};
    for (const key of ["name", "company", "email", "country"] as const) {
      if (!String(data.get(key) || "").trim()) next[key] = t.required;
    }
    const email = String(data.get("email") || "");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) next.email = t.invalidEmail;
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      document.getElementById(`q-${first}`)?.focus();
      return;
    }
    const ref = `LT-26-${String(Math.floor(1000 + Math.random() * 9000))}`;
    setSent({ ref, email });
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (sent) {
    return (
      <main className="mx-auto max-w-[720px] px-4 py-16 sm:px-8">
        <div role="status" className="rounded-[4px] border border-line bg-white p-8">
          <p className="text-[13px] font-medium text-[var(--ok)]">✓ {sent.ref}</p>
          <h1 className="mt-2 text-[2rem] font-[650] tracking-[-0.02em]">{t.sentTitle}</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-muted">{t.sentBody(sent.ref, sent.email)}</p>
          <Link href="/furniture" className="mt-6 inline-block rounded-[4px] bg-ink px-4 py-2.5 text-[14px] text-bg">
            {t.backToCatalogue}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 pb-24 pt-10 sm:px-8">
      <h1 className="text-[clamp(1.9rem,3.4vw,2.75rem)] font-[650] tracking-[-0.02em]">{t.quoteTitle}</h1>

      {items.length === 0 ? (
        <div className="mt-8 max-w-[560px] rounded-[4px] border border-dashed border-line p-10">
          <p className="text-[16px]">{t.quoteEmpty}</p>
          <Link href="/furniture" className="mt-5 inline-block rounded-[4px] bg-ink px-4 py-2.5 text-[14px] text-bg">
            {t.browse}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <section aria-label={t.quoteTitle}>
            <ul className="divide-y divide-line border-y border-line">
              {items.map((item) => {
                const product = getProduct(item.slug);
                if (!product) return null;
                const cw = product.colorways.find((c) => c.id === item.colorway) ?? product.colorways[0];
                return (
                  <li key={`${item.slug}-${item.colorway}`} className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 py-4 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:items-center">
                    <Link href={`/furniture/${product.slug}`}>
                      <Photo photo={product.photos[0]} className="aspect-square w-full rounded-[4px]" sizes="112px" />
                    </Link>
                    <div>
                      <Link href={`/furniture/${product.slug}`} className="text-[16px] font-[600] hover:underline">
                        {lang === "th" ? product.nameTh : product.name}
                      </Link>
                      <p className="mt-1 flex items-center gap-2 text-[13px] text-muted">
                        <span className="size-3 rounded-full ring-1 ring-black/10" style={{ background: `linear-gradient(135deg, ${cw.frame} 50%, ${cw.weaveA} 50%)` }} />
                        {cw.name[lang]}
                      </p>
                      <p className="mt-1 text-[13px] text-muted">
                        {t.lead}: {t.weeks(product.leadWeeks)}
                      </p>
                    </div>
                    <div className="col-start-2 flex items-center gap-4 sm:col-start-auto">
                      <div className="flex items-center rounded-[4px] border border-line bg-white">
                        <button type="button" onClick={() => setQty(item.slug, item.colorway, item.qty - 1)} className="px-3 py-1.5" aria-label="Decrease quantity">
                          −
                        </button>
                        <span className="tabular w-10 text-center text-[14px]" aria-live="polite">
                          {item.qty}
                        </span>
                        <button type="button" onClick={() => setQty(item.slug, item.colorway, item.qty + 1)} className="px-3 py-1.5" aria-label="Increase quantity">
                          +
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(item.slug, item.colorway)} className="text-[13px] text-muted underline underline-offset-4 hover:text-ink">
                        {t.remove}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="tabular mt-3 text-[14px] text-muted">{t.totalUnits(count)}</p>
          </section>

          <section aria-labelledby="project-heading" className="rounded-[4px] border border-line bg-white p-6 lg:self-start">
            <h2 id="project-heading" className="text-[18px] font-[650]">
              {t.project}
            </h2>
            <form onSubmit={onSubmit} noValidate className="mt-5 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["name", t.name, "text", "name"],
                  ["company", t.company, "text", "organization"],
                  ["email", t.email, "email", "email"],
                  ["country", t.country, "text", "country-name"],
                ] as const
              ).map(([key, label, type, auto]) => (
                <div key={key} className="grid gap-1.5">
                  <label htmlFor={`q-${key}`} className="text-[13px] text-muted">
                    {label}
                  </label>
                  <input
                    id={`q-${key}`}
                    name={key}
                    type={type}
                    autoComplete={auto}
                    aria-invalid={!!errors[key]}
                    aria-describedby={errors[key] ? `q-${key}-err` : undefined}
                    className={`${field} ${errors[key] ? "border-accent" : "border-line"}`}
                  />
                  {errors[key] && (
                    <p id={`q-${key}-err`} className="text-[13px] text-accent">
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}
              <div className="grid gap-1.5">
                <label htmlFor="q-type" className="text-[13px] text-muted">
                  {t.projectType}
                </label>
                <select id="q-type" name="type" className={`${field} border-line`} defaultValue="hotel">
                  <option value="hotel">{t.hotel}</option>
                  <option value="residence">{t.residence}</option>
                  <option value="restaurant">{t.restaurant}</option>
                  <option value="retail">{t.retail}</option>
                  <option value="other">{t.other}</option>
                </select>
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="q-date" className="text-[13px] text-muted">
                  {t.timeline}
                </label>
                <input id="q-date" name="date" type="month" className={`${field} border-line`} />
              </div>
              <div className="grid gap-1.5 sm:col-span-2">
                <label htmlFor="q-notes" className="text-[13px] text-muted">
                  {t.notes}
                </label>
                <textarea id="q-notes" name="notes" rows={4} placeholder={t.notesHint} className={`${field} border-line placeholder:text-muted/70`} />
              </div>
              <button type="submit" className="rounded-[4px] bg-accent px-5 py-3 text-[15px] font-medium text-accent-ink transition-opacity hover:opacity-90 sm:col-span-2">
                {t.send}
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
