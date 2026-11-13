"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { hash, usePersist } from "./persist";
import { Toast } from "./ui";

export type Line = { id: string; opt?: string; qty: number };
export type User = { name: string; email: string };
type Account = User & { pass: string };

export type OrderItem = { id: string; opt?: string; qty: number; name: string; price: number; img: string };
export type Order = {
  no: string;
  at: number;
  email: string;
  name: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  extras: number;
  total: number;
  delivery: { method: string; label: string; date?: string; address?: string };
  payment: "card" | "promptpay" | "cod" | "transfer";
  paid: boolean;
  status: "confirmed" | "cancelled";
  card?: string;
  meta?: Record<string, string | number>;
};

export type Catalog = {
  /** unit price for a cart line */
  price: (l: Line) => number;
  name: (l: Line) => string;
  img: (l: Line) => string;
  optLabel?: (l: Line) => string | undefined;
  /** every option key a product offers, so a past order can be added again */
  opts?: (id: string) => string[];
  /** highest quantity one line may hold */
  max?: (l: Line) => number;
};

type Store = {
  brand: string;
  catalog: Catalog;
  ready: boolean;
  lines: Line[];
  count: number;
  subtotal: number;
  add: (l: Line, quiet?: boolean) => void;
  setQty: (i: number, n: number) => void;
  remove: (i: number) => void;
  clear: () => void;
  wish: string[];
  toggleWish: (id: string) => void;
  orders: Order[];
  saveOrder: (o: Order) => void;
  patchOrder: (no: string, p: Partial<Order>) => void;
  user: User | null;
  signUp: (name: string, email: string, pass: string) => Promise<string | null>;
  logIn: (email: string, pass: string) => Promise<string | null>;
  logOut: () => void;
  panel: null | "cart" | "search" | "login" | "signup" | "menu";
  setPanel: (p: Store["panel"]) => void;
  toast: (m: string) => void;
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ brand, catalog, children }: { brand: string; catalog: Catalog; children: ReactNode }) {
  const [lines, setLines, ready] = usePersist<Line[]>(`${brand}:cart`, []);
  const [wish, setWish] = usePersist<string[]>(`${brand}:wish`, []);
  const [orders, setOrders] = usePersist<Order[]>(`${brand}:orders`, []);
  const [accounts, setAccounts] = usePersist<Account[]>(`${brand}:accounts`, []);
  const [user, setUser] = usePersist<User | null>(`${brand}:user`, null);
  const [panel, setPanel] = useState<Store["panel"]>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const toast = useCallback((m: string) => setMsg(m), []);
  const done = useCallback(() => setMsg(null), []);

  const add = useCallback(
    (l: Line, quiet?: boolean) => {
      setLines((prev) => {
        const i = prev.findIndex((x) => x.id === l.id && x.opt === l.opt);
        const cap = catalog.max?.(l) ?? 20;
        if (i < 0) return [...prev, { ...l, qty: Math.min(cap, l.qty) }];
        return prev.map((x, j) => (j === i ? { ...x, qty: Math.min(cap, x.qty + l.qty) } : x));
      });
      if (!quiet) setPanel("cart");
    },
    [setLines, catalog],
  );
  const setQty = useCallback((i: number, n: number) => setLines((p) => p.map((x, j) => (j === i ? { ...x, qty: Math.max(1, Math.min(catalog.max?.(x) ?? 20, n)) } : x))), [setLines, catalog]);
  const remove = useCallback((i: number) => setLines((p) => p.filter((_, j) => j !== i)), [setLines]);
  const clear = useCallback(() => setLines([]), [setLines]);
  const toggleWish = useCallback(
    (id: string) => {
      const on = wish.includes(id);
      setMsg(on ? "Removed from your wishlist" : "Saved to your wishlist");
      setWish(on ? wish.filter((x) => x !== id) : [...wish, id]);
    },
    [wish, setWish],
  );
  const saveOrder = useCallback((o: Order) => setOrders((p) => [o, ...p]), [setOrders]);
  const patchOrder = useCallback((no: string, patch: Partial<Order>) => setOrders((p) => p.map((o) => (o.no === no ? { ...o, ...patch } : o))), [setOrders]);

  const signUp = useCallback(
    async (name: string, email: string, pass: string) => {
      const e = email.trim().toLowerCase();
      if (accounts.some((a) => a.email === e)) return "An account with this email already exists. Log in instead.";
      const a = { name: name.trim(), email: e, pass: await hash(pass) };
      setAccounts((p) => [...p, a]);
      setUser({ name: a.name, email: e });
      setMsg(`Welcome, ${a.name.split(" ")[0]}`);
      return null;
    },
    [accounts, setAccounts, setUser],
  );
  const logIn = useCallback(
    async (email: string, pass: string) => {
      const e = email.trim().toLowerCase();
      const a = accounts.find((x) => x.email === e);
      if (!a) return "No account uses this email yet. Create one below.";
      if (a.pass !== (await hash(pass))) return "That password is not right. Try again.";
      setUser({ name: a.name, email: a.email });
      setMsg(`Welcome back, ${a.name.split(" ")[0]}`);
      return null;
    },
    [accounts, setUser],
  );
  const logOut = useCallback(() => {
    setUser(null);
    setMsg("You are logged out");
  }, [setUser]);

  const value = useMemo<Store>(
    () => ({
      brand,
      catalog,
      ready,
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + catalog.price(l) * l.qty, 0),
      add,
      setQty,
      remove,
      clear,
      wish,
      toggleWish,
      orders,
      saveOrder,
      patchOrder,
      user,
      signUp,
      logIn,
      logOut,
      panel,
      setPanel,
      toast,
    }),
    [brand, catalog, ready, lines, add, setQty, remove, clear, wish, toggleWish, orders, saveOrder, patchOrder, user, signUp, logIn, logOut, panel, toast],
  );
  return (
    <Ctx.Provider value={value}>
      {children}
      <Toast message={msg} onDone={done} />
    </Ctx.Provider>
  );
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore outside StoreProvider");
  return v;
}
