"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { OrderDetail, PromptPay } from "./Checkout";
import { baht, isEmail, longDay, useNow } from "./persist";
import { btn, type Item } from "./panels";
import { useStore, type Order } from "./store";
import { Field, Heart, Img } from "./ui";

/**
 * Account page: orders (with cancel and buy again), wishlist, and order
 * lookup for guests who checked out without an account.
 */
export function AccountPage({ items, shop, tab: initial = "orders", wishCta }: { items: Item[]; shop: string; tab?: "orders" | "wishlist"; wishCta?: (i: Item) => ReactNode }) {
  const s = useStore();
  const [tab, setTab] = useState(initial);
  const mine = s.user ? s.orders.filter((o) => o.email === s.user!.email) : [];
  const saved = s.wish.map((id) => items.find((i) => i.id === id)).filter(Boolean) as Item[];

  return (
    <div className="mx-auto grid max-w-[1080px] gap-8 px-5 pb-24 pt-[var(--page-top,7rem)] sm:px-8 lg:pt-[var(--page-top-lg,9rem)]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-2">
          <h1 className="font-display text-[34px] leading-tight sm:text-[44px]">{s.user ? `Hello, ${s.user.name.split(" ")[0]}` : "Your account"}</h1>
          <p className="text-muted">{s.user ? s.user.email : "Log in to see your orders, or look one up below."}</p>
        </div>
        {s.user ? (
          <button className="text-[14px] text-muted underline underline-offset-4 hover:text-ink" onClick={s.logOut}>
            Log out
          </button>
        ) : (
          <div className="flex gap-2">
            <button className={`${btn.primary} w-auto`} onClick={() => s.setPanel("login")}>
              Log in
            </button>
            <button className={`${btn.ghost} w-auto`} onClick={() => s.setPanel("signup")}>
              Create account
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-6 border-b border-line text-[15px]" role="tablist">
        {(["orders", "wishlist"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`-mb-px border-b-2 pb-3 capitalize ${tab === t ? "border-ink" : "border-transparent text-muted"}`}>
            {t === "orders" ? `Orders${mine.length ? ` (${mine.length})` : ""}` : `Wishlist${saved.length ? ` (${saved.length})` : ""}`}
          </button>
        ))}
      </div>

      {tab === "orders" ? (
        s.user ? (
          mine.length ? (
            <ul className="grid gap-4">
              {mine.map((o) => (
                <OrderRow key={o.no} o={o} />
              ))}
            </ul>
          ) : (
            <Empty text="No orders yet." href={shop} cta="Start shopping" />
          )
        ) : (
          <Lookup />
        )
      ) : saved.length ? (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {saved.map((i) => (
            <li key={i.id} className="grid content-start gap-3">
              <div className="relative">
                <Link href={i.href}>
                  <Img src={i.img} alt={i.name} ratio={4 / 5} sizes="(min-width:1024px) 25vw, 50vw" widths={[800]} className="rounded-[var(--r-sm,10px)]" />
                </Link>
                <button onClick={() => s.toggleWish(i.id)} aria-label={`Remove ${i.name} from wishlist`} className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-bg/85 backdrop-blur">
                  <Heart on />
                </button>
              </div>
              <Link href={i.href} className="grid gap-0.5">
                <span className="text-[15px]">{i.name}</span>
                <span className="text-[14px] text-muted">{i.note ? `${i.note}, ` : ""}{baht(i.price)}</span>
              </Link>
              {wishCta?.(i)}
            </li>
          ))}
        </ul>
      ) : (
        <Empty text="Tap the heart on anything you like and it waits for you here." href={shop} cta="Browse" />
      )}
    </div>
  );
}

function Empty({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <div className="grid justify-items-start gap-4 py-8">
      <p className="text-muted">{text}</p>
      <Link href={href} className={`${btn.ghost} w-auto`}>
        {cta}
      </Link>
    </div>
  );
}

function Lookup() {
  const s = useStore();
  const [f, setF] = useState({ no: "", email: "" });
  const [res, setRes] = useState<Order | null | "none">(null);
  return (
    <div className="grid gap-6">
      <form
        noValidate
        className="grid max-w-xl gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          const o = s.orders.find((x) => x.no.toUpperCase() === f.no.trim().toUpperCase() && x.email === f.email.trim().toLowerCase());
          setRes(o ?? "none");
        }}
      >
        <Field label="Order number" value={f.no} onValue={(v) => setF({ ...f, no: v })} placeholder="e.g. ORA-4K7Q2M" />
        <Field label="Email used" type="email" value={f.email} onValue={(v) => setF({ ...f, email: v })} error={!!f.email && !isEmail(f.email) && "Check the email"} />
        <button className={`${btn.primary} sm:w-auto`}>Find order</button>
      </form>
      {res === "none" && <p className="text-[15px]">We could not find that order. Check the number in your receipt email.</p>}
      {res && res !== "none" && (
        <ul>
          <OrderRow o={res} open />
        </ul>
      )}
    </div>
  );
}

