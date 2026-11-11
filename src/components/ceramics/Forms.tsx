"use client";

import { useState, type FormEvent } from "react";
import { sessions } from "@/data/ceramics";

const fmt = new Intl.NumberFormat("en-US");
const field =
  "w-full rounded-[2px] border border-line bg-white/70 px-3.5 py-2.5 text-[15px] outline-none transition-colors focus:border-ink";

export function WorkshopBooking() {
  const firstOpen = sessions.find((s) => s.seats > 0)!;
  const [sessionId, setSessionId] = useState(firstOpen.id);
  const [seats, setSeats] = useState(1);
  const [done, setDone] = useState<string | null>(null);
  const session = sessions.find((s) => s.id === sessionId)!;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(String(new FormData(e.currentTarget).get("email")));
  }

  if (done) {
    return (
      <div role="status" className="rounded-[2px] bg-white/60 p-8">
        <p className="font-display text-[2rem] leading-tight">Seat booked</p>
        <p className="mt-3 text-[16px] leading-relaxed">
          {seats} {seats === 1 ? "seat" : "seats"} for {session.title.toLowerCase()} on {session.day}, {session.time}. Details
          and the studio map are on their way to {done}. Wear clothes you do not mind getting clay on.
        </p>
        <button type="button" onClick={() => setDone(null)} className="mt-6 text-[14px] underline underline-offset-4">
          Book another session
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <legend className="text-[14px] text-muted">Upcoming sessions</legend>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {sessions.map((s) => {
            const full = s.seats === 0;
            return (
              <li key={s.id}>
                <label className={`flex items-center gap-4 py-3.5 ${full ? "opacity-50" : "cursor-pointer"}`}>
                  <input
                    type="radio"
                    name="session"
                    value={s.id}
                    disabled={full}
                    checked={sessionId === s.id}
                    onChange={() => {
                      setSessionId(s.id);
                      setSeats(1);
                    }}
                    className="size-4 accent-[var(--accent)]"
                  />
                  <span className="w-[92px] shrink-0 text-[14px]">{s.day}</span>
                  <span className="min-w-0 flex-1 text-[15px]">
                    {s.title}
                    <span className="block text-[13px] text-muted">{s.time}</span>
                  </span>
                  <span className="shrink-0 text-right text-[13px] text-muted">
                    {full ? "Full" : `${s.seats} left`}
                    <span className="tabular block text-ink">฿{fmt.format(s.priceThb)}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
      <div className="mt-6 grid gap-4 sm:grid-cols-[0.6fr_1fr_1fr]">
        <label className="grid gap-2 text-[14px]">
          Seats
          <select id="ws-seats" value={seats} onChange={(e) => setSeats(Number(e.target.value))} className={field}>
            {Array.from({ length: session.seats }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-[14px]">
          Name
          <input id="ws-name" name="name" required autoComplete="name" className={field} />
        </label>
        <label className="grid gap-2 text-[14px]">
          Email
          <input id="ws-email" name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" className="rounded-[2px] bg-accent px-6 py-3 text-[15px] text-accent-ink">
          Book {seats} {seats === 1 ? "seat" : "seats"}
        </button>
        <span className="tabular text-[15px]">Total ฿{fmt.format(session.priceThb * seats)}</span>
      </div>
    </form>
  );
}

export function SampleBoxForm() {
  const [done, setDone] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(String(new FormData(e.currentTarget).get("restaurant")));
  }

  if (done) {
    return (
      <div role="status" className="rounded-[2px] border border-line p-6">
        <p className="font-display text-[1.7rem] leading-tight">Sample box on its way</p>
        <p className="mt-2 text-[15px] leading-relaxed">
          We will send a plate, a bowl and a cup in each glaze to {done} this week, and call to talk through your menu.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-[14px]">
        Restaurant or hotel
        <input id="sb-restaurant" name="restaurant" required className={field} />
      </label>
      <label className="grid gap-2 text-[14px]">
        Covers per service
        <select id="sb-covers" name="covers" className={field} defaultValue="40-80">
          <option value="under-40">Under 40</option>
          <option value="40-80">40 to 80</option>
          <option value="80-150">80 to 150</option>
          <option value="over-150">Over 150</option>
        </select>
      </label>
      <label className="grid gap-2 text-[14px]">
        Your name
        <input id="sb-name" name="name" required autoComplete="name" className={field} />
      </label>
      <label className="grid gap-2 text-[14px]">
        Email
        <input id="sb-email" name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <button type="submit" className="rounded-[2px] bg-ink px-6 py-3 text-[15px] text-bg sm:col-span-2 sm:justify-self-start">
        Request a sample box
      </button>
    </form>
  );
}
