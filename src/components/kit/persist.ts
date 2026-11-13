"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function read<T>(key: string, init: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : init;
  } catch {
    return init;
  }
}

/**
 * State that survives a reload on this device. The first render always uses
 * `init` so the server and client markup agree; the saved value loads right
 * after mount and `ready` turns true.
 */
export function usePersist<T>(key: string, init: T) {
  const [value, setValue] = useState<T>(init);
  const [ready, setReady] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading saved state after hydration
    setValue(read(key, init));
    setReady(true);
    // init is a fresh literal each render; the key alone decides what to load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* private mode or full storage: keep working in memory */
    }
  }, [key, value, ready]);

  const set = useCallback((v: T | ((prev: T) => T)) => setValue(v), []);
  return [value, set, ready] as const;
}

export const baht = (n: number) => "฿" + Math.round(n).toLocaleString("en-US");

/** Short readable reference such as ORA-4K7Q2M */
export function makeRef(prefix: string) {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += a[Math.floor(Math.random() * a.length)];
  return `${prefix}-${s}`;
}

export async function hash(text: string) {
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    return text.split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7).toString(16);
  }
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v: string) => /^0\d{8,9}$/.test(v.replace(/[\s-]/g, ""));
export const isPostcode = (v: string) => /^\d{5}$/.test(v.trim());

export function luhn(num: string) {
  const d = num.replace(/\D/g, "");
  if (d.length < 13 || d.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = +d[d.length - 1 - i];
    if (i % 2) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

/** MM/YY that has not passed yet */
export function validExpiry(v: string, at?: Date) {
  const m = v.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m) return false;
  const now = at ?? new Date();
  const mm = +m[1];
  const yy = 2000 + +m[2];
  if (mm < 1 || mm > 12) return false;
  return yy > now.getFullYear() || (yy === now.getFullYear() && mm >= now.getMonth() + 1);
}

export const fmtCard = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

export const fmtExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export const day = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
export const longDay = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  x.setHours(0, 0, 0, 0);
  return x;
}

/**
 * Today's date, available only after mount. Pages are prerendered at build
 * time, so anything that depends on the clock waits for the browser.
 */
export function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the clock is read in the browser only
  useEffect(() => setNow(new Date()), []);
  return now;
}
