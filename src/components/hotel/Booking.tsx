"use client";

import { useMemo, useState, type FormEvent } from "react";
import { rooms } from "@/data/hotel";

const fmt = new Intl.NumberFormat("en-US");

function nightsBetween(a: string, b: string) {
  const diff = (new Date(b).getTime() - new Date(a).getTime()) / 86400000;
  return Number.isFinite(diff) ? Math.round(diff) : 0;
}

/** A fixed example stay in the cool season, so server and browser render the same dates. */
function defaultStay() {
  return { checkIn: "2027-01-15", checkOut: "2027-01-18" };
}

const field =
  "w-full rounded-[2px] border border-line bg-white/80 px-3.5 py-2.5 text-[15px] outline-none transition-colors focus:border-ink";

/** Availability bar under the hero. Shows room prices for the chosen dates. */
export function AvailabilityBar() {
  const [{ checkIn, checkOut }, setStay] = useState(defaultStay);
  const [guests, setGuests] = useState(2);
  const [checked, setChecked] = useState(false);
  const nights = Math.max(0, nightsBetween(checkIn, checkOut));

  const results = useMemo(
    () => rooms.filter((r) => r.sleeps >= guests).map((r) => ({ ...r, total: r.fromThb * nights })),
    [guests, nights],
  );

  return (
    <div className="rounded-[2px] bg-[var(--bg)] p-4 text-ink shadow-[0_20px_60px_rgb(0_0_0/0.18)] sm:p-5">
      <form
        className="grid gap-3 sm:grid-cols-[1fr_1fr_0.8fr_auto] sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <label className="grid gap-1.5 text-[13px] text-muted">
          Arrive
          <input
            id="stay-in"
            type="date"
            value={checkIn}
            onChange={(e) => {
              setStay((s) => ({ ...s, checkIn: e.target.value }));
              setChecked(false);
            }}
            className={field}
          />
        </label>
        <label className="grid gap-1.5 text-[13px] text-muted">
          Leave
          <input
            id="stay-out"
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={(e) => {
              setStay((s) => ({ ...s, checkOut: e.target.value }));
              setChecked(false);
            }}
            className={field}
          />
        </label>
        <label className="grid gap-1.5 text-[13px] text-muted">
          Guests
          <select
            id="stay-guests"
            value={guests}
            onChange={(e) => {
              setGuests(Number(e.target.value));
              setChecked(false);
            }}
            className={field}
          >
            {[1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded-[2px] bg-[var(--forest)] px-6 py-3 text-[15px] font-medium text-white">
          Check availability
        </button>
      </form>

      {checked && (
        <div className="mt-4 border-t border-line pt-4" aria-live="polite">
          {nights < 1 ? (
            <p className="text-[14px]">Choose a leaving date after your arrival date.</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-3">
              {results.map((r) => (
                <li key={r.slug} className="flex items-baseline justify-between gap-3 rounded-[2px] bg-white/70 px-3.5 py-3 text-[14px]">
                  <span>
                    <a href={`#room-${r.slug}`} className="font-medium underline-offset-4 hover:underline">
                      {r.name}
                    </a>
                    <span className="block text-[13px] text-muted">
                      {nights} {nights === 1 ? "night" : "nights"}, breakfast included
                    </span>
                  </span>
                  <span className="tabular shrink-0 font-medium">฿{fmt.format(r.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/** Full enquiry form at the end of the page. */
export function EnquiryForm() {
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null);
  const stay = defaultStay();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSent({ name: String(data.get("name")).split(" ")[0], email: String(data.get("email")) });
  }

  if (sent) {
    return (
      <div role="status" className="rounded-[2px] bg-white/70 p-8">
        <p className="font-display text-[2rem] italic leading-tight">Thank you, {sent.name}</p>
        <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed">
          We have your request and will confirm the room and rate to {sent.email} within a few hours. Nothing is charged
          until you confirm.
        </p>
        <button type="button" onClick={() => setSent(null)} className="mt-6 text-[14px] underline underline-offset-4">
          Make another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-[14px]">
        Arrive
        <input id="enq-in" name="in" type="date" required defaultValue={stay.checkIn} className={field} />
      </label>
      <label className="grid gap-2 text-[14px]">
        Leave
        <input id="enq-out" name="out" type="date" required defaultValue={stay.checkOut} className={field} />
      </label>
      <label className="grid gap-2 text-[14px]">
        Room
        <select id="enq-room" name="room" className={field} defaultValue={rooms[0].slug}>
          {rooms.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-[14px]">
        Guests
        <select id="enq-guests" name="guests" className={field} defaultValue="2">
          <option value="1">1 guest</option>
          <option value="2">2 guests</option>
          <option value="3">3 guests</option>
        </select>
      </label>
      <label className="grid gap-2 text-[14px]">
        Your name
        <input id="enq-name" name="name" required autoComplete="name" className={field} />
      </label>
      <label className="grid gap-2 text-[14px]">
        Email
        <input id="enq-email" name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="grid gap-2 text-[14px] sm:col-span-2">
        Anything we should prepare
        <textarea
          id="enq-notes"
          name="notes"
          rows={3}
          placeholder="Airport pick-up, dietary needs, a cot, a quiet room"
          className={`${field} placeholder:text-muted/70`}
        />
      </label>
      <button
        type="submit"
        className="mt-1 rounded-[2px] bg-[var(--forest)] px-6 py-3 text-[15px] font-medium text-white sm:col-span-2 sm:justify-self-start"
      >
        Request this stay
      </button>
    </form>
  );
}
