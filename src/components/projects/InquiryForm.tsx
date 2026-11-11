"use client";

import { useState, type FormEvent } from "react";
import { getProduct } from "@/data/products";

const field =
  "w-full rounded-[3px] border border-line bg-white/70 px-4 py-3 text-[15px] outline-none transition-colors focus:border-ink focus:bg-white";

type Props = {
  /** Product slugs picked from the hotspots on this page */
  picked: string[];
  onUnpick: (slug: string) => void;
  projectName?: string;
};

export function InquiryForm({ picked, onUnpick, projectName }: Props) {
  const [sent, setSent] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSent(String(data.get("email")));
    e.currentTarget.reset();
  }

  if (sent) {
    return (
      <div role="status" className="rounded-[3px] bg-white/70 p-8">
        <p className="font-display text-[2rem] italic leading-tight">Thank you</p>
        <p className="mt-3 max-w-[48ch] text-[16px] leading-relaxed">
          Our projects team will reply to {sent} within one working day, usually with a call to walk through the space and
          a first selection of pieces.
        </p>
        <button type="button" onClick={() => setSent(null)} className="mt-6 text-[14px] underline underline-offset-4">
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      {picked.length > 0 && (
        <div className="sm:col-span-2">
          <p className="text-[13px] text-muted">Pieces you are interested in</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {picked.map((slug) => (
              <li key={slug} className="flex items-center gap-2 rounded-full bg-ink py-1.5 pl-3.5 pr-1.5 text-[13px] text-bg">
                {getProduct(slug)?.name}
                <button
                  type="button"
                  onClick={() => onUnpick(slug)}
                  className="flex size-5 items-center justify-center rounded-full bg-white/20 text-[12px]"
                  aria-label={`Remove ${getProduct(slug)?.name}`}
                >
                  ×
                </button>
                <input type="hidden" name="pieces" value={slug} />
              </li>
            ))}
          </ul>
        </div>
      )}
      <label className="grid gap-2 text-[14px]">
        Your name
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="grid gap-2 text-[14px]">
        Company
        <input name="company" autoComplete="organization" className={field} />
      </label>
      <label className="grid gap-2 text-[14px]">
        Email
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="grid gap-2 text-[14px]">
        Project type
        <select name="type" className={field} defaultValue="hotel">
          <option value="hotel">Hotel or resort</option>
          <option value="residence">Residential common areas</option>
          <option value="restaurant">Restaurant or bar</option>
          <option value="screen">Film, TV or editorial</option>
        </select>
      </label>
      <label className="grid gap-2 text-[14px]">
        Location
        <input name="location" placeholder="City, country" className={`${field} placeholder:text-muted/60`} />
      </label>
      <label className="grid gap-2 text-[14px]">
        Opening date
        <input name="opening" type="month" className={field} />
      </label>
      <label className="grid gap-2 text-[14px] sm:col-span-2">
        Tell us about the space
        <textarea
          name="message"
          rows={4}
          defaultValue={projectName ? `We liked your work on ${projectName}. ` : ""}
          className={field}
        />
      </label>
      <button
        type="submit"
        className="mt-1 rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-bg transition-colors hover:bg-[var(--forest-2)] sm:col-span-2 sm:justify-self-start"
      >
        Send project inquiry
      </button>
    </form>
  );
}
