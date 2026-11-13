"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { addDays, baht, day, useNow, fmtCard, fmtExpiry, isEmail, isPhone, isPostcode, longDay, luhn, makeRef, validExpiry } from "./persist";
import { btn } from "./panels";
import { useStore, type Order } from "./store";
import { Choice, Field, Icon, Img } from "./ui";

export type Delivery = {
  id: string;
  label: string;
  detail: string;
  price: number;
  address: boolean;
  /** offer a delivery day: first day offered (days from today), how many, weekdays closed (0 = Sunday) */
  dates?: { from: number; count: number; closed?: number[] };
};
export type Extra = { id: string; label: string; detail: string; price: number };
export type Pay = "card" | "promptpay" | "cod";

export type CheckoutConfig = {
  prefix: string;
  home: string;
  shop: string;
  account: string;
  delivery: (subtotal: number, now: Date) => Delivery[];
  payments: Pay[];
  extras?: (subtotal: number) => Extra[];
  codLimit?: number;
};

const payLabel: Record<Pay, [string, string]> = {
  card: ["Credit or debit card", "Visa, Mastercard, JCB"],
  promptpay: ["PromptPay", "Scan a QR code with any Thai banking app"],
  cod: ["Cash on delivery", "Pay the courier in cash or by QR"],
};

const empty = { email: "", phone: "", name: "", line1: "", district: "", province: "Bangkok", postcode: "", note: "", card: "", exp: "", cvc: "", holder: "" };

/**
 * Two-step checkout: contact and delivery, then payment. Every field is
 * checked before moving on, and the first problem is scrolled into view.
 */
export function Checkout(props: { cfg: CheckoutConfig; aside?: ReactNode }) {
  const now = useNow();
  return now ? <CheckoutForm {...props} now={now} /> : <div className="min-h-screen" />;
}

