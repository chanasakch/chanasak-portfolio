"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useScrolled } from "@/components/shared/ui";
import { useTrade } from "./TradeProvider";

/** Scrolls to a section of the catalogue home, going there first if needed. */
export function useJump() {
  const pathname = usePathname();
  const router = useRouter();
  return (id: string) => {
    const go = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (pathname === "/furniture") go();
    else {
      router.push("/furniture");
      setTimeout(go, 120);
    }
  };
}

export function TradeHeader() {
  const { t, lang, setLang, count, setDrawer, setSearchOpen } = useTrade();
  const pathname = usePathname();
  const jump = useJump();
  const scrolled = useScrolled(60);
  const overHero = pathname === "/furniture" && !scrolled;

  const nav: [string, string][] = [
    [t.navNew, "new"],
    [t.navRooms, "rooms"],
    [t.navCollection, "catalogue"],
  ];

  return (
    <>
      <header
        className={`no-print fixed inset-x-0 top-0 z-40 transition-[background-color,color,border-color] duration-500 ${
          overHero ? "border-b border-transparent text-white" : "border-b border-line bg-bg/90 text-ink backdrop-blur-md"
        }`}
      >
        <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-8">
          <nav aria-label="Catalogue" className="hidden gap-7 text-[14px] md:flex">
            {nav.map(([label, id]) => (
              <button key={id} type="button" onClick={() => jump(id)} className="relative py-1 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100">
                {label}
              </button>
            ))}
          </nav>
          <button type="button" onClick={() => setSearchOpen(true)} className="flex items-center gap-2 text-[14px] md:hidden" aria-label={t.search}>
            <SearchIcon />
          </button>

          <Link href="/furniture" className="text-center text-[21px] font-[650] tracking-[-0.03em]" aria-label="Loom and Tide, home">
            Loom &amp; Tide
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-3">
            <button type="button" onClick={() => setSearchOpen(true)} className="hidden items-center gap-2 rounded-full px-3 py-2 text-[14px] md:flex" aria-label={t.search}>
              <SearchIcon />
              <span className="hidden lg:inline">{lang === "th" ? "ค้นหา" : "Search"}</span>
            </button>
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "th" : "en")}
              className="rounded-full px-2.5 py-2 text-[13px]"
              aria-label={lang === "en" ? "เปลี่ยนเป็นภาษาไทย" : "Switch to English"}
            >
              {lang === "en" ? "ไทย" : "EN"}
            </button>
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[14px] transition-colors ${
                overHero ? "border-white/50 hover:bg-white hover:text-ink" : "border-ink/20 hover:border-ink"
              }`}
            >
              <span className="hidden sm:inline">{t.quoteList}</span>
              <span className="sm:hidden">{lang === "th" ? "รายการ" : "Quote"}</span>
              <span className="tabular" aria-label={`${count} units`}>
                ({count})
              </span>
            </button>
          </div>
        </div>
      </header>
      {pathname !== "/furniture" && <div className="h-16" aria-hidden />}
    </>
  );
}

export function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" aria-hidden>
      <circle cx="7.5" cy="7.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11.5 11.5L16 16" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
