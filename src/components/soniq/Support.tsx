"use client";

import { useMemo, useState } from "react";
import { btn } from "@/components/kit/panels";
import { addDays, day, isEmail, isPhone, isPostcode, longDay, makeRef, useNow, usePersist } from "@/components/kit/persist";
import { useStore } from "@/components/kit/store";
import { Choice, Field, Icon } from "@/components/kit/ui";
import { soniq, soniqById } from "@/data/soniq";

type Ticket = { ref: string; at: number; product: string; issue: string; detail: string; method: "dropoff" | "courier"; when?: string; address?: string; name: string; email: string; phone: string; cancelled?: boolean };

const ISSUES = ["No sound on one side", "Won't charge", "Bluetooth keeps dropping", "Physical damage", "Something else"];
const SLOTS = ["11:00", "13:00", "15:00", "17:00", "19:00"];

export function Support() {
  const now = useNow();
  return now ? <SupportForm now={now} /> : <div className="min-h-screen" />;
}

function SupportForm({ now }: { now: Date }) {
  const s = useStore();
  const [list, setList] = usePersist<Ticket[]>("soniq:tickets", []);
  const [f, setF] = useState({ product: "halo", issue: "", detail: "", name: "", email: "", phone: "", line1: "", postcode: "" });
  const [method, setMethod] = useState<"dropoff" | "courier">("dropoff");
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(now, i)).filter((d, i) => i > 0 || now.getHours() < 18), [now]);
  const [di, setDi] = useState(0);
  const today = days[di]?.toDateString() === now.toDateString();
  const open = SLOTS.filter((t) => !today || +t.slice(0, 2) > now.getHours() + 1);
  const [slot, setSlot] = useState<string | null>(null);
  const time = slot && open.includes(slot) ? slot : null;
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState<Ticket | null>(null);

  const e = {
    issue: !f.issue && "Choose what is wrong",
    name: f.name.trim().length < 2 && "Enter your name",
    email: !isEmail(f.email) && "Enter a valid email",
    phone: !isPhone(f.phone) && "Enter a Thai mobile number",
    time: method === "dropoff" && !time && "Choose a time",
    line1: method === "courier" && f.line1.trim().length < 5 && "Enter the pickup address",
    postcode: method === "courier" && !isPostcode(f.postcode) && "Five digit postcode",
  };

  const submit = () => {
    setTried(true);
    if (Object.values(e).some(Boolean)) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid=true], [data-missing]")?.scrollIntoView({ block: "center", behavior: "smooth" }));
      return;
    }
    const d = days[di];
    const t: Ticket = {
      ref: makeRef("RPR"),
      at: Date.now(),
      product: f.product,
      issue: f.issue,
      detail: f.detail,
      method,
      when: method === "dropoff" ? `${d.toISOString()}|${time}` : addDays(now, 1).toISOString(),
      address: method === "courier" ? `${f.line1}, ${f.postcode}` : undefined,
      name: f.name.trim(),
      email: f.email.trim(),
      phone: f.phone,
    };
    setList([t, ...list]);
    setDone(t);
    window.scrollTo({ top: 0 });
    window.__lenis?.scrollTo(0, { immediate: true });
  };

  const whenText = (t: Ticket) => {
    if (t.method === "courier") return `Courier collects ${longDay(new Date(t.when!))}, between 09:00 and 17:00`;
    const [d, tm] = t.when!.split("|");
    return `Bring it to SONIQ Siam on ${longDay(new Date(d))} at ${tm}`;
  };

  if (done)
    return (
      <div className="mx-auto grid max-w-[640px] gap-6 px-4 pb-24 pt-10 sm:px-6 lg:pt-16">
        <span className="grid size-12 place-items-center rounded-full bg-ink text-bg">{Icon.check}</span>
        <h1 className="font-display text-[40px] leading-none sm:text-[52px]">Repair booked</h1>
        <p className="text-muted">
          Reference {done.ref} for your {soniqById(done.product)?.name}. {whenText(done)}. We sent the details to {done.email}.
        </p>
        <p className="text-[15px]">Most repairs under warranty are finished in five working days. If we cannot fix it, we replace it.</p>
        <button className={`${btn.ghost} sm:w-auto`} onClick={() => setDone(null)}>
          Back to support
        </button>
      </div>
    );

  const active = list.filter((t) => !t.cancelled);
  return (
    <div className="mx-auto grid max-w-[1440px] gap-12 px-4 pb-24 pt-8 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:pt-14">
      <div className="grid content-start gap-6">
        <h1 className="font-display text-[44px] leading-none sm:text-[68px]">Warranty and repairs</h1>
        <p className="max-w-md text-[16px] text-muted">Every SONIQ product has two years of warranty. Book a bench slot at Siam, or have a courier collect it from your door for free.</p>
        {active.length > 0 && (
          <section className="grid gap-3">
            <h2 className="text-[18px] font-bold">Your repair requests</h2>
            {active.map((t) => (
              <div key={t.ref} className="grid gap-2 rounded-[var(--r-sm)] bg-white/70 p-4 text-[14px]">
                <p className="font-semibold">
                  {soniqById(t.product)?.name}, {t.issue.toLowerCase()}
                </p>
                <p className="text-muted">
                  {t.ref}. {whenText(t)}.
                </p>
                <button
                  className="justify-self-start text-muted underline underline-offset-4 hover:text-ink"
                  onClick={() => {
                    setList(list.map((x) => (x.ref === t.ref ? { ...x, cancelled: true } : x)));
                    s.toast("Repair request cancelled");
                  }}
                >
                  Cancel request
                </button>
              </div>
            ))}
          </section>
        )}
        <section className="grid gap-1">
          <h2 className="mb-2 text-[18px] font-bold">Quick answers</h2>
          {[
            ["How do I reset my headphones?", "Hold the power and volume down buttons for ten seconds until the light flashes white, then pair again."],
            ["Is my product still under warranty?", "Two years from the date on your receipt. Orders from this site are found automatically from your email."],
            ["What does Protect+ add?", "Drops, spills and cracked cases for two years, with a replacement sent within 48 hours."],
          ].map(([q, a]) => (
            <details key={q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[15px]">
                {q}
                <span className="text-muted transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pb-4 text-[14px] text-muted">{a}</p>
            </details>
          ))}
        </section>
      </div>

      <div className="grid content-start gap-7 rounded-[var(--r-lg)] bg-white/60 p-5 sm:p-8">
        <h2 className="text-[22px] font-bold tracking-[-0.02em]">Book a repair</h2>
        <Field label="Product" as="select" value={f.product} onValue={(v) => setF({ ...f, product: v })} options={soniq.map((p) => ({ value: p.id, label: `${p.name} (${p.cat})` }))} />
        <div className="grid gap-2" data-missing={tried && e.issue ? "" : undefined}>
          <p className="text-[13px] text-muted">What is wrong</p>
          <div className="flex flex-wrap gap-2">
            {ISSUES.map((x) => (
              <button key={x} aria-pressed={f.issue === x} onClick={() => setF({ ...f, issue: x })} className={`rounded-full border px-4 py-2 text-[14px] ${f.issue === x ? "border-ink bg-ink text-bg" : "border-line hover:border-ink/50"}`}>
                {x}
              </button>
            ))}
          </div>
          {tried && e.issue && <p className="text-[12.5px] text-[var(--bad)]">{e.issue}</p>}
        </div>
        <Field label="Tell us more (optional)" as="textarea" value={f.detail} onValue={(v) => setF({ ...f, detail: v })} />
        <div className="grid gap-3" role="radiogroup" aria-label="How to get it to us">
          <Choice checked={method === "dropoff"} onSelect={() => setMethod("dropoff")} title="Bring it to SONIQ Siam" detail="Twenty minute bench check, often fixed while you wait" />
          <Choice checked={method === "courier"} onSelect={() => setMethod("courier")} title="Courier pickup" detail={`Free collection ${day(addDays(now, 1))}, returned in about five working days`} />
        </div>
        {method === "dropoff" ? (
          <div className="grid gap-3">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" data-lenis-prevent>
              {days.map((d, k) => (
                <button key={d.toISOString()} aria-pressed={k === di} onClick={() => setDi(k)} className={`shrink-0 rounded-[var(--r-sm)] border px-4 py-2.5 text-[14px] ${k === di ? "border-ink bg-ink text-bg" : "border-line"}`}>
                  {k === 0 && today ? "Today" : day(d)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5" data-missing={tried && e.time ? "" : undefined}>
              {SLOTS.map((t) => (
                <button
                  key={t}
                  disabled={!open.includes(t)}
                  aria-pressed={time === t}
                  onClick={() => setSlot(t)}
                  className={`rounded-[var(--r-sm)] border py-2.5 text-[14px] disabled:cursor-not-allowed disabled:opacity-30 disabled:line-through ${time === t ? "border-ink bg-ink text-bg" : "border-line"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            {tried && e.time && <p className="text-[12.5px] text-[var(--bad)]">{e.time}</p>}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
            <Field label="Pickup address" value={f.line1} onValue={(v) => setF({ ...f, line1: v })} error={tried && e.line1} />
            <Field label="Postcode" inputMode="numeric" value={f.postcode} onValue={(v) => setF({ ...f, postcode: v.replace(/\D/g, "").slice(0, 5) })} error={tried && e.postcode} />
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" value={f.name} onValue={(v) => setF({ ...f, name: v })} error={tried && e.name} />
          <Field label="Mobile number" type="tel" inputMode="tel" value={f.phone} onValue={(v) => setF({ ...f, phone: v })} error={tried && e.phone} />
          <Field label="Email" type="email" value={f.email} onValue={(v) => setF({ ...f, email: v })} error={tried && e.email} className="sm:col-span-2" />
        </div>
        <button className={`${btn.primary} sm:max-w-xs`} onClick={submit}>
          Book repair
        </button>
      </div>
    </div>
  );
}
