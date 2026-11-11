"use client";

import Link from "next/link";
import { useState } from "react";
import { Photo } from "@/components/shared/Photo";
import { typeLabels, type Project } from "@/data/projects";
import { ShopTheSpace } from "./ShopTheSpace";
import { InquiryForm } from "./InquiryForm";

const galleryShapes = ["aspect-[4/5]", "aspect-[4/3]", "aspect-[4/3]", "aspect-[4/5]"];

export function ProjectDetail({ project, next }: { project: Project; next: Project }) {
  const [picked, setPicked] = useState<string[]>([]);

  const pick = (slug: string) => {
    setPicked((p) => (p.includes(slug) ? p : [...p, slug]));
  };

  const facts: [string, string][] = [
    ["Client", project.client],
    ["Interior design", project.designer],
    ["Pieces supplied", String(project.pieces)],
    ["Made for this project", project.custom === 0 ? "None, all catalogue" : `${project.custom} custom designs`],
    ["Delivered in", `${project.weeks} weeks`],
    ["Completed", String(project.year)],
  ];

  return (
    <main>
      <section className="relative h-[86svh] min-h-[520px] overflow-hidden bg-[var(--forest)]">
        <Photo photo={project.hero} priority className="absolute inset-0 h-full w-full" sizes="100vw" showAlt={false} />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(10_24_20/0.55)_0%,rgb(10_24_20/0)_28%,rgb(10_24_20/0)_45%,rgb(10_24_20/0.78)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-4 pb-10 text-white sm:px-8 sm:pb-14">
          <p className="text-[14px] text-white/80">
            {typeLabels[project.type]}, {project.location}
          </p>
          <h1 className="mt-3 max-w-[18ch] font-display text-[clamp(2.6rem,7vw,6.5rem)] font-[450] leading-[0.98]">
            {project.name}
          </h1>
          <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-white/90">{project.intro}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 sm:px-8">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-line py-8 md:grid-cols-3 lg:grid-cols-6">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt className="text-[13px] text-muted">{k}</dt>
              <dd className="mt-1 text-[15px] leading-snug">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-10 py-16 md:grid-cols-2 md:gap-16 md:py-24">
          <div>
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] italic leading-none">The brief</h2>
            <p className="mt-5 max-w-[50ch] text-[17px] leading-[1.7]">{project.brief}</p>
          </div>
          <div>
            <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] italic leading-none">What we made</h2>
            <p className="mt-5 max-w-[50ch] text-[17px] leading-[1.7]">{project.made}</p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--forest)] text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 md:py-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-none">In this space</h2>
            <p className="max-w-[40ch] text-[15px] text-white/70">Tap a marker to see the piece and add it to your inquiry.</p>
          </div>
          <ShopTheSpace space={project.space} picked={picked} onPick={pick} />
        </div>
      </section>

      {project.gallery.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-8 md:py-24">
          <div className="gap-6 sm:columns-2">
            {project.gallery.map((g, i) => (
              <Photo
                key={g.id}
                photo={g}
                className={`${galleryShapes[i % galleryShapes.length]} mb-6 w-full break-inside-avoid rounded-[3px]`}
                sizes="(min-width: 640px) 50vw, 100vw"
              />
            ))}
          </div>
        </section>
      )}

      <section className="border-y border-line bg-soft">
        <figure className="mx-auto max-w-[1100px] px-4 py-20 sm:px-8 md:py-28">
          <blockquote className="font-display text-[clamp(1.7rem,3.4vw,2.9rem)] italic leading-[1.22]">
            <p>&ldquo;{project.quote.text}&rdquo;</p>
          </blockquote>
          <figcaption className="mt-8 text-[15px]">
            {project.quote.by}
            <span className="block text-muted">{project.quote.role}</span>
          </figcaption>
        </figure>
      </section>

      <section id="start" className="mx-auto grid max-w-[1440px] scroll-mt-6 gap-12 px-4 py-20 sm:px-8 md:grid-cols-[1fr_1.3fr] md:py-28">
        <div>
          <h2 className="font-display text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.02]">Start a project like this</h2>
          <p className="mt-6 max-w-[42ch] text-[17px] leading-[1.65]">
            Send us your floor plan or a mood board. We reply with a first selection, sample options and a realistic lead
            time, usually within a week.
          </p>
        </div>
        <InquiryForm picked={picked} onUnpick={(s) => setPicked((p) => p.filter((x) => x !== s))} projectName={project.name} />
      </section>

      <Link href={`/projects/${next.slug}`} className="group block border-t border-line">
        <div className="mx-auto grid max-w-[1440px] items-center gap-6 px-4 py-12 sm:px-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-[13px] text-muted">Next project</p>
            <p className="mt-2 font-display text-[clamp(2rem,5vw,4.2rem)] leading-none transition-colors group-hover:text-[var(--forest-2)]">
              {next.name}
            </p>
          </div>
          <Photo photo={next.cover} className="aspect-[4/3] w-full rounded-[3px] md:w-[280px]" sizes="280px" />
        </div>
      </Link>
    </main>
  );
}
