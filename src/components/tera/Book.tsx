"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { btn } from "@/components/kit/panels";
import { addDays, baht, day, fmtCard, fmtExpiry, isEmail, isPhone, longDay, luhn, makeRef, useNow, usePersist, validExpiry } from "@/components/kit/persist";
import { useStore } from "@/components/kit/store";
import { Choice, Field, Heart, Icon, Img, Sheet } from "@/components/kit/ui";
import { departures, destById, tripById, trips, type Trip } from "@/data/tera";
import { TripGrid, tripImg } from "./TeraSite";

const R = "/tera";
const TRANSFER = 1800;

export type Booking = {
  ref: string;
  at: number;
  trip: string;
  dep: string;
  n: number;
  own: boolean;
  names: string[];
  email: string;
  phone: string;
  transfer: boolean;
  total: number;
  paid: number;
  card: string;
  status: "confirmed" | "cancelled";
  refund?: number;
};

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const daysUntil = (dep: string, now: Date) => Math.round((parse(dep).getTime() - addDays(now, 0).getTime()) / 86400e3);
export const balanceDue = (dep: string) => addDays(parse(dep), -60);

/** What comes back on cancelling: deposit kept beyond 60 days, half the total from 30 to 60, nothing inside 30. */
export function refundFor(b: Booking, now: Date) {
  const left = daysUntil(b.dep, now);
  const deposit = Math.round(b.total * 0.3);
  if (left > 60) return Math.max(0, b.paid - deposit);
  if (left >= 30) return Math.max(0, b.paid - Math.round(b.total * 0.5));
  return 0;
}

const Conditions = () => (
  <div className="grid gap-3 text-[14.5px] leading-relaxed text-muted">
    <p>A 30% deposit holds your places. The balance is due 60 days before departure; bookings made inside 60 days are paid in full.</p>
    <p>If you cancel more than 60 days before departure we keep the deposit and refund the rest. From 60 to 30 days we keep half of the trip price. Inside 30 days the trip price is not refundable, so we strongly suggest travel insurance.</p>
    <p>If we cancel a departure, for weather, safety or too few travellers, you get every baht back or a free move to another date.</p>
    <p>Travel insurance that covers the activities in the plan is required on every trip.</p>
  </div>
);

export function Book() {
  const now = useNow();
  return now ? <BookForm now={now} /> : <div className="min-h-screen" />;
}

