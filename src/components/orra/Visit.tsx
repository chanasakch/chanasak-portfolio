"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { btn } from "@/components/kit/panels";
import { addDays, day, isEmail, isPhone, longDay, makeRef, useNow, usePersist } from "@/components/kit/persist";
import { useStore } from "@/components/kit/store";
import { Field, Icon, Img } from "@/components/kit/ui";
import { orra, orraById } from "@/data/orra";

type Booking = { ref: string; date: string; time: string; people: number; name: string; email: string; phone: string; pieces: string[]; note: string; cancelled?: boolean };

const TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export function Visit() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <VisitInner />
    </Suspense>
  );
}

function VisitInner() {
  const now = useNow();
  return now ? <VisitForm now={now} /> : <div className="min-h-screen" />;
}

function VisitForm({ now }: { now: Date }) {
  const s = useStore();
  const piece = useSearchParams().get("piece");
  // closed on Mondays; today only counts while a slot is still ahead
  const days = useMemo(() => {
    const out: Date[] = [];
    for (let i = 0; out.length < 12; i++) {
      const d = addDays(now, i);
      if (d.getDay() === 1) continue;
      if (i === 0 && now.getHours() >= 17) continue;
      out.push(d);
    }
    return out;
  }, [now]);
  const [di, setDi] = useState(0);
  const isToday = days[di]?.toDateString() === now.toDateString();
  const open = TIMES.filter((t) => !isToday || +t.slice(0, 2) > now.getHours());
  const [time, setTime] = useState<string | null>(null);
  const slot = time && open.includes(time) ? time : null;
  const [people, setPeople] = useState(2);
  const [pieces, setPieces] = useState<string[]>(piece && orraById(piece) ? [piece] : []);
  const [f, setF] = useState({ name: s.user?.name ?? "", email: s.user?.email ?? "", phone: "", note: "" });
  const [tried, setTried] = useState(false);
  const [list, setList] = usePersist<Booking[]>("orra:visits", []);
  const [done, setDone] = useState<Booking | null>(null);

  const e = {
    time: !slot && "Choose a time",
    name: f.name.trim().length < 2 && "Enter your name",
    email: !isEmail(f.email) && "Enter a valid email",
    phone: !isPhone(f.phone) && "Enter a Thai mobile number",
  };

  const submit = () => {
    setTried(true);
    if (Object.values(e).some(Boolean)) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid=true], [data-missing]")?.scrollIntoView({ block: "center", behavior: "smooth" }));
      return;
    }
    const b: Booking = { ref: makeRef("VIS"), date: days[di].toISOString(), time: slot!, people, name: f.name.trim(), email: f.email.trim(), phone: f.phone, pieces, note: f.note };
    setList([b, ...list]);
    setDone(b);
    window.scrollTo({ top: 0 });
    window.__lenis?.scrollTo(0, { immediate: true });
  };

  const upcoming = list.filter((b) => !b.cancelled && new Date(b.date).getTime() >= addDays(now, 0).getTime());

  if (done)
    return (
      <div className="mx-auto grid max-w-[640px] gap-6 px-5 pb-24 pt-32 sm:px-8 lg:pt-40">
        <span className="grid size-12 place-items-center rounded-full bg-ink text-bg">{Icon.check}</span>
        <h1 className="text-[40px] font-light leading-tight">See you on {day(new Date(done.date))}</h1>
        <p className="text-muted">
          {longDay(new Date(done.date))} at {done.time}, for {done.people}. Reference {done.ref}. We sent the details to {done.email} and will message {done.phone} the day before.
        </p>
        {done.pieces.length > 0 && <p className="text-[15px]">We will have {done.pieces.map((id) => orraById(id)?.name).join(", ")} set out for you.</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className={`${btn.ghost} sm:w-auto`} onClick={() => setDone(null)}>
            Back to bookings
          </button>
        </div>
      </div>
    );

  return (
    <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-24 pt-28 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:pt-36">
      <div className="grid content-start gap-6">
        <h1 className="text-[40px] font-light leading-[1.02] sm:text-[60px]">Book a showroom visit</h1>
        <p className="max-w-md text-[16px] leading-relaxed text-muted">An hour with one of our makers, the full swatch library and every piece on the floor. Visits are free and there is parking on Soi 43.</p>
        <Img src="orra/room-living" alt="Our showroom set out as a living room" ratio={1600 / 1095} sizes="(min-width:1024px) 45vw, 100vw" className="rounded-[var(--r-lg)]" />
        {upcoming.length > 0 && (
          <section className="grid gap-3">
            <h2 className="text-[18px]">Your upcoming visits</h2>
            {upcoming.map((b) => (
              <div key={b.ref} className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--r-sm)] border border-line p-4 text-[14px]">
                <span>
                  {day(new Date(b.date))}, {b.time}, for {b.people}
                  <span className="block text-muted">{b.ref}</span>
                </span>
                <button
                  className="text-muted underline underline-offset-4 hover:text-ink"
                  onClick={() => {
                    setList(list.map((x) => (x.ref === b.ref ? { ...x, cancelled: true } : x)));
                    s.toast("Visit cancelled");
                  }}
                >
                  Cancel visit
                </button>
              </div>
            ))}
          </section>
        )}
      </div>

      <div className="grid content-start gap-8">
        <section className="grid gap-3">
          <h2 className="text-[18px]">Day</h2>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" data-lenis-prevent>
            {days.map((d, k) => (
              <button
                key={d.toISOString()}
                aria-pressed={k === di}
                onClick={() => setDi(k)}
                className={`grid shrink-0 justify-items-center gap-0.5 rounded-[var(--r-sm)] border px-4 py-3 text-[13px] ${k === di ? "border-ink bg-ink text-bg" : "border-line hover:border-ink/50"}`}
              >
                <span>{d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
                <span className="text-[20px] font-light">{d.getDate()}</span>
                <span>{d.toLocaleDateString("en-GB", { month: "short" })}</span>
              </button>
            ))}
          </div>
          <p className="text-[13px] text-muted">Closed on Mondays.</p>
        </section>

        <section className="grid gap-3" data-missing={tried && e.time ? "" : undefined}>
          <h2 className="text-[18px]">Time</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {TIMES.map((t) => {
              const ok = open.includes(t);
              return (
                <button
                  key={t}
                  disabled={!ok}
                  aria-pressed={slot === t}
                  onClick={() => setTime(t)}
                  className={`rounded-[var(--r-sm)] border py-3 text-[14px] tabular-nums disabled:cursor-not-allowed disabled:opacity-30 disabled:line-through ${slot === t ? "border-ink bg-ink text-bg" : "border-line hover:border-ink/50"}`}
                >
                  {t}
                </button>
              );
            })}
          </div>
          {tried && e.time && <p className="text-[13px] text-[var(--bad)]">{e.time}</p>}
        </section>

        <section className="grid gap-3">
          <h2 className="text-[18px]">How many of you</h2>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} aria-pressed={people === n} onClick={() => setPeople(n)} className={`size-12 rounded-full border text-[15px] ${people === n ? "border-ink bg-ink text-bg" : "border-line hover:border-ink/50"}`}>
                {n}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-3">
          <h2 className="text-[18px]">Pieces to set out (optional)</h2>
          <div className="flex flex-wrap gap-2">
            {orra.map((p) => {
              const on = pieces.includes(p.id);
              return (
                <button key={p.id} aria-pressed={on} onClick={() => setPieces(on ? pieces.filter((x) => x !== p.id) : [...pieces, p.id])} className={`rounded-full border px-4 py-2 text-[13px] ${on ? "border-ink bg-ink text-bg" : "border-line hover:border-ink/50"}`}>
                  {p.name}
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" autoComplete="name" value={f.name} onValue={(v) => setF({ ...f, name: v })} error={tried && e.name} />
          <Field label="Mobile number" type="tel" inputMode="tel" value={f.phone} onValue={(v) => setF({ ...f, phone: v })} error={tried && e.phone} />
          <Field label="Email" type="email" value={f.email} onValue={(v) => setF({ ...f, email: v })} error={tried && e.email} className="sm:col-span-2" />
          <Field label="Anything we should prepare? (optional)" as="textarea" value={f.note} onValue={(v) => setF({ ...f, note: v })} className="sm:col-span-2" />
        </section>

        <button className={`${btn.primary} sm:max-w-sm`} onClick={submit}>
          {slot ? `Book ${day(days[di])} at ${slot}` : "Book visit"}
        </button>
      </div>
    </div>
  );
}
