"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { bySlug } from "@/data/loom";

export type Line = { slug: string; finish: string; size?: string; qty: number };

type Store = {
  lines: Line[];
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: Line) => void;
  setQty: (i: number, qty: number) => void;
  remove: (i: number) => void;
  clear: () => void;
};

const Ctx = createContext<Store | null>(null);

export function unitPrice(line: Line) {
  const p = bySlug(line.slug);
  if (!p) return 0;
  return p.price + (p.sizes?.find((s) => s.label === line.size)?.add ?? 0);
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);

  const add = useCallback((line: Line) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.slug === line.slug && l.finish === line.finish && l.size === line.size);
      if (i < 0) return [...prev, line];
      return prev.map((l, j) => (j === i ? { ...l, qty: l.qty + line.qty } : l));
    });
    setOpen(true);
  }, []);
  const setQty = useCallback((i: number, qty: number) => setLines((prev) => prev.map((l, j) => (j === i ? { ...l, qty: Math.max(1, Math.min(999, qty)) } : l))), []);
  const remove = useCallback((i: number) => setLines((prev) => prev.filter((_, j) => j !== i)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({ lines, count: lines.reduce((n, l) => n + l.qty, 0), open, setOpen, add, setQty, remove, clear }),
    [lines, open, add, setQty, remove, clear],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useQuote() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useQuote outside QuoteProvider");
  return v;
}
