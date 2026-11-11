"use client";

import Link from "next/link";
import { useState } from "react";
import { Photo } from "@/components/shared/Photo";
import { projects, typeLabels, type ProjectType } from "@/data/projects";

const types = Object.keys(typeLabels) as ProjectType[];

export function ProjectIndex() {
  const [filter, setFilter] = useState<ProjectType | "all">("all");
  const list = filter === "all" ? projects : projects.filter((p) => p.type === filter);

  const chip = (selected: boolean) =>
    `rounded-full border px-4 py-2 text-[14px] transition-colors ${
      selected ? "border-ink bg-ink text-bg" : "border-line hover:border-ink/50"
    }`;

  return (
    <section className="mx-auto max-w-[1440px] px-4 pb-20 sm:px-8">
      <div className="flex flex-wrap gap-2 border-b border-line pb-6" role="group" aria-label="Filter projects by sector">
        <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")} className={chip(filter === "all")}>
          All <span className="opacity-60">{projects.length}</span>
        </button>
        {types.map((t) => {
          const n = projects.filter((p) => p.type === t).length;
          return (
            <button key={t} type="button" aria-pressed={filter === t} onClick={() => setFilter(t)} className={chip(filter === t)}>
              {typeLabels[t]} <span className="opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      <ul aria-live="polite">
        {list.map((p, i) => {
          const flip = i % 2 === 1;
          return (
            <li key={p.slug} className="border-b border-line">
              <Link
                href={`/projects/${p.slug}`}
                className="group grid gap-6 py-10 md:grid-cols-12 md:items-center md:gap-10 md:py-14"
              >
                <Photo
                  photo={p.cover}
                  className={`aspect-[4/3] w-full rounded-[3px] md:col-span-7 ${flip ? "md:order-2" : ""}`}
                  imgClassName="transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                  sizes="(min-width: 768px) 58vw, 100vw"
                />
                <div className={`md:col-span-5 ${flip ? "md:order-1" : ""}`}>
                  <p className="text-[14px] text-muted">
                    {typeLabels[p.type]}, {p.year}
                  </p>
                  <h2 className="mt-2 font-display text-[clamp(2rem,3.6vw,3.2rem)] leading-[1.02]">{p.name}</h2>
                  <p className="mt-1 text-[15px] text-muted">{p.location}</p>
                  <p className="mt-5 max-w-[42ch] text-[16px] leading-relaxed">{p.intro}</p>
                  <dl className="mt-6 flex gap-8 text-[14px]">
                    <div>
                      <dt className="text-muted">Pieces</dt>
                      <dd className="mt-0.5 font-display text-[1.6rem]">{p.pieces}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">Custom designs</dt>
                      <dd className="mt-0.5 font-display text-[1.6rem]">{p.custom}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">Weeks</dt>
                      <dd className="mt-0.5 font-display text-[1.6rem]">{p.weeks}</dd>
                    </div>
                  </dl>
                  <span className="mt-7 inline-block text-[15px] underline decoration-ink/30 underline-offset-[6px] transition-colors group-hover:decoration-ink">
                    Read the case study
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
