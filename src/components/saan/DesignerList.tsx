"use client";

import { useState } from "react";
import { Photo } from "@/components/shared/Photo";
import type { Photo as PhotoType } from "@/data/images";

export type Designer = {
  name: string;
  practice: string;
  work: string;
  photo: PhotoType;
};

/** Hovering or focusing a name shows the piece they made for SAAN. */
export function DesignerList({ designers }: { designers: Designer[] }) {
  const [active, setActive] = useState(0);
  const current = designers[active];

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <ul className="border-t border-line">
        {designers.map((d, i) => (
          <li key={d.name} className="border-b border-line">
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className="grid w-full grid-cols-[1fr_auto] items-baseline gap-4 py-5 text-left"
            >
              <span
                className={`font-display text-[clamp(1.6rem,3vw,2.5rem)] leading-tight transition-colors ${
                  i === active ? "text-ink" : "text-muted"
                }`}
              >
                {d.name}
              </span>
              <span className="text-[14px] text-muted">{d.work}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="md:sticky md:top-8 md:self-start">
        <Photo key={current.name} photo={current.photo} className="aspect-[4/5] w-full rounded-[2px]" sizes="(min-width: 768px) 40vw, 100vw" />
        <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed">{current.practice}</p>
      </div>
    </div>
  );
}
