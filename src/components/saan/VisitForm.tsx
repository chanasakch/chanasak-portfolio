"use client";

import { useState, type FormEvent } from "react";

const field =
  "w-full rounded-[2px] border border-line bg-bg px-4 py-3 text-[15px] outline-none transition-colors focus:border-ink";

export function VisitForm() {
  const [sent, setSent] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSent(String(data.get("name") || "").split(" ")[0] || "there");
  }

  if (sent) {
    return (
      <div role="status" className="rounded-[2px] bg-soft p-8">
        <p className="font-display text-[1.8rem] leading-tight">Visit requested</p>
        <p className="mt-3 text-[15px] leading-relaxed">
          Thank you, {sent}. We will confirm your time by email within one working day. Parking is free in the building
          on Soi 49.
        </p>
        <button type="button" onClick={() => setSent(null)} className="mt-6 text-[14px] underline underline-offset-4">
          Book another visit
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-[14px] sm:col-span-2">
        Your name
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="grid gap-2 text-[14px]">
        Email
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="grid gap-2 text-[14px]">
        Preferred date
        <input name="date" type="date" required className={field} />
      </label>
      <label className="grid gap-2 text-[14px] sm:col-span-2">
        I am furnishing
        <select name="for" className={field} defaultValue="home">
          <option value="home">My home</option>
          <option value="hotel">A hotel or resort</option>
          <option value="restaurant">A restaurant or bar</option>
          <option value="residence">A residential project</option>
        </select>
      </label>
      <button
        type="submit"
        className="mt-2 rounded-full bg-ink px-6 py-3 text-[15px] text-bg transition-colors hover:bg-accent sm:col-span-2 sm:justify-self-start"
      >
        Request a visit
      </button>
    </form>
  );
}
