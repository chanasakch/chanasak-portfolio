"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTrade } from "./TradeProvider";

export function TradeHeader() {
  const { t, lang, setLang, query, setQuery, count } = useTrade();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-8">
        <Link href="/trade" className="flex items-baseline gap-2" aria-label="Loom and Tide trade catalogue">
          <span className="text-[19px] font-[650] tracking-[-0.02em]">Loom &amp; Tide</span>
          <span className="rounded-[3px] bg-ink px-1.5 py-0.5 text-[11px] font-medium text-bg">{t.brandTag}</span>
        </Link>

        <form
          role="search"
          className="order-3 w-full sm:order-none sm:w-auto sm:flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            if (pathname !== "/trade") router.push("/trade");
          }}
        >
          <label className="sr-only" htmlFor="trade-search">
            {t.search}
          </label>
          <input
            id="trade-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (pathname !== "/trade") router.push("/trade");
            }}
            placeholder={t.search}
            className="w-full max-w-[520px] rounded-[6px] border border-line bg-white px-3.5 py-2 text-[14px] outline-none placeholder:text-muted focus:border-ink"
          />
        </form>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex rounded-[6px] border border-line p-0.5 text-[13px]" role="group" aria-label="Language">
            {(["en", "th"] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
                className={`rounded-[4px] px-2.5 py-1 transition-colors ${lang === l ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}
              >
                {l === "en" ? "EN" : "ไทย"}
              </button>
            ))}
          </div>
          <Link
            href="/trade/quote"
            className="flex items-center gap-2 rounded-[6px] bg-accent px-3.5 py-2 text-[14px] font-medium text-accent-ink transition-opacity hover:opacity-90"
          >
            {t.quoteList}
            <span className="tabular min-w-5 rounded-full bg-white/25 px-1.5 text-center text-[12px]" aria-label={`${count} units`}>
              {count}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