function OrderRow({ o, open: start }: { o: Order; open?: boolean }) {
  const s = useStore();
  const [open, setOpen] = useState(!!start);
  const [confirm, setConfirm] = useState(false);
  const live = s.orders.find((x) => x.no === o.no) ?? o;
  const due = live.delivery.date ? new Date(live.delivery.date) : null;
  const now = useNow();
  const cancellable = !!now && live.status === "confirmed" && (!due || due.getTime() - now.getTime() > 24 * 3600e3);
  const status = live.status === "cancelled" ? "Cancelled" : live.payment === "promptpay" && !live.paid ? "Waiting for payment" : due ? `Due ${longDay(due)}` : "Confirmed";
  return (
    <li className="overflow-hidden rounded-[var(--r-lg,20px)] border border-line">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="grid w-full grid-cols-[1fr_auto] items-center gap-4 p-5 text-left sm:grid-cols-[1fr_auto_auto]">
        <span className="grid gap-1">
          <span className="text-[15px]">{live.no}</span>
          <span className="text-[13px] text-muted">
            {new Date(live.at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, {live.items.reduce((n, i) => n + i.qty, 0)} item(s)
          </span>
        </span>
        <span className={`hidden rounded-full px-3 py-1 text-[12.5px] sm:block ${live.status === "cancelled" ? "bg-soft text-muted" : "bg-ink text-bg"}`}>{status}</span>
        <span className="text-[15px] tabular-nums">{baht(live.total)}</span>
      </button>
      {open && (
        <div className="grid gap-4 border-t border-line p-5">
          <p className="text-[14px] sm:hidden">{status}</p>
          {live.payment === "promptpay" && !live.paid && live.status !== "cancelled" && <PromptPay o={live} />}
          <OrderDetail o={live} />
          <div className="flex flex-wrap gap-3">
            <button
              className={`${btn.ghost} w-auto`}
              onClick={() => {
                live.items.forEach((i) => s.add({ id: i.id, opt: i.opt ? findOpt(s, i.id, i.opt) : undefined, qty: i.qty }, true));
                s.setPanel("cart");
              }}
            >
              Buy again
            </button>
            {cancellable &&
              (confirm ? (
                <span className="flex flex-wrap items-center gap-3 text-[14px]">
                  Cancel this order?
                  <button
                    className="rounded-full bg-[var(--bad,#c4412b)] px-4 py-2 text-white"
                    onClick={() => {
                      s.patchOrder(live.no, { status: "cancelled" });
                      s.toast(live.paid ? "Order cancelled. Your refund is on its way." : "Order cancelled");
                      setConfirm(false);
                    }}
                  >
                    Yes, cancel
                  </button>
                  <button className="underline underline-offset-4" onClick={() => setConfirm(false)}>
                    Keep it
                  </button>
                </span>
              ) : (
                <button className="text-[14px] text-muted underline underline-offset-4 hover:text-ink" onClick={() => setConfirm(true)}>
                  Cancel order
                </button>
              ))}
          </div>
        </div>
      )}
    </li>
  );
}

/** Orders keep the option label; turn it back into the option key the catalogue uses. */
function findOpt(s: ReturnType<typeof useStore>, id: string, label: string) {
  const probe = (opt: string) => s.catalog.optLabel?.({ id, opt, qty: 1 }) === label;
  for (const k of s.catalog.opts?.(id) ?? []) if (probe(k)) return k;
  return undefined;
}