function BookForm({ now }: { now: Date }) {
  const q = useSearchParams();
  const s = useStore();
  const t = tripById(q.get("trip") ?? "");
  const deps = useMemo(() => (t ? departures(t, now) : []), [t, now]);
  const dep = deps.find((x) => ymd(x.date) === q.get("dep"));
  const n = Math.max(1, Math.min(6, +(q.get("n") ?? 1) || 1));
  const own = q.get("room") === "own";
  const [step, setStep] = useState<1 | 2>(1);
  const [names, setNames] = useState<string[]>(() => Array.from({ length: n }, () => ""));
  const [f, setF] = useState({ email: s.user?.email ?? "", phone: "", card: "", exp: "", cvc: "", holder: "" });
  const [transfer, setTransfer] = useState(false);
  const [mode, setMode] = useState<"deposit" | "full">("deposit");
  const [agree, setAgree] = useState(false);
  const [terms, setTerms] = useState(false);
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(false);
  const [list, setList] = usePersist<Booking[]>("tera:bookings", []);
  const [done, setDone] = useState<Booking | null>(null);

  if (done) return <Done b={done} />;

  if (!t || !dep || dep.seats < n)
    return (
      <div className="mx-auto grid max-w-xl gap-5 px-5 pb-24 pt-36 sm:px-8">
        <h1 className="font-display text-[36px] leading-tight">{!t ? "Choose a trip to book" : "That departure is no longer available"}</h1>
        <p className="text-muted">{!t ? "Start from any trip page and pick a date." : `Places on this date have gone. ${t.title} has other departures with room for ${n}.`}</p>
        <Link href={t ? `${R}/trip/${t.id}` : `${R}/trips`} className={`${btn.primary} w-auto`}>
          {t ? "Pick another date" : "See all trips"}
        </Link>
      </div>
    );

  const d = destById(t.dest)!;
  const end = addDays(dep.date, t.days - 1);
  const tripTotal = n * (dep.price + (own ? t.single : 0));
  const total = tripTotal + (transfer ? n * TRANSFER : 0);
  const left = daysUntil(ymd(dep.date), now);
  const mustFull = left <= 60;
  const pay = mustFull || mode === "full" ? total : Math.round(total * 0.3);

  const e1 = {
    names: names.map((x) => x.trim().split(/\s+/).length < 2 && "Enter first and last name as in the passport"),
    email: !isEmail(f.email) && "Enter a valid email",
    phone: !isPhone(f.phone) && "Enter a Thai mobile number",
  };
  const e2 = {
    card: !luhn(f.card) && "Check the card number",
    exp: !validExpiry(f.exp) && "Use MM/YY, not in the past",
    cvc: !/^\d{3,4}$/.test(f.cvc) && "Three or four digits",
    holder: f.holder.trim().length < 2 && "Name on the card",
    agree: !agree && "Please accept the booking conditions",
  };
  const jump = () => requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid=true]")?.scrollIntoView({ block: "center", behavior: "smooth" }));
  const top = () => {
    window.scrollTo({ top: 0 });
    window.__lenis?.scrollTo(0, { immediate: true });
  };

  const next = () => {
    setTried(true);
    if (e1.names.some(Boolean) || e1.email || e1.phone) return jump();
    setTried(false);
    setStep(2);
    top();
  };
  const confirm = () => {
    setTried(true);
    if (Object.values(e2).some(Boolean)) return jump();
    setBusy(true);
    const b: Booking = {
      ref: makeRef("TRA"),
      // runs on click, not during render
      // eslint-disable-next-line react-hooks/purity
      at: Date.now(),
      trip: t.id,
      dep: ymd(dep.date),
      n,
      own,
      names: names.map((x) => x.trim()),
      email: f.email.trim().toLowerCase(),
      phone: f.phone,
      transfer,
      total,
      paid: pay,
      card: f.card.replace(/\D/g, "").slice(-4),
      status: "confirmed",
    };
    setTimeout(() => {
      setList([b, ...list]);
      setDone(b);
      setBusy(false);
      top();
    }, 900);
  };

  return (
    <div className="mx-auto grid max-w-[1180px] gap-10 px-5 pb-24 pt-32 sm:px-8 lg:grid-cols-[1fr_380px] lg:gap-14 lg:pt-36">
      <div className="grid min-w-0 content-start gap-8">
        <div className="grid gap-3">
          <Link href={`${R}/trip/${t.id}`} className="text-[14px] text-muted underline underline-offset-4">
            Back to the trip
          </Link>
          <h1 className="font-display text-[34px] leading-tight sm:text-[46px]">Book your places</h1>
          <ol className="flex gap-6 text-[14px]">
            {["Travellers", "Payment"].map((x, k) => (
              <li key={x} className={`flex items-center gap-2 ${step === k + 1 ? "" : "text-muted"}`}>
                <span className={`grid size-6 place-items-center rounded-full text-[12px] ${step > k ? "bg-ink text-bg" : "border border-line"}`}>{k + 1}</span>
                {x}
              </li>
            ))}
          </ol>
        </div>

        {step === 1 ? (
          <>
            <section className="grid gap-4">
              <h2 className="text-[18px] font-medium">Who is travelling</h2>
              <p className="-mt-2 text-[13.5px] text-muted">Names exactly as they appear in each passport. We need them for flights and permits.</p>
              {names.map((v, k) => (
                <Field
                  key={k}
                  label={k === 0 ? "Lead traveller" : `Traveller ${k + 1}`}
                  autoComplete={k === 0 ? "name" : "off"}
                  value={v}
                  onValue={(x) => setNames(names.map((y, j) => (j === k ? x : y)))}
                  error={tried && e1.names[k]}
                />
              ))}
            </section>
            <section className="grid gap-4 sm:grid-cols-2">
              <Field label="Email for tickets and updates" type="email" autoComplete="email" value={f.email} onValue={(v) => setF({ ...f, email: v })} error={tried && e1.email} />
              <Field label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onValue={(v) => setF({ ...f, phone: v })} error={tried && e1.phone} />
            </section>
            <button
              role="checkbox"
              aria-checked={transfer}
              onClick={() => setTransfer(!transfer)}
              className={`flex items-start gap-3 rounded-[var(--r-sm)] border px-4 py-3.5 text-left ${transfer ? "border-ink bg-white" : "border-line"}`}
            >
              <span className={`mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-[5px] border ${transfer ? "border-ink bg-ink text-bg" : "border-line"}`}>{transfer && Icon.check}</span>
              <span className="flex-1">
                <span className="block text-[15px]">Airport transfers both ways</span>
                <span className="block text-[13px] text-muted">Met at arrivals, whatever time you land</span>
              </span>
              <span className="text-[14px]">{baht(TRANSFER)} each</span>
            </button>
            <button className={`${btn.primary} sm:max-w-xs`} onClick={next}>
              Continue to payment
            </button>
          </>
        ) : (
          <>
            <section className="grid gap-3" role="radiogroup" aria-label="How much to pay now">
              <h2 className="text-[18px] font-medium">How much to pay now</h2>
              <Choice
                checked={!mustFull && mode === "deposit"}
                disabled={mustFull}
                onSelect={() => setMode("deposit")}
                title={`Deposit, ${baht(Math.round(total * 0.3))}`}
                detail={mustFull ? "Not available: this trip leaves within 60 days" : `Balance of ${baht(total - Math.round(total * 0.3))} due by ${longDay(balanceDue(ymd(dep.date)))}`}
              />
              <Choice checked={mustFull || mode === "full"} onSelect={() => setMode("full")} title={`Pay in full, ${baht(total)}`} detail="Nothing more to pay before you go" />
            </section>
            <section className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Card number"
                inputMode="numeric"
                autoComplete="cc-number"
                value={f.card}
                onValue={(v) => setF({ ...f, card: fmtCard(v) })}
                error={tried && e2.card}
                className="sm:col-span-2"
                hint="Concept build: use 4242 4242 4242 4242. Nothing is charged."
              />
              <Field label="Expiry (MM/YY)" inputMode="numeric" value={f.exp} onValue={(v) => setF({ ...f, exp: fmtExpiry(v) })} error={tried && e2.exp} />
              <Field label="Security code" inputMode="numeric" value={f.cvc} onValue={(v) => setF({ ...f, cvc: v.replace(/\D/g, "").slice(0, 4) })} error={tried && e2.cvc} />
              <Field label="Name on card" autoComplete="cc-name" value={f.holder} onValue={(v) => setF({ ...f, holder: v })} error={tried && e2.holder} className="sm:col-span-2" />
            </section>
            <div className="grid gap-1.5">
              <label className="flex items-start gap-3 text-[14.5px]">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} aria-invalid={tried && !!e2.agree} className="mt-1 size-[18px] accent-[var(--ink)]" />
                <span>
                  I accept the{" "}
                  <button type="button" className="underline underline-offset-4" onClick={() => setTerms(true)}>
                    booking conditions
                  </button>{" "}
                  and will arrange travel insurance.
                </span>
              </label>
              {tried && e2.agree && <p className="pl-8 text-[12.5px] text-[var(--bad)]">{e2.agree}</p>}
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button className={`${btn.ghost} sm:w-auto`} onClick={() => setStep(1)}>
                Back
              </button>
              <button className={`${btn.primary} sm:max-w-xs`} onClick={confirm} disabled={busy}>
                {busy ? "Confirming" : `Pay ${baht(pay)} and book`}
              </button>
            </div>
          </>
        )}
      </div>

      <aside className="order-first lg:order-none">
        <div className="grid gap-4 overflow-hidden rounded-[var(--r-lg)] border border-line bg-white lg:sticky lg:top-28">
          <Img src={tripImg(t)} alt="" ratio={16 / 9} widths={tripImg(t) === d.img ? [960] : [800]} sizes="380px" position={tripImg(t) === d.img ? `${d.fx * 100}% ${d.fy * 100}%` : undefined} />
          <div className="grid gap-4 px-5 pb-5">
            <div>
              <p className="text-[13px] text-muted">{d.name}</p>
              <p className="text-[18px] font-medium leading-snug">{t.title}</p>
              <p className="mt-1 text-[14px]">
                {day(dep.date)} to {day(end)}
              </p>
            </div>
            <dl className="grid gap-2 border-t border-line pt-4 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-muted">
                  {n} x {own ? "own room" : "shared room"}
                </dt>
                <dd className="tabular-nums">{baht(tripTotal)}</dd>
              </div>
              {transfer && (
                <div className="flex justify-between">
                  <dt className="text-muted">Airport transfers</dt>
                  <dd className="tabular-nums">{baht(n * TRANSFER)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-line pt-3 text-[16px]">
                <dt>Total</dt>
                <dd className="tabular-nums">{baht(total)}</dd>
              </div>
              {step === 2 && (
                <div className="flex justify-between">
                  <dt className="text-muted">Due today</dt>
                  <dd className="tabular-nums">{baht(pay)}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </aside>
      <Sheet open={terms} onClose={() => setTerms(false)} title="Booking conditions">
        <Conditions />
      </Sheet>
    </div>
  );
}

/** Calendar file for the trip dates. */
function ics(b: Booking, t: Trip) {
  const start = parse(b.dep);
  const end = addDays(start, t.days);
  const f = (d: Date) => ymd(d).replace(/-/g, "");
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tera Journeys//EN",
    "BEGIN:VEVENT",
    `UID:${b.ref}@tera`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${f(start)}`,
    `DTEND;VALUE=DATE:${f(end)}`,
    `SUMMARY:${t.title} (${b.ref})`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${b.ref}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Done({ b }: { b: Booking }) {
  const t = tripById(b.trip)!;
  return (
    <div className="mx-auto grid max-w-[720px] gap-7 px-5 pb-24 pt-32 sm:px-8 lg:pt-40">
      <span className="grid size-12 place-items-center rounded-full bg-ink text-bg">{Icon.check}</span>
      <h1 className="font-display text-[36px] leading-tight sm:text-[48px]">You are going to {destById(t.dest)!.name}</h1>
      <p className="text-[16px] text-muted">
        Booking <span className="text-ink">{b.ref}</span> is confirmed for {b.n} traveller{b.n > 1 ? "s" : ""}. Your trip leader will email {b.email} six weeks before departure with a packing list and the group chat.
      </p>
      <Summary b={b} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={`${R}/account`} className={`${btn.primary} sm:w-auto`}>
          Go to my trips
        </Link>
        <button className={`${btn.ghost} sm:w-auto`} onClick={() => ics(b, t)}>
          Add to calendar
        </button>
      </div>
    </div>
  );
}

function Summary({ b }: { b: Booking }) {
  const t = tripById(b.trip)!;
  const start = parse(b.dep);
  const rows: [string, string][] = [
    ["Trip", t.title],
    ["Dates", `${longDay(start)} to ${longDay(addDays(start, t.days - 1))}`],
    ["Travellers", b.names.join(", ")],
    ["Room", b.own ? "Own room" : "Shared room"],
    ["Total", baht(b.total)],
    ["Paid", `${baht(b.paid)} by card ending ${b.card}`],
  ];
  if (b.status === "cancelled") rows.push(["Refund", baht(b.refund ?? 0)]);
  else if (b.paid < b.total) rows.push(["Balance", `${baht(b.total - b.paid)} due by ${longDay(balanceDue(b.dep))}`]);
  return (
    <dl className="grid gap-2.5 rounded-[var(--r-lg)] bg-white p-5 text-[14.5px]">
      {rows.map(([k, v]) => (
        <div key={k} className="grid gap-1 sm:grid-cols-[120px_1fr]">
          <dt className="text-muted">{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------------- my trips ---------------- */

export function MyTrips() {
  const now = useNow();
  const s = useStore();
  const [list, setList] = usePersist<Booking[]>("tera:bookings", []);
  const [tab, setTab] = useState<"trips" | "saved">("trips");
  const [look, setLook] = useState({ ref: "", email: "" });
  const [found, setFound] = useState<string | null | "none">(null);
  const mine = s.user ? list.filter((b) => b.email === s.user!.email) : found && found !== "none" ? list.filter((b) => b.ref === found) : [];
  const saved = s.wish.map((id) => trips.find((t) => t.id === id)).filter(Boolean) as Trip[];
  const update = (ref: string, p: Partial<Booking>) => setList(list.map((b) => (b.ref === ref ? { ...b, ...p } : b)));

  return (
    <div className="mx-auto grid max-w-[1080px] gap-8 px-5 pb-24 pt-32 sm:px-8 lg:pt-40">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-2">
          <h1 className="font-display text-[40px] leading-none sm:text-[56px]">My trips</h1>
          <p className="text-muted">{s.user ? s.user.email : "Log in to see every booking, or find one with its reference."}</p>
        </div>
        {s.user ? (
          <button className="text-[14px] text-muted underline underline-offset-4" onClick={s.logOut}>
            Log out
          </button>
        ) : (
          <div className="flex gap-2">
            <button className={`${btn.primary} w-auto`} onClick={() => s.setPanel("login")}>
              Log in
            </button>
            <button className={`${btn.ghost} w-auto`} onClick={() => s.setPanel("signup")}>
              Sign up
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-6 border-b border-line text-[15px]" role="tablist">
        {(["trips", "saved"] as const).map((x) => (
          <button key={x} role="tab" aria-selected={tab === x} onClick={() => setTab(x)} className={`-mb-px border-b-2 pb-3 ${tab === x ? "border-ink" : "border-transparent text-muted"}`}>
            {x === "trips" ? "Bookings" : `Saved trips${saved.length ? ` (${saved.length})` : ""}`}
          </button>
        ))}
      </div>

      {tab === "saved" ? (
        saved.length ? (
          <TripGrid list={saved} />
        ) : (
          <div className="grid justify-items-start gap-4">
            <p className="flex items-center gap-2 text-muted">
              Tap <Heart on={false} size={16} /> on any trip to keep it here.
            </p>
            <Link href={`${R}/trips`} className={`${btn.ghost} w-auto`}>
              Browse trips
            </Link>
          </div>
        )
      ) : (
        <>
          {!s.user && (
            <form
              noValidate
              className="grid max-w-xl gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
              onSubmit={(e) => {
                e.preventDefault();
                const b = list.find((x) => x.ref.toUpperCase() === look.ref.trim().toUpperCase() && x.email === look.email.trim().toLowerCase());
                setFound(b ? b.ref : "none");
              }}
            >
              <Field label="Booking reference" value={look.ref} onValue={(v) => setLook({ ...look, ref: v })} placeholder="e.g. TRA-7HQ2KP" />
              <Field label="Email used" type="email" value={look.email} onValue={(v) => setLook({ ...look, email: v })} />
              <button className={`${btn.primary} sm:w-auto`}>Find</button>
            </form>
          )}
          {found === "none" && !s.user && <p>No booking matches that reference and email.</p>}
          {mine.length > 0 && now ? (
            <ul className="grid gap-4">
              {mine.map((b) => (
                <BookingRow key={b.ref} b={b} now={now} update={update} />
              ))}
            </ul>
          ) : (
            s.user && (
              <div className="grid justify-items-start gap-4">
                <p className="text-muted">No bookings yet.</p>
                <Link href={`${R}/trips`} className={`${btn.ghost} w-auto`}>
                  Find a trip
                </Link>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}

function BookingRow({ b, now, update }: { b: Booking; now: Date; update: (ref: string, p: Partial<Booking>) => void }) {
  const s = useStore();
  const t = tripById(b.trip)!;
  const d = destById(t.dest)!;
  const [open, setOpen] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [paying, setPaying] = useState(false);
  const [card, setCard] = useState({ no: "", exp: "", cvc: "" });
  const [tried, setTried] = useState(false);
  const left = daysUntil(b.dep, now);
  const refund = refundFor(b, now);
  const past = left < 0;
  const status = b.status === "cancelled" ? "Cancelled" : past ? "Travelled" : b.paid < b.total ? `Balance due ${day(balanceDue(b.dep))}` : `In ${left} days`;
  const ce = { no: !luhn(card.no) && "Check the card number", exp: !validExpiry(card.exp) && "MM/YY, not in the past", cvc: !/^\d{3,4}$/.test(card.cvc) && "Three or four digits" };
  return (
    <li className="overflow-hidden rounded-[var(--r-lg)] border border-line bg-white">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="grid w-full grid-cols-[88px_1fr] items-center gap-4 p-3 text-left sm:grid-cols-[120px_1fr_auto]">
        <Img src={tripImg(t)} alt="" ratio={4 / 3} widths={tripImg(t) === d.img ? [960] : [800]} sizes="120px" position={tripImg(t) === d.img ? `${d.fx * 100}% ${d.fy * 100}%` : undefined} className="rounded-[14px]" />
        <span className="grid gap-0.5">
          <span className="text-[16px] font-medium leading-snug">{t.title}</span>
          <span className="text-[13px] text-muted">
            {day(parse(b.dep))}, {b.n} traveller{b.n > 1 ? "s" : ""}, {b.ref}
          </span>
          <span className="text-[13px] sm:hidden">{status}</span>
        </span>
        <span className={`mr-2 hidden rounded-full px-3 py-1 text-[12.5px] sm:block ${b.status === "cancelled" ? "bg-soft text-muted" : "bg-ink text-bg"}`}>{status}</span>
      </button>
      {open && (
        <div className="grid gap-4 border-t border-line p-5">
          <Summary b={b} />
          {b.status === "confirmed" && !past && (
            <div className="flex flex-wrap items-center gap-3">
              {b.paid < b.total && !paying && (
                <button className={`${btn.primary} w-auto`} onClick={() => setPaying(true)}>
                  Pay balance, {baht(b.total - b.paid)}
                </button>
              )}
              <button className={`${btn.ghost} w-auto`} onClick={() => ics(b, t)}>
                Add to calendar
              </button>
              {!cancel ? (
                <button className="text-[14px] text-muted underline underline-offset-4" onClick={() => setCancel(true)}>
                  Cancel booking
                </button>
              ) : (
                <span className="grid gap-2 rounded-[var(--r-sm)] bg-soft p-4 text-[14px]">
                  <span>
                    Departure is in {left} days. Under the booking conditions you get {baht(refund)} back{refund === 0 ? ", nothing is refundable now" : ""}.
                  </span>
                  <span className="flex gap-3">
                    <button
                      className="rounded-full bg-[var(--bad)] px-4 py-2 text-white"
                      onClick={() => {
                        update(b.ref, { status: "cancelled", refund });
                        s.toast(refund ? `Cancelled. ${baht(refund)} is on its way to your card.` : "Booking cancelled");
                      }}
                    >
                      Cancel and refund {baht(refund)}
                    </button>
                    <button className="underline underline-offset-4" onClick={() => setCancel(false)}>
                      Keep my booking
                    </button>
                  </span>
                </span>
              )}
            </div>
          )}
          {paying && (
            <div className="grid gap-4 rounded-[var(--r-sm)] border border-line p-4 sm:grid-cols-[1fr_120px_100px]">
              <Field label="Card number" inputMode="numeric" value={card.no} onValue={(v) => setCard({ ...card, no: fmtCard(v) })} error={tried && ce.no} />
              <Field label="Expiry" inputMode="numeric" value={card.exp} onValue={(v) => setCard({ ...card, exp: fmtExpiry(v) })} error={tried && ce.exp} />
              <Field label="CVC" inputMode="numeric" value={card.cvc} onValue={(v) => setCard({ ...card, cvc: v.replace(/\D/g, "").slice(0, 4) })} error={tried && ce.cvc} />
              <div className="flex gap-3 sm:col-span-3">
                <button
                  className={`${btn.primary} w-auto`}
                  onClick={() => {
                    setTried(true);
                    if (Object.values(ce).some(Boolean)) return;
                    update(b.ref, { paid: b.total, card: card.no.replace(/\D/g, "").slice(-4) });
                    setPaying(false);
                    s.toast("Balance paid. You are all set.");
                  }}
                >
                  Pay {baht(b.total - b.paid)}
                </button>
                <button className="text-[14px] underline underline-offset-4" onClick={() => setPaying(false)}>
                  Not now
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </li>
  );
}