function CheckoutForm({ cfg, aside, now }: { cfg: CheckoutConfig; aside?: ReactNode; now: Date }) {
  const s = useStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [f, setF] = useState(empty);
  const [tried, setTried] = useState(false);
  const options = useMemo(() => cfg.delivery(s.subtotal, now), [cfg, s.subtotal, now]);
  const [method, setMethod] = useState<string>("");
  const opt = options.find((o) => o.id === method) ?? options[0];
  const dates = useMemo(() => {
    if (!opt?.dates) return [];
    const out: Date[] = [];
    for (let i = opt.dates.from; out.length < opt.dates.count && i < 60; i++) {
      const d = addDays(now, i);
      if (!opt.dates.closed?.includes(d.getDay())) out.push(d);
    }
    return out;
  }, [opt, now]);
  const [date, setDate] = useState(0);
  const extras = useMemo(() => cfg.extras?.(s.subtotal) ?? [], [cfg, s.subtotal]);
  const [picked, setPicked] = useState<string[]>([]);
  const payments = cfg.payments.filter((p) => p !== "cod" || !cfg.codLimit || s.subtotal <= cfg.codLimit);
  const [pay, setPay] = useState<Pay>(payments[0]);
  const [placed, setPlaced] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (s.user)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill once the saved account loads
      setF((p) => ({ ...p, email: p.email || s.user!.email, name: p.name || s.user!.name }));
  }, [s.user]);

  const set = (k: keyof typeof empty) => (v: string) => setF((p) => ({ ...p, [k]: v }));
  const extrasTotal = extras.filter((x) => picked.includes(x.id)).reduce((n, x) => n + x.price, 0);
  const shipping = opt?.price ?? 0;
  const total = s.subtotal + shipping + extrasTotal;

  const e1 = {
    email: !isEmail(f.email) && "Enter a valid email so we can send your receipt",
    phone: !isPhone(f.phone) && "Enter a Thai mobile number, for example 081 234 5678",
    name: f.name.trim().length < 2 && "Enter the name for this order",
    line1: opt?.address && f.line1.trim().length < 5 && "Enter house number, building and street",
    district: opt?.address && f.district.trim().length < 2 && "Enter the district",
    postcode: opt?.address && !isPostcode(f.postcode) && "Postcodes have five digits",
  };
  const e2 = {
    card: pay === "card" && !luhn(f.card) && "Check the card number",
    exp: pay === "card" && !validExpiry(f.exp) && "Use MM/YY, not in the past",
    cvc: pay === "card" && !/^\d{3,4}$/.test(f.cvc) && "Three or four digits on the back",
    holder: pay === "card" && f.holder.trim().length < 2 && "Name as printed on the card",
  };
  const bad = (e: Record<string, string | false | undefined>) => Object.values(e).some(Boolean);

  const focusError = () =>
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>("[aria-invalid=true]");
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      el?.focus({ preventScroll: true });
    });

  const next = () => {
    setTried(true);
    if (bad(e1)) return focusError();
    setTried(false);
    setStep(2);
    window.scrollTo({ top: 0 });
    window.__lenis?.scrollTo(0, { immediate: true });
  };

  const place = () => {
    setTried(true);
    if (bad(e2)) return focusError();
    setBusy(true);
    const o: Order = {
      no: makeRef(cfg.prefix),
      at: Date.now(),
      email: f.email.trim().toLowerCase(),
      name: f.name.trim(),
      phone: f.phone,
      items: s.lines.map((l) => ({ id: l.id, opt: s.catalog.optLabel?.(l), qty: l.qty, name: s.catalog.name(l), price: s.catalog.price(l), img: s.catalog.img(l) })),
      subtotal: s.subtotal,
      shipping,
      extras: extrasTotal,
      total,
      delivery: {
        method: opt.id,
        label: opt.label,
        date: dates[date]?.toISOString(),
        address: opt.address ? `${f.line1}, ${f.district}, ${f.province} ${f.postcode}` : undefined,
      },
      payment: pay,
      paid: pay === "card",
      status: "confirmed",
      card: pay === "card" ? f.card.replace(/\D/g, "").slice(-4) : undefined,
      meta: Object.fromEntries(extras.filter((x) => picked.includes(x.id)).map((x) => [x.label, x.price])),
    };
    // a short pause stands in for the payment gateway
    setTimeout(() => {
      s.saveOrder(o);
      s.clear();
      setPlaced(o);
      setBusy(false);
      window.scrollTo({ top: 0 });
      window.__lenis?.scrollTo(0, { immediate: true });
    }, 900);
  };

  if (placed) return <Placed o={placed} cfg={cfg} />;

  if (s.ready && s.lines.length === 0)
    return (
      <div className="mx-auto grid max-w-md gap-5 px-5 py-28 text-center">
        <h1 className="font-display text-[32px] leading-tight">Your bag is empty</h1>
        <p className="text-muted">Add something you love and come back here to check out.</p>
        <Link href={cfg.shop} className={btn.primary}>
          Go to the shop
        </Link>
      </div>
    );

  return (
    <div className="mx-auto grid max-w-[1180px] gap-10 px-5 pb-24 pt-[var(--page-top,7rem)] sm:px-8 lg:grid-cols-[1fr_400px] lg:gap-16 lg:pt-[var(--page-top-lg,9rem)]">
      <div className="grid min-w-0 content-start gap-8">
        <div className="grid gap-3">
          <h1 className="font-display text-[34px] leading-tight sm:text-[44px]">Checkout</h1>
          <ol className="flex gap-6 text-[14px]">
            {["Details and delivery", "Payment"].map((t, i) => (
              <li key={t} className={`flex items-center gap-2 ${step === i + 1 ? "text-ink" : "text-muted"}`}>
                <span className={`grid size-6 place-items-center rounded-full text-[12px] ${step > i ? "bg-ink text-bg" : "border border-line"}`}>{i + 1}</span>
                {i === 0 && step === 2 ? (
                  <button className="underline underline-offset-4" onClick={() => setStep(1)}>
                    {t}
                  </button>
                ) : (
                  t
                )}
              </li>
            ))}
          </ol>
        </div>

        {step === 1 ? (
          <>
            <section className="grid gap-4">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-[18px]">Contact</h2>
                {!s.user && (
                  <button className="text-[14px] text-muted underline underline-offset-4" onClick={() => s.setPanel("login")}>
                    Log in for faster checkout
                  </button>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email" type="email" autoComplete="email" value={f.email} onValue={set("email")} error={tried && e1.email} />
                <Field label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onValue={set("phone")} error={tried && e1.phone} />
                <Field label="Full name" autoComplete="name" value={f.name} onValue={set("name")} error={tried && e1.name} className="sm:col-span-2" />
              </div>
            </section>

            <section className="grid gap-3" role="radiogroup" aria-label="Delivery">
              <h2 className="text-[18px]">Delivery</h2>
              {options.map((o) => (
                <Choice
                  key={o.id}
                  checked={opt.id === o.id}
                  onSelect={() => {
                    setMethod(o.id);
                    setDate(0);
                  }}
                  title={o.label}
                  detail={o.detail}
                  aside={o.price ? baht(o.price) : "Free"}
                />
              ))}
            </section>

            {opt?.address && (
              <section className="grid gap-4 sm:grid-cols-2">
                <Field label="Address" autoComplete="street-address" value={f.line1} onValue={set("line1")} error={tried && e1.line1} className="sm:col-span-2" placeholder="House no., building, soi, road" />
                <Field label="District" value={f.district} onValue={set("district")} error={tried && e1.district} />
                <Field
                  label="Province"
                  as="select"
                  value={f.province}
                  onValue={set("province")}
                  options={["Bangkok", "Nonthaburi", "Pathum Thani", "Samut Prakan", "Chiang Mai", "Phuket", "Chon Buri", "Other province"].map((v) => ({ value: v, label: v }))}
                />
                <Field label="Postcode" inputMode="numeric" autoComplete="postal-code" value={f.postcode} onValue={(v) => set("postcode")(v.replace(/\D/g, "").slice(0, 5))} error={tried && e1.postcode} />
                <Field label="Note for the driver (optional)" as="textarea" value={f.note} onValue={set("note")} className="sm:col-span-2" />
              </section>
            )}

            {dates.length > 0 && (
              <section className="grid gap-3">
                <h2 className="text-[18px]">{opt.address ? "Delivery day" : "Collection day"}</h2>
                <div className="flex gap-2 overflow-x-auto pb-1" data-lenis-prevent>
                  {dates.map((d, i) => (
                    <button
                      key={d.toISOString()}
                      onClick={() => setDate(i)}
                      aria-pressed={date === i}
                      className={`shrink-0 rounded-[var(--r-sm,10px)] border px-4 py-3 text-left text-[14px] ${date === i ? "border-ink bg-soft" : "border-line hover:border-muted"}`}
                    >
                      {day(d)}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {extras.length > 0 && (
              <section className="grid gap-3">
                <h2 className="text-[18px]">Add to your delivery</h2>
                {extras.map((x) => {
                  const on = picked.includes(x.id);
                  return (
                    <button
                      key={x.id}
                      role="checkbox"
                      aria-checked={on}
                      onClick={() => setPicked(on ? picked.filter((p) => p !== x.id) : [...picked, x.id])}
                      className={`flex items-start gap-3 rounded-[var(--r-sm,10px)] border px-4 py-3.5 text-left ${on ? "border-ink bg-soft" : "border-line"}`}
                    >
                      <span className={`mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-[5px] border ${on ? "border-ink bg-ink text-bg" : "border-line"}`}>{on && Icon.check}</span>
                      <span className="flex-1">
                        <span className="block text-[15px]">{x.label}</span>
                        <span className="block text-[13px] text-muted">{x.detail}</span>
                      </span>
                      <span className="text-[14px]">{baht(x.price)}</span>
                    </button>
                  );
                })}
              </section>
            )}

            <button className={`${btn.primary} sm:max-w-xs`} onClick={next}>
              Continue to payment
            </button>
          </>
        ) : (
          <>
            <section className="grid gap-2 rounded-[var(--r-sm,10px)] border border-line p-4 text-[14px]">
              <div className="flex justify-between gap-4">
                <span className="text-muted">Contact</span>
                <span className="truncate text-right">
                  {f.email}, {f.phone}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted">{opt.label}</span>
                <span className="text-right">
                  {opt.address ? `${f.line1}, ${f.postcode}` : opt.detail}
                  {dates[date] ? `, ${day(dates[date])}` : ""}
                </span>
              </div>
            </section>
            <section className="grid gap-3" role="radiogroup" aria-label="Payment">
              <h2 className="text-[18px]">Payment</h2>
              {cfg.payments.map((p) => (
                <Choice
                  key={p}
                  checked={pay === p}
                  onSelect={() => setPay(p)}
                  title={payLabel[p][0]}
                  detail={p === "cod" && !payments.includes("cod") ? `Available on orders up to ${baht(cfg.codLimit!)}` : payLabel[p][1]}
                  disabled={!payments.includes(p)}
                />
              ))}
            </section>
            {pay === "card" && (
              <section className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Card number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  value={f.card}
                  onValue={(v) => set("card")(fmtCard(v))}
                  error={tried && e2.card}
                  className="sm:col-span-2"
                  hint="Concept build: use the test number 4242 4242 4242 4242. Nothing is charged."
                />
                <Field label="Expiry (MM/YY)" inputMode="numeric" autoComplete="cc-exp" value={f.exp} onValue={(v) => set("exp")(fmtExpiry(v))} error={tried && e2.exp} />
                <Field label="Security code" inputMode="numeric" autoComplete="cc-csc" value={f.cvc} onValue={(v) => set("cvc")(v.replace(/\D/g, "").slice(0, 4))} error={tried && e2.cvc} />
                <Field label="Name on card" autoComplete="cc-name" value={f.holder} onValue={set("holder")} error={tried && e2.holder} className="sm:col-span-2" />
              </section>
            )}
            {pay === "promptpay" && <p className="rounded-[var(--r-sm,10px)] bg-soft p-4 text-[14px]">After you place the order we show a PromptPay code for {baht(total)}. The order is held for 30 minutes while you pay.</p>}
            {pay === "cod" && <p className="rounded-[var(--r-sm,10px)] bg-soft p-4 text-[14px]">Have {baht(total)} ready for the courier. They also take PromptPay at the door.</p>}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <button className={`${btn.ghost} sm:w-auto`} onClick={() => setStep(1)}>
                Back
              </button>
              <button className={`${btn.primary} sm:max-w-xs`} onClick={place} disabled={busy}>
                {busy ? "Placing your order" : `Place order, ${baht(total)}`}
              </button>
            </div>
          </>
        )}
      </div>

      <aside className="order-first min-w-0 lg:order-none">
        <div className="grid gap-4 rounded-[var(--r-lg,20px)] bg-soft p-5 lg:sticky lg:top-28">
          <h2 className="text-[16px]">Order summary</h2>
          <ul className="grid gap-3">
            {s.lines.map((l) => (
              <li key={`${l.id}-${l.opt}`} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 text-[14px]">
                <div className="relative">
                  <Img src={s.catalog.img(l)} alt="" ratio={1} sizes="56px" widths={[800]} className="rounded-[8px]" />
                  <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ink text-[11px] text-bg">{l.qty}</span>
                </div>
                <span className="min-w-0">
                  <span className="block truncate">{s.catalog.name(l)}</span>
                  {s.catalog.optLabel?.(l) && <span className="block truncate text-[12.5px] text-muted">{s.catalog.optLabel(l)}</span>}
                </span>
                <span className="tabular-nums">{baht(s.catalog.price(l) * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="grid gap-2 border-t border-line pt-4 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular-nums">{baht(s.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">{opt?.label ?? "Delivery"}</dt>
              <dd className="tabular-nums">{shipping ? baht(shipping) : "Free"}</dd>
            </div>
            {extrasTotal > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Services</dt>
                <dd className="tabular-nums">{baht(extrasTotal)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-line pt-3 text-[16px]">
              <dt>Total</dt>
              <dd className="tabular-nums">{baht(total)}</dd>
            </div>
            <p className="text-[12.5px] text-muted">Prices include 7% VAT. A full tax invoice comes with your receipt.</p>
          </dl>
          {aside}
        </div>
      </aside>
    </div>
  );
}

function Placed({ o, cfg }: { o: Order; cfg: CheckoutConfig }) {
  const s = useStore();
  const live = s.orders.find((x) => x.no === o.no) ?? o;
  return (
    <div className="mx-auto grid max-w-[720px] gap-8 px-5 pb-24 pt-[var(--page-top,7rem)] sm:px-8 lg:pt-[var(--page-top-lg,9rem)]">
      <div className="grid gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-ink text-bg">{Icon.check}</span>
        <h1 className="font-display text-[34px] leading-tight sm:text-[44px]">Thank you, {o.name.split(" ")[0]}</h1>
        <p className="text-[16px] text-muted">
          Order <span className="text-ink">{o.no}</span> is confirmed. A receipt is on its way to {o.email}.
        </p>
      </div>
      {live.payment === "promptpay" && !live.paid && <PromptPay o={live} />}
      <OrderDetail o={live} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={cfg.account} className={`${btn.primary} sm:w-auto`}>
          View my orders
        </Link>
        <Link href={cfg.shop} className={`${btn.ghost} sm:w-auto`}>
          Keep shopping
        </Link>
      </div>
    </div>
  );
}

/** Stand-in for the gateway's PromptPay screen, with the 30 minute hold. */
export function PromptPay({ o }: { o: Order }) {
  const s = useStore();
  const [left, setLeft] = useState(() => Math.max(0, o.at + 30 * 60e3 - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, o.at + 30 * 60e3 - Date.now())), 1000);
    return () => clearInterval(t);
  }, [o.at]);
  const mm = Math.floor(left / 60e3);
  const ss = Math.floor((left % 60e3) / 1e3);
  return (
    <section className="grid gap-4 rounded-[var(--r-lg,20px)] border border-line p-5 sm:grid-cols-[150px_1fr] sm:items-center">
      <div className="grid aspect-square place-items-center rounded-[12px] bg-white p-3 text-center text-[11px] leading-snug text-[#333]">
        <span>
          PromptPay QR
          <br />
          from the payment gateway
          <br />
          <b className="text-[13px]">{baht(o.total)}</b>
        </span>
      </div>
      <div className="grid gap-3">
        <h2 className="text-[18px]">Waiting for payment</h2>
        <p className="text-[14px] text-muted">
          {left > 0 ? `Scan with any Thai banking app within ${mm}:${String(ss).padStart(2, "0")}. The page updates when the bank confirms.` : "The hold has ended. Contact us and we will send a new code."}
        </p>
        {left > 0 && (
          <button
            className={`${btn.ghost} sm:w-auto`}
            onClick={() => {
              s.patchOrder(o.no, { paid: true });
              s.toast("Payment received");
            }}
          >
            Simulate bank confirmation
          </button>
        )}
      </div>
    </section>
  );
}

export function OrderDetail({ o }: { o: Order }) {
  return (
    <section className="grid gap-4 rounded-[var(--r-lg,20px)] bg-soft p-5">
      <ul className="grid gap-3">
        {o.items.map((i) => (
          <li key={`${i.id}-${i.opt}`} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 text-[14px]">
            <Img src={i.img} alt="" ratio={1} sizes="56px" widths={[800]} className="rounded-[8px]" />
            <span className="min-w-0">
              <span className="block truncate">
                {i.qty} x {i.name}
              </span>
              {i.opt && <span className="block truncate text-[12.5px] text-muted">{i.opt}</span>}
            </span>
            <span className="tabular-nums">{baht(i.price * i.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="grid gap-2 border-t border-line pt-4 text-[14px]">
        <Row k={o.delivery.label} v={o.shipping ? baht(o.shipping) : "Free"} />
        {o.extras > 0 && <Row k="Services" v={baht(o.extras)} />}
        <Row k="Total" v={baht(o.total)} strong />
        {o.delivery.date && <Row k={o.delivery.address ? "Arrives" : "Ready"} v={longDay(new Date(o.delivery.date))} />}
        {o.delivery.address && <Row k="Address" v={o.delivery.address} />}
        <Row k="Payment" v={o.payment === "card" ? `Card ending ${o.card}` : o.payment === "promptpay" ? (o.paid ? "PromptPay, paid" : "PromptPay, waiting") : "Cash on delivery"} />
      </dl>
    </section>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-6 ${strong ? "text-[16px]" : ""}`}>
      <dt className={strong ? "" : "text-muted"}>{k}</dt>
      <dd className="text-right tabular-nums">{v}</dd>
    </div>
  );
}
