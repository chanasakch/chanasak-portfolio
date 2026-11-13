"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { baht, isEmail } from "./persist";
import { useStore } from "./store";
import { Field, Icon, Img, Qty, Sheet } from "./ui";

export type Item = { id: string; name: string; cat: string; price: number; img: string; href: string; note?: string };

const primary =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--r-btn,999px)] bg-ink px-6 text-[15px] text-bg transition-opacity hover:opacity-90 disabled:opacity-40";
export const btn = { primary, ghost: primary.replace("bg-ink", "border border-line").replace("text-bg", "text-ink") };

/** Bag drawer: change quantities, remove lines, see the free delivery threshold, go to checkout. */
export function CartSheet({ checkout, shop, freeOver, note }: { checkout: string; shop: string; freeOver?: number; note?: string }) {
  const s = useStore();
  const router = useRouter();
  const close = () => s.setPanel(null);
  const left = freeOver ? Math.max(0, freeOver - s.subtotal) : 0;
  return (
    <Sheet
      open={s.panel === "cart"}
      onClose={close}
      title={`Your bag${s.count ? ` (${s.count})` : ""}`}
      footer={
        s.lines.length > 0 && (
          <div className="grid gap-3">
            <div className="flex justify-between text-[15px]">
              <span>Subtotal</span>
              <span className="tabular-nums">{baht(s.subtotal)}</span>
            </div>
            <p className="text-[13px] text-muted">{note ?? "Delivery is worked out at checkout."}</p>
            <button
              className={btn.primary}
              onClick={() => {
                close();
                router.push(checkout);
              }}
            >
              Check out
            </button>
          </div>
        )
      }
    >
      {s.lines.length === 0 ? (
        <div className="grid gap-4 py-10 text-center">
          <p className="text-muted">Your bag is empty.</p>
          <Link href={shop} onClick={close} className={btn.ghost}>
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {freeOver ? (
            <div className="grid gap-2">
              <p className="text-[13px]">{left > 0 ? `Add ${baht(left)} more for free delivery.` : "Your order ships free."}</p>
              <div className="h-[3px] overflow-hidden rounded-full bg-soft">
                <div className="h-full origin-left bg-ink transition-transform duration-500" style={{ transform: `scaleX(${Math.min(1, s.subtotal / freeOver)})` }} />
              </div>
            </div>
          ) : null}
          <ul className="grid gap-5">
            {s.lines.map((l, i) => (
              <li key={`${l.id}-${l.opt}`} className="grid grid-cols-[84px_1fr] gap-4">
                <Img src={s.catalog.img(l)} alt="" ratio={1} sizes="84px" widths={[800]} className="rounded-[var(--r-sm,10px)]" />
                <div className="grid min-w-0 content-start gap-1">
                  <div className="flex justify-between gap-3">
                    <p className="truncate text-[15px]">{s.catalog.name(l)}</p>
                    <p className="shrink-0 text-[15px] tabular-nums">{baht(s.catalog.price(l) * l.qty)}</p>
                  </div>
                  {s.catalog.optLabel?.(l) && <p className="text-[13px] text-muted">{s.catalog.optLabel(l)}</p>}
                  <div className="mt-2 flex items-center justify-between">
                    <Qty value={l.qty} onChange={(n) => s.setQty(i, n)} max={s.catalog.max?.(l) ?? 20} />
                    <button className="text-[13px] text-muted underline underline-offset-4 hover:text-ink" onClick={() => s.remove(i)}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Sheet>
  );
}

/** Log in and create account, switching in place. */
export function AuthSheet({ note }: { note?: string }) {
  const s = useStore();
  const mode = s.panel === "signup" ? "signup" : "login";
  const [f, setF] = useState({ name: "", email: "", pass: "" });
  const [tried, setTried] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const open = s.panel === "login" || s.panel === "signup";
  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fresh form each time the sheet opens
    setTried(false);
    setErr(null);
  }, [open, mode]);
  const e = {
    name: mode === "signup" && f.name.trim().length < 2 && "Enter your name",
    email: !isEmail(f.email) && "Enter a valid email address",
    pass: (mode === "signup" ? f.pass.length < 8 : f.pass.length < 1) && (mode === "signup" ? "Use at least 8 characters" : "Enter your password"),
  };
  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    setTried(true);
    if (e.name || e.email || e.pass) return;
    setBusy(true);
    const r = mode === "signup" ? await s.signUp(f.name, f.email, f.pass) : await s.logIn(f.email, f.pass);
    setBusy(false);
    if (r) setErr(r);
    else {
      setF({ name: "", email: "", pass: "" });
      s.setPanel(null);
    }
  };
  return (
    <Sheet open={open} onClose={() => s.setPanel(null)} title={mode === "signup" ? "Create an account" : "Log in"} side="center">
      <form onSubmit={submit} className="grid gap-4" noValidate>
        {mode === "signup" && <Field label="Full name" autoComplete="name" value={f.name} onValue={(v) => setF({ ...f, name: v })} error={tried && e.name} />}
        <Field label="Email" type="email" autoComplete="email" value={f.email} onValue={(v) => setF({ ...f, email: v })} error={tried && e.email} />
        <Field
          label="Password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          value={f.pass}
          onValue={(v) => setF({ ...f, pass: v })}
          error={tried && e.pass}
        />
        {err && (
          <p role="alert" className="rounded-[var(--r-sm,10px)] bg-soft px-3.5 py-3 text-[14px]">
            {err}
          </p>
        )}
        <button className={btn.primary} disabled={busy}>
          {busy ? "One moment" : mode === "signup" ? "Create account" : "Log in"}
        </button>
        <p className="text-center text-[14px] text-muted">
          {mode === "signup" ? "Already have an account? " : "New here? "}
          <button type="button" className="text-ink underline underline-offset-4" onClick={() => s.setPanel(mode === "signup" ? "login" : "signup")}>
            {mode === "signup" ? "Log in" : "Create an account"}
          </button>
        </p>
        <p className="text-center text-[12px] text-muted">{note ?? "Concept build: accounts are kept on this device only."}</p>
      </form>
    </Sheet>
  );
}

/** Live search over the catalogue. Enter opens the full results page. */
export function SearchSheet({ items, resultsHref, placeholder = "Search" }: { items: Item[]; resultsHref?: (q: string) => string; placeholder?: string }) {
  const s = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const open = s.panel === "search";
  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 80);
  }, [open]);
  const found = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items.slice(0, 4);
    return items.filter((i) => `${i.name} ${i.cat} ${i.note ?? ""}`.toLowerCase().includes(t));
  }, [q, items]);
  const close = () => s.setPanel(null);
  return (
    <Sheet open={open} onClose={close} title="Search">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (resultsHref && q.trim()) {
            close();
            router.push(resultsHref(q.trim()));
          } else if (found[0]) {
            close();
            router.push(found[0].href);
          }
        }}
        className="relative"
      >
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">{Icon.search}</span>
        <input
          ref={input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-12 w-full rounded-full border border-line bg-transparent pl-11 pr-4 text-[15px] outline-none focus:border-ink"
        />
      </form>
      <p className="mb-3 mt-6 text-[13px] text-muted">{q.trim() ? `${found.length} result${found.length === 1 ? "" : "s"}` : "Popular"}</p>
      {found.length === 0 ? (
        <p className="py-6 text-[15px]">Nothing matches &ldquo;{q}&rdquo;. Try a category such as {[...new Set(items.map((i) => i.cat))].slice(0, 3).join(", ")}.</p>
      ) : (
        <ul className="grid gap-3">
          {found.map((i) => (
            <li key={i.id}>
              <Link href={i.href} onClick={close} className="grid grid-cols-[64px_1fr_auto] items-center gap-4 rounded-[var(--r-sm,10px)] p-1.5 hover:bg-soft">
                <Img src={i.img} alt="" ratio={1} sizes="64px" widths={[800]} className="rounded-[var(--r-sm,10px)]" />
                <span className="min-w-0">
                  <span className="block truncate text-[15px]">{i.name}</span>
                  <span className="block text-[13px] text-muted">{i.cat}</span>
                </span>
                <span className="text-[14px] tabular-nums">{baht(i.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}

/** Newsletter sign-up with validation and a confirmation state. */
export function Newsletter({ cta = "Subscribe", className = "", inputClass = "", buttonClass = "" }: { cta?: string; className?: string; inputClass?: string; buttonClass?: string }) {
  const [v, setV] = useState("");
  const [state, setState] = useState<"idle" | "bad" | "done">("idle");
  if (state === "done")
    return (
      <p className={`text-[15px] ${className}`} role="status">
        Thanks. Look out for the next letter at {v}.
      </p>
    );
  return (
    <form
      noValidate
      className={`grid gap-2 ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        setState(isEmail(v) ? "done" : "bad");
      }}
    >
      <div className="flex gap-2">
        <input
          value={v}
          onChange={(e) => {
            setV(e.target.value);
            if (state === "bad") setState("idle");
          }}
          type="email"
          placeholder="Your email"
          aria-label="Email for newsletter"
          aria-invalid={state === "bad"}
          className={`h-11 min-w-0 flex-1 rounded-full border border-current/25 bg-transparent px-4 text-[14px] outline-none focus:border-current ${inputClass}`}
        />
        <button className={`h-11 shrink-0 rounded-full px-5 text-[14px] ${buttonClass || "bg-ink text-bg"}`}>{cta}</button>
      </div>
      {state === "bad" && <p className="text-[13px] text-[var(--bad,#c4412b)]">Enter a valid email address.</p>}
    </form>
  );
}
