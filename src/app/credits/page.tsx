import Link from "next/link";
import type { Metadata } from "next";
import { pexelsPage, photos } from "@/data/images";

export const metadata: Metadata = { title: "Photo credits" };

export default function Credits() {
  // Several crops come from one photo; list each source once.
  const seen = new Set<number>();
  const list = Object.values(photos).filter((p) => (seen.has(p.pexelsId) ? false : (seen.add(p.pexelsId), true)));

  return (
    <main className="mx-auto max-w-[760px] px-4 py-14 sm:px-8">
      <Link href="/" className="text-[14px] text-muted underline underline-offset-4">
        All concepts
      </Link>
      <h1 className="mt-6 text-[2.2rem] font-[450] tracking-[-0.01em]">Photo credits</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        All photographs are from Pexels and free to use under the Pexels license. The furniture, ceramics and places in them
        are not made or run by the fictional brands in these concepts.
      </p>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {list.map((p) => (
          <li key={p.pexelsId} className="grid grid-cols-[1fr_auto] items-baseline gap-4 py-3 text-[14px]">
            <span>
              {p.alt}
              {p.photographer && <span className="block text-[13px] text-muted">{p.photographer}</span>}
            </span>
            <a href={pexelsPage(p)} className="shrink-0 text-muted underline underline-offset-4" target="_blank" rel="noreferrer">
              Pexels {p.pexelsId}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
