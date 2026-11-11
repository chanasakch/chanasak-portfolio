"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dict, type Dict, type Lang } from "./dict";
import type { Category } from "@/data/products";

export type QuoteItem = { slug: string; colorway: string; qty: number };

type TradeState = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
  query: string;
  setQuery: (q: string) => void;
  cats: Category[];
  setCats: (c: Category[]) => void;
  items: QuoteItem[];
  add: (item: QuoteItem) => void;
  setQty: (slug: string, colorway: string, qty: number) => void;
  remove: (slug: string, colorway: string) => void;
  clear: () => void;
  count: number;
  drawer: boolean;
  setDrawer: (v: boolean) => void;
  quick: string | null;
  setQuick: (slug: string | null) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
};

const Ctx = createContext<TradeState | null>(null);

const STORAGE_KEY = "loomtide.quote.v1";
const LANG_KEY = "loomtide.lang";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private windows; the list still works for this visit.
  }
}

export function TradeProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [quick, setQuick] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    // Restore after hydration so server and client render the same first frame.
    const savedItems = read<QuoteItem[]>(STORAGE_KEY, []);
    const savedLang = read<Lang>(LANG_KEY, "en");
    queueMicrotask(() => {
      setItems(savedItems);
      setLangState(savedLang);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) write(STORAGE_KEY, items);
  }, [items, loaded]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    write(LANG_KEY, l);
  }, []);

  const add = useCallback((item: QuoteItem) => {
    setItems((prev) => {
      const found = prev.find((i) => i.slug === item.slug && i.colorway === item.colorway);
      if (found) {
        return prev.map((i) => (i === found ? { ...i, qty: i.qty + item.qty } : i));
      }
      return [...prev, item];
    });
    setQuick(null);
    setDrawer(true);
  }, []);

  const setQty = useCallback((slug: string, colorway: string, qty: number) => {
    setItems((prev) => prev.map((i) => (i.slug === slug && i.colorway === colorway ? { ...i, qty: Math.max(1, qty) } : i)));
  }, []);

  const remove = useCallback((slug: string, colorway: string) => {
    setItems((prev) => prev.filter((i) => !(i.slug === slug && i.colorway === colorway)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<TradeState>(
    () => ({
      lang,
      setLang,
      t: dict[lang] as unknown as Dict,
      query,
      setQuery,
      cats,
      setCats,
      items,
      add,
      setQty,
      remove,
      clear,
      count: items.reduce((n, i) => n + i.qty, 0),
      drawer,
      setDrawer,
      quick,
      setQuick,
      searchOpen,
      setSearchOpen,
    }),
    [lang, setLang, query, cats, items, add, setQty, remove, clear, drawer, quick, searchOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTrade() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTrade must be used inside TradeProvider");
  return ctx;
}
