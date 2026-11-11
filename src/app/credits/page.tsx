import Link from "next/link";
import type { Metadata } from "next";
import { photos } from "@/data/images";

export const metadata: Metadata = { title: "Photo credits" };

export default function Credits() {
  return (
    <main className="mx-auto max-w-[760px] px-4 py-14 sm:px-8">
      <Link href="/" className="text-[14px] text-muted underline underline-offset-4">
        All concepts
      </Link>
      <h1 className="mt-6 text-[2.2rem] font-[450] tracking-[-0.01em]">Photo credits</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        All photographs are from Pexels and free to use. The furniture in them is not made by the fictional brands shown
        in these concepts.
      </p>
      <ul className="mt-8 divide-y divide-line border-y border-line">
        {Object.values(photos).map((p) => (
          <li key={p.id} className="flex items-baseline justify-between gap-4 py-3 text-[14px]">
            <span>{p.alt}</span>
            <a href={p.page} className="shrink-0 text-muted underline underline-offset-4" target="_blank" rel="noreferrer">
              Pexels {p.id}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
