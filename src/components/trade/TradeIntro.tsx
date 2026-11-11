"use client";

import { useTrade } from "./TradeProvider";

export function TradeIntro() {
  const { t } = useTrade();
  return (
    <section className="mx-auto max-w-[1440px] px-4 pb-10 pt-10 sm:px-8 sm:pt-14">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-[650] leading-[1.1] tracking-[-0.025em]">{t.introTitle}</h1>
          <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-muted">{t.introBody}</p>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-[6px] border border-line bg-line text-[14px] sm:grid-cols-3">
          {[t.perk1, t.perk2, t.perk3].map((perk) => (
            <li key={perk} className="bg-white px-4 py-3.5 leading-snug">
              {perk}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
